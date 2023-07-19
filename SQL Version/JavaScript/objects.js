//const person = {name: "Kevin", age: 22, greet: () => console.log("Hi I am " + this.name)}
// You can also tie functions into objects. 
// The this keyword is used to access members of that particular object.
/* But there is an error here, const person = {name: "Kevin", age: 22, greet: () => console.log("Hi I am " + this.name)}
The name of the person will print as undefined, this has to do with the scope. So we have to rewrite this function. */

const person = {name: "Kevin", age: 22, greet(){console.log("Hi I am " + this.name)}}

console.log(person)

person.greet()

const hobbies = ["Listening to Music", "Sports", "Chess"]

for(let hobby of hobbies)
{
    console.log(hobby)
}

console.log(hobbies.map(hobby => "Hobbies: " + hobby))
/* The map method returns a new array, it takes a parameter on what changes need to be made on every element of the array. 
Hobby is a temporary variable which holds the value of each element of the old array.
Keep in mind that the old Array is not changed.*/
console.log(hobbies) // no change to the old array.

hobbies.push("Another Element inserted") // The push method is used to insert another element into the array.
console.log(hobbies)