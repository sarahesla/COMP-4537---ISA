/*
    S T O N K - a sub 100-line routing library
    You like express?, You like php?, You will love Stonk.
    Stonk's Philosophy: "Let it rip or die a virgin 🌪"
*/
let http = require("http")
let fs = require("fs")
let path = require("path")
let urlLib = require('url');
let qs = require('querystring')
const delay = ms => new Promise(res => setTimeout(res, ms));
const filetypes = require("./filetypes.js")
const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Max-Age': 2592000, // 30 days
    /** add other headers as per requirement */
  };
class Stonk{
    constructor(){
        this.get_routes = {}
        this.post_routes = {}
        this.res = {}
        this.req = {}
        this.appDir = "/"
        this.query = {}
        this.data = {}
    }
    get(url, f){
        let params = url.split("/:").slice(1)
        this.get_routes[url.split("/:")[0]] = {'f': f, '_p': params}
    }

    post(url, f){
        this.post_routes[url.split("/:")[0]] = {'f': f, '_d': {}}
    }

    html(content, code){
        this.res.writeHead(code, {'Content-Type': 'text/html',    'Access-Control-Allow-Origin': '*'});
        this.res.write(content)
        this.res.end()
    }
    json(content, code){
        this.res.writeHead(code, {'Content-Type': 'application/json',    'Access-Control-Allow-Origin': '*'});
        this.res.write(content)
        this.res.end()
    }

    files(appDir){
        this.appDir = appDir
    }

    serveFile(res, file){
        let filename = path.join(this.appDir + file)
            let readStream = fs.createReadStream(filename);
            readStream.on('error', function(error) {
                res.writeHead(404, {'Content-Type': 'text/html',    'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS, POST, GET'});
                let f = file.split("/")[file.split("/").length - 1]
                res.write("<h2>404 - Not found : "+ f +"</h2>")
                res.end()
            });
            try{
            let ft = file.split(".")[1]
            console.log("DFFF", ft)
            res.writeHead(200, {'Content-Type': filetypes[ft],    'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS, POST, GET'});
            readStream.pipe(res)
            }catch(e){
                res.writeHead(404, {'Content-Type': 'text/html',   'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS, POST, GET'});
                res.write("<h2>404</h2>")
            }
    }

    async rip(port, f){
        for(let i in [3, 2, 1]){
            console.log(3-i+".......")
            await delay(1000);
        }
        console.log("LET IT RIP!!!!!!!")
        console.log("Stonk is now ripping on port: ", port)
        f()
        // create a base http server, and load the routes
        http.createServer((req, res)=>{
            console.log(req.method, " :: ", req.url, " :: ", res.statusCode)
            let url = req.url
            this.req = req
            this.res = res
            // console.log("URL", urlLib.parse(req.url))
            let pathname = urlLib.parse(req.url).pathname
            if(pathname.length > 1) if(pathname.endsWith("/")) pathname = pathname.slice(0, -1)
            this.query = urlLib.parse(req.url, true).query;

              if (req.method === 'OPTIONS') {
                res.writeHead(204, headers);
                res.end();
                return;
              }

            else if(req.method == 'GET'){
                if(this.get_routes.hasOwnProperty(pathname))
                    this.get_routes[pathname]['f'](req, res)
                else
                    this.serveFile(res, pathname)
            }
            else if(req.method == 'POST'){
                console.log("yo", this.post_routes)
                if(this.post_routes.hasOwnProperty(pathname)){
                    console.log("yo", pathname)
                    this.post_routes[pathname]['f'](req, res)
                    let body = ''
                    req.on('data', (dat) =>{
                        body += dat
                        if (body.length > 1e6) req.connection.destroy()
                    })
                    req.on("end", () => {
                        this.data = qs.parse(body)
                    })
                }

            }else
                res.end()
            this.query = {}
          }).listen(port)
    }
}
module.exports = Stonk
