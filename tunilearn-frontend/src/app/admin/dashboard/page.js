"use client";

import { useEffect, useState } from "react";
import { getCourses, updateCourse } from "../../../services/crudService";
import { useAuth } from '../../contexts/AuthContext';


export default function AdminDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await getCourses();
        setCourses(res.data.filter(course => !course.approved));
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

  if (!user || user.role !== 'ADMIN') {
    return <div className="text-center py-20 text-red-600 font-bold">Not authorized</div>;
  }
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Pending Course Approvals</h1>
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
              <button
                className="btn-primary px-4 py-2"
                onClick={() => handleApprove(course.id)}
              >
                Approve
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
