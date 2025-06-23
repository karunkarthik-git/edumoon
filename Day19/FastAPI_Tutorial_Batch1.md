# FastAPI Tutorial - Batch 1: Getting Started
**Topics Covered:** First Steps, Path Parameters, Query Parameters

---

## Table of Contents
1. [First Steps](#first-steps)
2. [Path Parameters](#path-parameters)
3. [Query Parameters](#query-parameters)
4. [Complete Examples](#complete-examples)
5. [Best Practices](#best-practices)

---

## First Steps

### Overview
FastAPI is a modern, fast (high-performance), web framework for building APIs with Python 3.8+ based on standard Python type hints. It's designed to be easy to use, learn, and deploy while providing automatic interactive API documentation.

### Basic FastAPI Application

The simplest FastAPI application looks like this:

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}
```

### Key Components Breakdown

1. **Import FastAPI**: `from fastapi import FastAPI`
2. **Create FastAPI Instance**: `app = FastAPI()`
3. **Define Path Operation**: `@app.get("/")`
4. **Create Path Operation Function**: `async def root():`
5. **Return Content**: `return {"message": "Hello World"}`

### Running Your FastAPI Application

To run your FastAPI application, save the code to a file (e.g., `main.py`) and run:

```bash
fastapi dev main.py
```

This will start a development server at `http://127.0.0.1:8000`.

### Automatic API Documentation

FastAPI automatically generates interactive API documentation:

- **Swagger UI**: Available at `http://127.0.0.1:8000/docs`
- **ReDoc**: Available at `http://127.0.0.1:8000/redoc`
- **OpenAPI Schema**: Available at `http://127.0.0.1:8000/openapi.json`

### Understanding Path Operations

#### What is a Path?
A "path" refers to the last part of the URL starting from the first `/`. For example:
- URL: `https://example.com/items/foo`
- Path: `/items/foo`

#### What is an Operation?
An "operation" refers to HTTP methods:
- `GET`: Read data
- `POST`: Create data
- `PUT`: Update data
- `DELETE`: Delete data
- Others: `OPTIONS`, `HEAD`, `PATCH`, `TRACE`

#### Path Operation Decorators
FastAPI provides decorators for each HTTP method:

```python
@app.get("/")      # GET request
@app.post("/")     # POST request
@app.put("/")      # PUT request
@app.delete("/")   # DELETE request
```

### Async vs Sync Functions

You can define path operation functions as either async or sync:

```python
# Async function
@app.get("/async")
async def read_async():
    return {"message": "This is async"}

# Sync function
@app.get("/sync")
def read_sync():
    return {"message": "This is sync"}
```

### Return Types
FastAPI supports various return types that are automatically converted to JSON:
- `dict`
- `list`
- Singular values (`str`, `int`, `float`, `bool`)
- Pydantic models
- Many other objects and models

---

## Path Parameters

### Basic Path Parameters

Path parameters allow you to capture parts of the URL path and pass them to your function:

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/items/{item_id}")
async def read_item(item_id):
    return {"item_id": item_id}
```

### Path Parameters with Types

You can declare the type of path parameters using Python type annotations:

```python
@app.get("/items/{item_id}")
async def read_item(item_id: int):
    return {"item_id": item_id}
```

### Benefits of Type Declarations

1. **Editor Support**: Error checks, autocompletion, etc.
2. **Data Conversion**: Automatic parsing from string to declared type
3. **Data Validation**: Automatic validation with helpful error messages
4. **Automatic Documentation**: Type information appears in interactive docs

### Data Validation Examples

With type declarations, FastAPI automatically validates data:

```python
# Valid request: GET /items/3
# Response: {"item_id": 3}

# Invalid request: GET /items/foo
# Response: Validation error explaining that "foo" cannot be converted to int
```

### Order Matters

When defining path operations, order is important:

```python
@app.get("/users/me")  # This must come first
async def read_user_me():
    return {"user_id": "the current user"}

@app.get("/users/{user_id}")  # This comes second
async def read_user(user_id: str):
    return {"user_id": user_id}
```

If `/users/{user_id}` was defined first, it would match `/users/me` and treat "me" as a user ID.

### Predefined Values with Enums

For path parameters with predefined values, use Python Enums:

```python
from enum import Enum
from fastapi import FastAPI

class ModelName(str, Enum):
    alexnet = "alexnet"
    resnet = "resnet"
    lenet = "lenet"

app = FastAPI()

@app.get("/models/{model_name}")
async def get_model(model_name: ModelName):
    if model_name is ModelName.alexnet:
        return {"model_name": model_name, "message": "Deep Learning FTW!"}
    
    if model_name.value == "lenet":
        return {"model_name": model_name, "message": "LeCNN all the images"}
    
    return {"model_name": model_name, "message": "Have some residuals"}
```

### Path Parameters Containing Paths

For path parameters that contain paths themselves, use the path converter:

```python
@app.get("/files/{file_path:path}")
async def read_file(file_path: str):
    return {"file_path": file_path}
```

This allows URLs like `/files/home/johndoe/myfile.txt`.

---

## Query Parameters

### Basic Query Parameters

Query parameters are function parameters that are not part of the path parameters:

```python
from fastapi import FastAPI

app = FastAPI()

fake_items_db = [{"item_name": "Foo"}, {"item_name": "Bar"}, {"item_name": "Baz"}]

@app.get("/items/")
async def read_item(skip: int = 0, limit: int = 10):
    return fake_items_db[skip : skip + limit]
```

Query parameters appear after the `?` in URLs: `http://127.0.0.1:8000/items/?skip=0&limit=10`

### Default Values

Query parameters can have default values:

```python
@app.get("/items/")
async def read_item(skip: int = 0, limit: int = 10):
    return fake_items_db[skip : skip + limit]
```

- `skip=0` and `limit=10` are defaults
- `/items/` is equivalent to `/items/?skip=0&limit=10`

### Optional Parameters

Make query parameters optional by setting default to `None`:

```python
from typing import Union

@app.get("/items/{item_id}")
async def read_item(item_id: str, q: Union[str, None] = None):
    if q:
        return {"item_id": item_id, "q": q}
    return {"item_id": item_id}

# Python 3.10+ syntax
@app.get("/items/{item_id}")
async def read_item(item_id: str, q: str | None = None):
    if q:
        return {"item_id": item_id, "q": q}
    return {"item_id": item_id}
```

### Query Parameter Type Conversion

FastAPI automatically converts query parameters to declared types:

```python
@app.get("/items/{item_id}")
async def read_item(item_id: str, q: str | None = None, short: bool = False):
    item = {"item_id": item_id}
    if q:
        item.update({"q": q})
    if not short:
        item.update({
            "description": "This is an amazing item that has a long description"
        })
    return item
```

Boolean conversion examples:
- `short=1`, `short=True`, `short=true`, `short=on`, `short=yes` → `True`
- Any other value or omitted → `False`

### Multiple Path and Query Parameters

You can combine multiple path and query parameters:

```python
@app.get("/users/{user_id}/items/{item_id}")
async def read_user_item(
    user_id: int, 
    item_id: str, 
    q: str | None = None, 
    short: bool = False
):
    item = {"item_id": item_id, "owner_id": user_id}
    if q:
        item.update({"q": q})
    if not short:
        item.update({
            "description": "This is an amazing item that has a long description"
        })
    return item
```

FastAPI automatically detects which parameters are path parameters and which are query parameters based on whether they appear in the path.

### Required Query Parameters

To make a query parameter required, don't provide a default value:

```python
@app.get("/items/{item_id}")
async def read_user_item(item_id: str, needy: str):
    item = {"item_id": item_id, "needy": needy}
    return item
```

Accessing `/items/foo-item` without the `needy` parameter will return a validation error.

### Combining Required, Default, and Optional Parameters

```python
@app.get("/items/{item_id}")
async def read_user_item(
    item_id: str,           # Path parameter (always required)
    needy: str,             # Required query parameter
    skip: int = 0,          # Query parameter with default
    limit: int | None = None # Optional query parameter
):
    item = {
        "item_id": item_id, 
        "needy": needy, 
        "skip": skip, 
        "limit": limit
    }
    return item
```

---

## Complete Examples

### Example 1: Simple Item API

```python
from fastapi import FastAPI
from typing import Union

app = FastAPI()

# In-memory database
items_db = {
    "1": {"name": "Laptop", "price": 999.99, "in_stock": True},
    "2": {"name": "Mouse", "price": 29.99, "in_stock": True},
    "3": {"name": "Keyboard", "price": 79.99, "in_stock": False},
}

@app.get("/")
async def root():
    return {"message": "Welcome to the Items API"}

@app.get("/items/")
async def list_items(
    skip: int = 0, 
    limit: int = 10, 
    in_stock: Union[bool, None] = None
):
    items = list(items_db.values())
    
    # Filter by stock status if specified
    if in_stock is not None:
        items = [item for item in items if item["in_stock"] == in_stock]
    
    return items[skip:skip + limit]

@app.get("/items/{item_id}")
async def get_item(item_id: str):
    if item_id not in items_db:
        return {"error": "Item not found"}
    return items_db[item_id]
```

### Example 2: User and Items API

```python
from fastapi import FastAPI
from enum import Enum

app = FastAPI()

class UserRole(str, Enum):
    admin = "admin"
    user = "user"
    guest = "guest"

# Mock databases
users_db = {
    "1": {"username": "alice", "role": "admin", "active": True},
    "2": {"username": "bob", "role": "user", "active": True},
    "3": {"username": "charlie", "role": "guest", "active": False},
}

user_items_db = {
    "1": [{"id": "101", "name": "Alice's Laptop"}, {"id": "102", "name": "Alice's Phone"}],
    "2": [{"id": "201", "name": "Bob's Book"}],
    "3": []
}

@app.get("/")
async def root():
    return {"message": "User Items API", "version": "1.0"}

@app.get("/users/{user_id}")
async def get_user(user_id: str):
    if user_id not in users_db:
        return {"error": "User not found"}
    return users_db[user_id]

@app.get("/users/{user_id}/items")
async def get_user_items(
    user_id: str, 
    active_only: bool = True,
    limit: int = 10
):
    if user_id not in users_db:
        return {"error": "User not found"}
    
    user = users_db[user_id]
    if active_only and not user["active"]:
        return {"message": "User is not active"}
    
    items = user_items_db.get(user_id, [])
    return items[:limit]

@app.get("/roles/{role}")
async def get_users_by_role(role: UserRole, active_only: bool = True):
    matching_users = []
    for user_id, user_data in users_db.items():
        if user_data["role"] == role.value:
            if not active_only or user_data["active"]:
                matching_users.append({"id": user_id, **user_data})
    
    return {"role": role, "users": matching_users}
```

---

## Best Practices

### 1. Use Type Hints Consistently
Always declare types for path and query parameters to get automatic validation and documentation:

```python
# Good
@app.get("/items/{item_id}")
async def get_item(item_id: int, q: str | None = None):
    pass

# Avoid
@app.get("/items/{item_id}")
async def get_item(item_id, q=None):
    pass
```

### 2. Order Path Operations Correctly
Place more specific paths before generic ones:

```python
# Correct order
@app.get("/users/me")
@app.get("/users/{user_id}")

# Wrong order
@app.get("/users/{user_id}")  # This would catch "/users/me"
@app.get("/users/me")         # This would never be reached
```

### 3. Use Enums for Predefined Values
When path parameters have limited valid values, use Enums:

```python
from enum import Enum

class ItemCategory(str, Enum):
    electronics = "electronics"
    clothing = "clothing"
    books = "books"

@app.get("/categories/{category}")
async def get_category(category: ItemCategory):
    return {"category": category}
```

### 4. Provide Meaningful Default Values
Choose sensible defaults for query parameters:

```python
@app.get("/items/")
async def list_items(
    page: int = 1,           # Start from page 1, not 0
    per_page: int = 20,      # Reasonable page size
    sort_by: str = "name",   # Default sorting
    ascending: bool = True   # Default sort order
):
    pass
```

### 5. Use Descriptive Function and Parameter Names
Make your code self-documenting:

```python
# Good
@app.get("/search/users")
async def search_users(
    query: str,
    include_inactive: bool = False,
    max_results: int = 50
):
    pass

# Less clear
@app.get("/search/users")
async def search(q: str, inactive: bool = False, max: int = 50):
    pass
```

### 6. Handle Edge Cases
Consider what happens with invalid or edge case inputs:

```python
@app.get("/items/")
async def list_items(skip: int = 0, limit: int = 10):
    # Handle negative skip
    if skip < 0:
        skip = 0
    
    # Handle unreasonable limits
    if limit > 100:
        limit = 100
    elif limit <= 0:
        limit = 10
    
    return items_db[skip:skip + limit]
```

### 7. Use Union Types for Optional Parameters
Be explicit about optional types:

```python
from typing import Union

@app.get("/items/{item_id}")
async def get_item(
    item_id: str, 
    include_details: Union[bool, None] = None,
    format: Union[str, None] = None
):
    pass

# Python 3.10+ syntax
@app.get("/items/{item_id}")
async def get_item(
    item_id: str, 
    include_details: bool | None = None,
    format: str | None = None
):
    pass
```

### 8. Document Your API with Docstrings
Add docstrings to path operation functions for better documentation:

```python
@app.get("/items/{item_id}")
async def get_item(item_id: int, include_stock: bool = True):
    """
    Get a specific item by ID.
    
    - **item_id**: The ID of the item to retrieve
    - **include_stock**: Whether to include stock information
    """
    pass
```

---

## Summary

This batch covered the foundational concepts of FastAPI:

1. **First Steps**: Basic application structure, running FastAPI, and automatic documentation
2. **Path Parameters**: Capturing URL segments, type validation, enums, and path converters
3. **Query Parameters**: URL parameters, defaults, optional parameters, and type conversion

Key takeaways:
- FastAPI provides automatic validation, documentation, and type conversion
- Type hints are crucial for getting the most out of FastAPI
- Order matters when defining path operations
- Query parameters provide flexible API interfaces
- The framework handles much of the boilerplate code automatically

In the next batches, we'll explore request bodies, advanced validation, and more sophisticated FastAPI features.
