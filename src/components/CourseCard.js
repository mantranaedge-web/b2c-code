'use client';
import { useState } from 'react';
import Link from 'next/link';
import LeadForm from './LeadForm';

export default function CourseCard({ course }) {
  const [showLeadForm, setShowLeadForm] = useState(false);

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-48 bg-gradient-to-r from-primary-500 to-primary-700">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-center p-4">
              <h3 className="text-2xl font-bold mb-2">{course.title}</h3>
              <span className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                {course.category}
              </span>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
              {course.level}
            </span>
            <span className="text-sm text-gray-600">
              ⏱️ {course.duration}
            </span>
          </div>

          <p className="text-gray-600 mb-4 line-clamp-3">
            {course.description}
          </p>

          <Link
            href={`/courses/${course.id}`}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium inline-block mb-4"
          >
            View Details →
          </Link>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-yellow-500">★</span>
              <span className="text-sm font-medium text-gray-700">
                {course.rating} ({course.studentsEnrolled}+ students)
              </span>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Instructor:</strong> {course.instructor}
            </p>
            <p className="text-2xl font-bold text-primary-700">
              ₹{course.price.toLocaleString()}
            </p>
          </div>

          <button
            onClick={() => setShowLeadForm(true)}
            className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200"
          >
            Enquire Now
          </button>
        </div>
      </div>

      {showLeadForm && (
        <LeadForm
          courseName={course.title}
          onClose={() => setShowLeadForm(false)}
        />
      )}
    </>
  );
}