"use client";
import { Button } from '@/components/ui/button';
import { CircleUserRound } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function Header() {
    const [isLogin, setIsLogin] = useState(false);
    const [user, setUser] = useState(null);
    const [jwt, setJwt] = useState(null);
    const router = useRouter();

    useEffect(() => {
        setIsLogin(sessionStorage.getItem('jwt') ? true : false);
        setUser(JSON.parse(sessionStorage.getItem('user')));
        setJwt(sessionStorage.getItem('jwt'));
    }, []);

    const onSignOut = () => {
        sessionStorage.clear();
        router.push('/sign-in');
    };

    return (
        <div className=''>
            <div className='shadow-sm flex justify-between container mx-auto px-0'>
                <div className='flex items-center gap-8'>
                    <Link 
                        href={'/'} 
                        onClick={(e) => {
                            if (user?.username.toLowerCase().includes("delivery") || user.username.toLowerCase() === "admin") {
                                e.preventDefault(); 
                            }
                        }}
                    >
                        <Image 
                            src='/mtclogo.png' 
                            alt='logo' 
                            width={200} 
                            height={150} 
                            className='cursor-pointer' 
                        />
                    </Link>
                    {user?.username && !user.username.toLowerCase().includes("delivery") && user.username.toLowerCase() !== "admin" && (
                        <h2 className='text-2xl font-bold text-yellow-200'>RHODESIAN ONLINE</h2>
                    )}
                </div>
                <div className='flex gap-5 items-center'>
                    {!isLogin ? (
                        <Link href={'/sign-in'}>
                            <Button>Login</Button>
                        </Link>
                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="flex flex-col items-center">
                                    <CircleUserRound
                                        className="bg-green-100 p-2 mr-3 rounded-full cursor-pointer text-primary h-16 w-16"
                                    />
                                    <span className="text-white text-xl mr-3">{user?.username}</span>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {user?.username === "admin" && (
                                    <Link href={'/admin-dashboard'}>
                                        <DropdownMenuItem>Dashboard</DropdownMenuItem>
                                    </Link>
                                )}
                                <Link href={'/my-profile'}>
                                    <DropdownMenuItem>Profile</DropdownMenuItem>
                                </Link>
                                {user?.username && !user.username.toLowerCase().includes("delivery") && user.username.toLowerCase() !== "admin" && (
                                    <Link href={'/my-order'}>
                                        <DropdownMenuItem>My Order</DropdownMenuItem>
                                    </Link>
                                )}
                                {user?.username.toLowerCase().includes("delivery") && (
                                    <Link href={'/rider-page'}>
                                        <DropdownMenuItem>Orders</DropdownMenuItem>
                                    </Link>
                                )}
                                <DropdownMenuItem onClick={onSignOut}>Logout</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Header;
