from fastapi import APIRouter
from fastapi import HTTPException
from models.user import CreateUser
from db import db

router = APIRouter()

@router.post("/")
async def create_user(user: CreateUser):
    user_exists = await db.users.count_documents({"email": user.email}) > 0
    if user_exists:
        raise HTTPException(status_code=400, detail="User with this email already exists")
    result = await db.users.insert_one(user.dict())
    print(f"User created with id: {result}")
    return {
        "id": str(result.inserted_id)
    }
