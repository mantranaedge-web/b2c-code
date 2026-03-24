'use client';
import { useState } from 'react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function CourseUploadPage() {
  const [uploadMethod, setUploadMethod] = useState('csv');
  const [csvData, setCsvData] = useState('');
  const [jsonData, setJsonData] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [initialized, setInitialized] = useState(false);

  const handleInitialize = async () => {
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/courses/init', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: 'success',
          message: 'Courses sheet initialized successfully!',
        });
        setInitialized(true);
      } else {
        setStatus({
          type: 'error',
          message: data.error || 'Failed to initialize sheet',
        });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Failed to initialize sheet. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const parseCSV = (csv) => {
    const lines = csv.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const courses = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length !== headers.length) continue;

      const course = {};
      headers.forEach((header, index) => {
        let value = values[index]?.trim();
        
        // Remove quotes if present
        if (value?.startsWith('"') && value?.endsWith('"')) {
          value = value.slice(1, -1);
        }

        // Convert price, rating, studentsEnrolled to numbers
        if (header === 'price' || header === 'rating' || header === 'studentsEnrolled') {
          course[header] = parseFloat(value) || 0;
        } else {
          course[header] = value;
        }
      });
      courses.push(course);
    }

    return courses;
  };

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      setCsvData(content);
    };
    reader.readAsText(uploadedFile);
    setFile(uploadedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      let courses = [];

      if (uploadMethod === 'csv') {
        if (!csvData.trim()) {
          setStatus({ type: 'error', message: 'Please provide CSV data' });
          setLoading(false);
          return;
        }
        courses = parseCSV(csvData);
      } else {
        if (!jsonData.trim()) {
          setStatus({ type: 'error', message: 'Please provide JSON data' });
          setLoading(false);
          return;
        }
        try {
          courses = JSON.parse(jsonData);
        } catch (err) {
          setStatus({ type: 'error', message: 'Invalid JSON format' });
          setLoading(false);
          return;
        }
      }

      if (courses.length === 0) {
        setStatus({ type: 'error', message: 'No courses found in data' });
        setLoading(false);
        return;
      }

      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courses }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: 'success',
          message: `Successfully uploaded ${data.count} courses!`,
        });
        setCsvData('');
        setJsonData('');
        setFile(null);
      } else {
        setStatus({
          type: 'error',
          message: data.error || 'Failed to upload courses',
        });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Failed to upload courses. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const sampleCSV = `title,description,duration,level,price,category,instructor,rating,studentsEnrolled
Full Stack Web Development,"Master modern web development with React, Node.js, and MongoDB",12 weeks,Intermediate,49999,Web Development,Rajesh Kumar,4.8,2500
Data Science & Machine Learning,"Learn Python, data analysis, and machine learning algorithms",16 weeks,Advanced,59999,Data Science,Priya Sharma,4.9,1800`;

  const sampleJSON = `[
  {
    "title": "Full Stack Web Development",
    "description": "Master modern web development with React, Node.js, and MongoDB",
    "duration": "12 weeks",
    "level": "Intermediate",
    "price": 49999,
    "category": "Web Development",
    "instructor": "Rajesh Kumar",
    "rating": 4.8,
    "studentsEnrolled": 2500
  }
]`;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin" className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
            ← Back to Admin
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Bulk Course Upload</h1>
          <p className="text-gray-600 mt-2">Upload multiple courses at once using CSV or JSON format</p>
        </div>

        {/* Initialize Sheet */}
        {!initialized && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-yellow-900 mb-2">First Time Setup</h2>
            <p className="text-yellow-800 mb-4">
              Before uploading courses, you need to initialize the Courses sheet in Google Sheets.
            </p>
            <button
              onClick={handleInitialize}
              disabled={loading}
              className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Initializing...' : 'Initialize Courses Sheet'}
            </button>
          </div>
        )}

        {/* Upload Method Selector */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Choose Upload Method</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setUploadMethod('csv')}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                uploadMethod === 'csv'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              CSV Format
            </button>
            <button
              onClick={() => setUploadMethod('json')}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                uploadMethod === 'json'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              JSON Format
            </button>
          </div>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {uploadMethod === 'csv' ? 'CSV Upload' : 'JSON Upload'}
          </h2>

          {uploadMethod === 'csv' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload CSV File
                </label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Or paste CSV data below
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CSV Data
                </label>
                <textarea
                  value={csvData}
                  onChange={(e) => setCsvData(e.target.value)}
                  rows="10"
                  placeholder={sampleCSV}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                JSON Data
              </label>
              <textarea
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                rows="15"
                placeholder={sampleJSON}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 font-mono text-sm"
              />
            </div>
          )}

          {status.message && (
            <div
              className={`mt-4 p-4 rounded-lg ${
                status.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {status.message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Uploading...' : 'Upload Courses'}
          </button>
        </form>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">📋 Format Instructions</h3>
          
          <div className="space-y-4 text-blue-800">
            <div>
              <h4 className="font-semibold mb-2">Required Fields:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>title</strong> - Course title</li>
                <li><strong>description</strong> - Course description</li>
                <li><strong>duration</strong> - e.g., "12 weeks"</li>
                <li><strong>level</strong> - Beginner, Intermediate, or Advanced</li>
                <li><strong>price</strong> - Course price (number)</li>
                <li><strong>category</strong> - Course category</li>
                <li><strong>instructor</strong> - Instructor name</li>
                <li><strong>rating</strong> - Rating 0-5 (optional, default: 0)</li>
                <li><strong>studentsEnrolled</strong> - Number of students (optional, default: 0)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">CSV Format Tips:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>First row must be the header with field names</li>
                <li>Use commas to separate values</li>
                <li>Put descriptions with commas in quotes</li>
                <li>Download <a href="/courses-template.csv" className="underline font-semibold">template file</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">From Word Document:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Copy your course data from Word</li>
                <li>Paste into Excel/Google Sheets</li>
                <li>Organize into columns matching the required fields</li>
                <li>Export as CSV or copy and paste here</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}