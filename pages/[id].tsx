import Form from '@/Components/Form/Form'
import React from 'react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Description from '@/Components/Description/Description'

function Search() {
  const { query } = useRouter()
  return (
    <div className=" bg-slate-900 text-white  h-screen text-center">
      <h1 className="pt-10 pb-4 font-bold text-3xl">Ixplain</h1>
      <Form />
      <Description query={query.id as string} />
    </div>
  )
}

export default Search
