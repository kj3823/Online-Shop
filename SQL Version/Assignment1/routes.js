const routing = (req, res) => 
{
    const url = req.url;
    const method = req.method;

    if(url === '/')
    {
        res.write("<HTML")
        res.write("<head><title>Welcome!</title></head>")
        res.write("<form></form>")
        res.write("<body><form action = '/create-user' method = 'POST'><input name = 'UserName'><button type = 'submit'>Send</button></form>Welcome to my Node.JS server</body>")
        res.write("</HTML>")
        return res.end()
    }

    if(url === '/create-user' && method === 'POST')
    {
        const chunks = [];
        req.on('data', (chunk) => {
            chunks.push(chunk);
            console.log(chunks)
        })

        req.on('end',() => {
            const parsedData = Buffer.concat(chunks).toString();
            const finalData = parsedData.split('=')[1];
            console.log(finalData);
        })

        res.statusCode = 302;
        res.setHeader('Location','/users')
        return res.end()
    }

    if(url === '/users')
    {
        res.write("<HTML>")
        res.write("<head><title>Users</title></head>")
        res.write("<body><ul><li>User1</li></ul></body>")
        res.write("<HTML>")
        return res.end()
    }

        res.write("<HTML")
        res.write("<head><title>Welcome!</title></head>")
        res.write("<form></form>")
        res.write("<body>Welcome to my Node.JS server</body>")
        res.write("</HTML>")
        return res.end()
    
}

exports.Handler = routing;