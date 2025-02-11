import { Button } from '@/components/ui/button'
import { CheckCircle, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'


function AccountVerification() {
  return (
    <div className="bg-[url('/banner.png')] bg-cover bg-center min-h-screen w-full p-4 sm:p-10">
    <div className='flex justify-center my-20'>
    <div className='shadow-md flex flex-col justify-center
    p-20 rounded-md items-center gap-3 px-32 bg-blue-200 bg-opacity-80'>
        <CheckCircle2 className='h-24 w-24 text-blue-700' />
        <h2 className='font-medium text-3xl text-blue-700'>Account Created Successfully</h2>
        <h2 className='text-blue-900'>Complete the verification by clicking on the link sent to your provided email address</h2>
    </div>
    </div></div>
  )
}

export default AccountVerification