import { AssertionError } from 'assert'
import { Subcommand, Option, Arg, CompletionSpec } from '../types/Query'
import Description from '@/Components/Description/Description'

type Annotation = {
  value: string[]
  description: string | string[] | undefined
}

export const annotateTokens = (
  ast: ASTNode,
  completionSpec: CompletionSpec
): Annotation[] => {
  const annotations: Annotation[] = [
    { value: [ast.value], description: completionSpec.description },
  ]
  // Find the subcommand
  while (ast.children.length && ast.children[0].type == 'argument') {
    ast = ast.children[0]
    const subcommand = findSubcommand(ast.value, completionSpec.subcommands)
    if (!subcommand) break
    annotations[0].value.push(ast.value)
    annotations[0].description = subcommand.description
    if (
      'args' in subcommand &&
      ast.children.length &&
      ast.children[0].type == 'argument' &&
      !findSubcommand(ast.children[0].value, completionSpec.subcommands)
    ) {
      annotations[1] = { value: [], description: [] }
      if (Array.isArray(subcommand.args)) {
        subcommand?.args.forEach((arg) =>
          annotations[1].description.push(arg.name)
        )
      } else {
        annotations[1].description.push(subcommand.args.name)
      }
    }

    while (
      ast.children.length &&
      ast.children[0].type == 'argument' &&
      !findSubcommand(ast.children[0].value, completionSpec.subcommands)
    ) {
      ast = ast.children[0]
      annotations[1].value.push(ast.value)
    }
    while (ast.children.length && ast.children[0].type == 'option') {
      ast = ast.children[0]
      const tagDetails = findOption(ast.value, subcommand.options)
      if (!tagDetails) break
      annotations.push({
        value: ast.value,
        description: tagDetails?.description,
      })
      if ('args' in tagDetails) {
        annotations.push({
          value: [],
          description: [],
        })
        annotations[annotations.length - 1].description.push(
          tagDetails.args.name
        )
        while (ast.children.length && ast.children[0].type == 'argument') {
          ast = ast.children[0]
          annotations[annotations.length - 1].value.push(ast.value)
        }
      }
    }
  }
  if (ast.children.length && ast.children[0].type == 'argument') {
    ast = ast.children[0]
    annotations.push({
      value: ast.value,
      description: completionSpec.args?.name,
    })
  }

  // Traverse the AST tree and annotate each node
  const traverse = (node: ASTNode): void => {
    if (node.type === 'argument') {
      const commandName = node.value
      const commandSpec = completionSpec.subcommands?.find((subcommand) => {
        return subcommand.name.includes(commandName)
      })
      if (commandSpec) {
        annotations.push({
          value: commandName,
          description: commandSpec.description || '',
        })
      } else {
        annotations.push({
          value: commandName,
          description: completionSpec.description || '',
        })
      }
    } else if (node.type === 'option') {
      const optionName = node.value
      const optionSpec = completionSpec.options?.find((option) => {
        return option.name.includes(optionName)
      })
      if (optionSpec) {
        annotations.push({
          value: optionName,
          description: optionSpec.description || '',
        })
      } else {
        annotations.push({
          value: optionName,
          description: 'Tag',
        })
      }
    }

    if (node.children) {
      node.children.forEach(traverse)
    }
  }
  if (ast.children.length) ast.children.forEach(traverse)
  return annotations
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
