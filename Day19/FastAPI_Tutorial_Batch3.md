# FastAPI Tutorial - Batch 3: Advanced Body Handling and Data Models
**Topics Covered:** Query Parameter Models, Body - Multiple Parameters, Body - Fields, Body - Nested Models

---

## Table of Contents
1. [Query Parameter Models](#query-parameter-models)
2. [Body - Multiple Parameters](#body---multiple-parameters)
3. [Body - Fields](#body---fields)
4. [Body - Nested Models](#body---nested-models)
5. [Complete Examples](#complete-examples)
6. [Best Practices](#best-practices)

---

## Query Parameter Models

### Overview
Query Parameter Models allow you to group related query parameters into a Pydantic model, making your API endpoints cleaner and more maintainable. This is particularly useful when you have multiple related query parameters that need validation.

### Basic Query Parameter Model

```python
from typing import Annotated, Literal
from fastapi import FastAPI, Query
from pydantic import BaseModel, Field

class FilterParams(BaseModel):
    limit: int = Field(100, gt=0, le=100)
    offset: int = Field(0, ge=0)
    order_by: Literal["created_at", "updated_at"] = "created_at"
    tags: list[str] = []

app = FastAPI()

@app.get("/items/")
async def read_items(filter_query: Annotated[FilterParams, Query()]):
    return filter_query
```

### Key Benefits of Query Parameter Models

1. **Organized Code**: Group related parameters together
2. **Validation**: Automatic validation of query parameters
3. **Documentation**: Better API documentation
4. **Reusability**: Reuse the same model across endpoints
5. **Type Safety**: Full type checking support

### Advanced Query Parameter Model

```python
from typing import Annotated, Literal
from fastapi import FastAPI, Query
from pydantic import BaseModel, Field
from datetime import datetime

class SearchParams(BaseModel):
    # Basic filtering
    q: str | None = Field(None, min_length=1, max_length=100, description="Search query")
    limit: int = Field(10, gt=0, le=100, description="Number of results to return")
    offset: int = Field(0, ge=0, description="Number of results to skip")
    
    # Sorting
    sort_by: Literal["name", "price", "created_at", "updated_at"] = "created_at"
    sort_order: Literal["asc", "desc"] = "desc"
    
    # Filtering
    category: str | None = None
    min_price: float | None = Field(None, ge=0)
    max_price: float | None = Field(None, ge=0)
    tags: list[str] = []
    
    # Date filtering
    created_after: datetime | None = None
    created_before: datetime | None = None

app = FastAPI()

@app.get("/products/")
async def search_products(search_params: Annotated[SearchParams, Query()]):
    # Your search logic here
    return {
        "search_params": search_params,
        "message": "Search completed successfully"
    }
```

### Forbid Extra Query Parameters

```python
class FilterParams(BaseModel):
    model_config = {"extra": "forbid"}  # Prevents extra parameters
    
    limit: int = Field(100, gt=0, le=100)
    offset: int = Field(0, ge=0)
    order_by: Literal["created_at", "updated_at"] = "created_at"
    tags: list[str] = []

@app.get("/items/")
async def read_items(filter_query: Annotated[FilterParams, Query()]):
    return filter_query
```

---

## Body - Multiple Parameters

### Overview
FastAPI allows you to combine multiple body parameters, path parameters, and query parameters in a single endpoint. This provides flexibility in designing your API endpoints.

### Mix Path, Query and Body Parameters

```python
from typing import Annotated
from fastapi import FastAPI, Path, Query, Body
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None

app = FastAPI()

@app.put("/items/{item_id}")
async def update_item(
    item_id: Annotated[int, Path(title="The ID of the item to get", ge=0, le=1000)],
    q: str | None = None,
    item: Item | None = None,
):
    results = {"item_id": item_id}
    if q:
        results.update({"q": q})
    if item:
        results.update({"item": item})
    return results
```

### Multiple Body Parameters

When you have multiple Pydantic models as parameters, FastAPI will automatically create a JSON body with each model as a key:

```python
class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None

class User(BaseModel):
    username: str
    full_name: str | None = None

@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item, user: User):
    results = {"item_id": item_id, "item": item, "user": user}
    return results
```

Expected JSON body:
```json
{
    "item": {
        "name": "Foo",
        "description": "A very nice Item",
        "price": 10.5,
        "tax": 1.5
    },
    "user": {
        "username": "dave",
        "full_name": "Dave Grohl"
    }
}
```

### Singular Values in Body

You can add singular values to the body using the `Body` parameter:

```python
from fastapi import Body

@app.put("/items/{item_id}")
async def update_item(
    item_id: int, 
    item: Item, 
    user: User, 
    importance: Annotated[int, Body()]
):
    results = {
        "item_id": item_id, 
        "item": item, 
        "user": user, 
        "importance": importance
    }
    return results
```

Expected JSON body:
```json
{
    "item": {
        "name": "Foo",
        "description": "A very nice Item",
        "price": 10.5,
        "tax": 1.5
    },
    "user": {
        "username": "dave",
        "full_name": "Dave Grohl"
    },
    "importance": 5
}
```

### Multiple Body Parameters with Metadata

```python
@app.put("/items/{item_id}")
async def update_item(
    item_id: int,
    item: Annotated[Item, Body(title="The item to update", description="Item details")],
    user: Annotated[User, Body(title="The user performing the update")],
    importance: Annotated[int, Body(gt=0, le=10, title="Priority level")],
):
    return {
        "item_id": item_id,
        "item": item,
        "user": user,
        "importance": importance
    }
```

### Embed Single Body Parameter

When you have only one body parameter, you can embed it directly:

```python
@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Annotated[Item, Body(embed=True)]):
    results = {"item_id": item_id, "item": item}
    return results
```

With `embed=True`, the expected JSON body would be:
```json
{
    "item": {
        "name": "Foo",
        "description": "A very nice Item",
        "price": 10.5,
        "tax": 1.5
    }
}
```

Without `embed=True`, it would be:
```json
{
    "name": "Foo",
    "description": "A very nice Item",
    "price": 10.5,
    "tax": 1.5
}
```

---

## Body - Fields

### Overview
Pydantic's `Field` function allows you to add validation, metadata, and documentation to individual fields in your models. This is similar to how `Query` and `Path` work for parameters.

### Import Field

```python
from typing import Annotated
from fastapi import Body, FastAPI
from pydantic import BaseModel, Field

app = FastAPI()
```

### Basic Field Usage

```python
class Item(BaseModel):
    name: str
    description: str | None = Field(
        default=None, 
        title="The description of the item", 
        max_length=300
    )
    price: float = Field(
        gt=0, 
        description="The price must be greater than zero"
    )
    tax: float | None = None

@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Annotated[Item, Body(embed=True)]):
    results = {"item_id": item_id, "item": item}
    return results
```

### Advanced Field Validation

```python
from pydantic import Field, validator
from typing import Annotated
from datetime import datetime
import re

class Product(BaseModel):
    # String validations
    name: str = Field(
        min_length=1,
        max_length=100,
        title="Product Name",
        description="The name of the product"
    )
    
    # Email-like pattern validation
    contact_email: str = Field(
        pattern=r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
        title="Contact Email",
        description="Valid email address for contact"
    )
    
    # Numeric validations
    price: float = Field(
        gt=0,
        le=1000000,
        title="Price",
        description="Price must be greater than 0 and less than or equal to 1,000,000"
    )
    
    # Integer validations
    quantity: int = Field(
        ge=0,
        le=10000,
        title="Quantity",
        description="Available quantity"
    )
    
    # List validations
    tags: list[str] = Field(
        default=[],
        max_items=10,
        title="Tags",
        description="Product tags (maximum 10)"
    )
    
    # Custom field with example
    sku: str = Field(
        pattern=r'^[A-Z]{3}-\d{4}$',
        title="SKU",
        description="Product SKU in format ABC-1234",
        example="ABC-1234"
    )
    
    # Date field
    created_at: datetime = Field(
        default_factory=datetime.now,
        title="Creation Date",
        description="When the product was created"
    )

@app.post("/products/")
async def create_product(product: Product):
    return product
```

### Field Validation Options

```python
class ValidationExamples(BaseModel):
    # String validations
    short_string: str = Field(min_length=1, max_length=10)
    pattern_string: str = Field(pattern=r'^[A-Z][a-z]+$')
    
    # Numeric validations
    positive_int: int = Field(gt=0)  # greater than
    non_negative_int: int = Field(ge=0)  # greater than or equal
    limited_float: float = Field(gt=0, le=100)  # 0 < value <= 100
    
    # List/Array validations
    limited_list: list[str] = Field(min_items=1, max_items=5)
    
    # Custom title and description
    custom_field: str = Field(
        title="Custom Field Title",
        description="This is a custom field with metadata"
    )
    
    # Default values
    default_field: str = Field(default="default_value")
    optional_field: str | None = Field(default=None)
```

### Key Points About Fields

1. **Field is from Pydantic**: Import from `pydantic`, not `fastapi`
2. **Same as Query/Path**: Works similarly to `Query`, `Path`, and `Body`
3. **Validation**: Provides validation for model attributes
4. **Metadata**: Adds JSON Schema metadata for documentation
5. **Examples**: Can include examples for better API documentation

---

## Body - Nested Models

### Overview
FastAPI with Pydantic supports deeply nested models, allowing you to create complex data structures that are automatically validated, serialized, and documented.

### List Fields

```python
class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None
    tags: list[str] = []  # List of strings

@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item):
    results = {"item_id": item_id, "item": item}
    return results
```

### Set Types

Sets automatically handle uniqueness:

```python
class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None
    tags: set[str] = set()  # Unique items only
```

### Nested Models

```python
class Image(BaseModel):
    url: str
    name: str

class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None
    tags: set[str] = set()
    image: Image | None = None  # Nested model

@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item):
    results = {"item_id": item_id, "item": item}
    return results
```

### Special Types and Validation

```python
from pydantic import BaseModel, HttpUrl, EmailStr, validator
from datetime import datetime
from typing import Annotated

class Image(BaseModel):
    url: HttpUrl  # Validates URL format
    name: str
    alt_text: str | None = None

class Author(BaseModel):
    name: str
    email: EmailStr  # Validates email format
    website: HttpUrl | None = None

class Article(BaseModel):
    title: str
    content: str
    author: Author
    images: list[Image] = []
    published_at: datetime | None = None
    tags: set[str] = set()
    
    @validator('title')
    def title_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError('Title cannot be empty')
        return v.strip()
```

### Lists of Submodels

```python
class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None
    tags: set[str] = set()
    images: list[Image] | None = None  # List of Image models

@app.post("/items/")
async def create_item(item: Item):
    return item
```

### Deeply Nested Models

```python
class Image(BaseModel):
    url: HttpUrl
    name: str

class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None
    tags: set[str] = set()
    images: list[Image] | None = None

class Offer(BaseModel):
    name: str
    description: str | None = None
    price: float
    items: list[Item]  # List of Item models (which contain Image models)
    
    # Validation to ensure offer price is reasonable
    @validator('price')
    def price_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError('Price must be positive')
        return v

@app.post("/offers/")
async def create_offer(offer: Offer):
    return offer
```

### Bodies of Pure Lists

You can also declare a request body as a list directly:

```python
@app.post("/images/multiple/")
async def create_multiple_images(images: list[Image]):
    return images
```

### Bodies of Arbitrary Dictionaries

```python
@app.post("/index-weights/")
async def create_index_weights(weights: dict[int, float]):
    return weights
```

### Complex Nested Example

```python
from enum import Enum
from typing import Annotated
from pydantic import BaseModel, Field, HttpUrl, EmailStr
from datetime import datetime

class CategoryEnum(str, Enum):
    electronics = "electronics"
    clothing = "clothing"
    books = "books"
    home = "home"

class Address(BaseModel):
    street: str
    city: str
    state: str
    zip_code: str = Field(pattern=r'^\d{5}(-\d{4})?$')
    country: str = "USA"

class Contact(BaseModel):
    email: EmailStr
    phone: str | None = Field(None, pattern=r'^\+?1?\d{9,15}$')

class User(BaseModel):
    username: str = Field(min_length=3, max_length=20)
    full_name: str
    contact: Contact
    address: Address
    created_at: datetime = Field(default_factory=datetime.now)

class ProductImage(BaseModel):
    url: HttpUrl
    alt_text: str
    is_primary: bool = False

class Product(BaseModel):
    title: str = Field(min_length=1, max_length=100)
    description: str | None = Field(None, max_length=1000)
    price: float = Field(gt=0, le=1000000)
    category: CategoryEnum
    images: list[ProductImage] = []
    tags: set[str] = set()
    
    # Ensure at least one image is primary
    @validator('images')
    def validate_primary_image(cls, v):
        if v and not any(img.is_primary for img in v):
            if v:  # If there are images, make the first one primary
                v[0].is_primary = True
        return v

class Order(BaseModel):
    id: str = Field(pattern=r'^ORD-\d{8}$')
    user: User
    products: list[Product] = Field(min_items=1)
    total_amount: float = Field(gt=0)
    order_date: datetime = Field(default_factory=datetime.now)
    shipping_address: Address
    
    # Calculate total from products
    @validator('total_amount')
    def validate_total(cls, v, values):
        if 'products' in values:
            calculated_total = sum(product.price for product in values['products'])
            if abs(v - calculated_total) > 0.01:  # Allow small floating point differences
                raise ValueError('Total amount does not match sum of product prices')
        return v

@app.post("/orders/")
async def create_order(order: Order):
    return {
        "message": "Order created successfully",
        "order": order,
        "summary": {
            "order_id": order.id,
            "customer": order.user.username,
            "total_products": len(order.products),
            "total_amount": order.total_amount
        }
    }
```

---

## Complete Examples

### 1. E-commerce Product Management API

```python
from fastapi import FastAPI, Query, Path, Body
from pydantic import BaseModel, Field, HttpUrl
from typing import Annotated, Literal
from enum import Enum
from datetime import datetime

app = FastAPI(title="E-commerce Product API", version="1.0.0")

# Enums
class CategoryEnum(str, Enum):
    electronics = "electronics"
    clothing = "clothing"
    books = "books"
    home = "home"

class StatusEnum(str, Enum):
    active = "active"
    inactive = "inactive"
    discontinued = "discontinued"

# Models
class ProductImage(BaseModel):
    url: HttpUrl
    alt_text: str
    is_primary: bool = False

class ProductBase(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    description: str | None = Field(None, max_length=1000)
    price: float = Field(gt=0, le=1000000)
    category: CategoryEnum
    status: StatusEnum = StatusEnum.active

class Product(ProductBase):
    id: str
    images: list[ProductImage] = []
    tags: set[str] = set()
    created_at: datetime
    updated_at: datetime

class ProductCreate(ProductBase):
    images: list[ProductImage] = []
    tags: set[str] = set()

class ProductUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=100)
    description: str | None = Field(None, max_length=1000)
    price: float | None = Field(None, gt=0, le=1000000)
    category: CategoryEnum | None = None
    status: StatusEnum | None = None
    images: list[ProductImage] | None = None
    tags: set[str] | None = None

# Query parameter models
class ProductFilters(BaseModel):
    category: CategoryEnum | None = None
    status: StatusEnum = StatusEnum.active
    min_price: float | None = Field(None, ge=0)
    max_price: float | None = Field(None, ge=0)
    tags: list[str] = []
    search: str | None = Field(None, min_length=1, max_length=100)

class PaginationParams(BaseModel):
    limit: int = Field(10, gt=0, le=100)
    offset: int = Field(0, ge=0)
    sort_by: Literal["name", "price", "created_at", "updated_at"] = "created_at"
    sort_order: Literal["asc", "desc"] = "desc"

# API Endpoints
@app.get("/products/")
async def list_products(
    filters: Annotated[ProductFilters, Query()],
    pagination: Annotated[PaginationParams, Query()]
):
    """List products with filtering and pagination"""
    return {
        "filters": filters,
        "pagination": pagination,
        "message": "Products retrieved successfully"
    }

@app.get("/products/{product_id}")
async def get_product(
    product_id: Annotated[str, Path(title="Product ID", pattern=r'^PROD-\d+$')]
):
    """Get a specific product by ID"""
    return {"product_id": product_id}

@app.post("/products/")
async def create_product(product: ProductCreate):
    """Create a new product"""
    return {
        "message": "Product created successfully",
        "product": product
    }

@app.put("/products/{product_id}")
async def update_product(
    product_id: Annotated[str, Path(title="Product ID", pattern=r'^PROD-\d+$')],
    product: ProductUpdate
):
    """Update an existing product"""
    return {
        "product_id": product_id,
        "updates": product,
        "message": "Product updated successfully"
    }

@app.post("/products/bulk")
async def create_bulk_products(
    products: list[ProductCreate] = Field(min_items=1, max_items=50)
):
    """Create multiple products in bulk"""
    return {
        "message": f"Created {len(products)} products successfully",
        "products": products
    }
```

### 2. User Profile Management

```python
class SocialLinks(BaseModel):
    twitter: str | None = Field(None, pattern=r'^@[A-Za-z0-9_]+$')
    linkedin: HttpUrl | None = None
    github: str | None = Field(None, pattern=r'^[A-Za-z0-9_-]+$')

class UserPreferences(BaseModel):
    newsletter: bool = True
    notifications: bool = True
    theme: Literal["light", "dark", "auto"] = "auto"
    language: str = Field("en", pattern=r'^[a-z]{2}$')

class UserProfile(BaseModel):
    username: str = Field(min_length=3, max_length=20, pattern=r'^[A-Za-z0-9_]+$')
    email: EmailStr
    full_name: str = Field(min_length=1, max_length=100)
    bio: str | None = Field(None, max_length=500)
    avatar_url: HttpUrl | None = None
    social_links: SocialLinks | None = None
    preferences: UserPreferences = UserPreferences()
    tags: set[str] = set()

@app.post("/users/")
async def create_user_profile(profile: UserProfile):
    """Create a new user profile"""
    return profile

@app.put("/users/{username}")
async def update_user_profile(
    username: Annotated[str, Path(pattern=r'^[A-Za-z0-9_]+$')],
    profile: UserProfile
):
    """Update user profile"""
    return {"username": username, "profile": profile}
```

---

## Best Practices

### 1. Model Organization

```python
# base_models.py
class BaseModel(PydanticBaseModel):
    class Config:
        validate_assignment = True
        use_enum_values = True

class TimestampMixin(BaseModel):
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

# product_models.py
class Product(BaseModel, TimestampMixin):
    name: str
    price: float
```

### 2. Validation Patterns

```python
class ValidatedModel(BaseModel):
    @validator('email')
    def validate_email(cls, v):
        if '@' not in v:
            raise ValueError('Invalid email format')
        return v.lower()
    
    @validator('tags')
    def validate_tags(cls, v):
        if len(v) > 10:
            raise ValueError('Too many tags')
        return v
```

### 3. Response Models

```python
class ProductResponse(BaseModel):
    success: bool
    data: Product
    message: str

@app.post("/products/", response_model=ProductResponse)
async def create_product(product: ProductCreate):
    return ProductResponse(
        success=True,
        data=product,
        message="Product created successfully"
    )
```

### 4. Error Handling

```python
from fastapi import HTTPException
from pydantic import ValidationError

@app.post("/products/")
async def create_product(product: ProductCreate):
    try:
        # Process product
        return product
    except ValidationError as e:
        raise HTTPException(status_code=422, detail=str(e))
```

This comprehensive guide covers advanced FastAPI features for handling complex data structures, multiple parameters, field validation, and nested models. These concepts enable you to build sophisticated APIs with proper data validation and documentation.
