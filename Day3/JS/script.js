// Example: Console methods
console.log("Hello, World!");
console.warn("This is a warning message.");
console.error("This is an error message.");
console.info("This is an informational message.");
console.debug("This is a debug message.");

/*
1. Variables
Variables are containers for storing data values. In JavaScript, you can declare variables using `var`, `let`, or `const`.
- `var` is function-scoped and can be redeclared.
- `let` is block-scoped and can be updated but not redeclared in the same scope.
- `const` is block-scoped and cannot be updated or redeclared.
*/
let name = "John"; // String variable
const age = 25;    // Constant variable
var city = "New York"; // Old way to declare variables

/*
2. Datatypes
JavaScript supports several data types:
- String: Textual data ("Hello")
- Number: Numeric values (42, 3.14)
- Boolean: true or false
- Array: Ordered list of values ([1, 2, 3])
- Object: Key-value pairs ({ key: value })
- Null: Intentional absence of value
- Undefined: Variable declared but not assigned a value
*/
let number = 10;           // Number
let isStudent = true;      // Boolean
let hobbies = ["reading", "music"]; // Array
let person = { firstName: "Jane", lastName: "Doe" }; // Object
let nothing = null;        // Null
let notDefined;            // Undefined

/*
3. Operators
Operators are symbols used to perform operations on operands.
- Arithmetic: +, -, *, /, %
- Assignment: =, +=, -=, etc.
- Comparison: ==, ===, !=, !==, >, <, >=, <=
- Logical: &&, ||, !
- Increment/Decrement: ++, --
*/
let sum = 5 + 3;           // Addition
let product = 4 * 2;       // Multiplication
let isEqual = (sum === 8); // Comparison
let increment = ++number;  // Increment
let i = 5;
i = i + 5; // i += 5;
let isTrue1 = 5 == 5; // Loose equality -> check for the value only
let isTrue2 = 5 == "5"; // true
let isStrictTrue = 5 === "5"; // false because of Strict equality -> check for value and type

/*
4. Expressions
An expression is any valid unit of code that resolves to a value.
Examples: mathematical calculations, function calls, variable assignments.
*/
let total = (age * 2) + 5; // Expression combining operators and variables

/*
5. Conditional statements
Conditional statements control the flow of execution based on conditions.
- if: Executes a block if condition is true.
- else if: Checks another condition if previous is false.
- else: Executes if all previous conditions are false.
- switch: Selects one of many code blocks to execute.
*/
if (age < 18) {
    console.log("Minor");
} else if (age >= 18 && age < 65) {
    console.log("Adult");
} else {
    console.log("Senior");
}

// switch statement example
let grade = "B";
switch (grade) {
    case "A":
        console.log("Excellent");
        break;
    case "B":
        console.log("Good");
        break;
    case "C":
        console.log("Average");
        break;
    default:
        console.log("Needs Improvement");
}

/*
6. Comments
Comments are used to explain code and are ignored by JavaScript.
- Single-line comments start with //
- Multi-line comments are enclosed in /* ... * /
*/

// This is a single-line comment

/*
   This is a
   multi-line comment
*/

/*
7. Looping statements
Loops are used to execute a block of code multiple times.
- for: Loops a block a specific number of times.
- while: Loops as long as a condition is true.
- do...while: Loops at least once, then continues while condition is true.
*/
for (let i = 0; i < 3; i++) {
    console.log("For loop iteration:", i);
}

let count = 0;
while (count < 2) {
    console.log("While loop count:", count);
    count++;
}

let j = 0;
do {
    console.log("Do...while loop:", j);
    j++;
} while (j < 2);

/*
8. Functions
Functions are reusable blocks of code designed to perform a particular task.
- Function declaration: function name(params) { ... }
- Arrow function: const name = (params) => { ... }
*/
function greet(userName) {
    return "Hello, " + userName + "!";
}
console.log(greet("Alice"));

const add = (a, b) => a + b;
console.log("Sum:", add(2, 3));

/*
9. DOM manipulations
The Document Object Model (DOM) represents the structure of a web page.
JavaScript can be used to select, modify, add, or remove elements from the DOM.
Example: Changing the content and style of an element with id="demo".
*/
document.addEventListener("DOMContentLoaded", function() {
    const demoDiv = document.getElementById("demo");
    if (demoDiv) {
        demoDiv.textContent = "DOM Manipulation Example: Content changed!";
        demoDiv.style.color = "blue";
    }
});