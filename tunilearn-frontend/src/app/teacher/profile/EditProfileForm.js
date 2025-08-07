"use client";
import { useState } from "react";
import axios from "../../lib/axios";

export default function EditProfileForm({ profile, onSave, onCancel }) {
  const [fullName, setFullName] = useState(profile.fullName || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [image, setImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("name", fullName);
      formData.append("bio", bio);
      if (image) formData.append("profileImage", image);
      await axios.put(`/teacher/${profile.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onSave();
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-lg shadow max-w-lg mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full p-2 rounded border border-gray-700 bg-gray-800 text-white"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full p-2 rounded border border-gray-700 bg-gray-800 text-white"
          rows={3}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Profile Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>
      <div className="flex gap-4">
        <button type="submit" disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
          {saving ? "Saving..." : "Save"}
        </button>
        <button type="button" onClick={onCancel} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
          Cancel
        </button>
      </div>
    </form>
  );
}
