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
import { useRouter } from "next/navigation";
import { CircleUserRound } from "lucide-react";

export default function Home() {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setIsLogin(sessionStorage.getItem("jwt") ? true : false);
    setUser(JSON.parse(sessionStorage.getItem("user")));
    setJwt(sessionStorage.getItem("jwt"));
  }, []);

  const onSignOut = () => {
    sessionStorage.clear();
    router.push("/sign-in");
  };

  const [courseList, setCourseList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [todayScheduleCount, setTodayScheduleCount] = useState(0);
  const [activeTab, setActiveTab] = useState("Dashboard");

  // Function to get today's date in the required format (e.g., "February 20, 2025")
  const getTodayDate = () => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date().toLocaleDateString("en-US", options);
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courses = await GlobalApi.getCourses();
        setCourseList(courses);

        // Get today's date
        const today = getTodayDate();

        // Count how many schedules are for today
        const count = courses.reduce((acc, course) => {
          const todaySchedules = course.Schedule?.filter(
            (schedule) => schedule.Schedule_date === today
          ) || [];
          return acc + todaySchedules.length;
        }, 0);

        setTodayScheduleCount(count);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    const fetchStudents = async () => {
      try {
        const students = await GlobalApi.getStudents();
        setStudentList(students);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchCourses();
    fetchStudents();
  }, []);

  return (
    <div className="bg-[url('/banner.png')] bg-cover bg-center min-h-screen w-full p-4 sm:p-10">
      {/* Logo & Title */}
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 ml-20 mr-24 justify-between">
        <Link href={"/"} className="flex items-center gap-4">
          <Image
            src="/mtclogowhite.gif"
            alt="logo"
            width={100}
            height={50}
            className="cursor-pointer w-full max-w-[50px] sm:max-w-[100px]"
          />
          <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white text-center sm:text-left">
            MECHATRONICS TECHNOLOGIES CORPORATION
          </p>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex flex-col items-center">
              <CircleUserRound className="bg-slate-200 p-2 mr-3 rounded-full cursor-pointer text-blue-900 h-16 w-16" />
              <span className="text-slate-200 text-xl font-bold mr-3">
                {user?.username}
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {user?.username === "Admin" && (
              <Link href={"/admin-dashboard"}>
                <DropdownMenuItem>Dashboard</DropdownMenuItem>
              </Link>
            )}
            <Link href={"/my-profile"}>
              <DropdownMenuItem>Profile</DropdownMenuItem>
            </Link>
            {user?.username.toLowerCase().includes("delivery") && (
              <Link href={"/rider-page"}>
                <DropdownMenuItem>Orders</DropdownMenuItem>
              </Link>
            )}
            <DropdownMenuItem onClick={onSignOut}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Welcome Admin Message */}
      <div className="ml-20 mt-5">
        <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-400">
          Welcome Admin!
        </p>
      </div>

     {/* Dashboard Stats - Positioned Vertically on the Left */}
<div className="flex flex-col items-start gap-6 p-6 ml-20">
  {/* Total Courses */}
  <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center w-64">
    <h2 className="text-xl font-bold">Total Courses</h2>
    <p className="text-3xl font-extrabold text-blue-600">
      {courseList.length}
    </p>
  </div>

  {/* Schedules Today */}
  <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center w-64">
    <h2 className="text-xl font-bold">Schedules Today</h2>
    <p className="text-3xl font-extrabold text-purple-600">
      {todayScheduleCount}
    </p>
  </div>

  {/* Total Students */}
  <Link
    href="/students-info"
    className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center w-64 cursor-pointer hover:bg-blue-400"
  >
    <h2 className="text-xl font-bold">Total Students</h2>
    <p className="text-3xl font-extrabold text-red-600">
      {studentList.length}
    </p>
  </Link>
</div>
    </div>
  );
}
