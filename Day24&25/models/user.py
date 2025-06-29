from pydantic import BaseModel

class User(BaseModel):
    name: str
    email: str
    bio: str = None
    # profile_picture: str = None [Enhancement: Add profile picture field]
    password: str

class UserLogin(BaseModel):
    email: str
    password: str