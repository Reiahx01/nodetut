// Cross Origin Resource Handling
const whitelist = [
    'https://www.yoursite.com', 
    'http://localhost:4000', 
    'https://www.google.com']

const corsOptions = {
    origin: (origin, callback) => {
        if(whitelist.indexOf(origin) !== -1 || !origin) { //remove after dev work
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    optionsSuccessStatus: 200
}


module.exports = corsOptions