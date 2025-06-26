import uvicorn
from fastapi import FastAPI
from routes.user_routes import router as user_router
from routes.product_routes import router as product_router

app = FastAPI(
    title="My FastAPI Application",
    description="This is a simple FastAPI application.",
    version="1.0.0",
    openapi_tags=[
        {
            "name": "greetings",
            "description": "Operations with greetings",
        },
    ],
)

app.include_router(user_router, prefix="/users", tags=["users"])
app.include_router(product_router, prefix="/products", tags=["products"])

if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=8080, reload=True)