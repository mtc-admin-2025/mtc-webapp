"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import GlobalApi from "@/app/_utils/GlobalApi";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  CircleUserRound, 
  ChartNoAxesCombined, 
  BookCopy, 
  ClipboardCheck, 
  ClipboardPen, 
  UserRoundSearch,
  Search,
} from "lucide-react";

export default function CoursesPage() {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);
  const [courseList, setCourseList] = useState([]);
  const [trainerList, setTrainerList] = useState([]);
  const router = useRouter();

  useEffect(() => {
    setIsLogin(sessionStorage.getItem("jwt") ? true : false);
    setUser(JSON.parse(sessionStorage.getItem("user")));
    setJwt(sessionStorage.getItem("jwt"));

    const fetchTrainers = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/trainers?populate=*`);
        const data = await response.json();
        setTrainerList(data.data);
      } catch (error) {
        console.error("Error fetching trainers:", error);
      }
    };

    const fetchCourses = async () => {
      try {
        const courses = await GlobalApi.getCourses();
        setCourseList(courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchTrainers();
    fetchCourses();
  }, []);

  const onSignOut = () => {
    sessionStorage.clear();
    router.push("/sign-in");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 bg-[#1b4da3] p-6 rounded-3xl shadow-lg w-fit flex flex-col gap-6 mt-8 mx-7 h-full max-h-[calc(100vh-4rem)]">
        {/* Logo & Name */}
        <div className="flex items-center gap-4 mb-5 mt-5 ml-5 mr-5">
          <Image
            src="/mtclogowhite.gif"
            alt="logo"
            width={100}
            height={50}
            className="cursor-pointer w-full max-w-[50px] sm:max-w-[100px]"
          />
          <div className="flex flex-col">
            <p className="text-xl font-extrabold text-slate-200">MECHATRONICS</p>
            <p className="text-xl font-extrabold text-slate-200">TECHNOLOGIES</p>
            <p className="text-xl font-extrabold text-slate-200">CORPORATION</p>
          </div>
        </div>

        {/* Admin Tools Section */}
        <div className="flex flex-col gap-6">
          <p className="text-lg font-semibold text-slate-200 ml-2">Admin Tools</p>

          <Link href="/admin-dashboard" className="p-6 rounded-lg flex items-center w-[350px] relative group">
          <ChartNoAxesCombined className="h-11 w-11 ml-7 text-white" />
          <h2 className="text-xl font-bold ml-7 text-white">Dashboard</h2>
          {/* Blue line that appears on hover */}
          <div className="absolute right-1 top-4 bottom-4 w-1 bg-white rounded opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </Link>

          <Link href="/courses-info" className="bg-white p-6 rounded-lg flex items-center w-[350px] relative">
          <BookCopy className="text-blue-950 h-11 w-11 ml-7" />
          <h2 className="text-xl font-bold ml-7 text-blue-950">Courses</h2>
          <div className="absolute right-1 top-4 bottom-4 w-1 bg-blue-600 rounded"></div>
          </Link>

          <Link href="/assessment-info" className="p-6 rounded-lg flex items-center w-[350px] relative group">
            <ClipboardCheck className="h-11 w-11 ml-7 text-white" />
            <h2 className="text-xl font-bold ml-7 text-white">Assessments</h2>
            <div className="absolute right-1 top-4 bottom-4 w-1 bg-white rounded opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
          <Link href="/training-info" className="p-6 rounded-lg flex items-center w-[350px] relative group">
            <ClipboardPen className="h-11 w-11 ml-7 text-white" />
            <h2 className="text-xl font-bold ml-7 text-white">Trainings</h2>
            <div className="absolute right-1 top-4 bottom-4 w-1 bg-white rounded opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
          <Link href="/students-info" className="p-6 rounded-lg flex items-center w-[350px] relative group">
            <UserRoundSearch className="h-11 w-11 ml-7 text-white" />
            <h2 className="text-xl font-bold ml-7 text-white">Students</h2>
            <div className="absolute right-1 top-4 bottom-4 w-1 bg-white rounded opacity-0 group-hover:opacity-100 transition-opacity"></div> 
          </Link>
        </div>

        {/* Calendar Component */}
        <div className="bg-[#4b82e0] rounded-xl mt-3 p-6 text-white text-center font-bold w-[350px]">
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
                className={`p-2 rounded-full ${i + 1 === new Date().getDate() ? "bg-white text-[#4b82e0]" : ""}`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-[420px] flex-1 p-10">
        {/* Admin Profile & Search Bar */}
      <div className="fixed right-4 flex items-center space-x-4 mr-5">
        {/* Search Bar */}
        <div className="relative mt-5">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search" 
            className="px-10 py-2 w-96 border border-gray-100 shadow-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
      </div>


        {/* Profile Icon */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex flex-col items-center mt-5 mr-5">
              <CircleUserRound className="p-2 rounded-full cursor-pointer text-blue-900 h-16 w-16" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/admin-dashboard">
              <DropdownMenuItem>Dashboard</DropdownMenuItem>
            </Link>
            <Link href="/my-profile">
              <DropdownMenuItem>Profile</DropdownMenuItem>
            </Link>
            <DropdownMenuItem onClick={onSignOut}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

        {/* Courses Table */}
        <div className="bg-white rounded-xl shadow-lg p-6 w-3/4">
        <h1 className="text-2xl font-semibold text-gray-800">Welcome Back,</h1>
        <h1 className="text-4xl font-bold text-gray-800">{user?.username}</h1>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-20">Manage Courses</h2>
          <table className="table-auto w-full text-left border-collapse rounded-xl bg-gray-200">
            <thead className="bg-blue-600 text-white rounded-t-lg">
              <tr>
                <th className="p-4 rounded-tl-xl">Course ID</th>
                <th className="p-4">Course Name</th>
                <th className="p-4">Trainer</th>
                <th className="p-4 rounded-tr-xl"></th>
              </tr>
            </thead>
            <tbody>
              {courseList.length > 0 ? (
                courseList.map((course, index) => {
                  const trainer = trainerList.find((trainer) => trainer.id === course?.trainer?.id);
                  return (
                    <tr key={index} className="border-t-2">
                      <td className="p-4 rounded-bl-xl">{course.Course_ID}</td>
                      <td className="p-4">{course.Course_Name}</td>
                      <td className="p-4">{trainer ? trainer.Name : "N/A"}</td>
                      <td className="p-4 rounded-br-xl text-center">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                          Manage Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="p-4 text-center">No courses available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
