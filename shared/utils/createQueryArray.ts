import { z } from 'zod'

// A refactored version of this elegant solution:
// https://github.com/colinhacks/zod/issues/2873#issuecomment-3411299967

export const createQueryArray = <const T extends readonly [string, ...string[]]>(enumKeys: T) => {
  return z.union([
    z.enum(enumKeys).transform(val => [val]),
    z.array(z.enum(enumKeys))
  ])
}
