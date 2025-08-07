"use client";
import { useState } from "react";
import { enrollInCourse } from "../../services/enrollmentService";

export default function EnrollButton({ courseId }) {
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleEnroll = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      // Static studentId = 1
      await enrollInCourse(1, courseId);
      setEnrolled(true);
      setSuccess("Enrollment successful!");
    } catch (err) {
      setError("Enrollment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-4">
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        onClick={handleEnroll}
        disabled={enrolled || loading}
      >
        {enrolled ? "Enrolled" : loading ? "Enrolling..." : "Enroll Now"}
      </button>
      {success && <div className="text-green-600 mt-2">{success}</div>}
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </div>
  );
}
