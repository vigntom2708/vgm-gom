const app = require('./lib/server')

const port = process.env.PORT || 5000

function error (e, socket) {
  console.error('Error: ', e.message)
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
}

app.server.on('clentError', error).listen(port)
