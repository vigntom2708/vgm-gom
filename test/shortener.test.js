import test from 'ava'
import { shortener } from './../lib/shortener'

test('encode 0', t => {
  t.true(shortener.encode(0) === shortener.base[0])
})

test('encode last', t => {
  const last = shortener.base.length - 1
  t.true(shortener.encode(last) === shortener.base[last])
})

test('encode 123', t => {
  t.true(shortener.encode(123) === ')A')
})

test('decode first char', t => {
  t.true(shortener.decode(shortener.base[0]) === 0)
})

test('decode last char', t => {
  const last = shortener.base.length - 1
  t.true(shortener.decode(shortener.base[last]) === last)
})

test('decode ")A"', t => {
  t.true(shortener.decode(')A') === 123)
})
