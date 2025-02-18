"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import GlobalApi from "@/app/_utils/GlobalApi";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [courseList, setCourseList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [activeTab, setActiveTab] = useState("Dashboard");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courses = await GlobalApi.getCourses();
        setCourseList(courses);
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
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 ml-20 mr-20">
        <Link href={'/'}>
          <div className="flex items-center gap-4">
            <Image 
              src='/mtclogowhite.gif' 
              alt='logo' 
              width={100} 
              height={50} 
              className='cursor-pointer w-full max-w-[50px] sm:max-w-[100px]'
            />
            <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white text-center sm:text-left">
              MECHATRONICS TECHNOLOGIES CORPORATION
            </p>
          </div>
        </Link>
      </div>

      {/* Welcome Admin Message */}
      <div className="ml-20 mt-5">
        <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-400">
          Students Information
        </p>
      </div>

        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center ml-20 mr-20">
          <h2 className="text-xl font-bold">Total Students</h2>
          <p className="text-3xl font-extrabold text-red-600">{studentList.length}</p>
        </div>

      {/* Students Table */}
      <div className="mt-10 ml-20 mr-20 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Students List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border">Unique Learners ID</th>
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Age</th>
                <th className="py-2 px-4 border">Email</th>
              </tr>
            </thead>
            <tbody>
              {studentList.length > 0 ? (
                studentList.map((student) => (
                  <tr key={student.id} className="text-center border-t">
                    <td className="py-2 px-4 border">{student.Unique_Learners_Identifier}</td>
                    <td className="py-2 px-4 border">{student.Students_Name}</td>
                    <td className="py-2 px-4 border">{student.Age}</td>
                    <td className="py-2 px-4 border">{student.Email}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500">No students found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
