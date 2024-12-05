import { Button } from '@/components/ui/button'
import { CheckCircle, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'


function AccountVerification() {
  return (
    <div className='flex justify-center my-20'>
    <div className='border shadow-md flex flex-col justify-center
    p-20 rounded-md items-center gap-3 px-32'>
        <CheckCircle2 className='h-24 w-24 text-primary' />
        <h2 className='font-medium text-3xl text-primary'>Account Created Successfully</h2>
        <h2>Complete the verification by clicking on the link sent to your provided email address</h2>
       <Link href={'/sign-in'}> 
       <Button className="mt-8">Go to Log In</Button>
          </Link>
    </div>
    </div>
  )
}

export default AccountVerification