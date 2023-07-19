const person = { name: "Kevin", age: 22, greet() { console.log("Hi I am " + this.name) } }

const printName = (personData) => {
    console.log(person.name)
}

printName(person)

// We can simply this by using object destructuring.

const printNameOnly = ({ name }) => {
    console.log(name)
}

printNameOnly(person)
// This solution is called object destucturing, and it fees up bandwith, since it only extracts the name filed of the object being passed to it.

const { name, age } = person; // Another way of destructuring an object.

console.log(name, age)

const myArray = [1, 2, 3, 4, 5]

const [element1, element2] = myArray; // Destructuring an Array.

console.log(element1, element2)