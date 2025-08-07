"use client";

import { useEffect, useState } from "react";
import { getCourses, updateCourse, deleteCourse } from "../../../services/crudService";
import Link from "next/link";


export default function PendingCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await getCourses({ approved: false });
        setCourses(Array.isArray(res.data.data) ? res.data.data : []);
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
      setNotification("Course approved successfully.");
      setTimeout(() => setNotification(""), 2000);
    } catch (err) {
      setNotification("Failed to approve course.");
      setTimeout(() => setNotification(""), 2000);
    }
  };

  const handleDismiss = async (id) => {
    if (!window.confirm("Are you sure you want to dismiss this course?")) return;
    try {
      await deleteCourse(id);
      setCourses(courses.filter(course => course.id !== id));
      setNotification("Course dismissed.");
      setTimeout(() => setNotification(""), 2000);
    } catch (err) {
      setNotification("Failed to dismiss course.");
      setTimeout(() => setNotification(""), 2000);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Pending Course Approvals</h1>
      <Link href="/courses" className="text-blue-600 hover:underline mb-4 inline-block">Back to Courses</Link>
      {notification && (
        <div className="mb-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded">
          {notification}
        </div>
      )}
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
