'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function PreviewTestPage() {
  const [coursesJson, setCoursesJson] = useState('');
  const [validationResults, setValidationResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleValidate = async () => {
    if (!coursesJson.trim()) {
      alert('Please paste JSON data');
      return;
    }
    
    setLoading(true);
    try {
      const courses = JSON.parse(coursesJson);
      const response = await fetch('/api/courses/bulk-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'validate', courses }),
      });
      const data = await response.json();
      setValidationResults(data);
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInsert = async () => {
    setLoading(true);
    try {
      const courses = JSON.parse(coursesJson);
      const response = await fetch('/api/courses/bulk-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'insert', courses }),
      });
      const data = await response.json();
      alert(data.message || 'Upload complete!');
      setValidationResults(null);
      setCoursesJson('');
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin" className="text-blue-600 hover:underline mb-4 inline-block">← Back to Admin</Link>
        <h1 className="text-3xl font-bold mb-6">Preview Mode Test</h1>

        {!validationResults ? (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Step 1: Paste Courses JSON</h2>
            <textarea
              value={coursesJson}
              onChange={(e) => setCoursesJson(e.target.value)}
              rows="15"
              placeholder='[{"title":"Course Name","description":"...","duration":"3 days","level":"Foundation","price":25999,"category":"IT","instructor":"Trainer"}]'
              className="w-full p-4 border rounded font-mono text-sm mb-4"
            />
            <button
              onClick={handleValidate}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Validating...' : 'Validate & Preview →'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Step 2: Review Validation Results</h2>
              
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded">
                  <div className="text-2xl font-bold">{validationResults.validation.summary.totalProvided}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded">
                  <div className="text-2xl font-bold text-green-600">{validationResults.validation.summary.valid}</div>
                  <div className="text-sm text-gray-600">Valid</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded">
                  <div className="text-2xl font-bold text-yellow-600">{validationResults.validation.summary.duplicates}</div>
                  <div className="text-sm text-gray-600">Duplicates</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded">
                  <div className="text-2xl font-bold text-red-600">{validationResults.validation.summary.invalid}</div>
                  <div className="text-sm text-gray-600">Invalid</div>
                </div>
              </div>

              <div className={`p-4 rounded mb-6 ${validationResults.canProceed ? 'bg-green-50 text-green-900' : 'bg-red-50 text-red-900'}`}>
                <strong>{validationResults.message}</strong>
              </div>

              {validationResults.validation.courses.valid.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-green-600 mb-2">✓ Valid Courses ({validationResults.validation.courses.valid.length})</h3>
                  <div className="space-y-2">
                    {validationResults.validation.courses.valid.map((item) => (
                      <div key={item.index} className="p-3 bg-green-50 rounded border border-green-200">
                        #{item.index}: {item.title} ({item.level})
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {validationResults.validation.courses.duplicates.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-yellow-600 mb-2">⚠ Duplicates - Will be Skipped ({validationResults.validation.courses.duplicates.length})</h3>
                  <div className="space-y-2">
                    {validationResults.validation.courses.duplicates.map((item) => (
                      <div key={item.index} className="p-3 bg-yellow-50 rounded border border-yellow-200">
                        #{item.index}: {item.title} ({item.level}) - Already exists in sheet
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {validationResults.validation.courses.invalid.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-red-600 mb-2">✗ Invalid Courses ({validationResults.validation.courses.invalid.length})</h3>
                  <div className="space-y-2">
                    {validationResults.validation.courses.invalid.map((item) => (
                      <div key={item.index} className="p-3 bg-red-50 rounded border border-red-200">
                        <div className="font-semibold">#{item.index}: {item.title}</div>
                        <ul className="text-sm mt-1 ml-4">
                          {item.errors.map((error, idx) => (<li key={idx}>• {error}</li>))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setValidationResults(null)}
                  className="px-6 py-3 bg-gray-200 rounded hover:bg-gray-300"
                >
                  ← Back to Edit
                </button>
                <button
                  onClick={handleInsert}
                  disabled={loading || !validationResults.canProceed}
                  className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Uploading...' : `Confirm & Upload ${validationResults.validation.summary.valid} Valid Entries`}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}