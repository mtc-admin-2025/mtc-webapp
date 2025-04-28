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
  User,
} from "lucide-react";

export default function Home() {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);
  const [trainers, setTrainers] = useState([]);  // State for trainers
  const router = useRouter();
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  

  useEffect(() => {
    setIsLogin(sessionStorage.getItem("jwt") ? true : false);
    setUser(JSON.parse(sessionStorage.getItem("user")));
    setJwt(sessionStorage.getItem("jwt"));

    const getTodayDate = () => {
      return new Date().toLocaleDateString("en-CA"); // e.g., "2025-03-13"
    };

    const fetchTrainers = async () => {
      try {
        const trainersData = await GlobalApi.getTrainers(jwt);  // Fetch the trainers from API
        console.log("Trainers data:", trainersData);  // Log to verify
        setTrainers(trainersData);  // Update the state with the trainers data
        setLoading(false);
      } catch (err) {
        console.error("Error fetching trainers:", err);
        setError("Error fetching trainers");
        setLoading(false);
      }
    };

    if (jwt) {
      fetchTrainers();  // Call the function if JWT exists
    }
  }, [jwt]);

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
            <h2 className="text-xl font-bold ml-7 text-blue-950">Trainers</h2>
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

          <div>
  <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-10">Manage Trainers</h2>
  {loading ? (
    <p>Loading trainers...</p>
  ) : error ? (
    <p>{error}</p>
  ) : trainers.length === 0 ? (
    <p>No trainers available.</p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {trainers.map((trainer) => (
        <div key={trainer.id} className="bg-gray-200 rounded-xl shadow-xl p-6 flex items-center">
          {/* Trainer Image (on the left side) */}
          <div className="flex-shrink-0 mr-6 mb-20">
            <img
              src="/user.jpg" // Replace with the correct path to the image
              alt="Trainer"
              className="rounded-full w-24 h-24 object-cover" // Adjust size as needed
            />
          </div>

          {/* Trainer Details (on the right side) */}
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800">{trainer.Name}</h3>
            <p className="text-gray-600">Trainer ID: {trainer.Trainer_ID}</p>
            <p className="text-gray-600">Employed since: {trainer.Date_Employed}</p>
            <p className="text-gray-600">Specialization: {trainer.Specializations}</p>

            {/* Star Rating */}
            <div className="flex mt-2">
              {Array.from({ length: 5 }, (_, index) => (
                <span key={index}>
                  {index < trainer.Rating ? (
                    <span className="text-yellow-400 text-3xl">★</span> // Filled star
                  ) : (
                    <span className="text-gray-300 text-3xl">★</span> // Empty star
                  )}
                </span>
              ))}
            </div>

            <div className="mt-4">
            <Button className="w-full bg-blue-600 hover:bg-blue-800 transition-colors duration-300">
  View Profile
</Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>


        </div>
      </div>
    </div>
  );
}
