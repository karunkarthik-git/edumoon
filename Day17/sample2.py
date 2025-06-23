import math
from my_module import hey

print(math.pi)
print(math.e)
print(math.inf)
print(math.nan)
print(math.tau)

hey()

# with open("file.txt", "w") as file:
#     file.write("Hello, this is a sample text file.\n")
#     file.write("It contains multiple lines of text.\n")
#     file.write("This is the third line.\n")

with open("file.txt", "r") as file:
    content = file.read()
    print(content)

