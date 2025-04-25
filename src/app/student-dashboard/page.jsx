"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import GlobalApi from '@/app/_utils/GlobalApi';
import Link from 'next/link';
import TrainingList from "../_components/TrainingList";
import CourseList from "../_components/CourseList";
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
import { 
  CircleUserRound, 
  ChartNoAxesCombined, 
  BookCopy, 
  ClipboardCheck, 
  ClipboardPen, 
  UserRound,
  UsersRound,
  Search,
  EllipsisVertical,
} from "lucide-react";


export default function Home() {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);
  const router = useRouter();
  const [time, setTime] = useState("");


const [assessmentList, setAssessmentList] = useState([]);
const [trainingList, setTrainingList] = useState([]);


useEffect(() => {
  const fetchAssessments = async () => {
    try {
      if (!jwt || !user) return;

      const assessments = await GlobalApi.getAssessments(jwt);

      console.log("Fetched assessments:", assessments);

      // Filter assessments based on the user ID instead of email
      const userAssessments = assessments.filter(
        (a) => a?.users_permissions_user?.id === user.id
      );

      console.log("Filtered user assessments:", userAssessments);

      setAssessmentList(userAssessments);
    } catch (error) {
      console.error("Error fetching assessments:", error);
    }
  };

  fetchAssessments();
}, [jwt, user]);

useEffect(() => {
  const fetchTrainings = async () => {
    try {
      if (!jwt || !user) return;

      const trainings = await GlobalApi.getTrainings(jwt);

      console.log("Fetched trainings:", trainings);

      // Filter trainings based on the user ID instead of email
      const userTrainings = trainings.filter(
        (a) => a?.users_permissions_user?.id === user.id
      );

      console.log("Filtered user trainings:", userTrainings);

      setTrainingList(userTrainings);
    } catch (error) {
      console.error("Error fetching trainings:", error);
    }
  };

  fetchTrainings();
}, [jwt, user]);

  useEffect(() => {
      setIsLogin(sessionStorage.getItem('jwt') ? true : false);
      setUser(JSON.parse(sessionStorage.getItem('user')));
      setJwt(sessionStorage.getItem('jwt'));
  }, []);

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }));
    };

    updateTime(); // Set initial time
    const interval = setInterval(updateTime, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const onSignOut = () => {
      sessionStorage.clear();
      router.push('/sign-in');
  };

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
<div className="min-h-screen flex bg-[url('/banner.png')] bg-cover bg-center w-full p-10">
      {/* Admin Sidebar */}
      <div className="fixed top-0 left-0 bg-[#091d41] p-6 rounded-3xl shadow-lg w-fit flex flex-col gap-6 mt-8 mx-7 h-full max-h-[calc(100vh-4rem)]">
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
          <Link href="/student-dashboard" className="bg-white p-6 rounded-lg flex items-center w-[350px] relative">
            <ChartNoAxesCombined className="text-blue-950 h-11 w-11 ml-7" />
            <h2 className="text-xl font-bold ml-7 text-blue-950">Dashboard</h2>
            <div className="absolute right-1 top-4 bottom-4 w-1 bg-[#091d41] rounded"></div>
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
  
          <Link href="/my-profile" className="p-6 rounded-lg flex items-center w-[350px] relative group">
            <UserRound className="h-11 w-11 ml-7 text-white" />
            <h2 className="text-xl font-bold ml-7 text-white">My Account</h2>
            <div className="absolute right-1 top-4 bottom-4 w-1 bg-white rounded opacity-0 group-hover:opacity-100 transition-opacity"></div>
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
   {/* Current Time (Client-Side) */}
<div className="text-lg text-center text-white font-bold">{time}</div>
        </div>
  
        {/* Main Content */}
        <main className="ml-[400px] ">
  <div className="flex justify-between items-center w-full px-8">
    
    {/* Other Left-Side Content (if any) */}
    <div></div> 
    
    {/* Right-Side Content (User Profile Dropdown) */}
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex flex-col items-center cursor-pointer ml-auto"> {/* <-- Added ml-auto */}
          <CircleUserRound className="rounded-full text-white h-16 w-16" />
          <span className="text-slate-200 text-xl font-bold">{user?.username}</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {user?.username === "admin" && (
          <Link href="/admin-dashboard">
            <DropdownMenuItem>Dashboard</DropdownMenuItem>
          </Link>
        )}
        <Link href="/my-profile">
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </Link>
        <DropdownMenuItem onClick={onSignOut}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>

  <section className="flex flex-col md:flex-row justify-between mt-24 ml-5 gap-10">
  {/* Image Section */}
  <div className="flex-shrink-0">
    <Image
      src="/MTCCOVER.png"
      alt="logo"
      width={1500}
      height={500}
      className="cursor-pointer w-full max-w-[500px] sm:max-w-[1000px] rounded-lg"
    />
  </div>

  <section className="ml-5 mr-10">
  <div className="flex space-x-8"> {/* Flex container for two columns (Assessments & Trainings) */}
    
    {/* Enrolled Assessments Section */}
    <div className="flex-grow w-full md:w-1/2">
  <h1 className="text-white font-bold text-4xl mt-3">Enrolled Assessments</h1>
  <div className="grid grid-cols-1 gap-6 mt-5">
    {assessmentList.length > 0 ? (
      assessmentList.map((item, index) => (
        <div
          key={index}
          className="bg-gradient-to-r from-blue-950 to-blue-900 rounded-xl p-6 shadow-lg flex flex-col hover:scale-105 transform transition duration-300"
        >
          <p className="text-xl font-extrabold text-white ">
            {item.Course_Name}
          </p>
          <p className="text-xl font-extrabold text-white mb-4">
            {item.NCtier}
          </p>
          <p className="text-md text-gray-200 font-medium mb-1">
            <span className="font-bold">{item.Schedule}</span> 
          </p>
          <p className="text-md text-gray-200">
            <span className="font-bold">Status:</span> {item.Confirmed ? item.Confirmed : "Pending"}
          </p>
        </div>
      ))
    ) : (
      <p className="text-white">You are not enrolled in any assessments yet.</p>
    )}
  </div>
</div>

    {/* Enrolled Trainings Section */}
    <div className="flex-grow w-full md:w-1/2">
  <h1 className="text-white font-bold text-4xl mt-3">Enrolled Trainings</h1>
  <div className="grid grid-cols-1 gap-6 mt-5">
    {trainingList.length > 0 ? (
      trainingList.map((item, index) => (
        <div
          key={index}
          className="bg-gradient-to-r from-blue-950 to-blue-900 rounded-xl p-6 shadow-lg flex flex-col hover:scale-105 transform transition duration-300"
        >
          <p className="text-xl font-extrabold text-white ">
            {item.Course_Name}
          </p>
          <p className="text-xl font-extrabold text-white mb-4">
            {item.NCtier}
          </p>
          <p className="text-md text-gray-200 font-medium mb-1">
            <span className="font-bold">{item.Schedule}</span> 
          </p>
          <p className="text-md text-gray-200">
            <span className="font-bold">Status:</span> {item.Confirmed ? item.Confirmed : "Pending"}
          </p>
        </div>
      ))
    ) : (
      <p className="text-white">You are not enrolled in any trainings yet.</p>
    )}
  </div>
</div>


  </div>
</section>

</section>
</main>
      </div>
    );
  }