"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCourse } from "../../../services/crudService";
import Link from "next/link";
import EnrollButton from "../EnrollButton";

export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCourse() {
      try {
        const res = await getCourse(id);
        setCourse(res.data.data);
      } catch (err) {
        setError("Failed to fetch course details");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchCourse();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!course) return <div>Course not found.</div>;

  const { title, description, price, teacher, chapters, subject, prerequisites, features, learningObjectives, coverImageUrl } = course;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <Link href="/courses" className="text-blue-600 hover:underline">&larr; Back to Courses</Link>
      <h1 className="text-3xl font-bold mt-4 mb-2">{title}</h1>
      <div className="mb-2 text-gray-700 dark:text-gray-300">By <span className="font-semibold">{teacher?.name}</span></div>
      <div className="mb-2 text-gray-700 dark:text-gray-300">Subject: <span className="font-semibold">{subject?.name}</span></div>
      <div className="mb-4 text-lg text-blue-700 dark:text-blue-300 font-semibold">${price}</div>
      {coverImageUrl && (
        <img src={`http://localhost:5000${coverImageUrl.startsWith('/uploads') ? coverImageUrl : `/uploads/${coverImageUrl}`}`} alt="Course cover" className="mb-4 rounded shadow max-h-64" />
      )}
      {/* Enroll Button */}
      <div className="mb-6">
        <EnrollButton courseId={course.id} />
      </div>
      <p className="mb-6 text-gray-800 dark:text-gray-200">{description}</p>
      {prerequisites && <div className="mb-2"><span className="font-semibold">Prerequisites:</span> {prerequisites}</div>}
      {learningObjectives && (
        <div className="mb-2">
          <span className="font-semibold">Learning Objectives:</span>
          <ul className="list-disc ml-6">
            {JSON.parse(learningObjectives).map((obj, i) => <li key={i}>{obj}</li>)}
          </ul>
        </div>
      )}
      {features && (
        <div className="mb-2">
          <span className="font-semibold">Features:</span>
          <ul className="list-disc ml-6">
            {JSON.parse(features).map((f, i) => <li key={i}>{f}</li>)}
          </ul>
        </div>
      )}
      <h2 className="text-2xl font-bold mb-3 mt-6">Chapters</h2>
      <div className="space-y-6">
        {chapters && chapters.length > 0 ? (
          chapters.map((chapter) => (
            <div key={chapter.id} className="border rounded-lg p-4 bg-white dark:bg-gray-800">
              <h3 className="text-xl font-semibold mb-2">{chapter.title}</h3>
              <ul className="list-disc ml-6">
                {chapter.sections && chapter.sections.length > 0 ? (
                  chapter.sections.map((section) => (
                    <li key={section.id} className="mb-2">
                      <span className="font-medium">{section.title}</span>
                      {section.videoUrl && (
                        <div className="mt-2">
                          <span className="text-blue-500">YouTube Video:</span>
                          <div className="mt-1">
                            <iframe
                              width="360"
                              height="215"
                              src={`https://www.youtube.com/embed/${section.videoUrl}`}
                              title="YouTube video player"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </div>
                        </div>
                      )}
                      {section.pdfUrl && (
                        <a href={section.pdfUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-green-600 underline">PDF</a>
                      )}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">No lessons in this chapter.</li>
                )}
              </ul>
            </div>
          ))
        ) : (
          <div className="text-gray-500">No chapters found for this course.</div>
        )}
      </div>
    </div>
  );
}
