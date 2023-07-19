const file = require('fs');
const requestHandler = (req, res) =>
{
const url = req.url; // getting the URL from the request.
const method = req.method; // getting the request method.
if(url === '/')
    {
        res.setHeader('Content-Type','text/html') // creates a new header, with the content type being returned as HTML. (Metadata)
        res.write('<html>') // Writes data to the response.
        res.write('<head><title>My First Page</title></head>')
        res.write('<body><form action = "/message" method = "POST"><input name ="message"type = "text"><button type ="submit">Send</button></form></body>')
        // Once the form is filled, then the URL becomes /message.
        res.write('</html>')
        return res.end() // Ends the exceution. (Otherwise this will continue)
    }
if(url === '/message' && method === 'POST')
    {
        const body = [];// should be an empty array.
        req.on('data',(chunkReceieved) =>
        {
            body.push(chunkReceieved);
            console.log(body)
        })// On is an event listener.

        req.on('end',() =>
        {
            const parsedBody = Buffer.concat(body).toString(); // creates a new Buffer, and adds all the chunks from body into the Buffer.
            console.log(parsedBody);
            const finalData = parsedBody.split('=')[1]; // returns the second element of the array. (After the equal sign).
            file.writeFile("UserFile.txt", finalData, (error) => {

            }); // Better to use writeFile(), but it accets another parameter, a function.
        }) 
        res.statusCode = 302; // for redirection.
        res.setHeader('Location','/'); // localhost
        return res.end() // returns the request to the client.
    }
    res.setHeader('Content-Type','text/html') // creates a new header, with the content type being returned as HTML. (Metadata)
    res.write('<html>') // Writes data to the response.
    res.write('<head><title>My First Page</title></head>')
    res.write('<body>Hello from my Node.js server</body>')
    res.write('</html>')
    res.end() // The response will be sent back to the client.
    return res.end();

}


//module.exports = requestHandler;

exports.Handler = requestHandler;
exports.someText = "Hi, I love Node.JS"

// module.exports = {
//     Handler: requestHandler,
//     someText: "Hi, I love Node,JS"
// }