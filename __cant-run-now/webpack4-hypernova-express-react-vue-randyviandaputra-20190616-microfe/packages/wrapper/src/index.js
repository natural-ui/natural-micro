const express = require('express')
const path = require('path')
const {getContent} = require('./services/content')
const {getHeader} = require('./services/header')

const app = express()

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', async (req, res) => {
  const promises = [getContent(), getHeader()]
  const [content, {header}] = await Promise.all(promises)
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>MicroFrontend Playground</title>
      <link rel="stylesheet" href="/style.css">
    </head>
    <body>
      ${header.html}
      ${content.html}
      <script src="http://localhost:3001/client.js"></script>
      <script src="http://localhost:3002/client.js"></script>
    </body>
    </html>
  `

  return res.send(html)
})

app.listen(8080, () => console.log('Wrapper is Running'))
