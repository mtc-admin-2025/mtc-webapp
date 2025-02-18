"use client"
import { Fredoka,Lato,Poppins,PT_Sans,Kanit, Space_Grotesk} from "next/font/google";
import "./globals.css";
import Header from "./_components/Header";
import { Toaster } from "@/components/ui/sonner";
import { usePathname } from "next/navigation";
import { UpdateCartContext } from "./_context/UpdateCartContext";
import { useState } from "react";
import { Analytics } from "@vercel/analytics/react"

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "700"] });

export default function RootLayout({ children }) {
  const params=usePathname();
  const [updateCart,setUpdateCart]=useState(false);
  const showHeader=params=='/sign-in'||params=='/create-account'?false:true;
  return (
    <html lang="en">
      <body className={spaceGrotesk.className}>
      <UpdateCartContext.Provider value={{updateCart,setUpdateCart}}>
        {children}
        <Toaster />
        <Analytics />
        </UpdateCartContext.Provider>
        </body>
    </html>
  );
}
