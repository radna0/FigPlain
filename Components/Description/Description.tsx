import { Annotation } from '@/types/Query'
import React, { useEffect, useState } from 'react'
import { parseCommand } from '@/Utilities/parse'
import Explanation from './Explanation'
import Error from './Error'
import { annotateTokens } from '@/Utilities/annotate'
import { loadCompletionSpec } from '@/Utilities/LoadSpec'
import { IDescription } from '@/types/Components'

const Description: React.FC<IDescription> = ({ query }) => {
  const [error, setError] = useState('')
  const [annotatedTokens, setAnnotatedTokens] = useState<Annotation[]>([])

  useEffect(() => {
    setError('')
    async function fetchSpec() {
      const ast = parseCommand(query)
      if (!ast.value) {
        setError(`Something went wrong!`)
        return
      }
      const completionSpec = await loadCompletionSpec(ast.value)
      if (!completionSpec) {
        setError(`No command for: ${ast.value}`)
        return
      }
      const tokens = annotateTokens(ast, completionSpec)

      setAnnotatedTokens(tokens)
    }
    fetchSpec()
  }, [query])
  return (
    <div>
      <h1 className=" pt-10 pb-4 text-slate-400  text-2xl">
        Query: <b>{query}</b>
      </h1>
      {error ? (
        <Error error={error as string} />
      ) : (
        <Explanation tokens={annotatedTokens} />
      )}
    </div>
  )
}

export default Description
