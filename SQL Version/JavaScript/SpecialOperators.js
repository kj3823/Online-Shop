food = ["Pizza", "Burgers", "Coke", "Rice"];

const copiedArray = food.slice()
// The slice method creates a copy of the array, arguments can be passed to narrow down the copying.

console.log(copiedArray)

// But there is a better way of doing this by using the spread operator.

const copiedArray1 = [... food]

console.log(copiedArray1)

const person = {name: "Kevin", age: 22, greet(){console.log("Hi I am " + this.name)}}

const copiedPerson = {...person} // Spread operator on objects.

console.log(copiedPerson)

const toArray = (arg1, arg2, arg3) =>
{
    return [arg1, arg2, arg3]
}

console.log(toArray(1, 2, 3))

// THe abovve approach is not flexible.

const toArrayBetter = (...newArray) =>
{
    return newArray
}
/* This approach is much more flexible, since we are not limited by the number of parameters, and all these parameters are 
passed into a new array. This is done using the rest operator.*/

console.log(toArrayBetter(1, 2, 3, 4, 5))