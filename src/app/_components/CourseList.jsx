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
      {currentCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
          {currentCourses.map((course, index) => (
            <CourseItem key={index} course={course} />
          ))}
        </div>
      ) : (
        <p className="text-center mt-6 text-blue-400">No courses found.</p>
      )}

      <div className="flex justify-between mt-4">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={nextPage}
          disabled={currentCourses.length < coursesPerPage}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default CourseList;
