const http = require('http')
const url = require('url')
const validator = require('validator')
const redis = require('redis')
const { shortener } = require('./shortener')

const client = redis.createClient(process.env.REDIS_URL)
const config = { key: 'vgm:gom:url' }

client.on('error', err => {
  console.error(err)
  process.exit(1)
})

function errorResponse (msg) {
  return { error: msg }
}

function encodeUrl (address, send) {
  function addItem (key, item, next) {
    client.zcard(key, (error, reply) => {
      if (error) { console.error(error) }

      client.zadd(key, 'NX', reply + 1, item)
      next(key, item)
    })
  }

  function sendItem (key, item) {
    client.zscore(key, item, (error, reply) => {
      if (error) { console.error(error) }
      const id = +reply + shortener.base.length

      send({
        url: shortener.encode(id)
      })
    })
  }

  addItem(config.key, address, sendItem)
}

function decodeUrl (str, res) {
  const id = shortener.decode(str) - shortener.base.length

  client.zrangebyscore(config.key, id, id, (error, reply) => {
    if (error) { console.error(error) }

    if (reply.length > 0) {
      res.writeHead(302, {
        'Location': reply[0]
      })

      res.end()
    }

    sendResponse(res)(errorResponse('unknown id'))
  })
}

function sendResponse (res) {
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
  const parsedUrl = url.parse(req.url, true)
  const address = parsedUrl.query.url

  if (!address) {
    if ((/^\/.+$/).test(parsedUrl.pathname)) {
      return decodeUrl(parsedUrl.pathname.slice(1), res)
    }

    return send(errorResponse('Use: http://vgm-gom.herokuapp.com/?url=<address>'))
  }

  if (validator.isURL(address)) {
    return encodeUrl(address, send)
  }

  return send(errorResponse('Invalid URL!'))
})
