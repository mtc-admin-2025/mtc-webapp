'use client'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"

import TrainingDetail from './TrainingDetail'

const CourseItem = ({ course }) => {
  const [mounted, setMounted] = useState(false);
  const BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Define images based on keywords in course names
  const courseImageMap = [
    { keyword: "Electrical", image: "/eimtraining.jpg" },
    { keyword: "Instrumentation", image: "/ictraining.webp" },
    { keyword: "Mechatronics", image: "/mstraining.webp" },
    { keyword: "Solar", image: "/solartraining.jpg" },
  ];

  // Function to find an image based on course name
  const getDefaultImage = (courseName) => {
    if (!courseName || typeof courseName !== "string") return "/coursebanner.png";
    const matched = courseImageMap.find(item =>
      courseName.toLowerCase().includes(item.keyword.toLowerCase())
    );
    return matched?.image || "/coursebanner.png";
  };
  

  // Select Strapi image if available, otherwise use mapped WebP image
  const courseImage = course?.Image?.data?.[0]?.attributes?.url
  ? `${BASE_URL}${course.Image.data[0].attributes.url}`
  : getDefaultImage(course?.Course_Name);

    const today = new Date();

  // Filter training schedules to only include future or today's schedules
  const upcomingSchedules = course.TrainingSchedule
    ? course.TrainingSchedule.filter((sched) => new Date(sched.Schedule_date) >= today)
    : [];

  return (
    <Dialog>
      <DialogTrigger className="w-full">
        <div className="bg-opacity-50 bg-gray-700 relative p-4 md:p-6 flex flex-col gap-4 rounded-2xl shadow-xl hover:shadow-gray-600/50 transition-all ease-in-out cursor-pointer w-full h-[400px]">
  
  {/* Card Glow Effect */}
  <div className="absolute inset-0 rounded-2xl border border-opacity-20 border-gray-500"></div>

  {/* Image Section */}
  <Image
    src={courseImage}
    width={300}
    height={200}
    alt={course.Course_Name || 'Course Image'}
    className="rounded-t-2xl w-full h-[200px] object-cover"
  />

  {/* Text Content */}
  <div className="text-left flex-grow">
    <h2 className="font-bold text-3xl text-white">{course.Course_Name}</h2>
    <h2 className="font-bold text-lg text-blue-300">
  {upcomingSchedules.length > 0 
    ? `Available Schedule/s: ${upcomingSchedules.length}` 
    : "No available schedules"}
</h2>

  </div>

  <p className="text-lg font-semibold text-blue-500 mt-auto">See Details</p>
</div>

      </DialogTrigger>

      {/* Dialog Content */}
      <DialogContent className="max-w-4xl w-full md:max-w-5xl lg:max-w-6xl h-auto p-6">
        <DialogHeader>
          <DialogDescription>
            <TrainingDetail course={course}/>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default CourseItem;
