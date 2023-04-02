import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const Form = () => {
  const [text, setText] = useState('')
  const router = useRouter()
  useEffect(() => {
    console.log(router.query)
    if (router.query.id) setText(router.query.id as string)
  }, [])
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (!text) router.push('/')
    else router.push(`/${text}`)
  }
  return (
    <div className="">
      <input
        className=" p-4 w-96  border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 "
        type="text"
        placeholder="Enter your Command"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
      />
    </div>
  )
}

export default Form
