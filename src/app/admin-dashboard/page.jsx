"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import GlobalApi from '@/app/_utils/GlobalApi';
import Link from 'next/link';
import CourseList from "../_components/CourseList";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { useEffect, useState } from "react";

export default function Home() {
  const [courseList, setCourseList] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courses = await GlobalApi.getCourses();
        setCourseList(courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []); // Runs only once when component mounts

  return (
    <div className="bg-[url('/banner.png')] bg-cover bg-center min-h-screen w-full p-4 sm:p-10">
      
      {/* Logo & Title */}
      <div className='flex flex-col sm:flex-row items-center gap-4 sm:gap-8 ml-20 mr-20'>
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
      </div>
  
      {/* Main Section: Text on Left, Hexagon Image on Right */}
      <div className="flex flex-col items-center sm:items-start text-center sm:text-left ml-20 mr-20 mb-5 mt-10">
        <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-400">
          Welcome Admin!
        </p>
      </div>
      <div className="ml-20">
        <TabGroup className="text-white font-semibold text-xl">
      <TabList className='bg-slate-400 w-60 rounded-lg'>
        <Tab className='mr-3 hover:bg-blue-500 rounded-lg px-2'>Tab 1</Tab>
        <Tab className='mr-2 hover:bg-blue-500 rounded-lg px-2'>Tab 2</Tab>
        <Tab className='mr-2 hover:bg-blue-500 rounded-lg px-2'>Tab 3</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>Content 1</TabPanel>
        <TabPanel>Content 2</TabPanel>
        <TabPanel>Content 3</TabPanel>
      </TabPanels>
    </TabGroup>
       </div>
    </div>
  );
  
}
