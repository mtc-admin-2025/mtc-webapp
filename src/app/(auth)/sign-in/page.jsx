"use client";
import GlobalApi from '@/app/_utils/GlobalApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoaderIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';

function SignIn() {
    const [password, setPassword] = useState('');
    const [identifier, setIdentifier] = useState('');
    const router = useRouter();
    const [loader, setLoader] = useState(false);
    const showPasswordBtnRef = useRef(null);

    useEffect(() => {
        const jwt = sessionStorage.getItem('jwt');
        if (jwt) {
            router.push('/');
        }
    }, [router]);

    const onSignIn = (e) => {
        if (e) e.preventDefault(); // ✅ Prevents page refresh
        console.log("🚀 Form submitted with Enter key"); // Debugging

        if (!identifier || !password) {
            console.log("⚠️ Missing fields!"); // Debugging
            return;
        }

        setLoader(true);
        GlobalApi.SignIn(identifier, password)
            .then((resp) => {
                console.log("✅ Login successful");
                const user = resp.data.user;
                const jwt = resp.data.jwt;
                sessionStorage.setItem('user', JSON.stringify(user));
                sessionStorage.setItem('jwt', jwt);
                toast("Login Successfully");

                if (user.username === 'Admin') {
                    router.push('/admin-dashboard');
                } else if (user.username.toLowerCase().includes('delivery')) {
                    router.push('/rider-page');
                } else {
                    router.push('/student-dashboard');
                }
            })
            .catch((e) => {
                console.error("❌ Sign-in error:", e);
                toast(e?.response?.data?.error?.message || "An error occurred");
            })
            .finally(() => {
                setLoader(false);
            });
    };

    return (
        <div className="bg-[url('/banner.png')] bg-cover bg-center min-h-screen w-full p-4 sm:p-10">
            <div className='flex items-baseline justify-center my-20'>
                <div className='flex flex-col items-center justify-center p-10 bg-blue-300 rounded-lg bg-opacity-30'>

                    <Image src='/mtclogowhite.gif' width={200} height={200} alt='logo' />
                    <h2 className='text-slate-200 text-3xl font-extrabold'>Sign In to Account</h2>
                    <h2 className='text-slate-400 text-xl font-bold ml-20 mr-20'>Enter your account details to Sign In</h2>

                    {/* ✅ FORM HANDLES ENTER KEY */}
                    <form 
                        className='w-full flex flex-col gap-5 mt-7' 
                        onSubmit={onSignIn} 
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                console.log("🔹 Enter key detected"); // Debugging
                                e.preventDefault();
                                onSignIn(e);
                            }
                        }}
                    >
                        <Input 
                            placeholder='Enter email or username' 
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                        />
                        <div className='flex'>
                            <Input 
                                className='h-10 rounded-lg text-gray-950 mr-5' 
                                type="password" 
                                id="passwordField" 
                                placeholder="Enter password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button 
                                className='bg-blue-900 rounded-md w-20 hover:bg-blue-700'
                                ref={showPasswordBtnRef} 
                                type="button"
                                onClick={() => {
                                    const passwordField = document.getElementById("passwordField");
                                    passwordField.type = passwordField.type === "password" ? "text" : "password";
                                    showPasswordBtnRef.current.textContent = passwordField.type === "password" ? "Show" : "Hide";
                                }} 
                                disabled={!password}
                            >
                                Show
                            </Button>
                        </div>

                        <Button 
                            className='bg-blue-900 rounded-md hover:bg-blue-700'
                            type="submit" // ✅ Enter key will now trigger this
                            disabled={!(identifier && password)}
                        >
                            {loader ? <LoaderIcon className='animate-spin' /> : 'Sign In'}
                        </Button>

                        <p>Don&apos;t have an account?
                            <Link href={'/create-account'} className='text-blue-500'>
                                Click here to create a new account
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
