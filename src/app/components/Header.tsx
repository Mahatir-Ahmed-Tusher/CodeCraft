"use client"
import Image from 'next/image'
import React from 'react'

const Header = () => {
  return (
    <div className='p-4 flex items-center justify-between'>
      <a href='/'>
        <Image src={"https://bolt.new/static/favicon.svg"} alt='Logo' width={50} height={50} />
      </a>
      <div className='text-sm text-gray-400'>
        Bolt.new Clone - Client Side Only
      </div>
    </div>
  )
}

export default Header