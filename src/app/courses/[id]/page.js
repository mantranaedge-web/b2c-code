'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import LeadForm from '../../../components/LeadForm';

export const dynamic = 'force-dynamic';

export default function CourseDetailPage() {
  const params = useParams();
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [course, setCourse] = useState(null);
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourseData() {
      try {
        const coursesResponse = await fetch('/api/courses');
        const coursesData = await coursesResponse.json();
        
        if (coursesData.success) {
          const foundCourse = coursesData.courses[parseInt(params.id) - 1];
          if (foundCourse) {
            setCourse(foundCourse);
            
            const detailsResponse = await fetch(`/api/course-details?title=${encodeURIComponent(foundCourse.title)}`);
            const detailsData = await detailsResponse.json();
            if (detailsData.success) {
              setCourseDetails(detailsData.detail);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching course ', err);
      }
      setLoading(false);
    }
    fetchCourseData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Link href="/" className="text-primary-600">← Back to Courses</Link>
      </div>
    );
  }

  const display = {
    ...course,
    fullDescription: courseDetails?.fullDescription || course.description,
    modules: courseDetails?.modules || [],
    learningOutcomes: courseDetails?.learningOutcomes || [],
    prerequisites: courseDetails?.prerequisites || [],
    instructorBio: courseDetails?.instructorBio || `Expert in ${course.category}`,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="text-primary-600 font-semibold">← Back to Courses</Link>
        </div>
      </nav>

      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2 mb-4">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">{display.category}</span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">{display.level}</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">{display.title}</h1>
          <p className="text-xl mb-6">{display.description}</p>
          <div className="flex gap-6">
            <div>⏱️ {display.duration}</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold mb-4">About This Course</h2>
              <p className="text-gray-600">{display.fullDescription}</p>
            </div>

            {display.learningOutcomes.length > 0 && (
              <div className="bg-white rounded-lg shadow p-8">
                <h2 className="text-2xl font-bold mb-4">What You'll Learn</h2>
                <ul className="space-y-3">
                  {display.learningOutcomes.map((o, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-green-500">✓</span>
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {display.modules.length > 0 && (
              <div className="bg-white rounded-lg shadow p-8">
                <h2 className="text-2xl font-bold mb-6">Course Curriculum</h2>
                <div className="space-y-4">
                  {display.modules.map((m, i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-semibold">Module {i + 1}: {m.title}</h3>
                        <span className="text-sm text-gray-500">{m.duration}</span>
                      </div>
                      <p className="text-sm text-gray-600">{m.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {display.prerequisites.length > 0 && (
              <div className="bg-white rounded-lg shadow p-8">
                <h2 className="text-2xl font-bold mb-4">Prerequisites</h2>
                <ul className="space-y-2">
                  {display.prerequisites.map((p, i) => (
                    <li key={i} className="flex gap-3">
                      <span>•</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
              <button
                onClick={() => setShowLeadForm(true)}
                className="w-full bg-primary-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-primary-700 mb-4"
              >
                Enquire Now
              </button>
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold">{display.duration}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Level</span>
                  <span className="font-semibold">{display.level}</span>
                </div>
              </div>
              <div className="border-t mt-4 pt-4">
                <h4 className="font-semibold mb-3">This course includes:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2"><span className="text-green-500">✓</span>Lifetime access</li>
                  <li className="flex gap-2"><span className="text-green-500">✓</span>Certificate of completion</li>
                  <li className="flex gap-2"><span className="text-green-500">✓</span>Instructor support</li>
                  <li className="flex gap-2"><span className="text-green-500">✓</span>Practical projects</li>
                  <li className="flex gap-2"><span className="text-green-500">✓</span>Study materials</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showLeadForm && <LeadForm courseName={display.title} onClose={() => setShowLeadForm(false)} />}
    </div>
  );
}
