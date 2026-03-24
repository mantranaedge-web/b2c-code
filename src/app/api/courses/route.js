import { NextResponse } from 'next/server';
import { getCoursesFromSheet, addCoursesToSheet } from '../../../lib/courseManager.js';

// GET all courses
export async function GET(request) {
  try {
    const result = await getCoursesFromSheet();

    if (!result.success) {
      console.error('Failed to get courses from Google Sheets:', result.error);
      return NextResponse.json(
        { error: 'Failed to fetch courses' },
        { status: 500 }
      );
    }

    // Deduplicate courses by title + level combination (case-insensitive)
    // Keep the most recent course based on createdAt timestamp
    const uniqueCourses = [];
    const seenCombinations = new Map();
    
    for (const course of result.courses) {
      const combination = `${course.title.trim().toLowerCase()}|${course.level.trim().toLowerCase()}`;
      
      if (!seenCombinations.has(combination)) {
        // First occurrence of this title + level combination
        seenCombinations.set(combination, course);
        uniqueCourses.push(course);
      } else {
        // Duplicate found - keep the most recent one
        const existing = seenCombinations.get(combination);
        const existingDate = new Date(existing.createdAt || 0);
        const currentDate = new Date(course.createdAt || 0);
        
        if (currentDate > existingDate) {
          // Replace with more recent course
          const index = uniqueCourses.findIndex(c =>
            `${c.title.trim().toLowerCase()}|${c.level.trim().toLowerCase()}` === combination
          );
          if (index !== -1) {
            uniqueCourses[index] = course;
            seenCombinations.set(combination, course);
          }
        }
      }
    }
    
    // Log if duplicates were found and removed
    const duplicateCount = result.courses.length - uniqueCourses.length;
    if (duplicateCount > 0) {
      console.log(`Removed ${duplicateCount} duplicate course(s) from results`);
    }

    return NextResponse.json(
      {
        success: true,
        count: uniqueCourses.length,
        courses: uniqueCourses,
        ...(duplicateCount > 0 && {
          warning: `${duplicateCount} duplicate(s) found in Google Sheets and filtered out. Consider cleaning up the sheet.`
        })
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get courses error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

// POST new courses (bulk upload)
export async function POST(request) {
  try {
    const body = await request.json();
    const { courses } = body;

    if (!courses || !Array.isArray(courses) || courses.length === 0) {
      return NextResponse.json(
        { error: 'Please provide an array of courses' },
        { status: 400 }
      );
    }

    // Validate each course has required fields
    for (const course of courses) {
      if (!course.title || !course.description || !course.duration ||
          !course.level || !course.price || !course.category || !course.instructor) {
        return NextResponse.json(
          { error: 'All courses must have: title, description, duration, level, price, category, instructor' },
          { status: 400 }
        );
      }
    }

    // Add courses to Google Sheets
    const result = await addCoursesToSheet(courses);

    if (!result.success) {
      console.error('Failed to add courses to Google Sheets:', result.error);
      console.error('Full error details:', result.errorDetails);
      return NextResponse.json(
        {
          error: 'Failed to add courses. Please try again.',
          details: result.error,
          message: result.errorDetails || 'Check server logs for more details'
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Successfully added ${result.count} courses`,
        count: result.count,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Add courses error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      {
        error: 'Failed to add courses. Please try again.',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}