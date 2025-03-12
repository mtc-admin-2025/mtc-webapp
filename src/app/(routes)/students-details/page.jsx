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
  const [selectedStudent, setSelectedStudent] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setIsLogin(sessionStorage.getItem("jwt") ? true : false);
    setUser(JSON.parse(sessionStorage.getItem("user")));
    setJwt(sessionStorage.getItem("jwt"));

    const fetchStudents = async () => {
      try {
        const students = await GlobalApi.getStudents();
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
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 ml-20 mr-24 justify-between">
        <Link href={"/admin-dashboard"} className="flex items-center gap-4">
          <Image src="/mtclogowhite.gif" alt="logo" width={100} height={50} className="cursor-pointer w-full max-w-[50px] sm:max-w-[100px]" />
          <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white">MECHATRONICS TECHNOLOGIES CORPORATION</p>
        </Link>
      </div>

      <div className="ml-20 mt-5">
        <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-400">Students Information</p>
      </div>

      <div className="flex flex-row justify-between p-6 ml-20 mr-20 gap-10">
        <div className="bg-gray-200 p-6 rounded-lg shadow-lg w-5/6">
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
                    <tr
                      key={student.id}
                      className="text-center border-t cursor-pointer hover:bg-blue-400"
                      onClick={() => setSelectedStudent(student)}
                    >
                      <td className="py-2 px-4 border">{student.Unique_Learners_Identifier}</td>
                      <td className="py-2 px-4 border">{student.Students_Name}</td>
                      <td className="py-2 px-4 border">{student.Contact_Number}</td>
                      <td className="py-2 px-4 border">{student.Email}</td>
                      <td className="py-2 px-4 border">{student.Address}</td>
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

      {selectedStudent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Student Details</h2>
            <p><strong>ID:</strong> {selectedStudent.Unique_Learners_Identifier}</p>
            <p><strong>Name:</strong> {selectedStudent.Students_Name}</p>
            <p><strong>Contact:</strong> {selectedStudent.Contact_Number}</p>
            <p><strong>Email:</strong> {selectedStudent.Email}</p>
            <p><strong>Address:</strong> {selectedStudent.Address}</p>
            <Button className="mt-4 w-full bg-red-500" onClick={() => setSelectedStudent(null)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
}
