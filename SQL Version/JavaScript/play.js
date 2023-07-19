// var name = "Kevin";
// var age = 21;
// var hobbies = true;

function userSummary(userName, userAge, userHobbies)
{
    return ("User Name: " + userName + " UserAge: " + userAge + " User Hobbies: " + userHobbies);
}
let name = "KJ"
let age = 22;
let hobbies = false;

console.log(userSummary(name, age, hobbies))

// The let keyword can also be used for creating variables.

const constantVariable = "Kevin Joseph";

// constantVariable = "hello"; cannot resassign a constant variable.

console.log(constantVariable)


const userSummary1  = function(userName, userAge, userHobbies)
{
    return ("User Name: " + userName + " UserAge: " + userAge + " User Hobbies: " + userHobbies);
}

// The above function is an annonyumus function, it has no name, but it is called by using the name of the constant userSummary.
console.log(userSummary1(name, age, hobbies))

// Creating an arrow Function

const userSummary2 = (userName, userAge, userHobbies) =>
{
    return ("User Name: " + userName + " UserAge: " + userAge + " User Hobbies: " + userHobbies);
}
// This is another way of creating a function.

const addNumbers = (a, b) =>
{
    return a + b;
}
console.log(addNumbers(2, 4))

const add = (a,b) => a + b; // Shorter version, the curly braces and return statement can be ommitted if only one line of statement is present.

console.log(add(3, 4))

const addOne = a => a + 1; // You can omit the () for parameters if only one parameter exists.

console.log(addOne(1))

const addRandom = () => 1 + 2; // If no arugments are passed you must have a () before the =>

console.log(addRandom())