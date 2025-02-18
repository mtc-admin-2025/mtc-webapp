"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import GlobalApi from "@/app/_utils/GlobalApi";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from 'next/navigation';
import { CircleUserRound } from 'lucide-react';

export default function Profile() {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);
  const router = useRouter();

  useEffect(() => {
      setIsLogin(sessionStorage.getItem('jwt') ? true : false);
      setUser(JSON.parse(sessionStorage.getItem('user')));
      setJwt(sessionStorage.getItem('jwt'));
  }, []);

  return (
    <div className="bg-[url('/banner.png')] bg-cover bg-center min-h-screen w-full p-4 sm:p-10">
      <div className='flex flex-col sm:flex-row items-center gap-4 sm:gap-8 ml-20 mr-24 justify-between'>
        <Link href={'/'} className="flex items-center gap-4">
          <Image 
            src='/mtclogowhite.gif' 
            alt='logo' 
            width={100} 
            height={50} 
            className='cursor-pointer w-full max-w-[50px] sm:max-w-[100px]'
          />
          <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white text-center sm:text-left">
            MECHATRONICS TECHNOLOGIES CORPORATION
          </p>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex flex-col items-center">
              <CircleUserRound className="bg-slate-200 p-2 mr-3 rounded-full cursor-pointer text-blue-900 h-16 w-16"/>
              <span className="text-slate-200 text-xl font-bold mr-3">{user?.username}</span>
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
            {user?.username.toLowerCase().includes("delivery") && (
              <Link href={'/rider-page'}>
                <DropdownMenuItem>Orders</DropdownMenuItem>
              </Link>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="ml-20 mt-5">
        <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-400">
          Welcome {user?.username}!
        </p>
        <div className="mt-4 bg-white p-6 rounded-lg shadow-lg w-fit">
          <p className="text-lg font-semibold">Email: {user?.email}</p>
          <p className="text-lg font-semibold">Password: ******</p>
        </div>
      </div>
    </div>
  );
}
