import {
  Subcommand,
  CompletionSpec,
  Option,
  Annotation,
  Arg,
} from '../types/Query'

export const annotateTokens = (
  ast: ASTNode,
  completionSpec: CompletionSpec
): Annotation[] => {
  let annotations: Annotation[] = [
    { value: [ast.value], description: [completionSpec.description] },
  ]

  // Find the subcommand
  while (ast.children.length && ast.children[0].type == 'argument') {
    ast = ast.children[0]
    const subcommand = findSubcommand(ast.value, completionSpec.subcommands)
    if (!subcommand) break
    annotations[0].value.push(ast.value)
    annotations[0].description = [subcommand.description]
    ;[ast, annotations] = insertAllOptions(ast, annotations, subcommand)

    if (
      'args' in subcommand &&
      ast.children.length &&
      ast.children[0].type == 'argument' &&
      !findSubcommand(ast.children[0].value, completionSpec.subcommands)
    ) {
      annotations[annotations.length] = { value: [], description: [] }
      if (Array.isArray(subcommand.args)) {
        subcommand?.args.forEach((arg) =>
          annotations[annotations.length - 1].description.push(arg.name)
        )
      } else {
        annotations[annotations.length - 1].description.push(
          subcommand.args.name
        )
      }
      while (
        ast.children.length &&
        ast.children[0].type == 'argument' &&
        !findSubcommand(ast.children[0].value, completionSpec.subcommands)
      ) {
        ast = ast.children[0]
        annotations[annotations.length - 1].value.push(ast.value)
      }
    }
    ;[ast, annotations] = insertAllOptions(ast, annotations, subcommand)
  }

  if (
    annotations[annotations.length - 1].value.join() != ast.value &&
    !ast.children.length &&
    ast.type == 'argument'
  ) {
    if (completionSpec.args && 'name' in completionSpec.args)
      annotations.push({
        value: [ast.value],
        description: [completionSpec.args.name as string],
      })
  }
  // Traverse the AST tree and annotate each node
  const traverse = (node: ASTNode): void => {
    if (node.type === 'option') {
      const optionName = node.value
      const optionSpec = findOption(optionName, completionSpec.options)
      annotations.push({
        value: [optionName],
        description: optionSpec ? [optionSpec.description] : [],
      })
    }

    if (node.children) {
      node.children.forEach(traverse)
    }
  }
  if (ast.children.length) ast.children.forEach(traverse)
  return annotations
}

const insertAllOptions = (
  ast: ASTNode,
  annotations: Annotation[],
  subcommand: Subcommand
): [ASTNode, Annotation[]] => {
  while (ast.children.length && ast.children[0].type == 'option') {
    ast = ast.children[0]
    const tagDetails = findOption(ast.value, subcommand.options)
    if (!tagDetails) break
    annotations.push({
      value: [ast.value],
      description: [tagDetails.description],
    })
    if (
      'args' in tagDetails &&
      ast.children.length &&
      ast.children[0].type == 'argument'
    ) {
      annotations[annotations.length] = { value: [], description: [] }
      if ('name' in tagDetails.args)
        annotations[annotations.length - 1].description.push(
          tagDetails.args.name
        )
      while (ast.children.length && ast.children[0].type == 'argument') {
        ast = ast.children[0]
        annotations[annotations.length - 1].value.push(ast.value)
      }
    }
  }
  return [ast, annotations]
}
const findSubcommand = (
  name: string | string[] | undefined,
  subcommands: Subcommand[]
): Subcommand | undefined => {
  if (!name) return undefined
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
  options: Option[]
): Option | undefined => {
  if (!options) return undefined

  return options.find((option) => {
    if (typeof option.name === 'string') {
      return option.name === name
    }
    return option.name.find((extraTag) => extraTag === name)
  })
}
