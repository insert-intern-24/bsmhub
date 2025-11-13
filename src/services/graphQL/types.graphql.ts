export interface GraphQLErrorItem {
  message: string;
  locations?: { line: number; column: number }[];
  path?: string[];
  extensions?: Record<string, unknown>;
}

export interface GraphQLResponse<TData> {
  data?: TData;
  errors?: GraphQLErrorItem[];
}

export interface GraphQLRequest<TVars extends Record<string, unknown> = Record<string, unknown>> {
  query: string;
  variables?: TVars;
}


