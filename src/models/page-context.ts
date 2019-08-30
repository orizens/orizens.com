export interface IPageContext {
  isCreatedByStatefulCreatePages: boolean
  group: Group[]
  pathPrefix: string
  first: boolean
  last: boolean
  index: number
  pageCount: number
  additionalContext: AdditionalContext
}

export interface AdditionalContext {}

export interface Group {
  node: Node
}

export interface Node {
  fields: Fields
  frontmatter: Frontmatter
}

export interface Fields {
  slug: string
}

export interface Frontmatter {
  id: number
  author: string
  date: string
  image: string
  permalink: string
  templateKey: string
  title: string
  dsq_thread_id: string[]
  description: null
  tags: string[]
}
