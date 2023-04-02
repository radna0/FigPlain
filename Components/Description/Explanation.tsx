import React from 'react'
import Card from '../Card/Card'

function Explanation({ tokens }) {
  if (!tokens) return <div></div>

  const tags = tokens.tags
    ? tokens.tags.map((tag) => {
        return (
          <Card
            key={tag.tagName}
            header={tag.tagName}
            description={tag.description}
          />
        )
      })
    : null
  return (
    <div>
      <dl className=" text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
        <Card
          header={tokens.commandName[0].join(' ')}
          description={tokens.commandName[1]}
        />
        {!!tokens.tags.length && tags}
        {!!tokens.args[0].length && (
          <Card
            header={tokens.args[0].join(' ')}
            description={tokens?.args[1].join(' ')}
          />
        )}
      </dl>
    </div>
  )
}

export default Explanation
