export default eventHandler(async (event) => {
  const file = getRouterParam(event, 'file')
  if (!file) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid file target' })
  }

  const storage = useStorage('uploads')
  const fileExists = await storage.hasItem(file)

  if (!fileExists) {
    throw createError({ statusCode: 404, statusMessage: 'File not found' })
  }

  const fileBuffer = await storage.getItemRaw(file)

  const extension = file.split('.').pop()?.toLocaleLowerCase()

  const mimeTypes: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif'
  }

  if (extension && mimeTypes[extension]) {
    setHeader(event, 'Content-Type', mimeTypes[extension])
  }

  return fileBuffer
})
