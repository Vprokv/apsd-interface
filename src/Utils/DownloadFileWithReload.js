// обход открытия предложения Яндекс браузером открытия файлов своими программами
const downloadFileWithReload = (blob, fileName) => {
  const url = window.URL.createObjectURL(blob)
  const winHtml = `
    <!DOCTYPE html >
    <html lang='en'>
      <head>
        <title>${fileName}</title>
        <meta charset="utf-8" />
      </head>
      <body>
      </body>
      <script defer>
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = '${url}'
        a.target = '_blank'
        a.download = '${fileName}'
        document.body.appendChild(a)
        a.onclick = () => {
          window.URL.revokeObjectURL(url)
        }
        a.click()
        document.body.removeChild(a)
        window.open('', '_self', '').close()
      </script>
    </html>
`

  const winUrl = URL.createObjectURL(new Blob([winHtml], { type: 'text/html' }))

  window.open(winUrl, '_blank', { popup: true })
}

export default downloadFileWithReload
