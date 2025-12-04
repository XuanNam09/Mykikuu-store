from pydantic import BaseModel
from typing import List, Optional

class User(BaseModel):
    id: int
    username: str
    email: str
    is_admin: int

class UserRegister(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

# PRODUCT
class ProductBase(BaseModel):
    name: str
    price: float
    category: str
    image: str
    description: str
    sizes: str
    stock: int

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int

# ORDER ITEM
class OrderItem(BaseModel):
    product_id: int
    size: Optional[str] = None
    quantity: int
    price: float

# ĐÃ BỔ SUNG 3 TRƯỜNG MỚI
class OrderCreate(BaseModel):
    username: str
    recipient_name: str
    address: str
    phone: str
    items: List[OrderItem]

class OrderResponse(BaseModel):
    id: int
    user_id: int
    total_price: float
    status: str
    recipient_name: str
    address: str
    phone: str
    items: List[OrderItem]