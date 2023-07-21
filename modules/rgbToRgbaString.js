function rgbToRgbaString (rgb) {
  const arr = rgb.replace(/[^\d,]/g, '').split(',')
  const rgba = 'rgba(' + arr[0] + ', ' + arr[1] + ', ' + arr[2] + ', 0.25)'

  return rgba
}

module.exports = rgbToRgbaString
