"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const images = [
    '/gallery1.jpg',
    '/gallery2.jpg',
    '/gallery3.jpg',
    '/gallery4.jpg',
    '/gallery5.jpg',
    '/gallery6.jpg'
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 3) % images.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [images.length]);

  // Get the next 3 images to show
  const currentImages = [
    images[currentImageIndex % images.length],
    images[(currentImageIndex + 1) % images.length],
    images[(currentImageIndex + 2) % images.length],
  ];

  return (
    <div className="relative flex flex-col min-h-screen">
      {/* Main Content */}
      <div className="bg-[url('/banner.png')] bg-cover bg-center flex-grow p-4 sm:p-10 h-[100vh]">
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
              Power Up Your Future with Us!
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
            <div className="absolute inset-0 w-full h-full rounded-full blur-xl opacity-75 animate-pulse bg-blue-500/40"></div>
            <Image 
              src='/mtchexa.png' 
              alt='hexagon logo' 
              width={900} 
              height={900} 
              className='w-full max-w-[400px] sm:max-w-[900px] cursor-pointer relative'
            />
          </div>
        </div>
      </div>

      <section className="bg-[url('/cementbg.png')] bg-cover bg-center py-10 px-6 sm:px-20 ">
      <h2 className="text-3xl sm:text-5xl font-extrabold text-center text-gray-800 mb-8 mx-40">
        Explore and Learn
      </h2>

      {/* Display 3 images at a time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10 mx-40">
        {currentImages.map((image, index) => (
          <div key={index} className="relative w-full h-60">
            <Image
              src={image}
              alt={`Gallery Image ${index + 1}`}
              width={600}
              height={400}
              className="rounded-lg shadow-lg object-cover w-full h-full transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>


        {/* Videos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mx-40">
          <div className="aspect-w-16 aspect-h-9">
            <iframe 
              src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
              title="Video 1" 
              className="rounded-lg shadow-lg w-full h-60" 
              allowFullScreen
            ></iframe>
          </div>
          <div className="aspect-w-16 aspect-h-9">
            <iframe 
              src="https://www.youtube.com/embed/4FxCPS8jKGQ" 
              title="Video 2" 
              className="rounded-lg shadow-lg w-full h-60" 
              allowFullScreen
            ></iframe>
          </div>
          {/* Add more iframes for more videos */}
        </div>
      </section>

  {/* Square Image Gallery Section */}
<section className="bg-[url('/mtcbuild.png')] bg-cover bg-center py-10 px-6 sm:px-20 ">
  <h2 className="text-3xl sm:text-5xl font-extrabold text-center text-white mb-8">
    Trainings and Assessments
  </h2>

  {/* Square Pictures */}
  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-6 mb-10 mx-40">
    <Image 
      src="/square1.jpg" 
      alt="Square Image 1" 
      width={500} 
      height={500}  
      className="rounded-lg shadow-lg object-cover w-full h-[400px] transform hover:scale-105 transition-transform duration-400" 
    />
    <Image 
      src="/square2.jpg" 
      alt="Square Image 2" 
      width={500} 
      height={500}  
      className="rounded-lg shadow-lg object-cover w-full h-[400px] transform hover:scale-105 transition-transform duration-400" 
    />
    <Image 
      src="/square3.jpg" 
      alt="Square Image 3" 
      width={500} 
      height={500}  
      className="rounded-lg shadow-lg object-cover w-full h-[400px] transform hover:scale-105 transition-transform duration-400" 
    />
    <Image 
      src="/square4.jpg" 
      alt="Square Image 4" 
      width={500} 
      height={500}  
      className="rounded-lg shadow-lg object-cover w-full h-[400px] transform hover:scale-105 transition-transform duration-400" 
    />
    <Image 
      src="/square5.jpg" 
      alt="Square Image 5" 
      width={500} 
      height={500}  
      className="rounded-lg shadow-lg object-cover w-full h-[400px] transform hover:scale-105 transition-transform duration-400" 
    />
  </div>
</section>

<section className="bg-[url('/cementbg.png')] bg-cover bg-center py-10 px-6 sm:px-20 ">
  <h2 className="text-3xl sm:text-5xl font-extrabold text-center text-gray-800 mb-8">
    Our Trusted Partners
  </h2>

  {/* Trusted Partners Logos */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-10 mx-40">
  <div className="flex flex-col justify-center items-center">
  <Image 
    src="/partner1.png" 
    alt="Partner 1" 
    width={100} 
    height={100} 
    className="object-contain"
  />
  <p className="mt-2 text-center font-bold">PROBOT</p>
</div>
<div className="flex flex-col justify-center items-center">
  <Image 
    src="/partner2.jpg" 
    alt="Partner 2" 
    width={100} 
    height={100} 
    className="object-contain"
  />
  <p className="mt-2 text-center font-bold">TESDA</p>
</div>
<div className="flex flex-col justify-center items-center">
  <Image 
    src="/partner3.jpg" 
    alt="Partner 3" 
    width={100} 
    height={100} 
    className="object-contain"
  />
  <p className="mt-2 text-center font-bold">Mechatronics and Robotics Society of the Philippines</p>
</div>
<div className="flex flex-col justify-center items-center">
  <Image 
    src="/partner4.jpg" 
    alt="Partner 4" 
    width={100} 
    height={100} 
    className="object-contain"
  />
  <p className="mt-2 text-center font-bold">Industrial Controls Corporation </p>
</div>
  </div>
</section>



      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 sm:px-10">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto">
          {/* Left: Footer Details */}
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 bg-clip-text text-transparent">
              Mechatronics Technologies Corporation
            </p>
            <p className="text-sm sm:text-base mt-2">TESDA Accredited Training and Assessment Center</p>
            <p className="text-sm sm:text-base mt-2">📍 ICC-MTC Building, 699 Tandang Sora Avenue, Old Balara, Quezon City</p>
            <p className="text-sm sm:text-base mt-2">📞 0975 293 7418</p>
            <p className="text-sm sm:text-base mt-2">
              🌐 <a href="https://mtc-ph.vercel.app" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-400">
                mtc-ph.vercel.app
              </a>
            </p>
            <p className="text-sm sm:text-base mt-2 flex items-center justify-center md:justify-start gap-2">
              <Image 
                src="/fblogo.png" 
                alt="Facebook Logo" 
                width={20} 
                height={20} 
                className="inline-block"
              />
              <a href="https://www.facebook.com/MechatronicsTechnologiesCorp" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-400">
                Facebook Page
              </a>
            </p>
          </div>

          {/* Right: QR Code or Logo */}
          <div className="flex items-center">
            <Image 
              src="/qrcode.png" 
              alt="MTC QR Code" 
              width={120} 
              height={120} 
              className="rounded-md"
            />
          </div>
        </div>

        {/* Bottom Text */}
        <div className="mt-6 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Mechatronics Technologies Corporation. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
