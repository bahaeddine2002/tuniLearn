"use client";

import { useEffect, useState } from "react";
import { getCourses, updateCourse, deleteCourse } from "../../../services/crudService";
import Link from "next/link";

export default function PendingCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await getCourses({ approved: false });
        setCourses(res.data);
      } catch (err) {
        setError("Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const handleApprove = async (id) => {
    try {
      await updateCourse(id, { approved: true });
      setCourses(courses.filter(course => course.id !== id));
    } catch (err) {
      alert("Failed to approve course");
    }
  };

  const handleDismiss = async (id) => {
    if (!window.confirm("Are you sure you want to dismiss this course?")) return;
    try {
      await deleteCourse(id);
      setCourses(courses.filter(course => course.id !== id));
    } catch (err) {
      alert("Failed to dismiss course");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Pending Course Approvals</h1>
      <Link href="/courses" className="text-blue-600 hover:underline mb-4 inline-block">Back to Courses</Link>
      {courses.length === 0 ? (
        <div>No courses pending approval.</div>
      ) : (
        <ul className="space-y-4">
          {courses.map(course => (
            <li key={course.id} className="border p-4 rounded flex justify-between items-center">
              <div>
                <div className="font-semibold">{course.title}</div>
                <div className="text-sm text-gray-600">{course.description}</div>
              </div>
              <div className="flex gap-2">
                <button
                  className="btn-primary px-4 py-2"
                  onClick={() => handleApprove(course.id)}
                >
                  Approve
                </button>
                <button
                  className="btn-secondary px-4 py-2 bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => handleDismiss(course.id)}
                >
                  Dismiss
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
