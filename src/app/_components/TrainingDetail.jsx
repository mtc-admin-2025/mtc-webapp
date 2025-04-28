"use client";
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

function TrainingDetail({ course }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; 
  }

  const today = new Date();

  // Filter training schedules to only include future or today's schedules
  const upcomingSchedules = course.TrainingSchedule
    ? course.TrainingSchedule.filter((sched) => new Date(sched.Schedule_date) >= today)
    : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-7 bg-white text-black">
      {/* Left: Course Details */}
      <div className="flex flex-col gap-3">
        <h2 className="text-4xl font-bold">{course.Course_Name}</h2>
        <p className="text-lg text-gray-500">{course.Course_Description}</p>
        <h2 className="font-medium text-lg">
          <span className='font-bold'>Course ID:</span> {course.Course_ID}
        </h2>
        <Link href={'/training-register'}>
          <Button className="rounded-lg w-32 sm:w-40 h-10 sm:h-14 text-lg sm:text-2xl font-bold bg-blue-500 hover:bg-blue-400 text-white py-1 px-3 border-b-2 border-blue-700 hover:border-blue-500">
            Enroll Now
          </Button>
        </Link>
      </div>
  {/* Right: Schedule Section */}
  {upcomingSchedules.length > 0 ? (
          <div className="text-blue-950">
            <h3 className="font-bold text-2xl">Schedule/s:</h3>
            {upcomingSchedules.map((sched, index) => (
              <div key={index} className="p-4 rounded-lg mt-2 bg-blue-100 border-blue-950 shadow-md shadow-blue-200">
                <div className="flex justify-between items-center">
                  {/* Left side: Date and Time */}
                  <div>
                    <p className="text-2xl font-bold">{sched.Schedule_date}</p>
                    <p className="text-xl font-bold">{sched.Schedule_time}</p>
                  </div>
                  {/* Right side: Slots */}
                  <div className="text-right mr-10">
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-blue-500 mt-4 text-center font-bold">No upcoming schedules available</p>
        )}
    </div>
  );
}

export default TrainingDetail;
