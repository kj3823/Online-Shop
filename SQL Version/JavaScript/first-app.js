const fs = require('fs') // imports the fs module into a constant known as fs.

fs.writeFileSync('hello.txt',"Hello from Node.JS")

// The first arugument is the path of the file, since we want it in the same directory, we just specify the file name.
// The second argument is what is to be written into the file. 