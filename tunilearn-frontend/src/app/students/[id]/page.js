"use client";
import { useEffect, useState } from "react";
import { fetchStudentEnrollments } from "../../services/enrollmentService";
import Link from "next/link";

export default function StudentProfilePage({ params }) {
  const { id } = params;
  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetchStudentEnrollments(id);
        setStudent(res.student);
        setCourses(res.courses);
      } catch (err) {
        setError("Failed to fetch student enrollments");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!student) return <div>Student not found.</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex items-center mb-8">
        {student.profileImageUrl && (
          <img src={student.profileImageUrl} alt="Profile" className="w-20 h-20 rounded-full object-cover mr-6" />
        )}
        <div>
          <h1 className="text-3xl font-bold mb-1">{student.fullName}</h1>
          <div className="text-gray-600 dark:text-gray-300">Student ID: {student.id}</div>
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-4">Enrolled Courses</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {courses.length === 0 ? (
          <div className="col-span-2 text-gray-500">No enrolled courses yet.</div>
        ) : (
          courses.map((course) => (
            <Link key={course.id} href={`/courses/${course.id}`} className="block bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-lg transition-shadow">
              {course.coverImageUrl && (
                <img src={course.coverImageUrl} alt="Cover" className="w-full h-32 object-cover rounded mb-3" />
              )}
              <h3 className="text-lg font-semibold mb-1">{course.title}</h3>
              <div className="text-blue-700 dark:text-blue-300 font-semibold mb-1">${course.price}</div>
              <p className="text-gray-700 dark:text-gray-300 mb-2 line-clamp-2">{course.description}</p>
              <div className="text-xs text-gray-500">Enrolled at: {new Date(course.enrolledAt).toLocaleDateString()}</div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
