export default eventHandler(async (event) => {
  const query = getQuery(event)
  if (query.token !== 'eval-secret-123') {
    throw createError({ statusCode: 403, statusMessage: 'Unauthorized acccess to seeding endpoint' })
  }

  try {
    const { result } = await runTask('db:seed', { payload: {} })

    return {
      success: true,
      message: 'Migration loop trigger cleanly via HTTP pipeline.',
      nitroOutput: result
    }
  }
  catch (err: any) {
    throw createError({ statusCode: 500, statusMessage: `Seeding route exception: ${err.message}` })
  }
})
