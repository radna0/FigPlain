import { IDescription } from '@/types/Query'
import React, { useEffect, useState } from 'react'
import { parseCommand } from '@/Utilities/parse'
import Explanation from './Explanation'
import Error from './Error'
import { annotateTokens } from '@/Utilities/annotate'
import { loadCompletionSpec } from '@/Utilities/LoadSpec'

const Description: React.FC<IDescription> = ({ query }) => {
  const [error, setError] = useState('')
  const [annotatedTokens, setAnnotatedTokens] = useState(null)

  useEffect(() => {
    setError('')
    async function fetchSpec() {
      const parsedCommand = parseCommand(query)
      if (!parsedCommand.commandName) {
        setError(`Something went wrong!`)
        return
      }
      const completionSpec = await loadCompletionSpec(parsedCommand.commandName)
      if (!completionSpec) {
        setError(`No command for: ${parsedCommand.commandName}`)
        return
      }
      const tokens = annotateTokens(parsedCommand, completionSpec)

      setAnnotatedTokens(tokens)
    }
    fetchSpec()
  }, [query])
  return (
    <div>
      <h1 className=" pt-10 pb-4 text-slate-400  text-2xl">Query: {query}</h1>
      {error ? (
        <Error error={error} />
      ) : (
        <Explanation tokens={annotatedTokens} />
      )}
    </div>
  )
}

export default Description
