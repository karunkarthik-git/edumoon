# def greet():
#     print("Hello, World!")

# greet()

# def greet(name):
#     print("Hello, " + name + "!")

# greet("John")


# def add(x, y):
#     return x + y

# print(add(2, 5))



# x = 5

# def demo():
#     x = 10
#     print(x)

# demo()
# print(x)


# sq = lambda x: x * x
# print(sq(7))

# Datastructures
# print("List _________")

my_list = [1, "2", {"a":"b"}, 4, 5]
# for i in my_list:
#     print(i)
# print(my_list)
# print(my_list[2])
# print(my_list[2]["a"])
# print(my_list[-1])

# # slicing
# print(my_list[1:4])  # from index 1 to 3 [start, end)]
# print(my_list[:4])  # from index 0 to 3
# print(my_list[1:])  # from index 1 to the end
# print(my_list[-3:])  # from index -3 to the end
# print(my_list[-3: 0])  # from index -3 to 0

# my_list[1] = 3
# print(my_list)

# my_list = [1, 2, 3, 4, 5]
# my_list.append(6)
# print(my_list)
# my_list.extend([7, 8, 9])
# print(my_list)
# my_list.pop() # remove element at last
# print(my_list)
# my_list.pop(2) # remove element at index 2
# print(my_list)
# my_list.insert(1, 10)
# print(my_list)
# my_list.sort()  # sort the list
# print(my_list)
# my_list.reverse()  # reverse the list
# print(my_list)

# hash table
{
    10:10,
    1: 1,
    2: 2,
    3: 3,
}

print("Tuple _________")
my_tuple = (1, 2, 3, 4, 5)
print(my_tuple)
# my_tuple[1] = 3  # This will raise an error because tuples are immutable
print(my_tuple[1])  # Accessing an element in a tuple
print(my_tuple[1:4])  # Slicing a tuple
print(my_tuple[:4])  # Slicing a tuple from start to index 3
print(my_tuple[1:])  # Slicing a tuple from index 1 to the end
print(my_tuple[-3:])  # Slicing a tuple from index -3 to the end

print("Dictionary _________")
my_dict = {"name": "John", "age": 30, "city": "New York"}
print(my_dict)
print(type(my_dict))
print(my_dict["name"])  # Accessing a value by key
print(my_dict.get("age"))  # Accessing a value using get method
print(my_dict.keys())  # Getting all keys
print(my_dict.values())  # Getting all values
print(my_dict.items())  # Getting all key-value pairs
print(my_dict.get("job", "Not Found"))  # Accessing a key that doesn't exist with a default value
my_dict.pop("age")  # Removing a key-value pair
print(my_dict)

my_dict["country"] = "USA"  # Adding a new key-value pair
print(my_dict)

print("Set _________")
my_set = {10, 2, 3, 4, 5}
print(my_set)
my_set.add(1)
print(my_set)  # Sets do not allow duplicate values
my_set.add(6)  # Adding an element to the set
print(my_set)
my_set.remove(5)  # Removing an element from the set
print(my_set)
my_set.discard(100)  # Discarding an element (does not raise an error if not found)
print(my_set)
my_set.clear()  # Clearing the set
print(my_set)  # Now the set is empty

set1 = {1, 2, 3}
set2 = {3, 4, 5}
print(set1.union(set2))  # Union of two sets
print(set1.intersection(set2))  # Intersection of two sets
print(set1.difference(set2))  # Difference of two sets'
print(set2.difference(set1))  # Difference of two sets in reverse order
print(set1.symmetric_difference(set2))  # Symmetric difference of two sets

print("String _________")
my_string = "Hello, World!"
print(my_string)
print(my_string[0])  # Accessing the first character
print(my_string[7:12])  # Slicing the string from index 7 to 11
print(my_string[:5])  # Slicing the string from start to index 4
print(my_string.lower())  # Converting to lowercase
print(my_string.upper())  # Converting to uppercase
print(my_string.replace("World", "Python"))  # Replacing a substring
print(my_string.split(", "))  # Splitting the string into a list
print(my_string.find("World"))  # Finding the index of a substring
print(my_string.count("o"))  # Counting occurrences of a character
print(my_string.startswith("Hello"))  # Checking if the string starts with a substring
print(my_string.endswith("!"))  # Checking if the string ends with a substring
test_string = "  Hello, World!  "
print(test_string.strip())  # Removing leading and trailing whitespace
print(test_string.lstrip())  # Removing leading whitespace
print(test_string.rstrip())  # Removing trailing whitespace

name = "John"
age = 30
print(f"My name is {name} and I am {age} years old.")  # Formatted string using f-string
# console.log(`My name is ${name} and I am ${age} years old.`)  # Equivalent in JavaScript
print("My name is {} and I am {} years old.".format(age, name))  # Using format method
print("My name is %s and I am %d years old." % (name, age))  # Using old-style formatting

# print(my_list[10])
try:
    print(my_list[10])  # This will raise an IndexError
except IndexError as e:
    print(f"An error occurred: {e}")
# try {
# } catch (Exception e) {
#     print(f"An error occurred: {e}")
# }

print("End of the program.")

# Example of a custom exception
class CustomError(Exception):
    """Custom exception class for demonstration purposes."""
    pass

# throw CustomError("This is a custom error message.")
raise CustomError("This is a custom error message.")


