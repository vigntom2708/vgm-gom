import request from 'supertest'
import test from 'ava'
import server from './../lib/server'

function testRequest (title, str, task) {
  test.cb(title, t => {
    request(server)
      .get(str)
      .expect('Content-Type', 'application/json')
      .expect(200)
      .end((err, res) => {
        t.ifError(err, 'There is no error')
        task(t, res)
        t.end()
      })
  })
}

testRequest('Empty request', '/', (t, res) => {
  t.truthy(res.body.error, 'Request is wrong')
  t.regex(res.body.error, /^Use:\s.*/, 'Message starts with "Use: "')
})

testRequest('Wrong request', '/?wrong=request', (t, res) => {
  t.truthy(res.body.error, 'Request is wrong')
  t.regex(res.body.error, /^Use:\s.*/, 'Message starts with Use:')
})

testRequest('Invalid Url', '/?url=invalid://format', (t, res) => {
  t.truthy(res.body.error, 'Request is wrong')
  t.is(res.body.error, 'Invalid URL!')
})

testRequest('Valid Url', '/?url=https://www.example.com/foo?moo=poo&bdoom=true', (t, res) => {
  t.truthy(res.body.url, 'Valid request')
})
