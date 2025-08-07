"use client";

import { useEffect, useState } from "react";
import { enrollInCourse, fetchStudentEnrollments } from "../../services/enrollmentService";

export default function EnrollButton({ courseId }) {
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Check if static student (id=3) is already enrolled in this course
  useEffect(() => {
    async function checkEnrollment() {
      try {
        const res = await fetchStudentEnrollments(3);
        const enrolledCourses = res.data?.courses || res.courses || [];
        setEnrolled(enrolledCourses.some(c => c.id === courseId));
      } catch (err) {
        // ignore error, assume not enrolled
      }
    }
    if (courseId) checkEnrollment();
  }, [courseId]);

  const handleEnroll = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await enrollInCourse(3, courseId);
      setEnrolled(true);
      setSuccess("Enrollment successful!");
    } catch (err) {
      setError("Enrollment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (enrolled) return null;

  return (
    <div className="my-2">
      <button
        className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 disabled:opacity-50"
        onClick={handleEnroll}
        disabled={enrolled || loading}
      >
        {loading ? "Enrolling..." : "Enroll Now"}
      </button>
      {success && <div className="text-green-600 mt-1 text-sm">{success}</div>}
      {error && <div className="text-red-600 mt-1 text-sm">{error}</div>}
    </div>
  );
}
