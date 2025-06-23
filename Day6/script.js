console.log("Day 6: Test Script Loaded");

let test = "This is a test variable for Day 6 script.";
console.log(test);
const MAX = 100;
console.log(`The maximum value is: ${MAX}`);
test = "Updated test variable for Day 6 script.";
console.log(test);
// MAX = 200;
// console.log(`The maximum value is now: ${MAX}`); // This will throw an error since MAX is a constant

function addNumbers(x, y) {
    return x + y;
}

console.log("The sum of 5 and 10 is: " + addNumbers(5, 10));

// Es6 Arrow Function

const addNumbers1 = (x, y) => x + y;
console.log("The sum of 15 and 20 is: " + addNumbers1(15, 20));

const addNumbers2 = (x, y, z) => {
    let value1 = x + y;
    let value2 = value1 + z;
    return value2;
}
console.log("The sum of 5, 10, and 15 is: " + addNumbers2(5, 10, 15));

// map, filter, find, forEach

const name = "John Doe";
const age = 30;

const person = {
    name: name,
    age: age,
    greet: function() {
        console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
    }
}

person.greet();

// short hand operator for object properties
const variableKey = "test123";

const person1 = {
    name,
    age,
    greet: function() {
        console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
    },
    [variableKey]: true
}

console.log(person1);

const createPerson = (name = "Edumoon", age = 15) => {
    return {
        name,
        age
    };
}

console.log(createPerson());
console.log(createPerson("Alice", 25));
console.log(createPerson("Bob"));

// template literals
const greeting = (person) => `Hello, my name is ${person.name} and I am ${person.age} years old.`;
console.log(greeting(person1));

// Optional Chaining

const company = {
    name: "Tech Innovations",
    address: {
        street: "123 Tech Lane",
        city: "Tech City",
        country: "Techland"
    }
}

console.log(company?.address?.street); // "123 Tech Lane"
console.log(company?.address?.zipCode); // undefined, no error thrown
console.log(company.contact?.phone);

let a = 10;
let b = 20;

const condition1 = () => {
    return a != b;
};

const condition2 = () => {
    return a === b;
}

console.log(condition2() || condition1());

const sayHi = () => console.log("Hi, this is a test function.");
const sayBye = () => console.log("Bye, this is a test function.");


const callbackFunction = (abcd) => {
    abcd();
}

let abc = 1;

callbackFunction(abc > 5 ? sayHi : sayBye);

// setTimeout(() => {
//     console.log("This is a delayed message after 10 seconds.");
// }, 10000);

// console.log(Date.now().toLocaleString());

// setInterval(() => {
//     console.log(Date.now().toLocaleString());
// }, 3000);

// API calls that are made after an interval is called long polling.

// Promised -> API calls

const fetchUserDate = (userId, time) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const userData = {
                id: userId,
                name: "John Doe",
                age: 30
            };
            if (userId) {
                resolve(userData);
            } else {
                reject({
                    userId: userId,
                    message: "User ID is not provided."
                });
            }
        }, time);
    })
}


// console.log("Before fetchUserDate API call."); // fn1
// fetchUserDate(1, 0).then(userData => {
//     console.log("User Data:", userData); // B
// }
// ).catch(error => {
//     console.error("Error fetching user data:", error); // C
// }).finally(() => {
//     console.log("Fetch user data operation completed."); // D
// });
// // console.log("After fetchUserDate API call."); // D


// async function fetchUserDataAsync(userId) { // fn2
//     try {
//         const userData = await fetchUserDate(userId, 3000);
//         console.log("User Data (Async):", userData); // E
//         return userData;
//     } catch (error) {
//         console.error("Error fetching user data (Async):", error); // F
//     }
// }

// console.log("Before fetchUserDataAsync API call."); // G
// fetchUserDataAsync(2);
// setTimeout(() => {
//     console.log("After fetchUserDataAsync API call."); // H
// }, 100);


class User {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    greet() {
        console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
    }
}

const user1 = new User("Alice", 25);
const user2 = new User("Bob", 30);
user1.greet(); // "Hello, my name is Alice and I am 25 years old."
user2.greet(); // "Hello, my name is Bob and I am 30 years old."

class Test {
    // This is a test class
}

class Admin extends User {
    #privateProperty = "This is a private property";
    get getPrivateProperty() {
        return this.#privateProperty;
    }
    set privateProperty(value) {
        // #privateProperty = value;
        console.log("Cannot set a new value to a private property.");
    }
    constructor(name, age, role) {
        super(name, age);
        this.role = role;
    }

    greet() {
        console.log(`Hello, my name is ${this.name}, I am ${this.age} years old and I am an ${this.role}.`);
    }
}
const admin1 = new Admin("Charlie", 35, "Administrator");
admin1.greet(); // "Hello, my name is Charlie, I am 35 years old and I am an Administrator."
console.log(admin1.getPrivateProperty); // "This is a private property"
// admin1.privateProperty = "New Value"; // Cannot set a new value to a private property.

console.log(admin1 instanceof User); // true
console.log(admin1 instanceof Admin); // true
console.log(admin1 instanceof Test); // false


class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
    }
}

function processData(data) {
    if (!data || typeof data !== 'object') {
        throw new Error("Invalid data provided.");
    }
    // Process the data
    console.log("Data processed successfully:", data);
}

try {
    processData({ name: "Test Data" });
    processData(null); // This will throw a ValidationError
} catch (error) {
    if (error instanceof ValidationError) {
        console.error("Validation Error:", error);
    } else {
        console.error("An unexpected error occurred:", error);
    }
}