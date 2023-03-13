const downloadFileWithReload = (blob, fileName) => {
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.addEventListener('click', function (event) {
    const { target } = event
    const { nodeName } = target || {}
    if (nodeName === 'A') {
      const {
        location: { href},
      } = window
      setTimeout(() => {
        window.location.reload(href)
      })
    }
  })
  a.style.display = 'none'
  a.href = url
  a.target = '_blank'
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}

export default downloadFileWithReload
