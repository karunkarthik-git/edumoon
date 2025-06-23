print("Hey there!")
# print(input("Enter your name: "))

# This is a comment
'''
This
is a multi-line comment.
'''

x = 6
name = "1234"
temp = "12.42"
height = 5.9
is_student = True
no_value = None

# print(x + name)
print(name)
print(height)
print(is_student)
print(no_value)

print(type(x))
print(type(name))
print(type(height))
print(type(is_student))
print(type(no_value))

print(name  + name)
print(name  + str(x))
print(int(name)  + x)
print(x * 3)
print(name * 3)

print(int("101", 2))
print(float(temp))

x = 10
y = 20
print(x + y) # addition
print(x - y) # subtraction
print(x * y) # multiplication   
print(x / y) # division
print(y // x) # floor division
print(x % y) # modulus
print(x ** y) # exponentiation

# Comparison Operators
print("Comparison Operators:")
print(x == y) # equal to
print(x != y) # not equal to
print(x > y) # greater than
print(x < y) # less than
print(x >= y) # greater than or equal to
print(x <= y) # less than or equal to

# Logical Operators
print("Logical Operators:")
print(x > 5 and y < 30) # and  x > 5 && y < 30
print(x > 5 or y < 10) # or   x > 5 || y < 10
print(not(x > 5)) # not       !(x > 5)

# Assignment Operators
print("Assignment Operators:")
# =
# += , -= , *=, /=, //=, %=, **=
x -= 5

print(x)