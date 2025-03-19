"use client";
import React, { useState, useEffect } from "react";
import TrainingItem from "./TrainingItem";

function TrainingList({ courseList }) {
  const [loading, setLoading] = useState(true);

  // Wait for courseList to be available before rendering
  useEffect(() => {
    if (courseList && courseList.length > 0) {
      setLoading(false);
    }
  }, [courseList]);

  // Show only the loader until data is loaded
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  // Sort courses alphabetically
  const sortedCourses = courseList
    ?.slice()
    .sort((a, b) => (a.Course_Name?.localeCompare(b.Course_Name) || 0));

  return (
    <div className="mx-auto px-4">
      <p className="text-center mt-6 text-white font-bold text-6xl">Trainings</p>

      {sortedCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-20 mt-6">
          {sortedCourses.map((course, index) => (
            <TrainingItem key={index} course={course} />
          ))}
        </div>
      ) : (
        <p className="text-center mt-6 text-blue-500">No courses found.</p>
      )}
    </div>
  );
}

export default TrainingList;
