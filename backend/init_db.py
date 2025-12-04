import sqlite3
from database import DB_NAME

# =============================
# Reset & Insert sample data
# =============================

conn = sqlite3.connect(DB_NAME)
cur = conn.cursor()

print("🗑 Xóa toàn bộ sản phẩm cũ...")
cur.execute("DELETE FROM products")
cur.execute("DELETE FROM sqlite_sequence WHERE name='products'")

# =============================
# FULL PRODUCT LIST (50+ items)
# =============================

products = [
    # Quần áo
    ("Áo vest nam", 150000, "clothing",
     "https://global2019-static-cdn.kikuu.com/k-s-oss-16470779199493TmQtEMTwM.jpg?x-oss-process=style/p_list",
     "Áo vest nam thời trang, phong cách lịch lãm",
     "M,L,XL"),
    ("Quần jeans nữ", 250000, "clothing",
     "https://global2019-static-cdn.kikuu.com/k-s-oss-1744443999259NZFH5wsNx4.jpg?x-oss-process=style/p_list",
     "Quần jeans nữ dáng ôm, trẻ trung",
     "26,27,28,29,30"),
    ("Áo sơ mi nam", 200000, "clothing",
     "https://global2019-static-cdn.kikuu.com/k-s-oss-1684914694527KYN6cMpcTz.jpg?x-oss-process=style/p_list",
     "Áo sơ mi nam chất liệu thoáng mát",
     "M,L,XL"),
    ("Váy nữ xòe", 300000, "clothing",
     "https://global2019-static-cdn.kikuu.com/k-s-oss-1729823900155z3Jn6Brrxy.jpg?x-oss-process=style/p_list",
     "Váy nữ dáng xòe, phù hợp dự tiệc",
     "S,M,L"),
    ("Áo khoác nam", 400000, "clothing",
     "https://global2019-static-cdn.kikuu.com/upload-productImg-1629887679039.jpeg?x-oss-process=style/p_list",
     "Áo khoác nam phong cách năng động",
     "M,L,XL"),
    ("Quần jeans nam", 180000, "clothing",
     "https://global2019-static-cdn.kikuu.com/upload-productImg-89429416307162743.jpg?x-oss-process=style/p_list",
     "Quần jeans nam dáng slim fit",
     "28,29,30,31,32,34"),
    ("Áo khoác nữ", 550000, "clothing",
     "https://global2019-static-cdn.kikuu.com/upload-productImg-63696501604434258.jpg?x-oss-process=style/p_list",
     "Áo khoác nữ thời trang, giữ ấm tốt",
     "S,M,L"),
    ("Đồ bộ thể thao nam", 350000, "clothing",
     "https://global2019-static-cdn.kikuu.com/upload-productImg-27499357381097741.jpg?x-oss-process=style/p_list",
     "Đồ bộ thể thao nam thoải mái",
     "M,L,XL"),
    ("Quần tây nam", 270000, "clothing",
     "https://global2019-static-cdn.kikuu.com/upload-productImg-1634276995281.jpeg?x-oss-process=style/p_list",
     "Quần tây nam lịch sự, phù hợp công sở",
     "28,29,30,31,32,33,34"),
    ("Áo len nam", 320000, "clothing",
     "https://global2019-static-cdn.kikuu.com/upload-productImg-87508149090466335.jpg?x-oss-process=style/p_list",
     "Áo len nam ấm áp, thời trang",
     "M,L,XL"),

    # Giày
    ("Giày thể thao nam", 300000, "shoes",
     "https://global2019-static-cdn.kikuu.com/upload-productImg-45103808106168598.jpg?x-oss-process=style/p_list",
     "Giày thể thao nam năng động",
     "39,40,41,42,43"),
    ("Giày cao gót nữ", 400000, "shoes",
     "https://global2019-static-cdn.kikuu.com/upload-productImg-29710838965573851.jpg?x-oss-process=style/p_list",
     "Giày cao gót nữ thanh lịch",
     "35,36,37,38,39"),
    ("Giày thể thao nữ", 220000, "shoes",
     "https://global2019-static-cdn.kikuu.com/upload-productImg-1622702504037.jpeg?x-oss-process=style/p_list",
     "Giày thể thao nữ nhẹ nhàng",
     "35,36,37,38,39"),
    ("Giày lười nam", 350000, "shoes",
     "https://global2019-static-cdn.kikuu.com/upload-productImg-29643520629230151.jpg?x-oss-process=style/p_list",
     "Giày lười nam tiện lợi",
     "39,40,41,42,43"),
    ("Giày vải nam", 500000, "shoes",
     "https://global2019-static-cdn.kikuu.com/k-s-oss-1710400107612PfFEYDAGPT.jpg?x-oss-process=style/p_list",
     "Giày vải nam thời trang",
     "39,40,41,42,43"),
    ("Dép nam", 280000, "shoes",
     "https://global2019-static-cdn.kikuu.com/k-s-oss-1726563829362TSQAG2pjpY.png?x-oss-process=style/p_list",
     "Dép nam thoải mái",
     "39,40,41,42,43"),
    ("Giày da nam", 450000, "shoes",
     "https://global2019-static-cdn.kikuu.com/upload-productImg-71458708945690809.jpeg?x-oss-process=style/p_list",
     "Giày da nam lịch lãm",
     "39,40,41,42,43"),
    ("Dép nữ", 260000, "shoes",
     "https://global2019-static-cdn.kikuu.com/k-s-oss-17370077153447PfGF34sW5.jpg?x-oss-process=style/p_list",
     "Dép nữ thời trang",
     "35,36,37,38,39"),
    ("Giày thể thao nữ", 330000, "shoes",
     "https://global2019-static-cdn.kikuu.com/k-s-oss-1679298949949HzQrzJ4WeA.jpg?x-oss-process=style/p_list",
     "Giày thể thao nữ năng động",
     "35,36,37,38,39"),
    ("Giày nam", 400000, "shoes",
     "https://global2019-static-cdn.kikuu.com/upload-productImg-1635238057620.jpeg?x-oss-process=style/p_list",
     "Giày nam đa phong cách",
     "39,40,41,42,43"),

    # Túi xách
    ("Túi xách nữ thời trang", 350000, "bags",
     "https://global2019-static-cdn.kikuu.com/upload-productImg-1555842103413.jpeg?x-oss-process=style/p_list",
     "Túi xách nữ phong cách hiện đại",
     ""),
    ("Balo nam đi học", 280000, "bags",
     "https://global2019-static-cdn.kikuu.com/upload-productImg-1554731863751.jpeg?x-oss-process=style/p_list",
     "Balo nam tiện lợi cho học tập",
     ""),
    ("Túi đeo chéo nữ", 220000, "bags",
     "https://global2019-static-cdn.kikuu.com/k-s-oss-16485241352152fe3DXyJPn.jpg?x-oss-process=style/p_list",
     "Túi đeo chéo nữ nhỏ gọn",
     ""),
    ("Balo du lịch", 450000, "bags",
     "https://global2019-static-cdn.kikuu.com/upload-productImg-46072512382553549.jpg?x-oss-process=style/p_list",
     "Balo du lịch bền bỉ",
     ""),
    ("Túi xách nữ", 300000, "bags",
     "https://global2019-static-cdn.kikuu.com/upload-productImg-1604911990283.jpeg?x-oss-process=style/p_list",
     "Túi xách nữ thanh lịch",
     ""),
    ("Túi đeo vai nữ", 180000, "bags",
     "https://global2019-static-cdn.kikuu.com/k-s-oss-1716390115060A7XZhnnCPh.jpg?x-oss-process=style/p_list",
     "Túi đeo vai nữ thời trang",
     ""),
    ("Ví nam", 500000, "bags",
     "https://global2019-static-cdn.kikuu.com/upload-productImg-18662617502199927.jpg?x-oss-process=style/p_list",
     "Ví nam cao cấp",
     ""),
    ("Túi xách nữ", 260000, "bags",
     "https://global2019-static-cdn.kikuu.com/upload-productImg-30267582874769652.jpg?x-oss-process=style/p_list",
     "Túi xách nữ phong cách",
     ""),
    ("Túi xách nam", 210000, "bags",
     "https://global2019-static-cdn.kikuu.com/upload-productImg-29060445527628915.jpg?x-oss-process=style/p_list",
     "Túi xách nam đa năng",
     ""),
    ("Túi du lịch nữ", 600000, "bags",
     "https://global2019-static-cdn.kikuu.com/k-s-oss-1658474668731AhpSXpsSfB.jpg?x-oss-process=style/p_list",
     "Túi du lịch nữ thời trang",
     ""),

    # Phụ kiện
    ("Đồng hồ nữ", 120000, "accessories",
     "https://global2019-static-cdn.kikuu.com/k-s-oss-1713544788079HBmjS6zYWE.jpg?x-oss-process=style/p_list",
     "Đồng hồ nữ thời trang",
     ""),
    ("Đồng hồ nam", 90000, "accessories",
     "https://global2019-static-cdn.kikuu.com/upload-productImg-77245117381527466.jpg?x-oss-process=style/p_list",
     "Đồng hồ nam phong cách",
     ""),
    ("Đồng hồ nữ", 80000, "accessories",
     "https://global2019-static-cdn.kikuu.com/upload-productImg-13897595275054834.jpg?x-oss-process=style/p_list",
     "Đồng hồ nữ nhỏ gọn",
     ""),
    ("Đồng hồ nam", 70000, "accessories",
     "https://global2019-static-cdn.kikuu.com/k-s-oss-1697963749950we4aNaf3mw.jpg?x-oss-process=style/p_list",
     "Đồng hồ nam năng động",
     ""),
    ("Vòng tay nữ", 130000, "accessories",
     "https://global2019-static-cdn.kikuu.com/k-s-oss-1726105769246SjKKWZzXR6.jpg?x-oss-process=style/p_list",
     "Vòng tay nữ thời trang",
     ""),
    ("Bông tai nữ", 60000, "accessories",
     "https://global2019-static-cdn.kikuu.com/upload-productImg-1596598826229.jpeg?x-oss-process=style/p_list",
     "Bông tai nữ thanh lịch",
     ""),
    ("Đồng hồ nữ", 110000, "accessories",
     "https://global2019-static-cdn.kikuu.com/upload-productImg-74150899822205090.jpg?x-oss-process=style/p_list",
     "Đồng hồ nữ phong cách",
     ""),
    ("Dây chuyền", 150000, "accessories",
     "https://global2019-static-cdn.kikuu.com/upload-productImg-1633692759264.jpeg?x-oss-process=style/p_list",
     "Dây chuyền thời trang",
     ""),
    ("Vòng tay nữ", 90000, "accessories",
     "https://global2019-static-cdn.kikuu.com/upload-productImg-1599126869111.jpeg?x-oss-process=style/p_list",
     "Vòng tay nữ nhẹ nhàng",
     ""),
    ("Bộ trang sức nữ", 140000, "accessories",
     "https://global2019-static-cdn.kikuu.com/k-s-oss-1714060627913tPhPeheQ7W.jpg?x-oss-process=style/p_list",
     "Bộ trang sức nữ sang trọng",
     "")
]

# ==================================
# INSERT DATA
# ==================================
print("📥 Chèn dữ liệu mẫu...")

for p in products:
    cur.execute("""
        INSERT INTO products (name, price, category, image, description, sizes, stock)
        VALUES (?, ?, ?, ?, ?, ?, 100)
    """, p)

conn.commit()
conn.close()

print("🎉 HOÀN TẤT! Dữ liệu mẫu đã được thêm vào app.db")
