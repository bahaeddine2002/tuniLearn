"use client";
import { useAuth } from "../../contexts/AuthContext";
import axios from "../../lib/axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import EditProfileForm from "./EditProfileForm";

export default function TeacherProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);

  const fetchProfile = async () => {
    try {
      if (!user) return;
      const res = await axios.get(`/teacher/${user.id}`);
      setProfile(res.data.data);
    } catch (err) {
      setError("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!profile) return <div>Profile not found.</div>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <Link href="/courses" className="text-blue-600 hover:underline">&larr; Back to Courses</Link>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mt-6 mb-10">
        <img
          src={profile.profileImageUrl || "/default-profile.png"}
          alt={profile.fullName}
          className="w-32 h-32 rounded-full object-cover border-4 border-blue-600 shadow-lg"
        />
        <div>
          <h1 className="text-3xl font-bold mb-2">{profile.fullName}</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-2">{profile.bio || "No bio provided."}</p>
          <button
            onClick={() => setEditing(true)}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit Profile
          </button>
        </div>
      </div>
      {editing && (
        <EditProfileForm
          profile={profile}
          onSave={() => {
            setEditing(false);
            fetchProfile();
          }}
          onCancel={() => setEditing(false)}
        />
      )}
      <h2 className="text-2xl font-bold mb-4">My Courses</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {profile.courses.length > 0 ? (
          profile.courses.map((course) => (
            <div key={course.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
              {course.coverImageUrl && (
                <img src={course.coverImageUrl} alt={course.title} className="rounded mb-3 h-40 object-cover" />
              )}
              <h3 className="text-lg font-semibold mb-1">{course.title}</h3>
              <p className="text-gray-700 dark:text-gray-300 flex-1 mb-2">{course.description}</p>
              <div className="font-bold text-blue-700 dark:text-blue-300 mb-2">${course.price}</div>
              <Link href={`/courses/${course.id}`} className="mt-auto text-blue-600 hover:underline font-medium">View Course</Link>
            </div>
          ))
        ) : (
          <div className="col-span-full text-gray-500">No courses found for this instructor.</div>
        )}
      </div>
    </div>
  );
}
