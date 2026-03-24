'use client';
import { useState, useMemo, useEffect } from 'react';
import Header from '../components/Header';
import CourseCard from '../components/CourseCard';
import CourseSidebar from '../components/CourseSidebar';

export const dynamic = 'force-dynamic';

// Sample course data (fallback if Google Sheets is not available)
const sampleCourses = [
  {
    id: 1,
    title: 'Full Stack Web Development',
    description: 'Master modern web development with React, Node.js, and MongoDB. Build production-ready applications from scratch.',
    duration: '12 weeks',
    level: 'Intermediate',
    price: 49999,
    category: 'Web Development',
    instructor: 'Rajesh Kumar',
    rating: 4.8,
    studentsEnrolled: 2500,
  },
  {
    id: 2,
    title: 'Data Science & Machine Learning',
    description: 'Learn Python, data analysis, and machine learning algorithms. Build predictive models and AI solutions.',
    duration: '16 weeks',
    level: 'Advanced',
    price: 59999,
    category: 'Data Science',
    instructor: 'Priya Sharma',
    rating: 4.9,
    studentsEnrolled: 1800,
  },
  {
    id: 3,
    title: 'Digital Marketing Mastery',
    description: 'Comprehensive digital marketing training including SEO, SEM, social media, and content marketing strategies.',
    duration: '8 weeks',
    level: 'Beginner',
    price: 29999,
    category: 'Marketing',
    instructor: 'Amit Patel',
    rating: 4.7,
    studentsEnrolled: 3200,
  },
  {
    id: 4,
    title: 'Cloud Computing with AWS',
    description: 'Master Amazon Web Services, cloud architecture, and deployment strategies for scalable applications.',
    duration: '10 weeks',
    level: 'Intermediate',
    price: 44999,
    category: 'Cloud Computing',
    instructor: 'Sneha Reddy',
    rating: 4.8,
    studentsEnrolled: 1500,
  },
  {
    id: 5,
    title: 'Cybersecurity Fundamentals',
    description: 'Learn ethical hacking, network security, and cybersecurity best practices to protect digital assets.',
    duration: '14 weeks',
    level: 'Intermediate',
    price: 54999,
    category: 'Cybersecurity',
    instructor: 'Vikram Singh',
    rating: 4.9,
    studentsEnrolled: 1200,
  },
  {
    id: 6,
    title: 'UI/UX Design Bootcamp',
    description: 'Create stunning user interfaces and experiences using Figma, Adobe XD, and design thinking principles.',
    duration: '10 weeks',
    level: 'Beginner',
    price: 39999,
    category: 'Design',
    instructor: 'Neha Gupta',
    rating: 4.7,
    studentsEnrolled: 2100,
  },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [courses, setCourses] = useState(sampleCourses);
  const [loading, setLoading] = useState(true);

  // Fetch courses from Google Sheets on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses');
        const data = await response.json();
        
        if (data.success && data.courses.length > 0) {
          setCourses(data.courses);
        } else {
          // Use sample courses as fallback
          setCourses(sampleCourses);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        // Use sample courses as fallback
        setCourses(sampleCourses);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Extract unique categories and levels
  const categories = useMemo(() =>
    [...new Set(courses.map(course => course.category))],
    [courses]
  );
  
  const levels = useMemo(() =>
    [...new Set(courses.map(course => course.level))],
    [courses]
  );

  // Filter courses based on search, category, and level
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = searchQuery === '' || 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
      const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;

      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [searchQuery, selectedCategory, selectedLevel, courses]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Search */}
      <Header onSearch={setSearchQuery} />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Transform Your Workforce
            </h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Upskill your team with industry-leading courses
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-600">500+</div>
              <div className="text-sm text-gray-600">Companies</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600">50K+</div>
              <div className="text-sm text-gray-600">Learners</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600">100+</div>
              <div className="text-sm text-gray-600">Instructors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600">95%</div>
              <div className="text-sm text-gray-600">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <CourseSidebar
                categories={categories}
                levels={levels}
                selectedCategory={selectedCategory}
                selectedLevel={selectedLevel}
                onCategoryChange={setSelectedCategory}
                onLevelChange={setSelectedLevel}
                courseCount={filteredCourses.length}
              />
            </div>

            {/* Courses Grid */}
            <div className="lg:col-span-3">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {searchQuery ? `Search Results for "${searchQuery}"` : 'All Courses'}
                </h2>
                <p className="text-gray-600 mt-1">
                  {filteredCourses.length} courses available
                </p>
              </div>

              {filteredCourses.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search or filters
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setSelectedLevel('all');
                    }}
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">EdTech Pro</h3>
              <p className="text-gray-400">
                Empowering organizations through world-class training
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="/" className="hover:text-white">Courses</a></li>
                <li><a href="#" className="hover:text-white">For Business</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>sales@edtech.com</li>
                <li>+91 98765 43210</li>
                <li>Bangalore, India</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EdTech Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}