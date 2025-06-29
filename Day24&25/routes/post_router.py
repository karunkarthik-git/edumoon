from fastapi import APIRouter, Header, HTTPException, File, UploadFile, Form
from db import db
from cloudinary_util import upload_file_to_cloudinary
from datetime import datetime
from utils import decode_jwt_token
import json

router = APIRouter()

@router.post("/create", response_model=dict)
async def create_post(
    type: str = Form(...),
    title: str = Form(...),
    content: str = Form(...),
    tags: str = Form(None),  # JSON string for list of tags
    file: UploadFile = File(None),
    Authorization: str = Header(None)
    ):
    user_data = decode_jwt_token(Authorization)
    tags_list = []

    if tags:
        try:
            tags_list = json.loads(tags)
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid tags format. Use JSON array.")
    
    file_url = None
    if file:
        file_url = upload_file_to_cloudinary(file.file)
        if not file_url:
            raise HTTPException(status_code=500, detail="Failed to upload file to Cloudinary")

    post_data = {
        "type": type,
        "title": title,
        "content": content,
        "file_url": file_url,
        "tags": tags_list,
        "created_by": user_data.get('email'),
        "created_at": datetime.now()
    }
    
    # insert into the posts collection
    result = await db.posts.insert_one(post_data)
    if not result.acknowledged:
        raise HTTPException(status_code=500, detail="Failed to create post")

    return {
        "status": "success",
        "message": "Post created successfully",
        "data": {
            "id": str(result.inserted_id),
            "type": type,
            "title": title,
            "file_url": file_url
        }
    }
    

@router.get("/by-user", response_model=dict)
async def get_all_posts(Authorization: str = Header(None)):
    user_data = decode_jwt_token(Authorization)
    posts = await db.posts.find({"created_by": user_data.get('email')}, {"_id": 0}).to_list(length=None)
    return {
        "status": "success",
        "data": posts
    }

@router.get("/", response_model=dict)
async def get_posts():
    return {
        "status": "success",
        "data": await db.posts.find({}, {"_id": 0}).to_list(length=None)
    }