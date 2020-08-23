const express = require('express')
const nunjucks = require('nunjucks')
const routes = require('./routes')
const methodOverride = require('method-override')


const server = express()

//dessa maneira o express vai ter acesso as informaçõe do nosso formulario com o req.body  
server.use(express.urlencoded({ extended: true }))
server.use(express.static('public'))
server.use(methodOverride('_method'))
server.use(routes)


server.set("view engine", "njk")

nunjucks.configure('views', {
    express: server,
    noCache: true
})

server.listen(5000, function() {
    console.log("sever is running")
})