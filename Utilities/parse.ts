import { ParsedCommand } from '../types/Query'

export const parseCommand = (query: string): ParsedCommand => {
  const tokens = query?.match(/(?:[^\s"]+|"[^"]*")+/g) || []
  const commandName = tokens[0]
  const restTokens = tokens.slice(1)
  const subcommandName: string[] = []
  const optionTags: string[] = []
  const args: string[] = []

  for (let i = 0; i < restTokens.length; i++) {
    const token = restTokens[i]
    if (token.startsWith('-')) {
      if (token.startsWith('--')) {
        optionTags.push(token)
      } else {
        const shortOptions = token.slice(1).split('')
        for (const shortOption of shortOptions) {
          optionTags.push(`-${shortOption}`)
        }
      }
    } else {
      if (subcommandName.length === 0) {
        subcommandName.push(token)
      } else {
        args.push(token)
      }
    }
  }

  const parsedCommand: ParsedCommand = {
    commandName,
    subcommandName:
      subcommandName.length === 1 ? subcommandName[0] : subcommandName,
    optionTags,
    args,
  }

  return parsedCommand
}
