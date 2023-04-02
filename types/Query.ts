export type Subcommand = {
  name: string | string[]
  description: string
  subcommands: Subcommand[]
  options: Option[]
  args: Arg | Arg[]
}
export type Arg = {
  name: string
  description: string

  isOptional: boolean
  isVariadic: boolean
}
export type Option = {
  name: string | string[]
  description: string
  args: Arg | Arg[]
}

export interface ParsedCommand {
  commandName: string
  subcommandName: string | string[]
  optionTags: string[]
  args: string[]
}
export interface CompletionSpec {
  name: string
  description: string
  subcommands: Subcommand[]
  options: Option[]
  args: Arg[] | Arg
}

export type Annotation = {
  value: string[]
  description: string[]
}
