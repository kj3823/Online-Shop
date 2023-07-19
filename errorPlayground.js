const sum = ((a, b) => {
    if (a && b)
        return a + b;
    throw new Error("Invalid Arguments");
})
// try {
//     console.log(sum(1));
// } catch (error) {
//     console.log("Error occured");
//     console.log("THis works!");
// }

console.log(sum(2));
console.log("This worls");