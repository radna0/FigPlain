type ASTNode = {
  type: 'command' | 'subcommand' | 'option' | 'argument'
  value: string
  children: ASTNode[]
}

export const createAST = (tokens: string[]): ASTNode => {
  const ast: ASTNode = {
    type: 'command',
    value: tokens[0],
    children: [],
  }

  let currentNode = ast

  for (let i = 1; i < tokens.length; i++) {
    const token = tokens[i]

    if (token.startsWith('-')) {
      const optionNode: ASTNode = {
        type: 'option',
        value: token,
        children: [],
      }

      if (token.startsWith('--')) {
        currentNode.children.push(optionNode)
        currentNode = optionNode
      } else {
        const shortOptions = token.slice(1).split('')
        for (const shortOption of shortOptions) {
          const shortOptionNode: ASTNode = {
            type: 'option',
            value: `-${shortOption}`,
            children: [],
          }
          currentNode.children.push(shortOptionNode)
          currentNode = shortOptionNode
        }
      }
    } else {
      if (
        (token.startsWith('"') && token.endsWith('"')) ||
        (token.startsWith("'") && token.endsWith("'"))
      ) {
        const argNode: ASTNode = {
          type: 'argument',
          value: token.slice(1, -1),
          children: [],
        }
        currentNode.children.push(argNode)
        currentNode = argNode
      } else if (token === '-') {
        const argNode: ASTNode = {
          type: 'argument',
          value: '',
          children: [],
        }
        currentNode.children.push(argNode)
        currentNode = argNode
      } else {
        const subcommandNode: ASTNode = {
          type: 'argument',
          value: token,
          children: [],
        }
        currentNode.children.push(subcommandNode)
        currentNode = subcommandNode
      }
    }
  }

  return ast
}
