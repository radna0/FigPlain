import React from 'react'

const PurpleBlue = 'from-purple-600 to-blue-500'
const Cyan = 'from-cyan-500 to-blue-500'
const Green = 'from-green-400 to-blue-600'
const PurplePink = 'from-purple-500 to-pink-500'
const Pink = 'from-pink-500 to-orange-400'
const Teal = ' from-teal-300 to-lime-300'
const Red = ' from-red-200  to-yellow-200'

const colors = [PurpleBlue, Cyan, Green, PurplePink, Pink, Teal, Red]

function Card({ header, description }) {
  const randomizedColor = colors[Math.floor(colors.length * Math.random())]
  return (
    <>
      <div className="flex items-center justify-center flex-col font-semibold p-3">
        <dt className="mb-1 text-2xl tracking-tight text-gray-900 dark:text-white">
          {header}
        </dt>
        <dd
          className={`relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 bg-gradient-to-br ${randomizedColor} max-w-7xl font-normal text-lg  border border-gray-200 rounded-lg shadow  dark:border-gray-700`}
        >
          <span className="relative px-5 py-2.5 bg-white dark:bg-gray-900 rounded-md">
            {description}
          </span>
        </dd>
      </div>
    </>
  )
}

export default Card