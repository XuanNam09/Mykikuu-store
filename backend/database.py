import sqlite3
import os

DB_NAME = "app.db"

def get_db():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    if os.path.exists(DB_NAME):
        return

    conn = get_db()
    cur = conn.cursor()

    # USERS
    cur.execute("""
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            email TEXT UNIQUE,
            password TEXT,
            is_admin INTEGER DEFAULT 0
        )
    """)

    # Auto admin
    cur.execute("""
        INSERT INTO users (username, email, password, is_admin)
        VALUES ('admin', 'admin@example.com', 'admin123', 1)
    """)

    # PRODUCTS
    cur.execute("""
        CREATE TABLE products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            price REAL,
            category TEXT,
            image TEXT,
            description TEXT,
            sizes TEXT,
            stock INTEGER,
            sold INTEGER DEFAULT 0
        )
    """)

    # ORDERS
    cur.execute("""
        CREATE TABLE orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            total_price REAL,
            status TEXT DEFAULT 'pending'
        )
    """)

    # ORDER ITEMS
    cur.execute("""
        CREATE TABLE order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER,
            product_id INTEGER,
            size TEXT,
            quantity INTEGER,
            price REAL
        )
    """)

    conn.commit()
    conn.close()

init_db()
