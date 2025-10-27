import type { CodegenConfig } from '@graphql-codegen/cli'
import { addTypenameSelectionDocumentTransform } from '@graphql-codegen/client-preset'

const config: CodegenConfig = {
  schema: {
    'https://bsmhubsp.obtuse.kr/graphql/v1': {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzMyMzc0MDAwLAogICJleHAiOiAxODkwMTQwNDAwCn0.vg0Kkxj6OtOYczl6tR4X-N-RrH3GhjS4a1HccCELHT0',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzMyMzc0MDAwLAogICJleHAiOiAxODkwMTQwNDAwCn0.vg0Kkxj6OtOYczl6tR4X-N-RrH3GhjS4a1HccCELHT0'
      }
    }
  },
  documents: 'src/**/*.tsx',
  overwrite: true,
  ignoreNoDocuments: true,
  generates: {
    'src/gql/': {
      preset: 'client',
      documentTransforms: [addTypenameSelectionDocumentTransform],
      plugins: [],
      config: {
        scalars: {
          UUID: 'string',
          Date: 'string',
          Time: 'string',
          Datetime: 'string',
          JSON: 'string',
          BigInt: 'string',
          BigFloat: 'string',
          Opaque: 'any',
        },
      },
    },
  },
  hooks: {
    afterAllFileWrite: ['npm run prettier'], // optional
  },
}

export default config
