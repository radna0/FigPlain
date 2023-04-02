import React from 'react'
import Card from '../Card/Card'
import { IExplanation } from '@/types/Components'

const Explanation: React.FC<IExplanation> = ({ tokens }) => {
  if (!tokens) return <div></div>

  return (
    <div>
      <dl className=" text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
        {tokens.map((token, index) => {
          return (
            <Card
              key={token.value.join()}
              header={token.value}
              description={token.description}
            />
          )
        })}
      </dl>
    </div>
  )
}

export default Explanation
