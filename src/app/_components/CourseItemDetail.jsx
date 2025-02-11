"use client";
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

function CourseItemDetail({ course }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; 
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 p-7 bg-white text-black">
      {/* Course Image */}
      {/* Course Details */}
      <div className="flex flex-col gap-3">
        <h2 className="text-2xl font-bold">{course.Course_Name}</h2>
        <h2 className="text-sm text-gray-500">{course.Course_Description}</h2>
        <h2 className="font-medium text-lg">
          <span className='font-bold'>Course ID:</span> {course.Course_ID}
        </h2>
      </div>
    </div>
  );
}

export default CourseItemDetail;
