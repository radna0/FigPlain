type ASTNode = {
  type: 'command' | 'subcommand' | 'option' | 'argument' | 'invalid'
  value: string
  children: ASTNode[]
}
