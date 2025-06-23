# FastAPI Tutorial - Batch 2: Request Bodies and Advanced Validations
**Topics Covered:** Request Body, Query Parameters and String Validations, Path Parameters and Numeric Validations

---

## Table of Contents
1. [Request Body with Pydantic Models](#request-body-with-pydantic-models)
2. [Query Parameters and String Validations](#query-parameters-and-string-validations)
3. [Path Parameters and Numeric Validations](#path-parameters-and-numeric-validations)
4. [Complete Examples](#complete-examples)
5. [Best Practices](#best-practices)

---

## Request Body with Pydantic Models

### Overview
Request bodies are data sent from a client to your API. FastAPI uses Pydantic models to handle request body validation, serialization, and documentation automatically.

### Basic Pydantic Model Setup

#### Import BaseModel
```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()
```

#### Create a Data Model
```python
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Union

class Item(BaseModel):
    name: str
    description: Union[str, None] = None  # Optional field
    price: float
    tax: Union[float, None] = None       # Optional field

app = FastAPI()

@app.post("/items/")
async def create_item(item: Item):
    return item
```

### Understanding Pydantic Models

#### Required vs Optional Fields
- Fields without default values are **required**
- Fields with default values (including `None`) are **optional**

Example JSON representations:
```json
// All fields
{
    "name": "Laptop",
    "description": "Gaming laptop",
    "price": 999.99,
    "tax": 99.99
}

// Only required fields
{
    "name": "Laptop",
    "price": 999.99
}
```

### What FastAPI Does Automatically

When you declare a Pydantic model as a parameter, FastAPI will:

1. **Read** the request body as JSON
2. **Convert** the corresponding types (if needed)
3. **Validate** the data and return clear errors if invalid
4. **Provide** the received data in the parameter with full type hints
5. **Generate** JSON Schema definitions for your model
6. **Include** schemas in the OpenAPI schema and automatic docs

### Working with Request Bodies

#### Using the Model in Functions
```python
@app.post("/items/")
async def create_item(item: Item):
    # Access model attributes directly
    item_dict = item.dict()
    
    # Perform calculations
    if item.tax is not None:
        price_with_tax = item.price + item.tax
        item_dict.update({"price_with_tax": price_with_tax})
    
    return item_dict
```

#### Combining Request Body with Path Parameters
```python
@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item):
    return {"item_id": item_id, **item.dict()}
```

#### Combining Request Body, Path, and Query Parameters
```python
@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item, q: Union[str, None] = None):
    result = {"item_id": item_id, **item.dict()}
    if q:
        result.update({"q": q})
    return result
```

### Parameter Recognition Rules

FastAPI determines parameter types automatically:
- **Path parameters**: Declared in the path (e.g., `{item_id}`)
- **Query parameters**: Singular types (`int`, `float`, `str`, `bool`, etc.)
- **Request body**: Pydantic model types

### Advanced Pydantic Features

#### Model with Various Data Types
```python
from datetime import datetime
from typing import List, Union
from pydantic import BaseModel, Field

class User(BaseModel):
    id: int
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., regex=r'^[\w\.-]+@[\w\.-]+\.\w+$')
    age: int = Field(..., ge=0, le=120)
    created_at: datetime
    tags: List[str] = []
    is_active: bool = True
    score: Union[float, None] = None

@app.post("/users/")
async def create_user(user: User):
    return user
```

#### Nested Models
```python
class Address(BaseModel):
    street: str
    city: str
    country: str
    postal_code: str

class UserWithAddress(BaseModel):
    name: str
    email: str
    address: Address
    
@app.post("/users-with-address/")
async def create_user_with_address(user: UserWithAddress):
    return user
```

---

## Query Parameters and String Validations

### Overview
FastAPI allows you to add extensive validation and metadata to query parameters using the `Query` function and `Annotated` type hints.

### Basic Setup with Query and Annotated

#### Import Required Components
```python
from typing import Annotated, Union
from fastapi import FastAPI, Query

app = FastAPI()
```

#### Basic String Length Validation
```python
@app.get("/items/")
async def read_items(
    q: Annotated[Union[str, None], Query(max_length=50)] = None
):
    results = {"items": [{"item_id": "Foo"}, {"item_id": "Bar"}]}
    if q:
        results.update({"q": q})
    return results
```

### String Validation Options

#### Length Constraints
```python
@app.get("/items/")
async def read_items(
    q: Annotated[
        Union[str, None], 
        Query(min_length=3, max_length=50)
    ] = None,
):
    results = {"items": [{"item_id": "Foo"}, {"item_id": "Bar"}]}
    if q:
        results.update({"q": q})
    return results
```

#### Regular Expression Patterns
```python
@app.get("/items/")
async def read_items(
    q: Annotated[
        Union[str, None], 
        Query(
            min_length=3, 
            max_length=50, 
            pattern="^[a-zA-Z0-9]+$"  # Only alphanumeric characters
        )
    ] = None,
):
    results = {"items": [{"item_id": "Foo"}, {"item_id": "Bar"}]}
    if q:
        results.update({"q": q})
    return results
```

### Default Values and Required Parameters

#### Custom Default Values
```python
@app.get("/items/")
async def read_items(
    q: Annotated[str, Query(min_length=3)] = "defaultquery"
):
    results = {"items": [{"item_id": "Foo"}, {"item_id": "Bar"}]}
    results.update({"q": q})
    return results
```

#### Required Query Parameters
```python
@app.get("/items/")
async def read_items(
    q: Annotated[str, Query(min_length=3)]  # No default = required
):
    results = {"items": [{"item_id": "Foo"}, {"item_id": "Bar"}]}
    results.update({"q": q})
    return results
```

#### Required but Can Be None
```python
@app.get("/items/")
async def read_items(
    q: Annotated[Union[str, None], Query(min_length=3)]  # Required, but can be None
):
    results = {"items": [{"item_id": "Foo"}, {"item_id": "Bar"}]}
    if q:
        results.update({"q": q})
    return results
```

### List/Multiple Values

#### Query Parameter Lists
```python
@app.get("/items/")
async def read_items(
    q: Annotated[Union[List[str], None], Query()] = None
):
    query_items = {"q": q}
    return query_items

# URL: /items/?q=foo&q=bar
# Result: {"q": ["foo", "bar"]}
```

#### Lists with Default Values
```python
@app.get("/items/")
async def read_items(
    q: Annotated[List[str], Query()] = ["foo", "bar"]
):
    query_items = {"q": q}
    return query_items
```

### Metadata and Documentation

#### Adding Titles and Descriptions
```python
@app.get("/items/")
async def read_items(
    q: Annotated[
        Union[str, None],
        Query(
            title="Query string",
            description="Query string for the items to search in the database that have a good match",
            min_length=3,
            max_length=50,
        ),
    ] = None,
):
    results = {"items": [{"item_id": "Foo"}, {"item_id": "Bar"}]}
    if q:
        results.update({"q": q})
    return results
```

### Advanced Features

#### Parameter Aliases
```python
@app.get("/items/")
async def read_items(
    q: Annotated[Union[str, None], Query(alias="item-query")] = None
):
    results = {"items": [{"item_id": "Foo"}, {"item_id": "Bar"}]}
    if q:
        results.update({"q": q})
    return results

# URL: /items/?item-query=foobaritems
```

#### Deprecating Parameters
```python
@app.get("/items/")
async def read_items(
    q: Annotated[
        Union[str, None],
        Query(
            alias="item-query",
            title="Query string",
            description="Query string for the items to search in the database",
            min_length=3,
            max_length=50,
            pattern="^fixedquery$",
            deprecated=True,
        ),
    ] = None,
):
    results = {"items": [{"item_id": "Foo"}, {"item_id": "Bar"}]}
    if q:
        results.update({"q": q})
    return results
```

#### Excluding from OpenAPI
```python
@app.get("/items/")
async def read_items(
    hidden_query: Annotated[
        Union[str, None], 
        Query(include_in_schema=False)
    ] = None,
):
    if hidden_query:
        return {"hidden_query": hidden_query}
    else:
        return {"hidden_query": "Not found"}
```

### Custom Validation with Pydantic

#### Using AfterValidator
```python
import random
from typing import Annotated, Union
from fastapi import FastAPI
from pydantic import AfterValidator

app = FastAPI()

data = {
    "isbn-9781529046137": "The Hitchhiker's Guide to the Galaxy",
    "imdb-tt0371724": "The Hitchhiker's Guide to the Galaxy",
    "isbn-9781439512982": "Isaac Asimov: The Complete Stories, Vol. 2",
}

def check_valid_id(id: str):
    if not id.startswith(("isbn-", "imdb-")):
        raise ValueError('Invalid ID format, it must start with "isbn-" or "imdb-"')
    return id

@app.get("/items/")
async def read_items(
    id: Annotated[Union[str, None], AfterValidator(check_valid_id)] = None,
):
    if id:
        item = data.get(id)
    else:
        id, item = random.choice(list(data.items()))
    return {"id": id, "name": item}
```

---

## Path Parameters and Numeric Validations

### Overview
Similar to query parameters, path parameters can have additional validation and metadata using the `Path` function.

### Basic Path Validation Setup

#### Import Path
```python
from typing import Annotated
from fastapi import FastAPI, Path, Query

app = FastAPI()
```

#### Adding Metadata to Path Parameters
```python
@app.get("/items/{item_id}")
async def read_items(
    item_id: Annotated[int, Path(title="The ID of the item to get")],
    q: Annotated[Union[str, None], Query(alias="item-query")] = None,
):
    results = {"item_id": item_id}
    if q:
        results.update({"q": q})
    return results
```

### Parameter Ordering

#### Using Annotated (Recommended)
```python
@app.get("/items/{item_id}")
async def read_items(
    item_id: Annotated[int, Path(title="The ID of the item to get")],
    q: str  # Required query parameter
):
    results = {"item_id": item_id}
    results.update({"q": q})
    return results
```

#### Alternative Ordering (Without Annotated)
```python
@app.get("/items/{item_id}")
async def read_items(
    q: str,  # Required query parameter first
    item_id: int = Path(title="The ID of the item to get")
):
    results = {"item_id": item_id}
    results.update({"q": q})
    return results
```

#### Using * for Flexible Ordering
```python
@app.get("/items/{item_id}")
async def read_items(
    *, 
    item_id: int = Path(title="The ID of the item to get"), 
    q: str
):
    results = {"item_id": item_id}
    results.update({"q": q})
    return results
```

### Numeric Validations

#### Greater Than or Equal (ge)
```python
@app.get("/items/{item_id}")
async def read_items(
    item_id: Annotated[int, Path(title="The ID of the item to get", ge=1)],
    q: str
):
    results = {"item_id": item_id}
    results.update({"q": q})
    return results
```

#### Range Validations
```python
@app.get("/items/{item_id}")
async def read_items(
    item_id: Annotated[
        int, 
        Path(title="The ID of the item to get", gt=0, le=1000)
    ],
    q: str,
):
    results = {"item_id": item_id}
    results.update({"q": q})
    return results
```

#### Float Validations
```python
@app.get("/items/{item_id}")
async def read_items(
    *,
    item_id: Annotated[
        int, 
        Path(title="The ID of the item to get", ge=0, le=1000)
    ],
    q: str,
    size: Annotated[float, Query(gt=0, lt=10.5)],
):
    results = {"item_id": item_id}
    results.update({"q": q})
    results.update({"size": size})
    return results
```

### Validation Options Summary

- **`gt`**: greater than
- **`ge`**: greater than or equal
- **`lt`**: less than  
- **`le`**: less than or equal

These work for both integers and floats.

---

## Complete Examples

### Example 1: E-commerce Product API

```python
from typing import Annotated, List, Union
from fastapi import FastAPI, Path, Query
from pydantic import BaseModel, Field
from enum import Enum

app = FastAPI()

class CategoryEnum(str, Enum):
    electronics = "electronics"
    clothing = "clothing"
    books = "books"
    home = "home"

class Product(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Union[str, None] = Field(None, max_length=500)
    price: float = Field(..., gt=0, le=10000)
    category: CategoryEnum
    in_stock: bool = True
    tags: List[str] = []

class ProductUpdate(BaseModel):
    name: Union[str, None] = Field(None, min_length=1, max_length=100)
    description: Union[str, None] = Field(None, max_length=500)
    price: Union[float, None] = Field(None, gt=0, le=10000)
    category: Union[CategoryEnum, None] = None
    in_stock: Union[bool, None] = None
    tags: Union[List[str], None] = None

# In-memory database
products_db = {}
next_id = 1

@app.post("/products/", response_model=dict)
async def create_product(product: Product):
    global next_id
    product_id = next_id
    products_db[product_id] = product.dict()
    next_id += 1
    return {"id": product_id, **products_db[product_id]}

@app.get("/products/")
async def list_products(
    category: Annotated[
        Union[CategoryEnum, None], 
        Query(description="Filter by product category")
    ] = None,
    min_price: Annotated[
        Union[float, None], 
        Query(ge=0, description="Minimum price filter")
    ] = None,
    max_price: Annotated[
        Union[float, None], 
        Query(ge=0, description="Maximum price filter")
    ] = None,
    in_stock_only: Annotated[
        bool, 
        Query(description="Show only products in stock")
    ] = False,
    search: Annotated[
        Union[str, None], 
        Query(min_length=1, max_length=50, description="Search in product names")
    ] = None,
    limit: Annotated[
        int, 
        Query(ge=1, le=100, description="Number of products to return")
    ] = 10,
    offset: Annotated[
        int, 
        Query(ge=0, description="Number of products to skip")
    ] = 0,
):
    filtered_products = []
    
    for product_id, product in products_db.items():
        # Apply filters
        if category and product["category"] != category:
            continue
        if min_price and product["price"] < min_price:
            continue
        if max_price and product["price"] > max_price:
            continue
        if in_stock_only and not product["in_stock"]:
            continue
        if search and search.lower() not in product["name"].lower():
            continue
            
        filtered_products.append({"id": product_id, **product})
    
    # Apply pagination
    total = len(filtered_products)
    paginated_products = filtered_products[offset:offset + limit]
    
    return {
        "products": paginated_products,
        "total": total,
        "limit": limit,
        "offset": offset
    }

@app.get("/products/{product_id}")
async def get_product(
    product_id: Annotated[
        int, 
        Path(title="The ID of the product to get", ge=1)
    ]
):
    if product_id not in products_db:
        return {"error": "Product not found"}
    return {"id": product_id, **products_db[product_id]}

@app.put("/products/{product_id}")
async def update_product(
    product_id: Annotated[
        int, 
        Path(title="The ID of the product to update", ge=1)
    ],
    product_update: ProductUpdate
):
    if product_id not in products_db:
        return {"error": "Product not found"}
    
    # Update only provided fields
    update_data = product_update.dict(exclude_unset=True)
    products_db[product_id].update(update_data)
    
    return {"id": product_id, **products_db[product_id]}

@app.delete("/products/{product_id}")
async def delete_product(
    product_id: Annotated[
        int, 
        Path(title="The ID of the product to delete", ge=1)
    ]
):
    if product_id not in products_db:
        return {"error": "Product not found"}
    
    deleted_product = products_db.pop(product_id)
    return {"message": "Product deleted", "product": deleted_product}
```

### Example 2: User Management API

```python
from typing import Annotated, Union
from fastapi import FastAPI, Path, Query
from pydantic import BaseModel, Field, EmailStr
from datetime import datetime
import re

app = FastAPI()

class User(BaseModel):
    username: str = Field(..., min_length=3, max_length=20, pattern="^[a-zA-Z0-9_]+$")
    email: EmailStr
    full_name: str = Field(..., min_length=1, max_length=50)
    age: Union[int, None] = Field(None, ge=13, le=120)
    bio: Union[str, None] = Field(None, max_length=200)

class UserUpdate(BaseModel):
    email: Union[EmailStr, None] = None
    full_name: Union[str, None] = Field(None, min_length=1, max_length=50)
    age: Union[int, None] = Field(None, ge=13, le=120)
    bio: Union[str, None] = Field(None, max_length=200)

# In-memory database
users_db = {}

@app.post("/users/")
async def create_user(user: User):
    # Check if username already exists
    if user.username in users_db:
        return {"error": "Username already exists"}
    
    user_data = user.dict()
    user_data["created_at"] = datetime.now()
    users_db[user.username] = user_data
    
    return {"username": user.username, **user_data}

@app.get("/users/")
async def list_users(
    age_min: Annotated[
        Union[int, None], 
        Query(ge=0, le=120, description="Minimum age filter")
    ] = None,
    age_max: Annotated[
        Union[int, None], 
        Query(ge=0, le=120, description="Maximum age filter")
    ] = None,
    search: Annotated[
        Union[str, None],
        Query(min_length=1, max_length=20, description="Search in usernames and full names")
    ] = None,
    limit: Annotated[int, Query(ge=1, le=50)] = 10,
    offset: Annotated[int, Query(ge=0)] = 0,
):
    filtered_users = []
    
    for username, user_data in users_db.items():
        # Apply filters
        if age_min and (user_data.get("age") is None or user_data["age"] < age_min):
            continue
        if age_max and (user_data.get("age") is None or user_data["age"] > age_max):
            continue
        if search and (
            search.lower() not in username.lower() and 
            search.lower() not in user_data["full_name"].lower()
        ):
            continue
            
        filtered_users.append({"username": username, **user_data})
    
    # Apply pagination
    total = len(filtered_users)
    paginated_users = filtered_users[offset:offset + limit]
    
    return {
        "users": paginated_users,
        "total": total,
        "limit": limit,
        "offset": offset
    }

@app.get("/users/{username}")
async def get_user(
    username: Annotated[
        str, 
        Path(
            title="Username to get",
            min_length=3,
            max_length=20,
            pattern="^[a-zA-Z0-9_]+$"
        )
    ]
):
    if username not in users_db:
        return {"error": "User not found"}
    return {"username": username, **users_db[username]}

@app.put("/users/{username}")
async def update_user(
    username: Annotated[
        str, 
        Path(
            title="Username to update",
            min_length=3,
            max_length=20,
            pattern="^[a-zA-Z0-9_]+$"
        )
    ],
    user_update: UserUpdate
):
    if username not in users_db:
        return {"error": "User not found"}
    
    # Update only provided fields
    update_data = user_update.dict(exclude_unset=True)
    users_db[username].update(update_data)
    users_db[username]["updated_at"] = datetime.now()
    
    return {"username": username, **users_db[username]}
```

---

## Best Practices

### 1. Use Pydantic Models for Complex Data

Always use Pydantic models for request bodies instead of raw dictionaries:

```python
# Good
class Item(BaseModel):
    name: str
    price: float

@app.post("/items/")
async def create_item(item: Item):
    return item

# Avoid
@app.post("/items/")
async def create_item(item: dict):
    return item
```

### 2. Leverage Field Validation

Use Pydantic's `Field` for comprehensive validation:

```python
class Product(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="Product name")
    price: float = Field(..., gt=0, le=10000, description="Product price in USD")
    sku: str = Field(..., pattern="^[A-Z]{2,4}-[0-9]{3,6}$", description="Product SKU")
```

### 3. Use Annotated for Query and Path Parameters

Prefer `Annotated` over the old default value style:

```python
# Good
@app.get("/items/")
async def read_items(
    q: Annotated[Union[str, None], Query(min_length=3, max_length=50)] = None
):
    pass

# Older style (avoid)
@app.get("/items/")
async def read_items(q: Union[str, None] = Query(None, min_length=3, max_length=50)):
    pass
```

### 4. Provide Clear Validation Messages

Use descriptive field descriptions and validation constraints:

```python
class User(BaseModel):
    username: str = Field(
        ..., 
        min_length=3, 
        max_length=20, 
        pattern="^[a-zA-Z0-9_]+$",
        description="Username must be 3-20 characters, alphanumeric and underscores only"
    )
    age: int = Field(
        ..., 
        ge=13, 
        le=120,
        description="User age must be between 13 and 120"
    )
```

### 5. Use Appropriate HTTP Methods

Match HTTP methods to their intended purpose:

```python
@app.post("/users/")      # Create new user
async def create_user(user: User): pass

@app.get("/users/{user_id}")  # Read user
async def get_user(user_id: int): pass

@app.put("/users/{user_id}")  # Update entire user
async def update_user(user_id: int, user: User): pass

@app.patch("/users/{user_id}")  # Partial update
async def patch_user(user_id: int, user_update: UserUpdate): pass

@app.delete("/users/{user_id}")  # Delete user
async def delete_user(user_id: int): pass
```

### 6. Implement Proper Error Handling

Return meaningful error responses:

```python
from fastapi import HTTPException

@app.get("/users/{user_id}")
async def get_user(user_id: int):
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    return users_db[user_id]
```

### 7. Use Enums for Limited Choices

Define enums for fields with predefined values:

```python
from enum import Enum

class StatusEnum(str, Enum):
    active = "active"
    inactive = "inactive"
    pending = "pending"

class User(BaseModel):
    name: str
    status: StatusEnum = StatusEnum.pending
```

### 8. Implement Pagination

Always implement pagination for list endpoints:

```python
@app.get("/items/")
async def list_items(
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    offset: Annotated[int, Query(ge=0)] = 0
):
    total = len(items_db)
    items = list(items_db.values())[offset:offset + limit]
    return {
        "items": items,
        "total": total,
        "limit": limit,
        "offset": offset
    }
```

### 9. Use Response Models

Define response models for consistent API responses:

```python
class ItemResponse(BaseModel):
    id: int
    name: str
    price: float
    created_at: datetime

@app.post("/items/", response_model=ItemResponse)
async def create_item(item: Item):
    # ... create item logic
    return ItemResponse(
        id=new_id,
        name=item.name,
        price=item.price,
        created_at=datetime.now()
    )
```

### 10. Validate Custom Business Logic

Use Pydantic validators for complex business logic:

```python
from pydantic import validator

class Order(BaseModel):
    quantity: int
    price: float
    discount_percent: float = 0
    
    @validator('discount_percent')
    def validate_discount(cls, v, values):
        if v < 0 or v > 50:
            raise ValueError('Discount must be between 0 and 50 percent')
        return v
    
    @validator('quantity')
    def validate_quantity(cls, v):
        if v <= 0:
            raise ValueError('Quantity must be positive')
        return v
```

---

## Summary

This batch covered advanced FastAPI features for handling data validation and request processing:

1. **Request Bodies**: Using Pydantic models for automatic validation, serialization, and documentation
2. **Query Parameter Validations**: Adding string validations, metadata, and custom validators
3. **Path Parameter Validations**: Implementing numeric validations and metadata for path parameters

Key takeaways:
- Pydantic models provide powerful data validation and automatic documentation
- Use `Annotated` with `Query` and `Path` for enhanced parameter validation
- FastAPI automatically handles type conversion, validation, and error responses
- Proper validation improves API reliability and user experience
- The framework generates comprehensive OpenAPI documentation automatically

In the next batch, we'll explore more advanced topics like query parameter models, multiple parameters, fields, and nested models.
