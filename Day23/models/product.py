from pydantic import BaseModel

class Product(BaseModel):
    name: str
    description: str
    price: float
    stock: int
    _id: str = None  # Optional field for MongoDB ObjectId, can be set later
