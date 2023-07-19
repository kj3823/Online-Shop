// const fetchData = (callBack) =>
// {
//     setTimeout(() => 
//     {
//         console.log("Done!")
//     }, 1500) 
// }  

// // This function creates a callback

// setTimeout(() => {
//     console.log("Timer done!")
//     fetchData((text) => 
//     {
//         console.log(text)
//     })
// },  2000) // ASynchronous Code (waits 2000 ms)

// But managaging this code is very hard. It can be rewritten using pomises.

const fetchData = (()=>
    {
        const promise = new Promise((resolve, reject) =>
        {
        setTimeout(() =>
        {
            resolve("Done!")
        }, 1500)
    })
    return promise; // Synchronous code, the promise is returned before the setTomeout function completes, if called.
    })

setTimeout(() =>
{
    console.log("Timer done")
    fetchData().then(text => { // the then function is callable on a function returning a promise, it is called when a promise is resolved.
        console.log(text)

        return fetchData// nested call (returning a promise)
    }).then(text2 => { // this then block refers to the nested promise
        console.log(text2)
    })
})

console.log("Hello")

console.log("Hi")// Synchronus Code

/* A crucial concept to keep in mind while using Node or JS, is that, the control will not wait until the Asynchronous code 
is done before moving on the next line of code, the other lines of code will be executed, and once the timer is done then the 
Asynchronous code will be executed. */

// Here the bottom two log statements will be executed before the log statement in the setTimeout() function.
