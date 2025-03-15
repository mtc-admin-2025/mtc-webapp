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
  EllipsisVertical,
} from "lucide-react";

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
  const [todayAssessmentScheduleCount, setTodayAssessmentScheduleCount] = useState(0);
  const [todayTrainingScheduleCount, setTodayTrainingScheduleCount] = useState(0);

  useEffect(() => {
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

  const getTodayDate = () => {
    return new Date().toLocaleDateString("en-CA"); // e.g., "2025-03-13"
  };

  // ✅ Function to convert "Month DD, YYYY" → "YYYY-MM-DD"
  const parseScheduleDate = (dateStr) => {
    const parsedDate = new Date(dateStr);
    if (!isNaN(parsedDate)) {
      return parsedDate.toLocaleDateString("en-CA");
    }

    // Manual conversion if parsing fails
    const [month, day, year] = dateStr.split(" ");
    const monthIndex = new Date(`${month} 1, 2000`).getMonth();
    return new Date(year, monthIndex, parseInt(day)).toLocaleDateString("en-CA");
  };

  const fetchStudents = async () => {
    try {
      const students = await GlobalApi.getStudents();
      console.log("Fetched Students:", students); // Debugging
      setStudentList(students);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const courses = await GlobalApi.getCourses();
      setCourseList(courses);
  
      const today = getTodayDate();
      let trainingCount = 0;
      let assessmentCount = 0;
      let todayTraining = [];
  
      courses.forEach((course) => {
        if (course.TrainingSchedule) {
          const trainerName = course.trainer ? course.trainer.Name : "N/A"; // Extract trainer name from course level
  
          const todaysTrainings = course.TrainingSchedule.filter(
            (schedule) => schedule.Schedule_date && parseScheduleDate(schedule.Schedule_date) === today
          );
  
          trainingCount += todaysTrainings.length;
  
          todaysTrainings.forEach((schedule) => {
            todayTraining.push({
              Course_Name: course.Course_Name,
              Type: "Training",
              Schedule_date: schedule.Schedule_date,
              Schedule_time: schedule.Schedule_time,
              Trainer_Name: trainerName, // Attach trainer name
            });
          });
        }
  
        if (course.AssessmentSchedule) {
          assessmentCount += course.AssessmentSchedule.filter(
            (schedule) => schedule.Schedule_date && parseScheduleDate(schedule.Schedule_date) === today
          ).length;
        }
      });
  
      setTodayTrainingScheduleCount(trainingCount);
      setTodayAssessmentScheduleCount(assessmentCount);
      setTodayTrainingSchedules(todayTraining);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
    {/* Admin Sidebar */}
    <div className="fixed top-0 left-0 bg-[#1b4da3] p-6 rounded-3xl shadow-lg w-fit flex flex-col gap-6 mt-8 mx-7 h-full max-h-[calc(100vh-4rem)]">
      {/* Logo & Company Name */}
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

      {/* Navigation Links */}
      <div className="flex flex-col gap-6">
        <p className="text-lg font-semibold text-slate-200 ml-2">Admin Tools</p>
        <Link href="/admin-dashboard" className="bg-white p-6 rounded-lg flex items-center w-[350px] relative">
          <ChartNoAxesCombined className="text-blue-950 h-11 w-11 ml-7" />
          <h2 className="text-xl font-bold ml-7 text-blue-950">Dashboard</h2>
          <div className="absolute right-1 top-4 bottom-4 w-1 bg-blue-600 rounded"></div>
        </Link>

        <Link href="/courses-info" className="p-6 rounded-lg flex items-center w-[350px] relative group">
          <BookCopy className="h-11 w-11 ml-7 text-white" />
          <h2 className="text-xl font-bold ml-7 text-white">Courses</h2>
          {/* Blue line that appears on hover */}
          <div className="absolute right-1 top-4 bottom-4 w-1 bg-white rounded opacity-0 group-hover:opacity-100 transition-opacity"></div>
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
    <div className="ml-[420px] flex-1 p-10 flex gap-6">
      {/* Left Content */}
      <div className="w-3/5">
        {/* Admin Profile & Search Bar */}
        <div className="fixed right-4 flex items-center space-x-4 mr-5">
        {/* Search Bar */}
        <div className="relative mt-5">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search" 
            className="px-10 py-2 w-96  border border-gray-100 shadow-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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


        <div className="bg-gray-100 rounded-xl p-6 w-full mb-2">
          <h1 className="text-2xl font-semibold text-gray-800">Welcome Back,</h1>
          <h1 className="text-4xl font-bold text-gray-800">{user?.username}</h1>
        </div>

        <div className="rounded-xl p-6 w-full bg-cover bg-center h-60 flex flex-col justify-between ml-6" style={{ backgroundImage: "url('/mtcbuild.png')" }}></div>

       {/* Cards Section */}
        <div className="grid grid-cols-2 gap-8 mt-10 w-full ml-6">
            {/* Assessments Card - Top Left */}
            <div className="bg-white shadow-lg rounded-xl p-4 relative h-48">
              {/* Blue square on the top left */}
              <div className="w-8 h-8 bg-blue-600 rounded-sm absolute top-4 left-4"></div>

              {/* Vertical ellipsis icon on the top right */}
              <button className="absolute top-4 right-4 text-gray-600 hover:text-gray-800">
                <EllipsisVertical className="w-6 h-6" />
              </button>

              <h2 className="text-xl font-semibold ml-16 mb-6 mt-1">Assessments Today</h2>
              <p className="text-6xl font-bold text-gray-900 ml-16 mb-2">{todayAssessmentScheduleCount}</p>
              <p className="text-gray-600 ml-16">scheduled for today</p>
            </div>


            {/* Trainings Card - Top Right */}
            <div className="bg-white shadow-lg rounded-xl p-4 relative h-48">
              {/* Blue square on the top left */}
              <div className="w-8 h-8 bg-blue-600 rounded-sm absolute top-4 left-4"></div>

              {/* Vertical ellipsis icon on the top right */}
              <button className="absolute top-4 right-4 text-gray-600 hover:text-gray-800">
                <EllipsisVertical className="w-6 h-6" />
              </button>

              <h2 className="text-xl font-semibold ml-16 mb-6 mt-1">Trainings Today</h2>
              <p className="text-6xl font-bold text-gray-900 ml-16 mb-2">{todayTrainingScheduleCount}</p>
              <p className="text-gray-600 ml-16">scheduled for today</p>
            </div>

            {/* Enrolled Students Card - Below Assessments */}
            <div className="bg-white shadow-lg rounded-xl p-4 relative h-48">
              <div className="w-8 h-8 bg-blue-600 rounded-sm absolute top-4 left-4"></div>
              <h2 className="text-xl font-semibold ml-16 mb-6 mt-1">Assessors Today</h2>
            </div>

            {/* Upcoming Courses Card - Below Trainings */}
            <div className="bg-white shadow-lg rounded-xl p-4 relative h-48">
              <div className="w-8 h-8 bg-blue-600 rounded-sm absolute top-4 left-4"></div>
              <h2 className="text-xl font-semibold ml-16 mb-6 mt-1">Trainers Today</h2>
            </div>
          </div>
        </div>

      {/* Right Sidebar (Recent Activities) */}
      <div className="w-2/5 bg-white shadow-lg rounded-xl p-6 h-fit ml-6 mt-32">
        {/* Recent Activities Header with Blue Square */}
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-blue-600 rounded-sm mr-3"></div> {/* Blue Square */}
          <h2 className="text-xl font-semibold">Recent Activities</h2>
        </div>

        {/* Recent Activities List */}
        <ul className="space-y-3">
          <li className="flex items-center">
            <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
            <p className="text-gray-800">New student enrolled</p>
          </li>
          <li className="flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
            <p className="text-gray-800">Training scheduled</p>
          </li>
          <li className="flex items-center">
            <span className="w-3 h-3 bg-red-500 rounded-full mr-3"></span>
            <p className="text-gray-800">Assessment results updated</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
  );
}
