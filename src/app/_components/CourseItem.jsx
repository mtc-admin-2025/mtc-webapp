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
import CourseItemDetail from './CourseItemDetail'

const CourseItem = ({ course }) => {
  const [mounted, setMounted] = useState(false);
  const BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger className="w-full">
        <div className="bg-opacity-50 bg-gray-700 relative p-4 md:p-6 flex flex-col gap-4 rounded-2xl shadow-xl
        border-4 border-blue-600
          hover:shadow-blue-600/50 transition-all ease-in-out cursor-pointer">

          {/* Card Glow Effect */}
          <div className="absolute inset-0 rounded-2xl border border-opacity-20 border-blue-500"></div>

          {/* Image Section */}
          <Image 
            src={course.Image?.data?.[0]?.attributes?.url ? `${BASE_URL}${course.Image.data[0].attributes.url}` : '/mechabanner.png'}
            width={1000}
            height={800}
            alt={course.Course_Name || 'Course Image'}
            className='rounded-t-2xl w-full object-cover'
          />

          {/* Text Content */}
          <div className="text-left">
            <h2 className='font-bold text-3xl text-white'>{course.Course_Name}</h2> 
            <p className='text-lg font-semibold text-slate-300'>Trainer: {course.trainer?.Name || 'N/A'}</p> 
            <h2 className='font-bold text-lg text-blue-300'>Available Schedules: {course.Schedule.length}</h2>
          </div>
          <p className='text-lg font-semibold text-blue-500'>See Details</p> 
        </div>
      </DialogTrigger>

      {/* Dialog Content */}
      <DialogContent>
        <DialogHeader>
          <DialogDescription>
            <CourseItemDetail course={course}/>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>

    
  );
}

export default CourseItem;
