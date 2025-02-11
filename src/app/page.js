import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-[url('/banner.png')] bg-cover bg-center min-h-screen w-full p-4 sm:p-10">
      
      {/* Logo & Title */}
      <div className='flex flex-col sm:flex-row items-center gap-4 sm:gap-8 ml-20 mr-20'>
        <Image 
          src='/mtclogowhite.gif' 
          alt='logo' 
          width={300} 
          height={250} 
          className='cursor-pointer w-full max-w-[200px] sm:max-w-[300px]'
        />
        <p className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white text-center sm:text-left">
          MECHATRONICS TECHNOLOGIES CORPORATION
        </p>
      </div>

      {/* Main Section: Text on Left, Hexagon Image on Right */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-6 ml-20 mr-20">
        {/* Left: Text & Button */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <p className="text-3xl sm:text-6xl md:text-7xl lg:text-9xl font-extrabold text-white">
            Power Up Your Future with Us! 🚀
          </p>
          <p className="text-lg sm:text-2xl md:text-4xl font-extrabold text-white mt-2 sm:mt-4">
            Enroll Today & Master Mechatronics, Instrumentation, and Electrical Installation, and Maintenance!
          </p>
          <Link href={'/sign-in'}>
            <Button className="rounded-lg mt-5 w-40 sm:w-52 h-12 sm:h-20 text-xl sm:text-3xl font-bold bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500">
              Enroll Now
            </Button>
          </Link>
        </div>

        {/* Right: Image with Continuous Glow Effect */}
        <div className="relative flex justify-center sm:justify-end w-full sm:w-1/2 mt-6 sm:mt-0">
          {/* Glow Effect */}
          <div className="absolute inset-0 w-full h-full rounded-full blur-xl opacity-75 animate-pulse 
              bg-blue-500/40"></div>
          
          {/* Image */}
          <Image 
            src='/mtchexa.png' 
            alt='logo' 
            width={900} 
            height={900} 
            className='w-full max-w-[400px] sm:max-w-[900px] cursor-pointer relative'
          />
        </div>
      </div>
    </div> 
  );
}
