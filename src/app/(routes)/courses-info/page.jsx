"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import GlobalApi from "@/app/_utils/GlobalApi";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";
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
  CircleX,
} from "lucide-react";

export default function CoursesPage() {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);
  const [courseList, setCourseList] = useState([]);
  const [trainerList, setTrainerList] = useState([]);
  const router = useRouter();
  const [newCourse, setNewCourse] = useState({
    Course_ID: "",
    Course_Name: "",
  });
  const [newTrainerId, setNewTrainerId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");


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

  const handleCreateCourse = async () => {
    if (!newCourse.Course_ID || !newCourse.Course_Name || !newTrainerId) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const response = await GlobalApi.createCourse(
        { 
          Course_ID: newCourse.Course_ID, 
          Course_Name: newCourse.Course_Name, 
          trainer: newTrainerId 
        }, 
        jwt
      );

      if (response) {
        toast.success("Course added successfully!", {
          duration: 3000, // Toast disappears after 3 seconds
        });

        setCourseList([...courseList, response.data]); // Update UI immediately
        setIsModalOpen(false);
        setNewCourse({ Course_ID: "", Course_Name: "" });
        setNewTrainerId("");
      }
    } catch (error) {
      console.error("Error adding course:", error);
      toast.error("Failed to add course.");
    }
  };
  
  const handleDeleteCourse = async (courseId) => {
    try {
        console.log(`Deleting course with ID: ${courseId}`);

        const courseToDelete = courseList.find(course => course.Course_ID === courseId);
        if (!courseToDelete) {
            toast.error("Course not found!");
            return;
        }

        // Call the delete function from GlobalApi
        const success = await GlobalApi.deleteCourse(courseToDelete.id, jwt);

        if (success) {
            setCourseList(prev => prev.filter(course => course.id !== courseToDelete.id));
            toast.success("Course deleted successfully!");
        } else {
            toast.error("Failed to delete course.");
        }
    } catch (error) {
        console.error("Error in handleDeleteCourse:", error);
        toast.error("Failed to delete course.");
    }
};


  const filteredCourses = courseList.filter((course) =>
    course?.Course_ID?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    course?.Course_Name?.toLowerCase().includes(searchQuery.toLowerCase())
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

  {/* Header Section with Manage Courses, Search Bar & Add Course Button */}
  <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-20 flex items-center justify-between">
  Manage Courses
  <div className="flex items-center gap-x-2"> 
    {/* 🔍 Search Bar */}
    <div className="relative w-60 mt-3"> {/* ✅ Ensures correct positioning */}
  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
  <input
    type="text"
    placeholder="Search Course ID/Name"
    className="border border-gray-300 pl-10 p-1 text-sm h-10 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
</div>


    {/* ➕ Add Course Button */}
    <button 
      className="bg-gradient-to-r from-blue-600 to-blue-500 text-white text-lg font-semibold px-6 py-3 ml-2 rounded-xl shadow-md transform transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-blue-600 hover:shadow-lg"
      onClick={() => setIsModalOpen(true)}
    >
      + Add Course
    </button>
  </div>
</h2>


  {/* 📋 Course Table */}
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
      {filteredCourses.length > 0 ? (
        filteredCourses.map((course, index) => {
          if (!course || !course.Course_ID) return null; // ✅ Prevents the error
          const trainer = trainerList.find((trainer) => trainer.id === course?.trainer?.id);

          return (
            <tr key={index} className="border-t-2">
              <td className="p-4 rounded-bl-xl">{course.Course_ID}</td>
              <td className="p-4">{course.Course_Name}</td>
              <td className="p-4">{trainer ? trainer.Name : "N/A"}</td>
              <td className="p-4 rounded-br-xl text-center">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  onClick={() => {
                    setSelectedCourse(course); // Set the selected course details
                    setIsDetailsModalOpen(true); // Open the modal
                  }}
                >
                  Manage Details
                </button>
              </td>
            </tr>
          );
        })
      ) : (
        <tr>
          <td colSpan={4} className="p-4 text-center">No courses found</td>
        </tr>
      )}
    </tbody>
  </table>
</div>

      </div>
      {/* Add Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg w-[400px] overflow-hidden">
          {/* Full-width Blue Header */}
          <div className="bg-blue-600 w-full py-4 text-center">
            <h2 className="text-2xl font-bold text-white">Add New Course</h2>
          </div>
      
          {/* Form Fields */}
          <div className="p-6 flex flex-col gap-4">
            <input 
              type="text" 
              placeholder="Course ID" 
              className="p-2 border rounded-md w-full" 
              onChange={(e) => setNewCourse({...newCourse, Course_ID: e.target.value})} 
            />
            <input 
              type="text" 
              placeholder="Course Name" 
              className="p-2 border rounded-md w-full" 
              onChange={(e) => setNewCourse({...newCourse, Course_Name: e.target.value})} 
            />

<select 
  className="p-2 border rounded-md w-full"
  onChange={(e) => setNewTrainerId(e.target.value)}
  value={newTrainerId}
>
  <option value="">Select Trainer</option>
  {trainerList.map((trainer) => (
    <option key={trainer.id} value={trainer.id}>
      {trainer.Name}
    </option>
  ))}
</select>

      
            {/* Buttons */}
            <div className="flex justify-between mt-4">
              <button 
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                onClick={handleCreateCourse}
              >
                Submit
              </button>
              <button 
                className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 transition"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      
        )}

{isDetailsModalOpen && selectedCourse && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-xl shadow-lg p-6 w-[400px]">
      {/* Modal Header */}
      <div className="flex justify-between items-center border-b pb-3">
        <h2 className="text-2xl font-bold text-gray-800">Course Details</h2>
        <button
          onClick={() => setIsDetailsModalOpen(false)}
          className="text-gray-600 hover:text-gray-800"
        >
          <CircleX className="text-red-600 h-8 w-8" />
        </button>
      </div>

      {/* Course Information */}
      <div className="mt-4">
        <p><strong>Course ID:</strong> {selectedCourse.Course_ID}</p>
        <p><strong>Course Name:</strong> {selectedCourse.Course_Name}</p>
        <p><strong>Trainer:</strong> {selectedCourse.trainer ? selectedCourse.trainer.Name : "N/A"}</p>
      </div>

      <button
  className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg w-full hover:bg-red-700 transition"
  onClick={() => handleDeleteCourse(selectedCourse.Course_ID)}
>
  Delete Course
</button>
    </div>
  </div>
)}

    </div>
  );
}
