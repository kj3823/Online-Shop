const http = require('http'); // Require is a function which imports core modules, or a path (has to start with ./ if local file)


const routingInfo = require('./routes') 

//(. used since in the local folder)

// function listner(requ, recv)
// {

// }



//http.createServer(listner) // Takes a request-listener, as a paratmer, this is a function. This function is executed when a reuest comes in.

//Using an annonymous function.
// http.createServer(function(req, res)
// {

// })

// Using an arrow function:

//const server = http.createServer(listener = (req, res) => // The createServer() returns a server.
// {
    
// })

const server = http.createServer(routingInfo.Handler);

server.listen(3000) // Listens for incoming requests. (Always listening)

//process.exit() Terminates the program.

// Now, if you go to your browser and type localhost:3000 (portnumber). You can see the request being printed.
