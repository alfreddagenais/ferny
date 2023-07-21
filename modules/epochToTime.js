function epochToTime (time) {
  const date = new Date(0)
  date.setUTCSeconds(time)

  let minutes = date.getMinutes()
  let hours = date.getHours()

  if (minutes <= 9) {
    minutes = '0' + minutes
  }

  if (hours <= 9) {
    hours = '0' + hours
  }

  const str = hours + ':' + minutes
  return str
}

module.exports = epochToTime
