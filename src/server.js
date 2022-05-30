const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const { logger } = require('../middleware/logEvents')
const errorHandler = require('../middleware/errorHandler')
const PORT = process.env.PORT || 4000

// custom middleware logger
app.use(logger)

// Cross Origin Resource Handling
const whitelist = ['https://www.yoursite.com', 'http://localhost:4000', 'https://www.google.com']
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
app.use(cors(corsOptions))

// built-in middleware to handle urlendcoded data
// in orther words, form data:
// 'content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

//built-in middleware for json
app.use(express.json())

// serve static files
app.use(express.static(path.join(__dirname, '..', 'public')))

app.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
})

app.get('/new-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'new-page.html'))
})

app.get('/old-page(.html)?', (req, res) => {
    res.redirect(301, '/new-page.html') // 302 by default
})

// Route handlers
app.get('/hello(.html)?', (req, res, next) => {
    console.log('attempted to load hello.html')
    next()
}, (req, res) => {
    res.send('Hello World!')
})

const one = (req, res, next) => {
    console.log('one')
    next()
}

const two = (req, res, next) => {
    console.log('two')
    next()
}

const three = (req, res) => {
    console.log('three')
    res.send('Finished')
}

app.get('/chain(.html)?', [one, two, three])

app.get('/*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, '..', 'views', '404.html'))
})

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))