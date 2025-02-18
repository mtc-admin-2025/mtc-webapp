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
  const [studentList, setStudentList] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [todayScheduleCount, setTodayScheduleCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    setIsLogin(sessionStorage.getItem("jwt") ? true : false);
    setUser(JSON.parse(sessionStorage.getItem("user")));
    setJwt(sessionStorage.getItem("jwt"));

    const fetchStudents = async () => {
      try {
        const students = await GlobalApi.getStudents();
        console.log("Fetched Students:", students); // Debugging
        setStudentList(students);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

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

  const onSignOut = () => {
    sessionStorage.clear();
    router.push("/sign-in");
  };

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

      {/* Welcome Message */}
      <div className="ml-20 mt-5">
        <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-400">
          Students Information
        </p>
      </div>

      {/* Wrapper to position Cards (Left) and Table (Right) */}
      <div className="flex flex-row justify-between p-6 ml-20 mr-20 gap-10">
        {/* Dashboard Stats - Left Side */}
        <div className="flex flex-col items-start gap-6 w-1/3">
          {/* Total Courses */}
          <div className="bg-gray-400 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center w-full cursor-pointer hover:bg-blue-500">
            <h2 className="text-xl font-bold text-gray-600">Total Courses</h2>
            <p className="text-3xl font-extrabold text-gray-300">
              {courseList.length}
            </p>
          </div>

          {/* Schedules Today */}
          <div className="bg-gray-400 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center w-full cursor-pointer hover:bg-blue-500">
            <h2 className="text-xl font-bold text-gray-600">Schedules Today</h2>
            <p className="text-3xl font-extrabold text-gray-300">
              {todayScheduleCount}
            </p>
          </div>

          {/* Total Students */}
          <Link
            href="/students-info"
            className="bg-blue-400 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center w-full cursor-pointer hover:bg-blue-500"
          >
            <h2 className="text-xl font-bold">Total Students</h2>
            <p className="text-3xl font-extrabold text-gray-800">
              {studentList.length}
            </p>
          </Link>
        </div>

        {/* Students Table - Right Side */}
        <div className="bg-gray-200 p-6 rounded-lg shadow-lg w-2/3">
          <h2 className="text-2xl font-bold mb-4">Students List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-blue-200 border border-gray-200">
              <thead>
                <tr className="bg-blue-300">
                  <th className="py-2 px-4 border">Unique Learners ID</th>
                  <th className="py-2 px-4 border">Name</th>
                  <th className="py-2 px-4 border">Contact Number</th>
                  <th className="py-2 px-4 border">Email</th>
                  <th className="py-2 px-4 border">Address</th>
                </tr>
              </thead>
              <tbody>
                {studentList.length > 0 ? (
                  studentList.map((student) => (
                    <tr key={student.id} className="text-center border-t">
                      <td className="py-2 px-4 border">
                        {student.Unique_Learners_Identifier}
                      </td>
                      <td className="py-2 px-4 border">{student.Students_Name}</td>
                      <td className="py-2 px-4 border">{student.Contact_Number}</td>
                      <td className="py-2 px-4 border">{student.Email}</td>
                      <td className="py-2 px-4 border">{student.Address}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-4 text-center text-gray-500">
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <p className="mt-5 text-center">Click to see more details</p>
          </div>
        </div>
      </div>
    </div>
  );
}
