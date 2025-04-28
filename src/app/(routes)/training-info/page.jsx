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

export default function TrainingPage() {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);
  const [allTrainingSchedules, setAllTrainingSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const router = useRouter();

  useEffect(() => {
    setIsLogin(!!sessionStorage.getItem("jwt"));
    setUser(JSON.parse(sessionStorage.getItem("user")));
    setJwt(sessionStorage.getItem("jwt"));

    fetchCourses();
  }, []);


  useEffect(() => {
    fetchTrainings();
  }, []);

  useEffect(() => {
    filterSchedules();
  }, [startDate, endDate, selectedCourse, allTrainingSchedules]);

  const fetchCourses = async () => {
    try {
      const courses = await GlobalApi.getCourses();
      let allTrainings = [];

      courses.forEach((course) => {
        if (course.TrainingSchedule) {
          const trainerName = course.trainer ? course.trainer.Name : "N/A";

          course.TrainingSchedule.forEach((schedule) => {
            allTrainings.push({
              Course_Name: course.Course_Name,
              Type: "Training",
              Schedule_date: schedule.Schedule_date,
              Schedule_time: schedule.Schedule_time,
              Trainer_Name: trainerName,
            });
          });
        }
      });

      setAllTrainingSchedules(allTrainings);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchTrainings = async () => {
    try {
      const trainings = await GlobalApi.getTrainings(); // Fetch training data
      setAllTrainingSchedules(trainings);
      setFilteredSchedules(trainings); // Show all by default
    } catch (error) {
      console.error("Error fetching trainings:", error);
    }
  };

  const filterSchedules = () => {
    let filtered = allTrainingSchedules;

    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      filtered = filtered.filter((schedule) => {
        const scheduleDate = new Date(schedule.Schedule_date);
        if (start && end) return scheduleDate >= start && scheduleDate <= end;
        if (start) return scheduleDate.toDateString() === start.toDateString();
        if (end) return scheduleDate.toDateString() === end.toDateString();
        return true;
      });
    }

    if (selectedCourse) {
      filtered = filtered.filter((schedule) => schedule.Course_Name === selectedCourse);
    }

    setFilteredSchedules(filtered);
  };

  const uniqueCourses = [...new Set(allTrainingSchedules.map((schedule) => schedule.Course_Name))];

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

          <Link href="/training-info" className="bg-white p-6 rounded-lg flex items-center w-[350px] relative">
            <ClipboardPen className="text-blue-950 h-11 w-11 ml-7" />
            <h2 className="text-xl font-bold ml-7 text-blue-950">Trainings</h2>
            <div className="absolute right-1 top-4 bottom-4 w-1 bg-blue-600 rounded"></div>
          </Link>

          <Link href="/students-info" className="p-6 rounded-lg flex items-center w-[350px] relative group">
            <UserRoundSearch className="h-11 w-11 ml-7 text-white" />
            <h2 className="text-xl font-bold ml-7 text-white">Trainers</h2>
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
          <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-10">Manage Trainings</h2>
{/* Date Filter */}
<div className="flex items-center gap-4 mb-6">
        <label className="text-lg font-semibold text-gray-700">Filter by Date:</label>
        <input
          type="date"
          className="border border-gray-300 p-2 rounded-lg"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <span className="text-lg font-semibold text-gray-700">to</span>
        <input
          type="date"
          className="border border-gray-300 p-2 rounded-lg"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

  {uniqueCourses
    .sort((a, b) => a.localeCompare(b)) // Sort courses alphabetically
    .map((course, index) => (
      <button
        key={index}
        className={`px-5 py-2 rounded-lg font-semibold shadow-md transition-all duration-300 ease-in-out transform 
          ${selectedCourse === course 
            ? "bg-blue-600 text-white scale-105 shadow-lg"  // Active button style
            : "bg-gray-300 text-gray-800 hover:bg-blue-500 hover:text-white hover:scale-105"
          }`}
        onClick={() => setSelectedCourse(selectedCourse === course ? "" : course)}
      >
        {course}
      </button>
    ))}
</div>


      {/* Trainings Table */}
      <table className="table-auto w-full text-left border-collapse rounded-lg overflow-hidden bg-gray-200">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="p-4">Course Name</th>
            <th className="p-4">Schedule Date</th>
            <th className="p-4">Schedule Time</th>
            <th className="p-4">Trainer Name</th>
          </tr>
        </thead>
        <tbody>
          {filteredSchedules
            .sort((a, b) => new Date(b.Schedule_date) - new Date(a.Schedule_date)) // Sort latest first
            .map((schedule, index) => (
              <tr key={index} className="border-t">
                <td className="p-4">{schedule.Course_Name}</td>
                <td className="p-4">{schedule.Schedule_date}</td>
                <td className="p-4">{schedule.Schedule_time}</td>
                <td className="p-4">{schedule.Trainer_Name}</td>
              </tr>
            ))}
        </tbody>
      </table>
        </div>
    </div>
  </div>
  );
}
