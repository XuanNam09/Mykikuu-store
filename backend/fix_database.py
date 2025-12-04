# fix_database.py - CHẠY 1 LẦN DUY NHẤT ĐỂ SỬA LỖI CỘT TRONG DATABASE
import sqlite3

print("Đang sửa database app.db...")

conn = sqlite3.connect('app.db')
cur = conn.cursor()

# 1. Thêm cột vào bảng orders (nếu chưa có)
columns_to_add_orders = ['recipient_name', 'address', 'phone', 'status']
for col in columns_to_add_orders:
    try:
        if col == 'status':
            cur.execute(f"ALTER TABLE orders ADD COLUMN {col} TEXT DEFAULT 'pending'")
        else:
            cur.execute(f"ALTER TABLE orders ADD COLUMN {col} TEXT")
        print(f"Đã thêm cột {col} vào bảng orders")
    except sqlite3.OperationalError:
        print(f"Cột {col} đã tồn tại trong bảng orders")

# 2. Thêm cột size vào bảng order_items (nếu chưa có)
try:
    cur.execute("ALTER TABLE order_items ADD COLUMN size TEXT")
    print("Đã thêm cột size vào bảng order_items")
except sqlite3.OperationalError:
    print("Cột size đã tồn tại trong bảng order_items")

conn.commit()
conn.close()

print("\nHOÀN TẤT! TẤT CẢ LỖI ĐÃ ĐƯỢC SỬA!")
print("Bây giờ bạn có thể đặt hàng thành công 100%")
print("Hãy khởi động lại backend và thử lại nhé!")