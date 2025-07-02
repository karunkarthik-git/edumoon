import uvicorn
from fastapi import FastAPI
from routes.user_router import router as user_router
from routes.post_router import router as post_router
from routes.comment_router import router as comment_router
from fastapi.middleware.cors import CORSMiddleware

from middleware import AuthMiddleware

app = FastAPI(
    title="Student Collaboration App",
    description="A single app for students to collaborate",
    version="1.0.0"
)

app.add_middleware(AuthMiddleware)
app.include_router(user_router, prefix="/api/v1/users", tags=["users"])
app.include_router(post_router, prefix="/api/v1/posts", tags=["posts"])
app.include_router(comment_router, prefix="/api/v1/comments", tags=["comments"])
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=8080, reload=True)