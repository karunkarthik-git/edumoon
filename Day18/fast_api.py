from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def get_base():
    return {"message": "Welcome to the FastAPI application!"}

@app.get("/hello")
def get_hello():
    print("Hello endpoint was called")
    return {"message": "Hello, World!"}



