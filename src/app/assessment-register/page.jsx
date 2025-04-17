"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from 'next/link';
import { useEffect, useState } from "react";
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from 'next/navigation';
import { CircleUserRound } from 'lucide-react';
import GlobalApi from "../_utils/GlobalApi";
import { toast } from 'sonner'; 

export default function Home() {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);
  const router = useRouter();

  
  const [address, setAddress] = useState(""); 
  const [addressSuggestions, setAddressSuggestions] = useState([]); 
  const [isAddressSuggestionsVisible, setIsAddressSuggestionsVisible] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState("");
  const [privacyConsent, setPrivacyConsent] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [first_name, setFirstName] = useState("");
const [middle_name, setMiddleName] = useState("");
const [last_name, setLastName] = useState("");
const [suffix, setSuffix] = useState("");
const [mother_name, setMotherName] = useState("");
const [father_name, setFatherName] = useState("");
const [contact_number, setContact] = useState("");
const [birthdate, setBirthdate] = useState("");
const [birthplace, setBirthplace] = useState("");
const [sex, setSex] = useState("");
const [civil_status, setCivilStatus] = useState("");
const [employment, setEmployment] = useState("");
const [educational_attainment, setEducationalAttainment] = useState("");
const [age, setAge] = useState("");
const [picture, setPicture] = useState(null);
const [signature, setSignature] = useState(null);

const [courses, setCourses] = useState([]);  // State for courses
const [selectedCourse, setSelectedCourse] = useState(""); // State for selected course

useEffect(() => {
  const fetchCourses = async () => {
    try {
      const courseData = await GlobalApi.getCourses();
      setCourses(courseData);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  fetchCourses();
}, []);

useEffect(() => {
  const storedUser = JSON.parse(sessionStorage.getItem("user"));
  const storedJwt = sessionStorage.getItem("jwt");

  if (storedJwt) {
    setIsLogin(true);
    setUser(storedUser);
    setJwt(storedJwt);
  }

  console.log("Stored user:", storedUser); // Add this for debugging
}, []);

  
  
  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setAddress(user.address || "");
      setBirthdate(user.birthdate || "");
      setAge(user.age || "");
      setSelectedCourse(user.selectedCourse || "");
      setSelectedScholarship(user.selectedScholarship || "");
      setSex(user.sex || "");
      setEmployment(user.employment || "");
      setEducationalAttainment(user.educational_attainment || "");
      setBirthplace(user.birthplace || "");
      setContact(user.contact_number || "");
      setFirstName(user.first_name || "");
      setMiddleName(user.middle_name || "");
      setLastName(user.last_name || "");
      setSuffix(user.suffix || "");
      setMotherName(user.mother_name || "");
      setFatherName(user.father_name || "");
      setPicture(user.picture || "");
      setSignature(user.signature || "");
      setCivilStatus(user.civil_status|| "");
    }
  }, [user]);
  
  useEffect(() => {
    if (birthdate) {
      const birthDate = new Date(birthdate);
      const currentDate = new Date();

      const calculatedAge = currentDate.getFullYear() - birthDate.getFullYear();
      const monthDifference = currentDate.getMonth() - birthDate.getMonth();
      const dayDifference = currentDate.getDate() - birthDate.getDate();

      const finalAge = monthDifference < 0 || (monthDifference === 0 && dayDifference < 0) ? calculatedAge - 1 : calculatedAge;
      setAge(finalAge);
    }
  }, [birthdate]);

  const onSignOut = () => {
      sessionStorage.clear();
      router.push('/sign-in');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
  
    const requiredFields = {
      email,
      first_name,
      middle_name,
      last_name,
      address,
      mother_name,
      father_name,
      contact_number,
      birthdate,
      birthplace,
      sex,
      employment,
      educational_attainment,
      age,
    };
  
    // Check for blank fields safely
    const missingFields = [];
  
    for (const [key, value] of Object.entries(requiredFields)) {
      if (
        value === null ||
        value === undefined ||
        (typeof value === "string" && value.trim() === "")
      ) {
        missingFields.push(key.replace(/_/g, ' '));
      }
    }
  
    if (missingFields.length === 1) {
      toast.error(`${missingFields[0]} is required.`);
      return;
    } else if (missingFields.length > 1) {
      toast.error("Missing fields are required.");
      return;
    }
  
    // Check if contact_number is exactly 11 digits
    if (!/^\d{11}$/.test(contact_number)) {
      toast.error("Contact number must be exactly 11 digits.");
      return;
    }
  
    // Check if email is valid
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
  
    // Check if privacy consent is checked
    if (!privacyConsent) {
      toast.info("You must agree to the privacy policy to proceed.");
      return;
    }
  
    // Proceed with saving
    const updatedUserData = {
      username,
      email,
      first_name,
      middle_name,
      last_name,
      suffix,
      address,
      mother_name,
      father_name,
      contact_number,
      birthdate,
      birthplace,
      sex,
      employment,
      educational_attainment,
      age,
      privacyConsent,
    };
  
    try {
      const response = await GlobalApi.updateUser(user.id, updatedUserData, jwt);
      console.log('API Response:', response);
  
      if (response?.id) {
        setUser(response);
        sessionStorage.setItem('user', JSON.stringify(response));
        toast.success("Profile updated successfully!", {
          duration: 3000,
        });
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("Failed to save changes. Please try again.");
    }
  };
  
  const handleAddressChange = async (e) => { // Updated function to handle "address"
    const query = e.target.value;
    setAddress(query);
    setIsAddressSuggestionsVisible(true);

    if (query.length < 3) {
      setAddressSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&countrycodes=PH&q=${query}`
      );
      const results = await response.json();
      setAddressSuggestions(results.length ? results : []);
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
    }
  };

  const handleAddressSelect = (selectedAddress) => { // Updated function to handle "address"
    setAddress(selectedAddress.display_name);
    setIsAddressSuggestionsVisible(false);
  };


  const handleBirthdateChange = (e) => {
    const selectedDate = e.target.value;
    setBirthdate(selectedDate);

    // Calculate Age
    if (selectedDate) {
      const birthYear = new Date(selectedDate).getFullYear();
      const currentYear = new Date().getFullYear();
      const calculatedAge = currentYear - birthYear;
      setAge(calculatedAge);
    } else {
      setAge("");
    }
  };
  const handleCourseSelect = (course) => {
    console.log("Selected course:", course);
    setSelectedCourse(course);
  };

  return (
    <div className="bg-[url('/banner.png')] bg-cover bg-center min-h-screen w-full p-4 sm:p-10">
      <div className='flex flex-col sm:flex-row items-center gap-4 sm:gap-8 ml-20 mr-24 justify-between'>
        <Link href={'/student-dashboard'} className="flex items-center gap-4">
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
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex flex-col items-center">
              <CircleUserRound className="bg-slate-200 p-2 mr-3 rounded-full cursor-pointer text-blue-900 h-16 w-16"/>
              <span className="text-slate-200 text-xl font-bold mr-3">{user?.username}</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {user?.username === "admin" && (
              <Link href={'/admin-dashboard'}>
                <DropdownMenuItem>Dashboard</DropdownMenuItem>
              </Link>
            )}
            <Link href={'/my-profile'}>
              <DropdownMenuItem>Profile</DropdownMenuItem>
            </Link>
            {user?.username.toLowerCase().includes("delivery") && (
              <Link href={'/rider-page'}>
                <DropdownMenuItem>Orders</DropdownMenuItem>
              </Link>
            )}
            <DropdownMenuItem onClick={onSignOut}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Registration Form */}
      <div className="mt-10 mx-32 bg-gray-200 p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-2">Assessment Registration</h2>
        <h2 className="text-lg font-bold mb-4 ml-1 text-gray-600">Please fill up the corresponding fields.</h2>

        <form onSubmit={handleRegister}>

          {/* Dropdown for selecting Course */}
          <div className="mb-5 w-full">
  <label className="block text-sm font-semibold mt-4">
    Select Qualification
  </label>
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
  {courses.map((course, index) => (
    <button
      key={index}
      type="button" // Prevent accidental form submission
      onClick={() => handleCourseSelect(course)}
      className={`w-full p-3 border rounded-xl ${
        selectedCourse === course ? 'bg-blue-700' : 'bg-blue-400'
      } text-white hover:bg-blue-700 transition`}
    >
      {course.Course_Name} {/* Display the course name */}
    </button>
  ))}
</div>
</div>



          <div className="mb-5 w-60">
          <label className="block text-sm font-semibold mt-4">
            Assessment Type
          </label>
          <select
            className="w-full p-3 border rounded-md"
            value={selectedScholarship}
            onChange={(e) => setSelectedScholarship(e.target.value)}
          >
            <option value="">Select Assessment Type</option>
            <option value="Paid Assessment">Paid Assessment</option>
            <option value="TWSP">TWSP Scholarship</option>
            <option value="PESFA">PESFA Scholarship</option>
            <option value="STEP">STEP Scholarship</option>
            <option value="others">Others</option>
          </select>
          </div>
    
          <div className="border-4 border-blue-400 rounded-lg">
          <div className="mx-5 my-3">
          <h2 className="text-xl font-bold mb-2">Profile</h2>
          <label className="block text-sm font-semibold">Name</label>
<div className="flex gap-2 mb-5">
  <div className="flex-[1.25]">
    <Input
      type="text"
      placeholder="Last Name"
      className="w-full"
      value={last_name}
      onChange={(e) => setLastName(e.target.value)}
    />
  </div>
  <div className="flex-[1.75]">
    <Input
      type="text"
      placeholder="First Name"
      className="w-full"
      value={first_name}
      onChange={(e) => setFirstName(e.target.value)}
    />
  </div>
  <div className="flex-[1]">
    <Input
      type="text"
      placeholder="Middle Name"
      className="w-full"
      value={middle_name}
      onChange={(e) => setMiddleName(e.target.value)}
    />
  </div>
  <div className="flex-[0.4]">
    <Input
      type="text"
      placeholder="Suffix (Jr, Sr, II, etc.)"
      className="w-full"
      value={suffix}
      onChange={(e) => setSuffix(e.target.value)}
    />
  </div>
</div>
          <div className="relative mb-5">
  <label className="block text-sm font-semibold">Address</label>
  <Input
    placeholder="Enter Address"
    value={address}
    onChange={handleAddressChange}
    className="w-full"
  />
  {isAddressSuggestionsVisible && addressSuggestions.length > 0 && (
    <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 shadow-lg max-h-40 overflow-y-auto z-10">
      {addressSuggestions.map((suggestion) => (
        <li
          key={suggestion.place_id}
          onClick={() => handleAddressSelect(suggestion)}
          className="p-2 cursor-pointer hover:bg-gray-100"
        >
          {suggestion.display_name}
        </li>
      ))}
    </ul>
  )}
</div>

          <div className="flex gap-2 mb-5">
            {/* Email Address */}
            <div className="flex-[0.4]">
              <label className="block text-sm font-semibold">Email Address</label>
              <Input 
                type="text" 
                placeholder="Email" 
                className="w-full" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>

            {/* Sex */}
            <div className="flex-[0.2]">
              <label className="block text-sm font-semibold">Sex</label>
              <select
              className="w-full p-2 border rounded-md"
              value={sex}
              onChange={(e) => setSex(e.target.value)} // Update the state when the selection changes
            >
              <option value="" disabled hidden>Select Sex</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            </div>

            {/* Employment (Before Assessment) */}
            <div className="flex-[0.3]">
              <label className="block text-sm font-semibold">Employment</label>
              <select
  className="w-full p-2 border rounded-md"
  value={employment}
  onChange={(e) => setEmployment(e.target.value)}
>
  <option value="" disabled hidden>Select Employment</option>
  <option value="Employed">Employed</option>
  <option value="Unemployed">Unemployed</option>
  <option value="Self-Employed">Self-Employed</option>
  <option value="Student">Student</option>
</select>

            </div>

            {/* Educational Attainment (Before Assessment) */}
            <div className="flex-[0.3]">
              <label className="block text-sm font-semibold"
              value={educational_attainment}
              onChange={(e) => setEducationalAttainment(e.target.value)}>Educational Attainment</label>
               <select
    className="w-full p-2 border rounded-md"
    value={educational_attainment} // Binding to state value
    onChange={(e) => setEducationalAttainment(e.target.value)} // Updating state on change
  >
    <option value="" disabled hidden>Select Educational Attainment</option>
    <option value="No Grade Completed">No Grade Completed</option>
    <option value="Elementary Undergraduate">Elementary Undergraduate</option>
    <option value="Elementary Graduate">Elementary Graduate</option>
    <option value="High School Undergraduate">High School Undergraduate</option>
    <option value="High School Graduate">High School Graduate</option>
    <option value="Junior High (K-12)">Junior High (K-12)</option>
    <option value="Senior High (K-12)">Senior High (K-12)</option>
    <option value="Post-Secondary Non-Tertiary/Technical Vocational Course Undergraduate">
      Post-Secondary Non-Tertiary/Technical Vocational Course Undergraduate
    </option>
    <option value="Post-Secondary Non-Tertiary/Technical Vocational Course Graduate">
      Post-Secondary Non-Tertiary/Technical Vocational Course Graduate
    </option>
    <option value="College Undergraduate">College Undergraduate</option>
    <option value="College Graduate">College Graduate</option>
    <option value="Masteral">Masteral</option>
    <option value="Doctorate">Doctorate</option>
  </select>
            </div>
          </div>

          <div className="flex gap-2 mb-5">
             {/* Birthdate */}
            <div className="flex-[0.3]">
              <label className="block text-sm font-semibold">Birthdate</label>
              <Input type="date" value={birthdate} onChange={handleBirthdateChange} className="w-full p-2 border rounded" />
            </div>

            {/* Age (Auto-calculated) */}
            <div className="flex-[0.06] mr-5">
              <label className="block text-sm font-semibold">Age</label>
              <Input 
                type="text" 
                value={age} 
                disabled 
                className="w-full p-2 border rounded bg-white cursor-not-allowed" 
                placeholder="Auto" 
              />
            </div>

            {/* Birthplace */}
            <div className="flex-auto">
  <label className="block text-sm font-semibold">Birthplace</label>
  <Input
    type="text"
    placeholder="Enter Birthplace"
    value={birthplace}
    onChange={(e) => setBirthplace(e.target.value)} // Ensure this is set to update state
  />
</div>

<div className="flex-[0.2]">
              <label className="block text-sm font-semibold">Civil Status</label>
              <select
              className="w-full p-2 border rounded-md"
              value={civil_status}
              onChange={(e) => setCivilStatus(e.target.value)} // Update the state when the selection changes
            >
              <option value="" disabled hidden>Select Civil Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Separated">Separated</option>
              <option value="Widowed">Widowed</option>
            </select>
            </div> 

            <div className="flex-[0.5]">
  <label className="block text-sm font-semibold">Contact Number</label>
  <Input 
    type="text" 
    placeholder="Enter Contact Number"
    value={contact_number} // Binding the state value to the input
    onChange={(e) => setContact(e.target.value)} // Handling the state update properly
  />
</div>

          </div>
          </div></div>
          
          <div className="mt-10">
            <p className="text-lg font-semibold">Privacy Consent and Disclaimer</p>

            {/* Use flex to align the disclaimer and button in a row */}
            <div className="flex justify-between items-start">
              {/* Disclaimer text on the left */}
              <p className="text-sm italic max-w-7xl">
                I hereby attest that I have read and understood the Privacy Notice of TESDA through its website 
                <a href="https://www.tesda.gov.ph" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                  (https://www.tesda.gov.ph)
                </a> 
                and thereby give my consent to the processing of my personal information indicated in this Learner&apos;s Profile. The 
                processing includes scholarships, employment, survey, and all other related TESDA programs that may be beneficial to my 
                qualifications.
              </p>

              {/* Button on the right */}
              <div>
                  <Button onClick={handleRegister}
                  className="rounded-lg min-w-40 sm:min-w-48 h-10 sm:h-14 text-lg sm:text-2xl font-bold bg-blue-700 hover:bg-blue-400 text-white py-1 px-3 border-b-2 border-blue-700 hover:border-blue-500">
                    Submit Application
                  </Button>
              </div>
            </div>

            {/* Radio buttons below the disclaimer */}
            <div className="flex items-center mt-2">
              <input 
                type="checkbox" 
                id="agree" 
                name="privacyConsent" 
                value="agree" 
                checked={privacyConsent === "agree"} 
                onChange={() => setPrivacyConsent("agree")} 
                className="mr-2"
              />
              <label htmlFor="agree" className="mr-4">Agree</label>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
