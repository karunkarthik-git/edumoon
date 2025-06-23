import uvicorn
from fastapi import FastAPI, Path, Request, Form
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from typing import List
from pydantic import BaseModel, Field

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

templates = Jinja2Templates(directory="templates")

# @app.get("/hello", tags=["greetings"])
# async def root():
#     return {"message": "Hello, World!"}

# Path parameters can be used to capture dynamic segments in the URL.
# @app.get("/hello/{name}/{age}", tags=["greetings"])
# async def root(name: str, age: int):
#     return {"message": f"Hello, {name}! You are {age} years old."}

# @app.get("/hey", tags=["greetings"])
# async def hey(name: str, age: int):
#     """
#     A simple endpoint that greets the user by name.
#     If no age is provided, it defaults to 30.
#     """
#     return {
#         "name": name,
#         "age": age,
#     }

@app.get("/hello/{name}/{age}", tags=["greetings"])
async def hello(
        name: str = Path(description="The name of the person to greet", example="Alice", min_length=5, max_length=50),
        age: int = Path(description="The age of the person", example=30, ge=40, le=80)
        # gt, lt
    ):
    """
    A simple endpoint that returns a greeting message.
    """
    return {"message": f"Hello, {name}! You are {age} years old."}

class Student(BaseModel):
    id: int
    name: str = Field(..., min_length=2, max_length=100)
    subjects: List[str] = []

@app.post("/students", tags=["students"])
async def create_student(student: Student):
    """
    Create a new student.
    """
    return {"message": "Student created successfully", "student": student}


# @app.get("/html")
# async def get_html():
#     """
#     Returns a simple HTML response.
#     """
#     html = """
#     <html>
#         <head>
#             <title>My FastAPI Application</title>
#         </head>
#         <body>
#             <h1>Welcome to My FastAPI Application!</h1>
#             <p>This is a simple HTML response.</p>
#         </body>
#     </html>
#     """
#     return HTMLResponse(content=html, status_code=201)

@app.get("/html/{name}", response_class=HTMLResponse)
async def get_html(name:str, request:Request):
    return templates.TemplateResponse("index.html", {"request": request, "name": name})


@app.get("/login", response_class=HTMLResponse)
async def login(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/submit")
async def submit(username: str = Form(...), password: str = Form(...)):
    """
    Handle the form submission.
    """
    # Here you would typically handle the login logic
    return {"message": f"Username: {username}, Password: {password}"}

if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=8080, reload=True)