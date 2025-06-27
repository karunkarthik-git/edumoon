import uvicorn
from fastapi import FastAPI
from routes.user_router import router as user_router
from middleware import AuthMiddleware

app = FastAPI(
    title="Student Collaboration App",
    description="A single app for students to collaborate",
    version="1.0.0"
)

app.add_middleware(AuthMiddleware)
app.include_router(user_router, prefix="/api/v1/users", tags=["users"])

if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=8080, reload=True)