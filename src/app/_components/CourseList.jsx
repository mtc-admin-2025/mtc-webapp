"use client";
import React, { useState } from "react";
import CourseItem from "./CourseItem";

function CourseList({ courseList }) {
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 8;

  // Sort courses alphabetically
  const sortedCourses = courseList
    ?.slice()
    .sort((a, b) => (a.Course_Name?.localeCompare(b.Course_Name) || 0));

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = sortedCourses?.slice(indexOfFirstCourse, indexOfLastCourse) || [];

  const nextPage = () => {
    if (currentCourses.length === coursesPerPage) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const prevPage = () => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));

  return (
    <div className="mx-auto px-4">
      <p className="text-center mt-6 text-blue-300 font-bold text-6xl">Assessment</p>
      {currentCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-20 mt-6">
          {currentCourses.map((course, index) => (
            <CourseItem key={index} course={course} />
          ))}
        </div>
      ) : (
        <p className="text-center mt-6 text-blue-500">No courses found.</p>
      )}

    </div>
  );
}

export default CourseList;
