import { parseContentHeader } from '@/Utils/parseContentHeader'

const downloadFile = ({ data: blob, headers }) => {
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.style.display = 'none'
  a.href = url
  a.download = parseContentHeader(headers['content-disposition'])
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}

export default downloadFile
