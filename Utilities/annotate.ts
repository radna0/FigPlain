import {
  Subcommand,
  Option,
  Arg,
  ParsedCommand,
  CompletionSpec,
  allAnnotations,
} from '../types/Query'

export const annotateTokens = (
  parsedCommand: ParsedCommand,
  completionSpec: CompletionSpec
) => {
  const allAnnotations: allAnnotations = {
    tags: [],
  }
  allAnnotations['commandName'] = [
    [parsedCommand.commandName],
    completionSpec.description,
  ]
  allAnnotations['args'] = [parsedCommand?.args, []]
  // Annotate subcommand
  if (parsedCommand.subcommandName) {
    if (!completionSpec.subcommands) {
      allAnnotations['args'][0] = Array.isArray(parsedCommand.subcommandName)
        ? parsedCommand.subcommandName
        : [parsedCommand.subcommandName]
    } else {
      const subcommand = findSubcommand(
        parsedCommand.subcommandName,
        completionSpec.subcommands
      )
      if (subcommand) {
        allAnnotations['commandName'][0].push(parsedCommand.subcommandName)
        allAnnotations['commandName'][1] = subcommand.description
        if (
          Array.isArray(subcommand.args) &&
          !allAnnotations['args'][1].length
        ) {
          subcommand?.args.forEach((arg) =>
            allAnnotations['args'][1].push(arg.name)
          )
        } else if (!allAnnotations['args'][1].length) {
          allAnnotations['args'][1].push(subcommand.args.name)
        }
      }
      if (subcommand && parsedCommand.optionTags?.length) {
        for (let tag of parsedCommand.optionTags) {
          if (tag == '--') continue
          const tagDetails = findOption(tag, subcommand.options)
          if (!tagDetails) continue
          allAnnotations['tags']?.push({
            tagName: tag,
            description: tagDetails.description,
          })
          if (tagDetails.args)
            allAnnotations['args'][1].push(tagDetails.args.name)
        }
      }
    }
  }
  if (Array.isArray(completionSpec.args) && !allAnnotations['args'][1].length) {
    completionSpec.args.forEach((arg) =>
      allAnnotations['args'][1].push(arg.name)
    )
  } else if (!allAnnotations['args'][1].length) {
    allAnnotations['args'][1].push(completionSpec.args.name)
  }

  if (parsedCommand.optionTags?.length && !allAnnotations['tags'].length) {
    for (let tag of parsedCommand.optionTags) {
      if (tag == '--') continue
      const tagDetails = findOption(tag, completionSpec.options)
      allAnnotations['tags'].push({
        tagName: tag,
        description: tagDetails?.description,
      })
    }
  }
  return allAnnotations
}

const findSubcommand = (
  name: string | string[],
  subcommands: Subcommand[] | undefined
): Subcommand | undefined => {
  if (!subcommands) return undefined

  return subcommands.find((subcommand) => {
    if (typeof subcommand.name === 'string') {
      return subcommand.name === name
    }
    return subcommand.name.find((extraName) => extraName === name)
  })
}

const findOption = (
  name: string | string[],
  options: Subcommand[] | undefined
): Subcommand | undefined => {
  if (!options) return undefined

  return options.find((option) => {
    if (typeof option.name === 'string') {
      return option.name === name
    }
    return option.name.find((extraTag) => extraTag === name)
  })
}
