'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function CoursePreparePage() {
  const [text, setText] = useState('');
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const sample = `Title: Web Development Bootcamp
Description: Learn HTML, CSS, JavaScript and React
Duration: 12 weeks
Level: Beginner
Price: 39999
Category: Web Development
Instructor: John Doe

Title: Data Science with Python
Description: Master data analysis and machine learning
Duration: 16 weeks
Level: Advanced  
Price: 59999
Category: Data Science
Instructor: Jane Smith`;

  const parse = () => {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    const result = [];
    let curr = {};
    
    lines.forEach(line => {
      if (line.match(/^title:/i)) curr.title = line.split(':')[1].trim();
      else if (line.match(/^description:/i)) curr.description = line.split(':')[1].trim();
      else if (line.match(/^duration:/i)) curr.duration = line.split(':')[1].trim();
      else if (line.match(/^level:/i)) curr.level = line.split(':')[1].trim();
      else if (line.match(/^price:/i)) curr.price = parseInt(line.split(':')[1].replace(/\D/g, ''));
      else if (line.match(/^category:/i)) curr.category = line.split(':')[1].trim();
      else if (line.match(/^instructor:/i)) {
        curr.instructor = line.split(':')[1].trim();
        if (curr.title) {
          result.push({...curr, rating: 0, studentsEnrolled: 0});
          curr = {};
        }
      }
    });
    
    if (curr.title) result.push({...curr, rating: 0, studentsEnrolled: 0});
    
    if (result.length > 0) {
      setCourses(result);
      setStatus(`Parsed ${result.length} courses`);
    } else {
      setStatus('No courses found');
    }
  };

  const upload = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({courses})
      });
      const data = await res.json();
      setStatus(res.ok ? `Uploaded ${data.count} courses!` : 'Upload failed');
    } catch {
      setStatus('Error uploading');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/admin" className="text-primary-600 mb-4 inline-block">← Admin</Link>
        <h1 className="text-3xl font-bold mb-2">Word to JSON Converter</h1>
        <p className="text-gray-600 mb-6">Paste course data from Word documents</p>

        {status && <div className="mb-4 p-4 bg-blue-50 rounded">{status}</div>}

        {courses.length === 0 ? (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-3">Format Example:</h3>
              <pre className="bg-gray-50 p-4 rounded text-sm overflow-auto">{sample}</pre>
              <button onClick={() => setText(sample)} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Use Sample
              </button>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <textarea value={text} onChange={(e) => setText(e.target.value)} rows="15"
                placeholder="Paste your course data here..."
                className="w-full px-4 py-3 border rounded-lg font-mono text-sm" />
              <div className="flex gap-3 mt-4">
                <button onClick={parse} className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700">
                  Parse Courses
                </button>
                <button onClick={() => setText('')} className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300">
                  Clear
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Review {courses.length} Courses</h2>
              <button onClick={() => {setCourses([]); setText('')}} className="text-primary-600">
                ← Start Over
              </button>
            </div>
            
            {courses.map((c, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold mb-4">Course {i + 1}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Title</label>
                    <input type="text" value={c.title} onChange={(e) => {
                      const u = [...courses]; u[i].title = e.target.value; setCourses(u);
                    }} className="w-full px-3 py-2 border rounded" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Category</label>
                    <input type="text" value={c.category} onChange={(e) => {
                      const u = [...courses]; u[i].category = e.target.value; setCourses(u);
                    }} className="w-full px-3 py-2 border rounded" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Duration</label>
                    <input type="text" value={c.duration} onChange={(e) => {
                      const u = [...courses]; u[i].duration = e.target.value; setCourses(u);
                    }} className="w-full px-3 py-2 border rounded" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Level</label>
                    <select value={c.level} onChange={(e) => {
                      const u = [...courses]; u[i].level = e.target.value; setCourses(u);
                    }} className="w-full px-3 py-2 border rounded">
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Price (₹)</label>
                    <input type="number" value={c.price} onChange={(e) => {
                      const u = [...courses]; u[i].price = parseInt(e.target.value); setCourses(u);
                    }} className="w-full px-3 py-2 border rounded" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Instructor</label>
                    <input type="text" value={c.instructor} onChange={(e) => {
                      const u = [...courses]; u[i].instructor = e.target.value; setCourses(u);
                    }} className="w-full px-3 py-2 border rounded" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm mb-1">Description</label>
                    <textarea value={c.description} onChange={(e) => {
                      const u = [...courses]; u[i].description = e.target.value; setCourses(u);
                    }} rows="2" className="w-full px-3 py-2 border rounded" />
                  </div>
                </div>
                <button onClick={() => setCourses(courses.filter((_, idx) => idx !== i))}
                  className="mt-4 text-red-600 text-sm">Remove Course</button>
              </div>
            ))}

            <div className="bg-white rounded-lg shadow p-6">
              <button onClick={upload} disabled={loading}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50">
                {loading ? 'Uploading...' : `Upload ${courses.length} Courses to Google Sheets`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}