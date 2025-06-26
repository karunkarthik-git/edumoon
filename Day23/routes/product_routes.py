from fastapi import APIRouter
from fastapi import HTTPException
from models.product import Product
from db import db

router = APIRouter()

@router.post("/")
async def create_product(product: Product):
    result = await db.products.insert_one(product.dict())
    print(f"Product created with id: {result}")
    return {
        "id": str(result.inserted_id)
    }

@router.get("/")
async def get_products():
    return await db.products.find({}, {"_id": 0}).to_list(length=None)