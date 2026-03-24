import { NextResponse } from 'next/server';
import { 
  getCoursesFromSheet, 
  getCourseDetailsFromSheet,
  addCoursesToSheet,
  addCourseDetailsToSheet 
} from '../../../../lib/courseManager.js';

/**
 * Enhanced bulk upload endpoint with validation and preview
 * Supports two modes:
 * - validate: Check for duplicates and validation errors without inserting
 * - insert: Actually insert the data after validation
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { mode, courses, courseDetails } = body;

    // Validate request
    if (!mode || !['validate', 'insert'].includes(mode)) {
      return NextResponse.json(
        { error: 'Invalid mode. Must be "validate" or "insert"' },
        { status: 400 }
      );
    }

    if ((!courses || courses.length === 0) && (!courseDetails || courseDetails.length === 0)) {
      return NextResponse.json(
        { error: 'Please provide courses and/or courseDetails to upload' },
        { status: 400 }
      );
    }

    const validationResults = {
      courses: { valid: [], invalid: [], duplicates: [] },
      courseDetails: { valid: [], invalid: [], duplicates: [] },
      summary: { totalProvided: 0, valid: 0, invalid: 0, duplicates: 0 }
    };

    // Validate and check courses
    if (courses && courses.length > 0) {
      validationResults.summary.totalProvided += courses.length;
      
      // Get existing courses from sheet
      const existingCoursesResult = await getCoursesFromSheet();
      const existingCourses = existingCoursesResult.success ? existingCoursesResult.courses : [];
      const existingCombinations = new Set(
        existingCourses.map(c => `${c.title.toLowerCase().trim()}|${c.level.toLowerCase().trim()}`)
      );

      // Validate each course
      for (let i = 0; i < courses.length; i++) {
        const course = courses[i];
        const errors = [];

        // Check required fields
        if (!course.title || course.title.trim() === '') errors.push('Missing title');
        if (!course.description || course.description.trim() === '') errors.push('Missing description');
        if (!course.duration || course.duration.trim() === '') errors.push('Missing duration');
        if (!course.level || course.level.trim() === '') errors.push('Missing level');
        if (!course.price || isNaN(course.price)) errors.push('Missing or invalid price');
        if (!course.category || course.category.trim() === '') errors.push('Missing category');
        if (!course.instructor || course.instructor.trim() === '') errors.push('Missing instructor');

        // Validate level
        if (course.level && !['Beginner', 'Intermediate', 'Advanced', 'Foundation'].includes(course.level)) {
          errors.push('Level must be: Beginner, Intermediate, Advanced, or Foundation');
        }

        // Check for duplicates
        const combination = `${(course.title || '').toLowerCase().trim()}|${(course.level || '').toLowerCase().trim()}`;
        const isDuplicate = existingCombinations.has(combination);

        const validationEntry = {
          index: i + 1,
          title: course.title || '(missing)',
          level: course.level || '(missing)',
          errors: errors,
          isDuplicate: isDuplicate
        };

        if (errors.length > 0) {
          validationResults.courses.invalid.push(validationEntry);
          validationResults.summary.invalid++;
        } else if (isDuplicate) {
          validationResults.courses.duplicates.push(validationEntry);
          validationResults.summary.duplicates++;
        } else {
          validationResults.courses.valid.push(validationEntry);
          validationResults.summary.valid++;
        }
      }
    }

    // Validate and check course details
    if (courseDetails && courseDetails.length > 0) {
      validationResults.summary.totalProvided += courseDetails.length;
      
      // Get existing course details from sheet
      const existingDetailsResult = await getCourseDetailsFromSheet();
      const existingDetails = existingDetailsResult.success ? existingDetailsResult.details : [];
      const existingTitles = new Set(
        existingDetails.map(d => d.courseTitle.toLowerCase().trim())
      );

      // Validate each course detail
      for (let i = 0; i < courseDetails.length; i++) {
        const detail = courseDetails[i];
        const errors = [];

        // Check required fields
        if (!detail.courseTitle || detail.courseTitle.trim() === '') errors.push('Missing courseTitle');
        if (!detail.courseLevel || detail.courseLevel.trim() === '') errors.push('Missing courseLevel');
        if (!detail.fullDescription || detail.fullDescription.trim() === '') errors.push('Missing fullDescription');
        
        // Check for duplicates
        const isDuplicate = existingTitles.has((detail.courseTitle || '').toLowerCase().trim());

        const validationEntry = {
          index: i + 1,
          courseTitle: detail.courseTitle || '(missing)',
          courseLevel: detail.courseLevel || '(missing)',
          errors: errors,
          isDuplicate: isDuplicate
        };

        if (errors.length > 0) {
          validationResults.courseDetails.invalid.push(validationEntry);
          validationResults.summary.invalid++;
        } else if (isDuplicate) {
          validationResults.courseDetails.duplicates.push(validationEntry);
          validationResults.summary.duplicates++;
        } else {
          validationResults.courseDetails.valid.push(validationEntry);
          validationResults.summary.valid++;
        }
      }
    }

    // If mode is validate, return validation results without inserting
    if (mode === 'validate') {
      return NextResponse.json({
        success: true,
        mode: 'validate',
        validation: validationResults,
        canProceed: validationResults.summary.invalid === 0,
        message: validationResults.summary.invalid > 0 
          ? `Found ${validationResults.summary.invalid} validation errors. Please fix them before uploading.`
          : validationResults.summary.duplicates > 0
          ? `Found ${validationResults.summary.duplicates} duplicates. Review before proceeding.`
          : `All ${validationResults.summary.valid} entries are valid and ready to upload.`
      });
    }

    // If mode is insert, only insert valid courses (skip duplicates and invalid)
    if (mode === 'insert') {
      const insertResults = {
        courses: { inserted: 0, failed: 0, skipped: 0 },
        courseDetails: { inserted: 0, failed: 0, skipped: 0 }
      };

      // Insert valid courses
      if (validationResults.courses.valid.length > 0) {
        const validCourses = validationResults.courses.valid.map(v => {
          const originalIndex = v.index - 1;
          return courses[originalIndex];
        });

        const coursesResult = await addCoursesToSheet(validCourses);
        if (coursesResult.success) {
          insertResults.courses.inserted = coursesResult.count;
        } else {
          insertResults.courses.failed = validCourses.length;
        }
      }
      insertResults.courses.skipped = validationResults.courses.duplicates.length + validationResults.courses.invalid.length;

      // Insert valid course details
      if (validationResults.courseDetails.valid.length > 0) {
        const validDetails = validationResults.courseDetails.valid.map(v => {
          const originalIndex = v.index - 1;
          return courseDetails[originalIndex];
        });

        const detailsResult = await addCourseDetailsToSheet(validDetails);
        if (detailsResult.success) {
          insertResults.courseDetails.inserted = detailsResult.count;
        } else {
          insertResults.courseDetails.failed = validDetails.length;
        }
      }
      insertResults.courseDetails.skipped = validationResults.courseDetails.duplicates.length + validationResults.courseDetails.invalid.length;

      return NextResponse.json({
        success: true,
        mode: 'insert',
        results: insertResults,
        validation: validationResults,
        message: `Successfully inserted ${insertResults.courses.inserted} courses and ${insertResults.courseDetails.inserted} course details. Skipped ${insertResults.courses.skipped + insertResults.courseDetails.skipped} entries (duplicates or invalid).`
      }, { status: 201 });
    }

  } catch (error) {
    console.error('Bulk upload error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process bulk upload',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}