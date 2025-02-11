"use client"
import GlobalApi from '@/app/_utils/GlobalApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoaderIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState, useRef } from 'react'
import { toast } from 'sonner'

function SignIn() {
    const [password, setPassword] = useState('');
    const [identifier, setIdentifier] = useState(''); // Changed to a single identifier state
    const router = useRouter();
    const [loader, setLoader] = useState(false); // Initialize loader as false
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

    useEffect(() => {
        const jwt = sessionStorage.getItem('jwt');
        if (jwt) {
            router.push('/')
        }
    },[router])

    const onSignIn = () => {
        setLoader(true);
        GlobalApi.SignIn(identifier, password).then(
            (resp) => {
                const user = resp.data.user; // Get user data
                const jwt = resp.data.jwt;   // Get JWT
                
                console.log("User object:", user); // Debug user structure
                console.log("Username:", user.username); // Verify username
    
                sessionStorage.setItem('user', JSON.stringify(user));
                sessionStorage.setItem('jwt', jwt);
    
                toast("Login Successfully");
    
                // Check username and redirect accordingly
                if (user.username === 'admin') {
                    console.log("Redirecting to admin dashboard...");
                    router.push('/admin-dashboard'); // Redirect to admin page
                } else if (user.username.toLowerCase().includes('delivery')) {
                    console.log("Redirecting to rider page...");
                    router.push('/rider-page'); // Redirect to rider page
                } else {
                    console.log("Redirecting to default page...");
                    router.push('/student-dashboard'); // Redirect to default user landing page
                }
    
                setLoader(false);
            },
            (e) => {
                console.error("Sign-in error:", e); // Log errors for debugging
                toast(e?.response?.data?.error?.message || "An error occurred");
                setLoader(false);
            }
        );
    };
    return (
        <div className="bg-[url('/banner.png')] bg-cover bg-center min-h-screen w-full p-4 sm:p-10">
        <div className='flex items-baseline justify-center my-20'>
            <div className='flex flex-col items-center justify-center
            p-10 bg-blue-300 rounded-lg bg-opacity-30'>
                <Image src='/mtclogowhite.gif' width={200} height={200} alt='logo'/>
                <h2 className='text-slate-200 text-3xl font-extrabold'>Sign In to Account</h2>
                <h2 className='text-slate-400 text-xl font-bold ml-20 mr-20'>Enter your account details to Sign In</h2>
                <div className='w-full flex flex-col gap-5 mt-7'>
                <Input 
                        placeholder='enter email or username' 
                        onChange={(e) => setIdentifier(e.target.value)} 
                    />
                    <div className='flex'>
                        <Input 
                            className='h-10 rounded-lg text-gray-950 mr-5' 
                            type="password" 
                            id="passwordField" 
                            placeholder="enter password" 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    <Button className='bg-blue-900 rounded-md w-20 hover:bg-blue-700'ref={showPasswordBtnRef} onClick={togglePasswordVisibility} disabled={!(password)}>Show</Button></div>
                    
                    <Button className = 'bg-blue-900 rounded-md  hover:bg-blue-700'
                        onClick={onSignIn}
                        disabled={!(identifier && password)} // Update condition to check both fields
                    >
                        {loader ? <LoaderIcon className='animate-spin' /> : 'Sign In'}
                    </Button>
                    <p>Don&apos;t have an account?
                        <Link href={'/create-account'} className='text-blue-500'>
                            Click here to create a new account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
        </div>
      )

}

export default SignIn;
