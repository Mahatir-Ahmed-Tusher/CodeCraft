import ChatView from '@/app/components/ChatView'
import CodeView from '@/app/components/CodeView'
import React from 'react'

const NewWorkspace = () => {
  return (
   <div className='min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 dark:from-blue-950/50 dark:via-purple-950/50 dark:to-cyan-950/50'>
        <div className='p-10'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-7'>
                <ChatView/>
                <div className='col-span-2'>
                <CodeView/>
                </div>
            </div>
        </div>
   </div>
  )
}

export default NewWorkspace