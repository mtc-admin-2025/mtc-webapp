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
import { v4 as uuidv4 } from 'uuid';

function CreateAccount() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const [loader, setLoader] = useState(false);
    const [uniqueID, setUniqueID] = useState(() => uuidv4());
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
            router.push('/');
        }
    }, [router]);
    
    const onCreateAccount = () => {
        setLoader(true);
    
        GlobalApi.registerUser(username, email, password)
            .then(resp => {
                const user = resp.data.user;
                const jwt = resp.data.jwt;
    
                sessionStorage.setItem('user', JSON.stringify(user));
                sessionStorage.setItem('jwt', jwt);
    
                
                const uniqueLearnerID = uuidv4().replace(/-/g, "").substring(0, 16);

    
                const studentData = {
                    Students_Name: user.username, 
                    Email: user.email,          
                    userID: user.id,
                    Unique_Learners_Identifier: uniqueLearnerID 
                };
    
                return GlobalApi.createStudent(studentData, jwt);
            })
            .then(() => {
                toast("Account Created Successfully");
                router.push('/account-verification');
            })
            .catch(e => {
                toast(e?.response?.data?.error?.message || "Error creating account");
            })
            .finally(() => {
                setLoader(false);
            });
    };
    
  
  

    return (
        <div className="bg-[url('/banner.png')] bg-cover bg-center min-h-screen w-full p-4 sm:p-10">
            <div className='flex items-baseline justify-center my-20'>
                <div className='flex flex-col items-center justify-center p-10 bg-blue-300 rounded-lg bg-opacity-30 ml-4 mr-4'>
                    <Image src='/mtclogowhite.gif' width={200} height={200} alt='logo' />
                    <h2 className='text-slate-200 text-3xl font-extrabold'>Create an Account</h2>
                    <h2 className='text-slate-400 text-xl font-bold'>Enter your Email and Password to Create an account</h2>
                    <div className='w-full flex flex-col gap-5 mt-7'>
                        <Input placeholder='Username'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <Input placeholder='name@example.com'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <div className='flex'>
                            <Input className='h-10 rounded-lg text-gray-950 mr-5' type="password"
                                id="passwordField" placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                            <Button className='bg-blue-900 rounded-md hover:bg-blue-700'
                                ref={showPasswordBtnRef} onClick={togglePasswordVisibility}
                                disabled={!password}>
                                Show
                            </Button>
                        </div>

                        <Button className="ml-40 bg-blue-900 hover:bg-blue-700 items-center justify-center"
                            onClick={onCreateAccount}
                            disabled={!username || !email || !password}>
                            {loader ? <LoaderIcon className='animate-spin' /> : 'Create an Account'}
                        </Button>

                        <p className='ml-16 text-slate-400'>Already have an account?
                            <Link href={'/sign-in'} className='text-blue-500'>
                                {' '}Click here to Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateAccount;
