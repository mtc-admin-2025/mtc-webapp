"use client"
import GlobalApi from '@/app/_utils/GlobalApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoaderIcon, eye} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState, useRef} from 'react'
import { toast } from 'sonner'

function CreateAccount() {
    const [username,setUsername]=useState();
    const [email,setEmail]=useState();
    const [password,setPassword]=useState();
    const router=useRouter();
    const [loader,setLoader]=useState();

    const showPasswordBtnRef = useRef(null);

  const togglePasswordVisibility = () => {
    const passwordField = document.getElementById("passwordField");
    const showPasswordBtn = showPasswordBtnRef.current;

    if (showPasswordBtn && passwordField.type === "password") {
      passwordField.type = "text";
      showPasswordBtn.textContent = "Hide";
    } else {
      passwordField.type = "password";
      showPasswordBtn.textContent = "Show";   

    }
  };
    useEffect(()=>{
        const jwt=sessionStorage.getItem('jwt');
        if(jwt)
        {
            router.push('/')
        }
    },[router])
    const onCreateAccount=()=>{
        setLoader(true)
        GlobalApi.registerUser(username,email,password).then(resp=>{
            console.log(resp.data.user)
            console.log(resp.data.jwt)
            sessionStorage.setItem('user',JSON.stringify(resp.data.user));
            sessionStorage.setItem('jwt',resp.data.jwt);
            toast("Account Created Successfully")
            router.push('/account-verification');
            setLoader(false)
        },(e)=>{
            setLoader(false)
            toast(e?.response?.data?.error?.message)
        })
    }
  return (
    <div className="bg-[url('/banner.png')] bg-cover bg-center min-h-screen w-full p-4 sm:p-10">
    <div className='flex items-baseline justify-center my-20'>
        <div className='flex flex-col items-center justify-center
        p-10 bg-blue-300 rounded-lg bg-opacity-30 ml-4 mr-4'>
            <Image src='/mtclogowhite.gif' width={200} height={200} alt='logo'/>
            <h2 className='text-slate-200 text-3xl font-extrabold'>Create an Account</h2>
            <h2 className='text-slate-400 text-xl font-bold'>Enter your Email and Password to Create an account</h2>
            <div className='w-full flex flex-col gap-5 mt-7'>
                <Input placeholder='Username' 
                onChange={(e)=>setUsername(e.target.value)}
                />
                <Input placeholder='name@example.com' 
                onChange={(e)=>setEmail(e.target.value)}/>
                <div className='flex'>
                <Input className='h-10 rounded-lg text-gray-950 mr-5'type="password" id="passwordField" placeholder="enter password" onChange={(e) => setPassword(e.target.value)} />
                <Button className='bg-blue-900 rounded-md hover:bg-blue-700'ref={showPasswordBtnRef} onClick={togglePasswordVisibility} disabled={!(password)}>Show</Button></div>
                
                <Link href={'/account-verification'}><Button className ="ml-40  bg-blue-900 hover:bg-blue-700 items-center justify-center"onClick={()=>onCreateAccount()}
                    disabled={!(username||email||password)}
                >
                   {loader?<LoaderIcon className='animate-spin '/>:'Create an Account'} </Button></Link>
                   
                <p className='ml-16 text-slate-400'>Already have an account?  
                    <Link href={'/sign-in'} className='text-blue-500'>
                          Click here to Sign In
                    </Link>
                </p>
            </div>
        </div>
    </div>
    </div>
  )
}

export default CreateAccount