import { NextResponse } from 'next/server';
import { initializeCoursesSheet, initializeCourseDetailsSheet } from '../../../../lib/courseManager.js';

// Initialize Courses and CourseDetails sheets with headers
export async function POST(request) {
  try {
    // Initialize both Courses and CourseDetails sheets
    const coursesResult = await initializeCoursesSheet();
    const detailsResult = await initializeCourseDetailsSheet();

    if (!coursesResult.success || !detailsResult.success) {
      console.error('Failed to initialize sheets:', {
        coursesError: coursesResult.success ? null : coursesResult.error,
        detailsError: detailsResult.success ? null : detailsResult.error,
      });
      return NextResponse.json(
        {
          error: 'Failed to initialize one or more sheets',
          coursesError: coursesResult.success ? null : coursesResult.error,
          detailsError: detailsResult.success ? null : detailsResult.error,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        courses: coursesResult.message,
        courseDetails: detailsResult.message,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Initialize courses sheets error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize courses sheets' },
      { status: 500 }
    );
  }
}