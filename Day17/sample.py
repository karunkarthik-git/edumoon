import time

# try:
#     x = 10/10
#     # x = 10/0
#     print(x)
# except ZeroDivisionError:
#     print("Error: Division by zero is not allowed.")
# except Exception as e:
#     print(f"An unexpected error occurred: {e}")
# finally:
#     print("This block always executes, regardless of whether an exception occurred or not.")

# Parent class
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        raise NotImplementedError("Subclasses must implement this method")

class Dog(Animal):
    def __init__(self, name, age):
        super().__init__(name)
        self.age = age

    def bark(self):
        print(f"{self.name} says Woof!")
    
    def speak(self):
        print(f"{self.name} is a dog and barks.")


my_dog = Dog("Buddy", 3)
another_dog = Dog("Max", 5)
my_dog.bark()
another_dog.bark()
my_dog.speak()

class Cat(Animal):
    def speak(self):
        print(f"{self.name} is a cat and meows.")

my_cat = Cat("Whiskers")
my_cat.speak()

class BankAccount:
    def __init__(self, balance):
        self.balance = balance
    
    def deposit(self, amount):
        self.balance += amount
    
    def get_balance(self):
        return self.balance
    
    def __str__(self):
        return f"BankAccount(balance={self.balance})"
    
    def __repr__(self):
        return f"BankAccount(balance={self.balance})"
    

my_account = BankAccount(1000)
print(my_account.get_balance())
my_account.deposit(500)
print(my_account.get_balance())
print(my_account)
# Example of using __str__ and __repr__
print(repr(my_account))  # Calls __repr__

# Decorator
# Annotations in java.
# Usages of decorations is logging, authentication, etc.
def my_decorator(func):
    def wrapper():
        start_time = time.time()
        print("Something is happening before the function is called.")
        func()
        print("Something is happening after the function is called.", time.time() - start_time) 
    return wrapper

@my_decorator
def say_hello():
    print("Hello!")

say_hello()

# Iterators and Generators
# my_list = [1, 2, 3, 4, 5]
# my_iterator = iter(my_list)
# print(next(my_iterator))  # Output: 1
# print(next(my_iterator))  # Output: 2

def my_generator():
    for i in range(5):
        yield i * 2

gen = my_generator()

print(next(gen))  # Output: 0
print(next(gen))  # Output: 2
print(next(gen))  # Output: 4
print(next(gen))  # Output: 6
print(next(gen))  # Output: 8
print(next(gen))  # Raises StopIteration exception when there are no more items