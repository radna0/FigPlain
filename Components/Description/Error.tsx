import { IError } from '@/types/Components'
import React from 'react'

const Error: React.FC<IError> = ({ error }) => {
  return <div className=" text-2xl text-red-500">{error}</div>
}

export default Error
