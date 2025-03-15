"use client"

import "./globals.css";
import Header from "./_components/Header";
import { Toaster } from "@/components/ui/sonner";
import { usePathname } from "next/navigation";
import { UpdateCartContext } from "./_context/UpdateCartContext";
import { useState } from "react";
import { Analytics } from "@vercel/analytics/react"


export default function RootLayout({ children }) {
  const params=usePathname();
  const [updateCart,setUpdateCart]=useState(false);
  const showHeader=params=='/sign-in'||params=='/create-account'?false:true;
  return (
    <html lang="en">
      <body>
      <UpdateCartContext.Provider value={{updateCart,setUpdateCart}}>
        {children}
        <Toaster />
        <Analytics />
        </UpdateCartContext.Provider>
        </body>
    </html>
  );
}
