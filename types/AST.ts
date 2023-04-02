type ASTNode = {
  type: 'command' | 'subcommand' | 'option' | 'argument'
  value: string
  children: ASTNode[]
}
