"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GlobalApi from "@/app/_utils/GlobalApi";
import {
    CircleUserRound,
    ChartNoAxesCombined,
    BookCopy,
    ClipboardCheck,
    ClipboardPen,
    UserRoundSearch,
} from "lucide-react";

export default function StudentsPage({ params }) {
    const [isLogin, setIsLogin] = useState(false);
    const [user, setUser] = useState(null);
    const router = useRouter();
    const { courseName } = params;
    const [studentsData, setStudentsData] = useState([]); // Store all assessment data
    const [filteredStudents, setFilteredStudents] = useState([]); // Store filtered students
    const [updateError, setUpdateError] = useState(null); // State to handle update errors
    const [updateSuccess, setUpdateSuccess] = useState(null); // State for successful updates

    useEffect(() => {
        setIsLogin(!!sessionStorage.getItem("jwt"));
        setUser(JSON.parse(sessionStorage.getItem("user")));
        fetchAssessments(); // Fetch all assessment data
    }, []);

    useEffect(() => {
        console.log("Fetched students data:", studentsData);
    }, [studentsData]);
    

    useEffect(() => {
        // Filter students when the raw data or courseName changes
        const courseToFilter = courseName.replace(/-/g, ' ');
        const filtered = studentsData.filter(
            (assessment) =>
                (assessment?.Course_Name === courseToFilter || assessment?.attributes?.Course_Name === courseToFilter) &&
                assessment?.Students_Name // Ensure there's a student name to avoid empty rows
        );
        setFilteredStudents(filtered);
    }, [studentsData, courseName]);

    const fetchAssessments = () => {
        const jwt = sessionStorage.getItem("jwt");
        if (!jwt) return;
    
        GlobalApi.getAssessments(jwt)
            .then((data) => {
                setStudentsData(data);
            })
            .catch((error) => {
                console.error("Error fetching assessments:", error);
            });
    };
    
    const updateAssessmentStatus = async (assessmentId, status, studentName) => {
        const jwt = sessionStorage.getItem("jwt");
        if (!jwt) {
            setUpdateError("You must be logged in to update status.");
            return;
        }
    
        try {
            const payload = {
                data: {
                    Confirmed: status,
                },
            };
            await GlobalApi.updateAssessmentStatus(assessmentId, payload, jwt); // Pass the payload correctly
            setUpdateSuccess(`Successfully updated ${studentName}'s status to ${status}.`);
            setUpdateError(null);
            fetchAssessments();
        } catch (error) {
            console.error("Error updating status:", error);
            setUpdateError(`Failed to update ${studentName}'s status. Please try again.`);
            setUpdateSuccess(null);
        }
    };
    
    
    const onSignOut = () => {
        sessionStorage.clear();
        router.push("/sign-in");
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar (Fixed) */}
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

                    <Link href="/assessment-info" className="bg-white p-6 rounded-lg flex items-center w-[350px] relative">
                        <ClipboardCheck className="text-blue-950 h-11 w-11 ml-7" />
                        <h2 className="text-xl font-bold ml-7 text-blue-950">Assessments</h2>
                        <div className="absolute right-1 top-4 bottom-4 w-1 bg-blue-600 rounded"></div>
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
            <div className="ml-[420px] flex-1 p-10 mt-6">
                {/* Admin Profile & Search Bar (if needed on this page) */}
                <div className="fixed right-4 flex items-center space-x-4 mr-5">
                    {/* Profile Icon */}
                    <div className="flex flex-col items-center mt-5 mr-5">
                        <CircleUserRound className="p-2 rounded-full cursor-pointer text-blue-900 h-16 w-16" />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Students for Course: {courseName.replace(/-/g, ' ')}</h2>
                    {updateError && (
                        <div className="bg-red-200 text-red-800 p-3 rounded mb-4">
                            {updateError}
                        </div>
                    )}
                    {updateSuccess && (
                        <div className="bg-green-200 text-green-800 p-3 rounded mb-4">
                            {updateSuccess}
                        </div>
                    )}
                    {filteredStudents.length > 0 ? (
                        <table className="table-auto w-full text-left border-collapse rounded-lg overflow-hidden bg-gray-200">
                            <thead className="bg-blue-600 text-white">
                                <tr>
                                    <th className="p-4">Student Name</th>
                                    <th className="p-4">Student Email</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Actions</th> {/* New Actions Column */}
                                    {/* Add more relevant columns */}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map((assessment) => (
                                    <tr key={assessment.id} className="border-t">
                                        <td className="p-4">{assessment?.Students_Name || assessment?.attributes?.Students_Name}</td>
                                        <td className="p-4">{assessment?.Students_Email || assessment?.attributes?.Students_Email}</td>
                                        <td className="p-4">{assessment?.Confirmed || assessment?.attributes?.Confirmed}</td>
                                        <td className="p-4">
                                            <Button
                                                size="sm"
                                                className="bg-green-500 hover:bg-green-600 text-white mr-2"
                                                onClick={() => {
                                                    console.log("Updating Confirmed for ID:", assessment.id, "Name:", assessment?.Students_Name || assessment?.attributes?.Students_Name);
                                                    const studentName = assessment?.Students_Name || assessment?.attributes?.Students_Name;
                                                    updateAssessmentStatus(assessment.id, "Confirmed", studentName);
                                                }}
                                            >
                                                Confirm
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="bg-red-500 hover:bg-red-600 text-white"
                                                onClick={() => {
                                                    console.log("Updating Rejected for ID:", assessment.id, "Name:", assessment?.Students_Name || assessment?.attributes?.Students_Name);
                                                    const studentName = assessment?.Students_Name || assessment?.attributes?.Students_Name;
                                                    updateAssessmentStatus(assessment.id, "Rejected", studentName);
                                                }}
                                            >
                                                Reject
                                            </Button>
                                        </td>
                                        {/* Add more relevant data cells */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No students found for this course.</p>
                    )}
                </div>
            </div>
        </div>
    );
}