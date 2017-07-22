const http = require('http')
const url = require('url')
const validator = require('validator')

function errorResponse (msg) {
  return { error: msg }
}

function createURLShortener (address) {
  return {
    test: 'ok!'
  }
}

function sendResponse(res) {
  return (data) => {
    const result = JSON.stringify(data)

    res.writeHead(200, {
      'Content-Length': Buffer.byteLength(result),
      'Content-Type': 'application/json'
    })

    res.end(result)
  }
}

exports.server = http.createServer((req, res) => {
  const send = sendResponse(res)
  const address = url.parse(req.url, true).query.url

  if(!address) {
    return send(errorResponse('Use: http://vgm-gom.herokuapp.com/?url=<address>'))
  }

  if (validator.isURL(address)) {
    return send(createURLShortener(address))
  }

  return send(errorResponse("Invalid URL!"))
})
