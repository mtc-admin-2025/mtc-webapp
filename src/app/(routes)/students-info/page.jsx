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
import { 
  CircleUserRound, 
  ChartNoAxesCombined, 
  BookCopy, 
  ClipboardCheck, 
  ClipboardPen, 
  UserRoundSearch,
  Search,
} from "lucide-react";

export default function Home() {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);
  const [studentList, setStudentList] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [todayAssessmentScheduleCount, setTodayAssessmentScheduleCount] = useState(0);
  const [todayTrainingScheduleCount, setTodayTrainingScheduleCount] = useState(0);
  const router = useRouter();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setIsLogin(sessionStorage.getItem("jwt") ? true : false);
    setUser(JSON.parse(sessionStorage.getItem("user")));
    setJwt(sessionStorage.getItem("jwt"));

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

    fetchStudents();
    fetchCourses();
  }, []);


  const fetchCourses = async () => {
    try {
      const courses = await GlobalApi.getCourses();
      setCourseList(courses);

      const today = getTodayDate();
      let trainingCount = 0;
      let assessmentCount = 0;

      courses.forEach((course) => {
        if (course.TrainingSchedule) {
          trainingCount += course.TrainingSchedule.filter(
            (schedule) => schedule.Schedule_date && parseScheduleDate(schedule.Schedule_date) === today
          ).length;
        }

        if (course.AssessmentSchedule) {
          assessmentCount += course.AssessmentSchedule.filter(
            (schedule) => schedule.Schedule_date && parseScheduleDate(schedule.Schedule_date) === today
          ).length;
        }
      });

      setTodayTrainingScheduleCount(trainingCount);
      setTodayAssessmentScheduleCount(assessmentCount);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const onSignOut = () => {
    sessionStorage.clear();
    router.push("/sign-in");
  };

  const filteredStudents = studentList.filter(student =>
    student.Unique_Learners_Identifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.Students_Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.Email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
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

      <Link href="/courses-info" className="p-6 rounded-lg flex items-center w-[350px] relative group">
          <BookCopy className="h-11 w-11 ml-7 text-white" />
          <h2 className="text-xl font-bold ml-7 text-white">Courses</h2>
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

        <Link href="/students-info" className="bg-white p-6 rounded-lg flex items-center w-[350px] relative">
          <UserRoundSearch className="text-blue-950 h-11 w-11 ml-7" />
          <h2 className="text-xl font-bold ml-7 text-blue-950">Students</h2>
          <div className="absolute right-1 top-4 bottom-4 w-1 bg-blue-600 rounded"></div>
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

      <div className="bg-white rounded-xl shadow-lg p-6 w-3/4">
        <h1 className="text-2xl font-semibold text-gray-800">Welcome Back,</h1>
        <h1 className="text-4xl font-bold text-gray-800">{user?.username}</h1>
           {/* Header Section with Manage Courses, Search Bar & Add Course Button */}
  <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-20 flex items-center justify-between">
  Manage Students
  <div className="flex items-center gap-x-2"> 
    {/* 🔍 Search Bar */}
    <div className="relative w-60 mt-3"> {/* ✅ Ensures correct positioning */}
  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
  <input
    type="text"
    placeholder="Search Student/s"
    className="border border-gray-300 pl-10 p-1 text-sm h-10 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
</div>
  </div>
</h2>


  {/* 📋 Students Table */}
  <table className="table-auto w-full text-left border-collapse rounded-lg overflow-hidden bg-gray-200">
    <thead className="bg-blue-600 text-white">
      <tr>
        <th className="p-4 text-sm font-semibold">Unique Learners ID</th>
        <th className="p-4 text-sm font-semibold">Name</th>
        <th className="p-4 text-sm font-semibold">Contact Number</th>
        <th className="p-4 text-sm font-semibold">Email</th>
        <th className="p-4 text-sm font-semibold">Address</th>
        <th className="p-4 text-sm font-semibold"></th>
      </tr>
    </thead>
    <tbody>
      {filteredStudents.length > 0 ? (
        filteredStudents.map((student, index) => (
          <tr key={index} className="border-t">
            <td className="p-4">{student.Unique_Learners_Identifier}</td>
            <td className="p-4">{student.Students_Name}</td>
            <td className="p-4">{student.Contact_Number}</td>
            <td className="p-4">{student.Email}</td>
            <td className="p-4">{student.Address}</td>
            <td className="p-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => setSelectedStudent(student)}
              >
                View Details
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="6" className="p-4 text-center">No students found.</td>
        </tr>
      )}
    </tbody>
  </table>
</div>

{selectedStudent && (
<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
  <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl w-full">
    <h2 className="text-3xl font-bold text-gray-700 mb-6 text-center">Student Details</h2>
    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
      <div className="border-b pb-2">
        <span className="block text-gray-600 font-semibold">Unique Learners Identifier</span>
        <span className="text-gray-800">{selectedStudent.Unique_Learners_Identifier || "N/A"}</span>
      </div>
      <div className="border-b pb-2">
        <span className="block text-gray-600 font-semibold">Name</span>
        <span className="text-gray-800">{selectedStudent.Students_Name || "N/A"}</span>
      </div>
      <div className="border-b pb-2">
        <span className="block text-gray-600 font-semibold">Contact Number</span>
        <span className="text-gray-800">{selectedStudent.Contact_Number || "N/A"}</span>
      </div>
      <div className="border-b pb-2">
        <span className="block text-gray-600 font-semibold">Email</span>
        <span className="text-gray-800">{selectedStudent.Email || "N/A"}</span>
      </div>
      <div className="border-b pb-2 col-span-2">
        <span className="block text-gray-600 font-semibold">Address</span>
        <span className="text-gray-800">{selectedStudent.Address || "N/A"}</span>
      </div>
    </div>
    <button
      className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-md transition"
      onClick={() => setSelectedStudent(null)}
    >
      Close
    </button>
  </div>
</div>
      )}</div>
</div>
  );
}