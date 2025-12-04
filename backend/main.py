from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from database import get_db
from models import *
from utils import create_token, verify_token

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ======================
# AUTH HELPERS
# ======================
def get_user_from_auth_header(authorization: str = None):
    if not authorization:
        raise HTTPException(status_code=401, detail="Thiếu Authorization")
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Sai định dạng token")
    token = authorization.replace("Bearer ", "")
    user = verify_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Token không hợp lệ")
    return user


# ======================
# ======================
# REGISTER
# ======================
@app.post("/auth/register")
def register(data: UserRegister):
    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT * FROM users WHERE username=? OR email=?", (data.username, data.email))
    if cur.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="Username hoặc email đã tồn tại")

    cur.execute("""
        INSERT INTO users (username, email, password, is_admin)
        VALUES (?, ?, ?, 0)
    """, (data.username, data.email, data.password))

    conn.commit()
    conn.close()
    return {"message": "Đăng ký thành công"}


# ======================
# LOGIN
# ======================
@app.post("/auth/login")
def login(data: UserLogin):
    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT * FROM users WHERE username=?", (data.username,))
    user = cur.fetchone()

    if not user or user["password"] != data.password:
        conn.close()
        raise HTTPException(status_code=400, detail="Sai tài khoản hoặc mật khẩu")

    token = create_token({
        "id": user["id"],
        "username": user["username"],
        "email": user["email"],
        "is_admin": user["is_admin"]
    })

    conn.close()
    return {"token": token, "is_admin": user["is_admin"]}


# ======================
# THÊM 3 API BỊ THIẾU (404 Not Found)
# ======================
@app.get("/categories")
def get_categories():
    return ["clothing", "shoes", "bags", "accessories"]

@app.get("/products")
def get_all_products():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM products")
    rows = cur.fetchall()
    conn.close()
    return [dict(row) for row in rows]

@app.get("/products/{product_id}")
def get_product(product_id: int):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM products WHERE id=?", (product_id,))
    row = cur.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")
    return dict(row)


# ======================
# TẠO ĐƠN HÀNG – ĐÃ FIX LỖI 500 + CÓ NHẬN THÔNG TIN GIAO HÀNG
# ======================
@app.post("/orders")
def create_order(data: OrderCreate, Authorization: str = Header(None)):
    conn = get_db()
    try:
        cur = conn.cursor()

        # Tìm user
        cur.execute("SELECT id FROM users WHERE username=?", (data.username,))
        user_row = cur.fetchone()
        if not user_row:
            raise HTTPException(status_code=404, detail="Không tìm thấy người dùng")

        user_id = user_row["id"]
        total = sum(item.quantity * item.price for item in data.items)

        # Tạo đơn hàng với thông tin giao hàng
        cur.execute("""
            INSERT INTO orders 
            (user_id, total_price, recipient_name, address, phone, status)
            VALUES (?, ?, ?, ?, ?, 'pending')
        """, (
            user_id,
            total,
            getattr(data, 'recipient_name', ''),
            getattr(data, 'address', ''),
            getattr(data, 'phone', '')
        ))

        order_id = cur.lastrowid

        # Thêm sản phẩm vào đơn
        for item in data.items:
            cur.execute("""
                INSERT INTO order_items (order_id, product_id, size, quantity, price)
                VALUES (?, ?, ?, ?, ?)
            """, (order_id, item.product_id, item.size or None, item.quantity, item.price))

            cur.execute("""
                UPDATE products 
                SET stock = stock - ?, sold = sold + ?
                WHERE id = ?
            """, (item.quantity, item.quantity, item.product_id))

        conn.commit()
        return {"message": "Đặt hàng thành công!", "order_id": order_id, "total": total}

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Lỗi hệ thống: {str(e)}")
    finally:
        conn.close()


# ======================
# USER VIEW ORDERS
# ======================
@app.get("/orders/{username}")
def my_orders(username: str):
    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        SELECT o.* FROM orders o
        JOIN users u ON o.user_id = u.id
        WHERE u.username = ?
        ORDER BY o.id DESC
    """, (username,))
    orders = cur.fetchall()

    result = []
    for order in orders:
        cur.execute("SELECT * FROM order_items WHERE order_id=?", (order["id"],))
        items = cur.fetchall()
        result.append({
            "order": dict(order),
            "items": [dict(i) for i in items]
        })

    conn.close()
    return result


# ======================
# ADMIN STATISTICS
# ======================
@app.get("/admin/statistics")
def statistics(Authorization: str = Header(None)):
    user = get_user_from_auth_header(Authorization)

    if user["is_admin"] != 1:
        raise HTTPException(status_code=403, detail="Chỉ admin mới được xem")

    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT COUNT(*) AS total FROM orders")
    total_orders = cur.fetchone()["total"] or 0

    cur.execute("SELECT COALESCE(SUM(total_price), 0) AS revenue FROM orders")
    revenue = cur.fetchone()["revenue"]

    cur.execute("SELECT COALESCE(SUM(sold), 0) AS sold FROM products")
    total_sold = cur.fetchone()["sold"]

    cur.execute("SELECT name, sold FROM products ORDER BY sold DESC LIMIT 10")
    best = cur.fetchall()

    conn.close()

    return {
        "total_orders": total_orders,
        "total_revenue": float(revenue),
        "total_sold": total_sold,
        "best_sellers": [dict(i) for i in best]
    }


# ==================== ADMIN API - HOÀN CHỈNH, SIÊU ỔN ĐỊNH, ĐẸP 100% ====================

@app.get("/admin/orders")
def get_all_orders(Authorization: str = Header(None)):
    user = get_user_from_auth_header(Authorization)
    if not user["is_admin"]:
        raise HTTPException(status_code=403, detail="Chỉ admin mới được xem")

    conn = get_db()
    cur = conn.cursor()

    try:
        # Lấy tất cả đơn hàng + thông tin khách hàng
        cur.execute("""
            SELECT o.id, o.total_price, o.status, o.recipient_name, o.address, o.phone, u.username
            FROM orders o
            JOIN users u ON o.user_id = u.id
            ORDER BY o.id DESC
        """)
        orders_raw = cur.fetchall()

        result = []
        for row in orders_raw:
            order = dict(row)

            # Lấy chi tiết sản phẩm trong đơn
            cur.execute("""
                SELECT oi.quantity, oi.price, oi.size, p.name, p.image
                FROM order_items oi
                JOIN products p ON oi.product_id = p.id
                WHERE oi.order_id = ?
            """, (order["id"],))
            items_raw = cur.fetchall()

            items = []
            for item in items_raw:
                items.append({
                    "name": item["name"] or "Sản phẩm không tên",
                    "image": item["image"] or "https://via.placeholder.com/150",
                    "quantity": item["quantity"],
                    "price": float(item["price"]),
                    "size": item["size"] or "Freesize"
                })

            result.append({
                "id": order["id"],
                "username": order["username"],
                "total_price": float(order["total_price"]),
                "status": order["status"] or "pending",
                "recipient_name": order["recipient_name"] or "Chưa có tên",
                "address": order["address"] or "Chưa có địa chỉ",
                "phone": order["phone"] or "Chưa có SĐT",
                "items": items
            })

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi server: {str(e)}")
    finally:
        conn.close()


@app.get("/admin/users")
def get_all_users(Authorization: str = Header(None)):
    user = get_user_from_auth_header(Authorization)
    if not user["is_admin"]:
        raise HTTPException(status_code=403, detail="Chỉ admin mới được xem")

    conn = get_db()
    cur = conn.cursor()

    try:
        cur.execute("SELECT id, username, email, is_admin FROM users ORDER BY id")
        users = cur.fetchall()
        return [dict(u) for u in users]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi server: {str(e)}")
    finally:
        conn.close()


@app.patch("/admin/orders/{order_id}")
def update_order_status(order_id: int, data: dict, Authorization: str = Header(None)):
    user = get_user_from_auth_header(Authorization)
    if not user["is_admin"]:
        raise HTTPException(status_code=403, detail="Chỉ admin mới được cập nhật")

    status = data.get("status")
    allowed_status = ["pending", "processing", "delivered", "cancelled"]
    
    if status not in allowed_status:
        raise HTTPException(status_code=400, detail=f"Trạng thái không hợp lệ. Chỉ chấp nhận: {', '.join(allowed_status)}")

    conn = get_db()
    cur = conn.cursor()

    try:
        cur.execute("UPDATE orders SET status = ? WHERE id = ?", (status, order_id))
        
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy đơn hàng")

        conn.commit()
        return {"message": "Cập nhật trạng thái thành công"}

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Lỗi cập nhật: {str(e)}")
    finally:
        conn.close()

        
        # ==================== CRUD SẢN PHẨM - HOÀN CHỈNH 100% ====================

# THÊM SẢN PHẨM
@app.post("/admin/products")
def create_product(product: dict, Authorization: str = Header(None)):
    user = get_user_from_auth_header(Authorization)
    if not user["is_admin"]:
        raise HTTPException(403, "Chỉ admin mới được thêm sản phẩm")

    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO products (name, price, category, image, description, sizes, stock)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        product["name"], product["price"], product.get("category", "clothing"),
        product["image"], product.get("description", ""), product.get("sizes", "Freesize"), product.get("stock", 100)
    ))
    product_id = cur.lastrowid
    conn.commit()
    conn.close()
    return {"id": product_id, "message": "Thêm sản phẩm thành công"}

# SỬA SẢN PHẨM
@app.put("/admin/products/{product_id}")
def update_product(product_id: int, product: dict, Authorization: str = Header(None)):
    user = get_user_from_auth_header(Authorization)
    if not user["is_admin"]:
        raise HTTPException(403, "Chỉ admin mới được sửa")

    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        UPDATE products SET name=?, price=?, category=?, image=?, description=?, sizes=?, stock=?
        WHERE id=?
    """, (
        product["name"], product["price"], product.get("category", "clothing"),
        product["image"], product.get("description", ""), product.get("sizes", "Freesize"),
        product.get("stock", 100), product_id
    ))
    if cur.rowcount == 0:
        conn.close()
        raise HTTPException(404, "Không tìm thấy sản phẩm")
    conn.commit()
    conn.close()
    return {"message": "Cập nhật thành công"}

# XÓA SẢN PHẨM
@app.delete("/admin/products/{product_id}")
def delete_product(product_id: int, Authorization: str = Header(None)):
    user = get_user_from_auth_header(Authorization)
    if not user["is_admin"]:
        raise HTTPException(403, "Chỉ admin mới được xóa")

    conn = get_db()
    cur = conn.cursor()
    cur.execute("DELETE FROM products WHERE id=?", (product_id,))
    if cur.rowcount == 0:
        conn.close()
        raise HTTPException(404, "Không tìm thấy sản phẩm")
    conn.commit()
    conn.close()
    return {"message": "Xóa sản phẩm thành công"}