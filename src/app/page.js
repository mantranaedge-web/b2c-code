'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import CourseCard from '@/components/CourseCard';
import LeadForm from '@/components/LeadForm';

export default function HomePage() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [showContactForm, setShowContactForm] = useState(false);

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/courses');
      
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }

      const data = await response.json();
      setCourses(data.courses || []);
      setFilteredCourses(data.courses || []);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredCourses(courses);
      return;
    }

    const searchLower = query.toLowerCase();
    const filtered = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchLower) ||
        course.description.toLowerCase().includes(searchLower) ||
        course.category.toLowerCase().includes(searchLower) ||
        course.instructor.toLowerCase().includes(searchLower)
    );
    setFilteredCourses(filtered);
  };

  // Handle category filter
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    applyFilters(category, selectedLevel);
  };

  // Handle level filter
  const handleLevelChange = (level) => {
    setSelectedLevel(level);
    applyFilters(selectedCategory, level);
  };

  // Apply both category and level filters
  const applyFilters = (category, level) => {
    let filtered = courses;

    // Filter by category
    if (category !== 'All') {
      filtered = filtered.filter((course) => course.category === category);
    }

    // Filter by level
    if (level !== 'All') {
      filtered = filtered.filter((course) => course.level === level);
    }

    setFilteredCourses(filtered);
  };

  // Get unique categories and levels
  const categories = ['All', ...new Set(courses.map((course) => course.category))];
  const levels = ['All', ...new Set(courses.map((course) => course.level))];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={handleSearch} />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Transform Your Team with Expert Training
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8">
              Discover cutting-edge courses designed for corporate excellence
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                <span className="text-2xl font-bold">{courses.length}+</span>
                <span className="ml-2">Courses</span>
              </div>
              {/* Commented out for now
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                <span className="text-2xl font-bold">500+</span>
                <span className="ml-2">Companies</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                <span className="text-2xl font-bold">10k+</span>
                <span className="ml-2">Professionals Trained</span>
              </div>
              */}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-8">
          {/* Left Sidebar - Filters */}
          <aside className="w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-lg shadow-md p-6 space-y-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Filters</h2>
              
              {/* Category Filter */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Category</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-all ${
                        selectedCategory === category
                          ? 'bg-primary-600 text-white shadow-md'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Level Filter */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Level</h3>
                <div className="space-y-2">
                  {levels.map((level) => (
                    <button
                      key={level}
                      onClick={() => handleLevelChange(level)}
                      className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-all ${
                        selectedLevel === level
                          ? 'bg-primary-600 text-white shadow-md'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters Button */}
              {(selectedCategory !== 'All' || selectedLevel !== 'All') && (
                <button
                  onClick={() => {
                    handleCategoryChange('All');
                    handleLevelChange('All');
                  }}
                  className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </aside>

          {/* Right Content Area */}
          <div className="flex-1 min-w-0">

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mb-4"></div>
            <p className="text-gray-600">Loading courses...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <svg
              className="w-12 h-12 text-red-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              Failed to Load Courses
            </h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={fetchCourses}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

            {/* Courses Grid */}
            {!loading && !error && filteredCourses.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}

        {/* No Courses Found */}
        {!loading && !error && filteredCourses.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Courses Found
            </h3>
            <p className="text-gray-600 mb-4">
              {courses.length === 0
                ? 'No courses are available at the moment.'
                : 'Try adjusting your search or filter criteria.'}
            </p>
            {(selectedCategory !== 'All' || selectedLevel !== 'All') && (
              <button
                onClick={() => {
                  handleCategoryChange('All');
                  handleLevelChange('All');
                }}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Show All Courses
              </button>
            )}
          </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand Section */}
            <div>
              <h3 className="text-xl font-bold mb-4">MantranaEdge</h3>
              <p className="text-gray-400 text-sm">
                Empowering organizations through world-class training
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                    Courses
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => setShowContactForm(true)}
                    className="text-gray-400 hover:text-white transition-colors text-left"
                  >
                    Contact Us
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:mantranaedge@gmail.com" className="hover:text-white transition-colors">
                    mantranaedge@gmail.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:+919876543210" className="hover:text-white transition-colors">
                    +91 98765 43210
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Bangalore, India</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-700 pt-6 text-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} MantranaEdge. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Contact Form Modal */}
      {showContactForm && (
        <LeadForm
          courseName="General Inquiry"
          onClose={() => setShowContactForm(false)}
        />
      )}
    </div>
  );
}