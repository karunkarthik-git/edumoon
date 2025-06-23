

def get_data(a:str) -> bool:
    """
    This function takes a string input and returns it in uppercase.
    :param a: Input string
    :return: Uppercase version of the input string
    """
    return a.isalpha()

# print(get_data("123"))

from typing import List
from pydantic import BaseModel, Field

class Student(BaseModel):
    id: int
    name: str = Field(..., min_length=2, max_length=100)
    subjects: List[str] = []

data = {
    "id": 1,
    "name": "J",
    "subjects": ["Math", "Science", "History"]
}

student = Student(**data)

# data2 = {
#     "id": ["2"],
#     "name": "John Doe",
#     "subjects": ["Math", "Science", "History"]
# } 

# Student(**data2)