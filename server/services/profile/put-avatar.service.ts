import type { MultiPartData } from 'h3'

import { eq } from 'drizzle-orm'

import type { SessionUserDTO } from '#shared/dto/user.dto'

import { AVATAR_ALLOWED_MIME_TYPES, AVATAR_MAX_SIZE } from '#shared/dto/profile.dto'

export async function putAvatar(sessionUser: SessionUserDTO, formData: MultiPartData[]) {
  const file = formData.find(item => item.name === 'avatar')

  if (!file || !file.data) {
    throw createError({ statusCode: 400, statusMessage: 'Required file payload is missing' })
  }

  if (file.data.length > AVATAR_MAX_SIZE) {
    throw createError({ statusCode: 400, statusMessage: 'File exceeds maximum size limits' })
  }

  if (!file.type || !AVATAR_ALLOWED_MIME_TYPES.includes(file.type)) {
    throw createError({ statusCode: 400, statusMessage: 'Unsupported image file format' })
  }

  const mimeToExtMap: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif'
  }
  const extension = mimeToExtMap[file.type]

  const storage = useStorage('uploads')
  const uniqueFileName = `${Date.now()}-${crypto.randomUUID()}.${extension}`
  await storage.setItemRaw(uniqueFileName, file.data)
  const publicAvatarUrl = `/uploads/${uniqueFileName}`

  if (sessionUser.accountType === 'freelancer') {
    await db
      .update(tables.freelancerProfiles)
      .set({ avatar: publicAvatarUrl })
      .where(eq(tables.freelancerProfiles.userId, sessionUser.id))
  }
  else {
    await db
      .update(tables.companyProfiles)
      .set({ logo: publicAvatarUrl })
      .where(eq(tables.companyProfiles.userId, sessionUser.id))
  }

  return {
    success: true,
    avatarUrl: publicAvatarUrl
  }
}
