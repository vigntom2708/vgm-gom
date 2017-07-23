const base = 'aAbBcCdDeEfFgGhHiIjJkKmMnNpPrRsStTuUvVwWxXyYzZ123456789-_+!*()'
const size = base.length

exports.shortener = {
  base,

  encode (x) {
    let result = ''
    let value = x

    do {
      const id = value % size
      value = Math.floor(value / size)
      result = result + base[id].toString()
    } while (value > 0)

    return result
  },

  decode (x) {
    return x.split('').reduce((acc, val) => {
      const [result, pos] = acc
      const id = base.indexOf(val)
      const foo = [result + (Math.pow(size, pos)) * id, pos + 1]
      return foo
    }, [0, 0])[0]
  }
}
