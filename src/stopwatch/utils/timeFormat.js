function zeroPad (number, size = 2) {
  let s = String(number)
  while (s.length < size) { s = '0' + s }
  return s
}

export default function timeFormat (miliseconds) {
  let remaining = miliseconds / 1000
  const hh = parseInt(remaining / 3600, 10)
  remaining %= 3600
  const mm = parseInt(remaining / 60, 10)
  const ss = parseInt(remaining % 60, 10)
  const S = parseInt((miliseconds % 1000) / 100, 10)
  return `${zeroPad(hh)}:${zeroPad(mm)}:${zeroPad(ss)}.${S}`
}
