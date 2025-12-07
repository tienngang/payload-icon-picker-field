import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { seed } from './seed'

let filename: string
let dirname: string

try {
  if (!import.meta.url) {
    console.warn('[demo-payload.config] import.meta.url is undefined, using process.cwd()')
    filename = process.cwd()
    dirname = process.cwd()
  } else {
    filename = fileURLToPath(import.meta.url)
    dirname = path.dirname(filename)
    console.log('[demo-payload.config] Successfully initialized paths')
  }
} catch (error) {
  console.error('[demo-payload.config] Error initializing paths:', error)
  filename = process.cwd()
  dirname = process.cwd()
}
// eslint-disable-next-line no-restricted-exports
export default buildConfig({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
  },
  collections: [Media, Pages, Users, Posts],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  editor: lexicalEditor({}),
  graphQL: {
    schemaOutputFile: path.resolve(dirname, 'lib/schema.graphql'),
  },
  onInit: async payload => {
    if (process.env.NODE_ENV === 'development' && process.env.PAYLOAD_SEED_DATABASE) {
      await seed(payload)
    }
  },
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'lib/types.ts'),
  }
})
