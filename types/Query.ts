export type query = string

export interface IDescription {
  query: query
}

export type Subcommand = {
  name: string | string[]
  description?: string
  subcommands?: Subcommand[]
  options?: Option[]
  args?: Arg | Arg[]
}
export type Arg = {
  name?: string
  description?: string

  isOptional?: boolean
  isVariadic?: boolean
}
export type Option = {
  name: string | string[]
  description?: string
  args: Arg | Arg[]
}

export interface ParsedCommand {
  commandName: string | undefined
  subcommandName?: string | string[]
  optionTags: string[]
  args?: string[]
}
export interface CompletionSpec {
  name: string
  description?: string
  subcommands?: Subcommand[]
  options?: Option[]
  args?: Arg[]
}

export interface allAnnotations {
  commandName?: [String[], String | undefined]
  tags: {
    tagName: String
    description?: String
  }[]
  args?: [String[] | undefined, String[]]
}
