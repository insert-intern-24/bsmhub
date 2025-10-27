import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  defaultDataIdFromObject
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { relayStylePagination } from '@apollo/client/utilities'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

const cache = new InMemoryCache({
  dataIdFromObject(responseObject) {
    if ('nodeId' in responseObject) {
      return `${responseObject.nodeId}`
    }
    return defaultDataIdFromObject(responseObject)
  },
  possibleTypes: { 
    Node: ['Todos'] // 실제 사용하는 노드 타입들로 업데이트 필요
  },
  typePolicies: {
    Query: {
      fields: {
        todosCollection: relayStylePagination(), // 실제 컬렉션 이름으로 업데이트 필요
        node: {
          read(_, { args, toReference }) {
            const ref = toReference({
              nodeId: args?.nodeId,
            })
            return ref
          },
        },
      },
    },
  },
})

const httpLink = createHttpLink({
  uri: 'https://bsmhubsp.obtuse.kr/graphql/v1',
})

const authLink = setContext(async (_, { headers }) => {
  const token = (await supabase.auth.getSession()).data.session?.access_token
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
  }
})

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
})

export default apolloClient
