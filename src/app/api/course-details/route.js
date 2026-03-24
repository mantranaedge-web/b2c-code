import { NextResponse } from 'next/server';
import { 
  addCourseDetailsToSheet, 
  getCourseDetailsFromSheet,
  getCourseDetailsByTitle 
} from '../../../lib/courseManager.js';

// GET course details - either all or by course title
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseTitle = searchParams.get('title');

    if (courseTitle) {
      // Get details for a specific course
      const result = await getCourseDetailsByTitle(courseTitle);

      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          detail: result.detail,
        },
        { status: 200 }
      );
    } else {
      // Get all course details
      const result = await getCourseDetailsFromSheet();

      if (!result.success) {
        console.error('Failed to get course details from Google Sheets:', result.error);
        return NextResponse.json(
          { error: 'Failed to fetch course details' },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          count: result.details.length,
          details: result.details,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Get course details error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course details' },
      { status: 500 }
    );
  }
}

// POST new course details (bulk upload)
export async function POST(request) {
  try {
    const body = await request.json();
    const { courseDetails } = body;

    if (!courseDetails || !Array.isArray(courseDetails) || courseDetails.length === 0) {
      return NextResponse.json(
        { error: 'Please provide an array of course details' },
        { status: 400 }
      );
    }

    // Validate each course detail has required fields
    for (const detail of courseDetails) {
      if (!detail.courseTitle) {
        return NextResponse.json(
          { error: 'All course details must have a courseTitle field' },
          { status: 400 }
        );
      }

      // Validate modules format if provided
      if (detail.modules && !Array.isArray(detail.modules)) {
        return NextResponse.json(
          { error: 'modules must be an array of objects with title, duration, and description' },
          { status: 400 }
        );
      }

      // Validate learning outcomes format if provided
      if (detail.learningOutcomes && !Array.isArray(detail.learningOutcomes)) {
        return NextResponse.json(
          { error: 'learningOutcomes must be an array of strings' },
          { status: 400 }
        );
      }

      // Validate prerequisites format if provided
      if (detail.prerequisites && !Array.isArray(detail.prerequisites)) {
        return NextResponse.json(
          { error: 'prerequisites must be an array of strings' },
          { status: 400 }
        );
      }
    }

    // Add course details to Google Sheets
    const result = await addCourseDetailsToSheet(courseDetails);

    if (!result.success) {
      console.error('Failed to add course details to Google Sheets:', result.error);
      
      // Check if it's a duplicate error
      if (result.duplicates) {
        return NextResponse.json(
          {
            error: result.error,
            details: result.errorDetails,
            duplicates: result.duplicates,
          },
          { status: 409 } // 409 Conflict for duplicates
        );
      }

      return NextResponse.json(
        {
          error: 'Failed to add course details. Please try again.',
          details: result.error,
          message: result.errorDetails || 'Check server logs for more details'
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Successfully added details for ${result.count} course(s)`,
        count: result.count,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Add course details error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      {
        error: 'Failed to add course details. Please try again.',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}