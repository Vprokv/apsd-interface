export const parseContentHeader = (disposition) => {
  let filename
  const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
  const matches = filenameRegex.exec(disposition)
  if (matches != null && matches[1]) {
    filename = matches[1].replace(/['"]/g, '')
  }
  return filename && decodeURIComponent(escape(filename))
}
