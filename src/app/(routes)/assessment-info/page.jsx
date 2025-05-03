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

export default function AssessmentPage() {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);
  const [allAssessmentSchedules, setAllAssessmentSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [startTime, setStartTime] = useState("08:00"); // Default start time
  const [endTime, setEndTime] = useState("17:00");   // Default end time
  const [trainerName, setTrainerName] = useState("N/A"); // Default trainer name
  const router = useRouter();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    setIsLogin(!!sessionStorage.getItem("jwt"));
    setUser(JSON.parse(sessionStorage.getItem("user")));
    setJwt(sessionStorage.getItem("jwt"));

    fetchCourses();
  }, []);

  useEffect(() => {
    fetchAssessments();
  }, []);

  useEffect(() => {
    filterSchedules();
  }, [startDate, endDate, selectedCourse, allAssessmentSchedules]);

  const fetchCourses = async () => {
    try {
      const coursesData = await GlobalApi.getCourses();
      setCourses(coursesData); // <-- Store courses here

      let allAssessments = [];

      coursesData.forEach((course) => {
        if (course.AssessmentSchedule && Array.isArray(course.AssessmentSchedule)) {
          const trainerName = course.trainer ? course.trainer.Name : "N/A";

          course.AssessmentSchedule.forEach((schedule) => {
            allAssessments.push({
              Course_Name: course.Course_Name,
              Type: "Assessment",
              Schedule_date: schedule.Schedule_date,
              Schedule_time: schedule.Schedule_time,
              Trainer_Name: trainerName,
            });
          });
        }
      });

      setAllAssessmentSchedules(allAssessments);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchAssessments = async () => {
    try {
      const Assessments = await GlobalApi.getAssessments(); // Fetch Assessment data
      setAllAssessmentSchedules(Assessments);
      setFilteredSchedules(Assessments); // Show all by default
    } catch (error) {
      console.error("Error fetching Assessments:", error);
    }
  };

  const filterSchedules = () => {
    let filtered = allAssessmentSchedules;

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

  const uniqueCourses = [...new Set(allAssessmentSchedules.map((schedule) => schedule.Course_Name))];

  const onSignOut = () => {
    sessionStorage.clear();
    router.push("/sign-in");
  };

  const handleAddAssessment = async () => {
    if (!courseName || !scheduleDate || !startTime || !endTime) {
      alert("Please fill in all fields before saving.");
      return;
    }

    const newAssessment = {
      Course_ID: courseName, // Assuming you want to store the Course Name as the Course ID
      Course_Name: courseName,
      Schedule_date: scheduleDate,
      Schedule_time: `${startTime} - ${endTime}`,
      Name: trainerName || "N/A", // Use "Name" to match your Strapi field
    };

    try {
      console.log("Sending assessment data:", newAssessment); // Log the data being sent
      const response = await GlobalApi.createAssessment(newAssessment, jwt);
      console.log("Strapi API Response:", response); // Log the entire response

      if (response && response.data) {
        setAllAssessmentSchedules([response.data, ...allAssessmentSchedules]);
        setFilteredSchedules([response.data, ...filteredSchedules]);
        setShowModal(false);
        setCourseName("");
        setScheduleDate("");
        setStartTime("08:00");
        setEndTime("17:00");
        setTrainerName("");
      } else if (response) {
        alert(`Failed to save assessment. Response: ${JSON.stringify(response.data || response.statusText)}`);
      } else {
        alert("Failed to save assessment. No response from the server.");
      }
    } catch (error) {
      console.error("Error saving assessment to Strapi:", error);
      alert(`Failed to save assessment. ${error.message}`); // Display the specific error message
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    const options = { hour: 'numeric', minute: '2-digit', hour12: true };
    return date.toLocaleTimeString('en-US', options).replace(' ', ''); // Remove the space before AM/PM
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
          <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-10">Manage Assessments</h2>
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
                      ? "bg-blue-600 text-white scale-105 shadow-lg"   // Active button style
                      : "bg-gray-300 text-gray-800 hover:bg-blue-500 hover:text-white hover:scale-105"
                    }`}
                  onClick={() => setSelectedCourse(selectedCourse === course ? "" : course)}
                >
                  {course}
                </button>
              ))}
          </div>

          {/* Button for Adding Assessment */}
          <Button
            onClick={() => setShowModal(true)}
            className="mb-4 bg-blue-600 text-white hover:bg-blue-800"
          >
            Add Assessment
          </Button>

          {/* Modal for Adding Assessment */}
          {showModal && (
            <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg w-1/3">
                <h3 className="text-2xl mb-4 font-bold">Add Assessment</h3>

                {/* Modal form */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold">Course Name:</label>
                  <select
                    value={courseName}
                    onChange={(e) => {
                      const selected = e.target.value;
                      setCourseName(selected);
                      const matchedCourse = courses.find(c => c.Course_Name === selected);
                      setTrainerName(matchedCourse?.trainer?.Name || "N/A");
                    }}
                    className="border border-gray-300 p-2 rounded-lg w-full"
                  >
                    <option value="">Select a course</option>
                    {courses.map((course, index) => (
                      <option key={index} value={course.Course_Name}>
                        {course.Course_Name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700  font-semibold">Trainer Name:</label>
                  <select
                    value={trainerName}
                    onChange={(e) => setTrainerName(e.target.value)}
                    className="border border-gray-300 p-2 rounded-lg w-full"
                  >
                    <option value="">Select a Trainer</option>
                    <option value="Marlon">Marlon</option>
                    <option value="Solomon">Solomon</option>
                    <option value="Jerome">Jerome</option>
                    <option value="Joven">Joven</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700  font-semibold">Schedule Date:</label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="border border-gray-300 p-2 rounded-lg w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700  font-semibold">Start Time:</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="border border-gray-300 p-2 rounded-lg w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold">End Time:</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="border border-gray-300 p-2 rounded-lg w-full"
                  />
                </div>

                {/* Save and Close buttons */}
                <div className="flex justify-between">
                  <Button
                    onClick={handleAddAssessment}
                    className="bg-blue-600 text-white hover:bg-blue-800"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => setShowModal(false)}
                    className="bg-gray-300 text-black"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Assessments Table */}
          <table className="table-auto w-full text-left border-collapse rounded-lg overflow-hidden bg-gray-200">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-4">Course Name</th>
                <th className="p-4">Date</th>
                <th className="p-4">Time</th>
                <th className="p-4">Trainer Name</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchedules
                .sort((a, b) => new Date(b.Schedule_date) - new Date(a.Schedule_date)) // Sort latest first
                .map((schedule, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-4">{schedule.Course_Name}</td>
                    <td className="p-4">{formatDate(schedule.Schedule_date)}</td>
                    <td className="p-4">
                      {schedule.Schedule_time.includes('-')
                        ? schedule.Schedule_time.split('-').map(t => formatTime(t.trim())).join(' - ')
                        : `${formatTime(schedule.Schedule_time)} - ${formatTime("17:00")}`}
                    </td>
                    <td className="p-4">{schedule.Trainer_Name}</td>
                    <td className="p-4">
                      <Link href={`/students/${schedule.Course_Name.replace(/ /g, '-')}`}>
                        <Button size="sm" className='bg-blue-600 hover:bg-blue-800'>Manage Students</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}