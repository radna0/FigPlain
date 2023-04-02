import { createAST } from './AST'

export const parseCommand = (query: string): ASTNode => {
  const tokens = query?.match(/(?:[^\s"]+|"[^"]*"|'[^']*')+/g) || []

  const ast = createAST(tokens)
  console.log(ast)
  return ast
}
