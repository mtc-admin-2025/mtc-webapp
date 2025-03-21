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
import { CircleUserRound, ClipboardCheck, ChartNoAxesCombined, ClipboardPen, UsersRound, UserRound } from 'lucide-react';

export default function Profile() {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    const storedJwt = sessionStorage.getItem("jwt");
    
    if (storedJwt) {
      setIsLogin(true);
      setUser(storedUser);
      setJwt(storedJwt);
      fetchEnrolledCourses(storedUser.email, storedJwt);
    }
  }, []);

  const fetchEnrolledCourses = async (email, jwt) => {
    try {
      const courses = await GlobalApi.getEnrolledCourses(email, jwt);
      setEnrolledCourses(courses);
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
    }
  };

  const courseImageMap = [
    { keyword: "Electrical", image: "/eimassessment.jpg" },
    { keyword: "Instrumentation", image: "/icassessment.jpg" },
    { keyword: "Mechatronics", image: "/msassessment.jpg" },
    { keyword: "Solar", image: "/solarassessment.jpg" },
  ];
  
  const getImageForCourse = (courseName) => {
    const course = courseImageMap.find((item) => courseName.includes(item.keyword));
    return course ? course.image : "/default-image.jpg"; // Provide a default image if no match is found
  };


  return (
    <div className="min-h-screen flex bg-[url('/banner.png')] bg-cover bg-center w-full p-10">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 bg-[#091d41] p-6 rounded-3xl shadow-lg w-fit flex flex-col gap-6 mt-8 mx-7 h-full max-h-[calc(100vh-4rem)]">
        {/* Logo */}
        <div className="flex items-center gap-4 mb-5 mt-5 ml-5 mr-5">
          <Image src='/mtclogowhite.gif' alt='logo' width={100} height={50} className='cursor-pointer w-full max-w-[50px] sm:max-w-[100px]' />
          <div className="flex flex-col">
            <p className="text-xl font-extrabold text-slate-200">MECHATRONICS</p>
            <p className="text-xl font-extrabold text-slate-200">TECHNOLOGIES</p>
            <p className="text-xl font-extrabold text-slate-200">CORPORATION</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-6">
        <Link href="/student-dashboard" className="p-6 rounded-lg flex items-center w-[350px] relative group">
        <ChartNoAxesCombined className="h-11 w-11 ml-7 text-white" />
        <h2 className="text-xl font-bold ml-7 text-white">Dashboard</h2>
        {/* Blue line that appears on hover */}
        <div className="absolute right-1 top-4 bottom-4 w-1 bg-white rounded opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </Link>

          <Link href="/assessment-page-list" className="p-6 rounded-lg flex items-center w-[350px] relative group">
            <ClipboardCheck className="h-11 w-11 ml-7 text-white" />
            <h2 className="text-xl font-bold ml-7 text-white">Assessments</h2>
            <div className="absolute right-1 top-4 bottom-4 w-1 bg-white rounded opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
  
          <Link href="/training-page-list" className="p-6 rounded-lg flex items-center w-[350px] relative group">
            <ClipboardPen className="h-11 w-11 ml-7 text-white" />
            <h2 className="text-xl font-bold ml-7 text-white">Trainings</h2>
            <div className="absolute right-1 top-4 bottom-4 w-1 bg-white rounded opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
  
          <Link href="/trainer-page-list" className="p-6 rounded-lg flex items-center w-[350px] relative group">
            <UsersRound className="h-11 w-11 ml-7 text-white" />
            <h2 className="text-xl font-bold ml-7 text-white">Trainers/Assessors</h2>
            {/* Blue line that appears on hover */}
            <div className="absolute right-1 top-4 bottom-4 w-1 bg-white rounded opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
  
          <Link href="/my-profile" className="bg-white p-6 rounded-lg flex items-center w-[350px] relative">
            <UserRound className="text-blue-950 h-11 w-11 ml-7" />
            <h2 className="text-xl font-bold ml-7 text-blue-950">My Account</h2>
            <div className="absolute right-1 top-4 bottom-4 w-1 bg-[#091d41] rounded"></div>
          </Link>
        </div>

         {/* Calendar Component */}
              <div className="bg-[#13346d] rounded-xl mt-3 p-6 text-white text-center font-bold w-[350px]">
            <h2 className="text-xl mb-4">
              {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </h2>
  
            {/* Weekdays */}
            <div className="grid grid-cols-7 gap-2 text-xs">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="p-2">{day}</div>
              ))}
            </div>
  
            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2 mt-1">
              {Array.from({ length: new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay() }, (_, i) => (
                <div key={i} className="p-2"></div> // Empty spaces
              ))}
              {Array.from({ length: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() }, (_, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-full ${i + 1 === new Date().getDate() ? "bg-white text-[#13346d]" : ""}`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
      </div>

             
        

      {/* Main Content */}
      <main className="ml-[420px] flex flex-col gap-8 w-4/5">
        <div className="flex justify-between items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex flex-col items-center cursor-pointer ml-auto mr-8">
                <CircleUserRound className="rounded-full text-white h-16 w-16" />
                <span className="text-slate-200 text-xl font-bold">{user?.username}</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {user?.username === "Admin" && <Link href="/admin-dashboard"><DropdownMenuItem>Dashboard</DropdownMenuItem></Link>}
              <Link href="/my-profile"><DropdownMenuItem>Profile</DropdownMenuItem></Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Profile Information */}
        <div className="mt-5">
          <p className="text-6xl font-bold text-white text-center">{user?.username}&apos;s Profile</p>
        </div>
        
        <div className="mt-5">
  <h2 className="text-2xl font-bold text-white text-center">Enrolled Courses</h2>
  {enrolledCourses.length > 0 ? (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {enrolledCourses.map(course => (
        <div 
        key={course.id} 
        className="bg-[#13346d] text-white rounded-lg shadow-lg overflow-hidden p-6"
      >
        {/* Display course image */}
        <img 
          src={getImageForCourse(course.Course_Name)} 
          alt={course.Course_Name} 
          className="w-full h-48 object-cover rounded-md mb-4" 
        />
      
        <h3 className="text-xl font-bold">{course.Course_Name}</h3>
        <p className="text-sm text-gray-300 mt-2">{course.Course_Description}</p>
      </div>
      ))}
    </div>
          ) : (
            <p className="text-lg text-white">No courses enrolled.</p>
          )}
        </div>
      </main>
    </div>
  );
}
