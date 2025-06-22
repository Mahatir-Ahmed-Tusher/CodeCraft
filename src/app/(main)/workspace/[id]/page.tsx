import ChatView from '@/app/components/ChatView'
import CodeView from '@/app/components/CodeView'
import React from 'react'

const Workspace = () => {
  return (
   <div className='p-10'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-7'>
            <ChatView/>
            <div className='col-span-2'>
            <CodeView/>
            </div>
        </div>
   </div>
  )
}

export default Workspace