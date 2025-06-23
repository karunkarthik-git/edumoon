# Conditional Statements

# if, elif, else

# age = input("Please enter your age: ")
# age = int(age)  # Convert input to integer
# age = 20
# if age < 18:
#     print("You are a minor.")
#     if age < 13:
#         print("You are a child.")
#     else:
#         print("You are a teenager.")
# elif age < 65:
#     print("You are an adult.")
# else:
#     print("You are a senior citizen.")

# for, while, do while

# for i in range(5):
#     print("Iteration:", i)

# for i in range(1, 11):
#     print("Value of i:", i)

# for i in range(1, 11, 2):
#     print("Value of i:", i)

j = 1
while j < 5:
    print("j :", j)
    j += 1

# while True:
#     print("This will run forever")

i = 0
while i < 10:
    print("While loop iteration:", i)
    i += 1
    if i == 7:
        break  # Exit the loop when i is 7
    if i == 5:
        continue
    
    print("This will not print when i is 5")