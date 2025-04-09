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

export default function Home() {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);
  const router = useRouter();
  const [permanentAddress, setPermanentAddress] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [permanentSuggestions, setPermanentSuggestions] = useState([]);
  const [currentSuggestions, setCurrentSuggestions] = useState([]);
  const [isPermanentSuggestionsVisible, setIsPermanentSuggestionsVisible] = useState(false);
  const [isCurrentSuggestionsVisible, setIsCurrentSuggestionsVisible] = useState(false);
  const [birthdate, setBirthdate] = useState("");
  const [age, setAge] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedScholarship, setSelectedScholarship] = useState("");
  const [privacyConsent, setPrivacyConsent] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");


  

  useEffect(() => {
      setIsLogin(sessionStorage.getItem('jwt') ? true : false);
      setUser(JSON.parse(sessionStorage.getItem('user')));
      setJwt(sessionStorage.getItem('jwt'));
  }, []);

  useEffect(() => {
    if (user) {
      setUsername(user.username); 
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setEmail(user.email); 
    }
  }, [user]);

  const onSignOut = () => {
      sessionStorage.clear();
      router.push('/sign-in');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Registering with: ", { permanentAddress, currentAddress });
  };

  const handlePermanentAddressChange = async (e) => {
    const query = e.target.value;
    setPermanentAddress(query);
    setIsPermanentSuggestionsVisible(true);

    if (query.length < 3) {
      setPermanentSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&countrycodes=PH&q=${query}`
      );
      const results = await response.json();
      setPermanentSuggestions(results.length ? results : []);
    } catch (error) {
      console.error("Error fetching permanent address suggestions:", error);
    }
  };

  const handlePermanentAddressSelect = (selectedAddress) => {
    setPermanentAddress(selectedAddress.display_name);
    setIsPermanentSuggestionsVisible(false);
  };

  const handleCurrentAddressChange = async (e) => {
    const query = e.target.value;
    setCurrentAddress(query);
    setIsCurrentSuggestionsVisible(true);

    if (query.length < 3) {
      setCurrentSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&countrycodes=PH&q=${query}`
      );
      const results = await response.json();
      setCurrentSuggestions(results.length ? results : []);
    } catch (error) {
      console.error("Error fetching current address suggestions:", error);
    }
  };

  const handleCurrentAddressSelect = (selectedAddress) => {
    setCurrentAddress(selectedAddress.display_name);
    setIsCurrentSuggestionsVisible(false);
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

  const courses = [
    "Electrical Installation and Maintenance",
    "Instrumentation and Calibration",
    "Mechatronics Servicing",
    "Solar PV Installation"
  ];

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
        <h2 className="text-3xl font-bold mb-2">Training Registration</h2>
        <h2 className="text-lg font-bold mb-4 ml-1 text-gray-600">Please fill up the corresponding fields.</h2>

        <form onSubmit={handleRegister}>

        <div>
            <label className="block text-lg font-semibold">Course for Training</label>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
              {courses.map((course, index) => (
                <button
                  key={index}
                  type="button" // Prevent accidental form submission
                  onClick={() => handleCourseSelect(course)}
                  className={`w-full p-3 border rounded ${
                    selectedCourse === course ? "bg-blue-700" : "bg-blue-400"
                  } text-white hover:bg-blue-700 transition`}
                >
                  {course}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-5 w-60">
          <label className="block text-sm font-semibold mt-4">
            Training Type
          </label>
          <select
            className="w-full p-3 border rounded-md"
            value={selectedScholarship}
            onChange={(e) => setSelectedScholarship(e.target.value)}
          >
            <option value="">Select Training Type</option>
            <option value="Paid Training">Paid Training</option>
            <option value="TWSP">TWSP Scholarship</option>
            <option value="PESFA">PESFA Scholarship</option>
            <option value="STEP">STEP Scholarship</option>
            <option value="others">Others</option>
          </select>
          </div>
    

          <label className="block text-sm font-semibold">Name <span className="text-blue-500 font-thin text-xs">update if needed</span></label>
          <div className="flex gap-2 mb-5">
            <div className="flex-[1.5]">
              <Input type="text" placeholder="Last Name" className="w-full" />
            </div>
            <div className="flex-[2]">
            <Input 
                type="text" 
                placeholder="First Name" 
                className="w-full" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="flex-[0.3]">
              <Input type="text" placeholder="Middle Initial" className="w-full" />
            </div>
            <div className="flex-[0.4]">
              <Input type="text" placeholder="Suffix (Jr, Sr, II, etc.)" className="w-full" />
            </div>
          </div>

          <div className="relative mb-5">
            <label className="block text-sm font-semibold">Permanent Address (for Mailing)</label>
            <Input placeholder="Enter Permanent Address" value={permanentAddress} onChange={handlePermanentAddressChange} className="w-full" />
            {isPermanentSuggestionsVisible && permanentSuggestions.length > 0 && (
              <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 shadow-lg max-h-40 overflow-y-auto z-10">
                {permanentSuggestions.map((suggestion) => (
                  <li key={suggestion.place_id} onClick={() => handlePermanentAddressSelect(suggestion)} className="p-2 cursor-pointer hover:bg-gray-100">
                    {suggestion.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="relative mb-5">
            <label className="block text-sm font-semibold">Current Address</label>
            <Input placeholder="Enter Current Address" value={currentAddress} onChange={handleCurrentAddressChange} className="w-full" />
            {isCurrentSuggestionsVisible && currentSuggestions.length > 0 && (
              <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 shadow-lg max-h-40 overflow-y-auto z-10">
                {currentSuggestions.map((suggestion) => (
                  <li key={suggestion.place_id} onClick={() => handleCurrentAddressSelect(suggestion)} className="p-2 cursor-pointer hover:bg-gray-100">
                    {suggestion.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex gap-2 mb-5">
            {/* Email Address */}
            <div className="flex-[0.4]">
              <label className="block text-sm font-semibold">Email Address <span className="text-blue-500 font-thin text-xs">update if needed</span></label>
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
              <select className="w-full p-2 border rounded-md">
                <option value="" disabled selected hidden>Select Sex</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* Employment (Before Training) */}
            <div className="flex-[0.3]">
              <label className="block text-sm font-semibold">Employment</label>
              <select className="w-full p-2 border rounded-md">
                <option value="" disabled selected hidden>Select Employment</option>
                <option value="Employed">Employed</option>
                <option value="Unemployed">Unemployed</option>
                <option value="Self-Employed">Self-Employed</option>
                <option value="Student">Student</option>
              </select>
            </div>

            {/* Educational Attainment (Before Training) */}
            <div className="flex-[0.3]">
              <label className="block text-sm font-semibold">Educational Attainment</label>
              <select className="w-full p-2 border rounded-md">
                <option value="" disabled selected hidden>Select Educational Attainment</option>
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
              <Input type="text" placeholder="Enter Birthplace"/>
            </div>
          </div>
          
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
                <Link href={'/student-dashboard'}>
                  <Button className="rounded-lg min-w-40 sm:min-w-48 h-10 sm:h-14 text-lg sm:text-2xl font-bold bg-blue-700 hover:bg-blue-400 text-white py-1 px-3 border-b-2 border-blue-700 hover:border-blue-500">
                    Submit Application
                  </Button>
                </Link>
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
