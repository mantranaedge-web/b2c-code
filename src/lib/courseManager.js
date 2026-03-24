import { google } from 'googleapis';

// Initialize Google Sheets API for Courses
const getGoogleSheetsClient = () => {
  try {
    // Handle different private key formats
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;
    
    // If it's base64 encoded, decode it first
    if (process.env.GOOGLE_PRIVATE_KEY_BASE64) {
      privateKey = Buffer.from(process.env.GOOGLE_PRIVATE_KEY_BASE64, 'base64').toString('utf-8');
    } else if (privateKey) {
      // Replace escaped newlines with actual newlines
      privateKey = privateKey.replace(/\\n/g, '\n');
      
      // Remove any extra quotes that might have been added
      if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
        privateKey = privateKey.slice(1, -1).replace(/\\n/g, '\n');
      }
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    return google.sheets({ version: 'v4', auth });
  } catch (error) {
    console.error('Google Sheets client initialization error:', error);
    console.error('Private key format issue. Check GOOGLE_PRIVATE_KEY in environment variables.');
    throw error;
  }
};

// Add courses to Google Sheets
export async function addCoursesToSheet(courses) {
  try {
    // Use separate Courses sheet ID if available, fallback to main sheet ID for backward compatibility
    const spreadsheetId = process.env.GOOGLE_COURSES_SHEET_ID || process.env.GOOGLE_SHEET_ID;
    
    // Validate environment variables
    if (!spreadsheetId) {
      throw new Error('Neither GOOGLE_COURSES_SHEET_ID nor GOOGLE_SHEET_ID is defined in environment variables');
    }
    
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_EMAIL is not defined in environment variables');
    }
    
    if (!process.env.GOOGLE_PRIVATE_KEY) {
      throw new Error('GOOGLE_PRIVATE_KEY is not defined in environment variables');
    }

    const sheets = getGoogleSheetsClient();
    
    // Check for duplicate courses by title + level combination
    const existingCoursesResult = await getCoursesFromSheet();
    if (existingCoursesResult.success) {
      const existingCombinations = existingCoursesResult.courses.map(c =>
        `${c.title.toLowerCase().trim()}|${c.level.toLowerCase().trim()}`
      );
      const duplicates = courses.filter(course =>
        existingCombinations.includes(`${course.title.toLowerCase().trim()}|${course.level.toLowerCase().trim()}`)
      );
      
      if (duplicates.length > 0) {
        return {
          success: false,
          error: 'Duplicate courses detected',
          errorDetails: `The following courses already exist: ${duplicates.map(c => `${c.title} (${c.level})`).join(', ')}`,
          duplicates: duplicates.map(c => `${c.title} (${c.level})`),
        };
      }
    }

    // Check if Courses sheet exists and has headers
    try {
      const spreadsheet = await sheets.spreadsheets.get({
        spreadsheetId,
      });

      const courseSheet = spreadsheet.data.sheets?.find(
        sheet => sheet.properties?.title === 'Courses'
      );

      if (!courseSheet) {
        return {
          success: false,
          error: 'Courses sheet does not exist',
          errorDetails: 'Please initialize the Courses sheet first by visiting /api/courses/init',
        };
      }
    } catch (error) {
      console.error('Error checking spreadsheet:', error);
      return {
        success: false,
        error: 'Failed to access Google Spreadsheet',
        errorDetails: error.message,
      };
    }

    // Prepare rows data
    const values = courses.map(course => [
      course.title,
      course.description,
      course.duration,
      course.level,
      course.price,
      course.category,
      course.instructor,
      course.rating || 0,
      course.studentsEnrolled || 0,
      'active', // status
      new Date().toISOString(), // createdAt
    ]);

    // Append to sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Courses!A:K',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    return {
      success: true,
      count: values.length,
      updatedRange: response.data.updates.updatedRange,
    };
  } catch (error) {
    console.error('Error adding courses to Google Sheets:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });
    return {
      success: false,
      error: error.message,
      errorDetails: `${error.message}. Check if: 1) Google Sheet exists and is accessible, 2) Service account has edit permissions, 3) Courses sheet is initialized`,
    };
  }
}

// Get all courses from Google Sheets
export async function getCoursesFromSheet() {
  try {
    const sheets = getGoogleSheetsClient();
    // Use separate Courses sheet ID if available, fallback to main sheet ID for backward compatibility
    const spreadsheetId = process.env.GOOGLE_COURSES_SHEET_ID || process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      throw new Error('Neither GOOGLE_COURSES_SHEET_ID nor GOOGLE_SHEET_ID is defined');
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Courses!A2:K', // Skip header row
    });

    const rows = response.data.values || [];

    // Convert rows to course objects
    const courses = rows
      .filter(row => row[9] === 'active') // Only active courses
      .map((row, index) => ({
        id: index + 1,
        title: row[0] || '',
        description: row[1] || '',
        duration: row[2] || '',
        level: row[3] || 'Beginner',
        price: parseInt(row[4]) || 0,
        category: row[5] || '',
        instructor: row[6] || '',
        rating: parseFloat(row[7]) || 0,
        studentsEnrolled: parseInt(row[8]) || 0,
        status: row[9] || 'active',
        createdAt: row[10] || '',
      }));

    return {
      success: true,
      courses,
    };
  } catch (error) {
    console.error('Error getting courses from Google Sheets:', error);
    return {
      success: false,
      error: error.message,
      courses: [],
    };
  }
}

// Initialize Courses sheet with headers
export async function initializeCoursesSheet() {
  try {
    const sheets = getGoogleSheetsClient();
    // Use separate Courses sheet ID if available, fallback to main sheet ID for backward compatibility
    const spreadsheetId = process.env.GOOGLE_COURSES_SHEET_ID || process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      throw new Error('Neither GOOGLE_COURSES_SHEET_ID nor GOOGLE_SHEET_ID is defined');
    }

    // Check if sheet exists
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    const courseSheet = spreadsheet.data.sheets?.find(
      sheet => sheet.properties?.title === 'Courses'
    );

    if (!courseSheet) {
      // Create Courses sheet
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: 'Courses',
                },
              },
            },
          ],
        },
      });
    }

    // Check if headers exist
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Courses!A1:K1',
    });

    // If no headers, add them
    if (!response.data.values || response.data.values.length === 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Courses!A1:K1',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [
            [
              'Title',
              'Description',
              'Duration',
              'Level',
              'Price',
              'Category',
              'Instructor',
              'Rating',
              'Students Enrolled',
              'Status',
              'Created At',
            ],
          ],
        },
      });

      return {
        success: true,
        message: 'Courses sheet initialized with headers',
      };
    }

    return {
      success: true,
      message: 'Courses sheet already has headers',
    };
  } catch (error) {
    console.error('Error initializing courses sheet:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Update course in Google Sheets
export async function updateCourseInSheet(rowNumber, courseData) {
  try {
    const sheets = getGoogleSheetsClient();
    // Use separate Courses sheet ID if available, fallback to main sheet ID for backward compatibility
    const spreadsheetId = process.env.GOOGLE_COURSES_SHEET_ID || process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      throw new Error('Neither GOOGLE_COURSES_SHEET_ID nor GOOGLE_SHEET_ID is defined');
    }

    const values = [[
      courseData.title,
      courseData.description,
      courseData.duration,
      courseData.level,
      courseData.price,
      courseData.category,
      courseData.instructor,
      courseData.rating || 0,
      courseData.studentsEnrolled || 0,
      courseData.status || 'active',
      courseData.createdAt || new Date().toISOString(),
    ]];

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Courses!A${rowNumber}:K${rowNumber}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    return {
      success: true,
      message: 'Course updated successfully',
    };
  } catch (error) {
    console.error('Error updating course in Google Sheets:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Delete course (mark as inactive)
export async function deleteCourseFromSheet(rowNumber) {
  try {
    const sheets = getGoogleSheetsClient();
    // Use separate Courses sheet ID if available, fallback to main sheet ID for backward compatibility
    const spreadsheetId = process.env.GOOGLE_COURSES_SHEET_ID || process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      throw new Error('Neither GOOGLE_COURSES_SHEET_ID nor GOOGLE_SHEET_ID is defined');
    }

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Courses!J${rowNumber}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [['inactive']],
      },
    });

    return {
      success: true,
      message: 'Course marked as inactive',
    };
  } catch (error) {
    console.error('Error deleting course from Google Sheets:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// ============================================
// COURSE DETAILS MANAGEMENT
// ============================================

/**
 * Add course details to Google Sheets
 * Course details include: modules, learning outcomes, prerequisites, instructor bio, etc.
 */
export async function addCourseDetailsToSheet(courseDetails) {
  try {
    const sheets = getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_COURSES_SHEET_ID || process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      throw new Error('Neither GOOGLE_COURSES_SHEET_ID nor GOOGLE_SHEET_ID is defined');
    }

    // Check if CourseDetails sheet exists
    try {
      const spreadsheet = await sheets.spreadsheets.get({
        spreadsheetId,
      });

      const detailsSheet = spreadsheet.data.sheets?.find(
        sheet => sheet.properties?.title === 'CourseDetails'
      );

      if (!detailsSheet) {
        return {
          success: false,
          error: 'CourseDetails sheet does not exist',
          errorDetails: 'Please initialize the CourseDetails sheet first by visiting /api/courses/init',
        };
      }
    } catch (error) {
      console.error('Error checking spreadsheet:', error);
      return {
        success: false,
        error: 'Failed to access Google Spreadsheet',
        errorDetails: error.message,
      };
    }

    // Check for duplicates
    const existingDetails = await getCourseDetailsFromSheet();
    if (existingDetails.success) {
      const existingTitles = existingDetails.details.map(d => d.courseTitle.toLowerCase().trim());
      const duplicates = courseDetails.filter(detail => 
        existingTitles.includes(detail.courseTitle.toLowerCase().trim())
      );
      
      if (duplicates.length > 0) {
        return {
          success: false,
          error: 'Duplicate course details detected',
          errorDetails: `Details already exist for: ${duplicates.map(d => d.courseTitle).join(', ')}`,
          duplicates: duplicates.map(d => d.courseTitle),
        };
      }
    }

    // Prepare rows data with new structure
    const values = courseDetails.map(detail => [
      detail.courseTitle,
      detail.courseLevel || '',
      detail.fullDescription || '',
      detail.targetAudience || '',
      JSON.stringify(detail.keyConcepts || []),
      JSON.stringify(detail.learningOutcomes || []),
      JSON.stringify(detail.benefitsOrganizations || []),
      JSON.stringify(detail.benefitsIndividuals || []),
      JSON.stringify(detail.prerequisites || []),
      detail.examFormat || '',
      detail.examQuestions || 0,
      detail.examPassPercentage || 0,
      detail.examDuration || '',
      detail.examBookType || '',
      detail.instructorBio || '',
      new Date().toISOString(), // createdAt
    ]);

    // Append to sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'CourseDetails!A:P',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    return {
      success: true,
      count: values.length,
      updatedRange: response.data.updates.updatedRange,
    };
  } catch (error) {
    console.error('Error adding course details to Google Sheets:', error);
    return {
      success: false,
      error: error.message,
      errorDetails: `${error.message}. Check if: 1) Google Sheet exists and is accessible, 2) Service account has edit permissions, 3) CourseDetails sheet is initialized`,
    };
  }
}

/**
 * Get all course details from Google Sheets
 */
export async function getCourseDetailsFromSheet() {
  try {
    const sheets = getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_COURSES_SHEET_ID || process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      throw new Error('Neither GOOGLE_COURSES_SHEET_ID nor GOOGLE_SHEET_ID is defined');
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'CourseDetails!A2:P', // Skip header row
    });

    const rows = response.data.values || [];

    // Convert rows to course detail objects with new structure
    const details = rows.map((row, index) => ({
      id: index + 1,
      courseTitle: row[0] || '',
      courseLevel: row[1] || '',
      fullDescription: row[2] || '',
      targetAudience: row[3] || '',
      keyConcepts: row[4] ? JSON.parse(row[4]) : [],
      learningOutcomes: row[5] ? JSON.parse(row[5]) : [],
      benefitsOrganizations: row[6] ? JSON.parse(row[6]) : [],
      benefitsIndividuals: row[7] ? JSON.parse(row[7]) : [],
      prerequisites: row[8] ? JSON.parse(row[8]) : [],
      examFormat: row[9] || '',
      examQuestions: parseInt(row[10]) || 0,
      examPassPercentage: parseInt(row[11]) || 0,
      examDuration: row[12] || '',
      examBookType: row[13] || '',
      instructorBio: row[14] || '',
      createdAt: row[15] || '',
    }));

    return {
      success: true,
      details,
    };
  } catch (error) {
    console.error('Error getting course details from Google Sheets:', error);
    return {
      success: false,
      error: error.message,
      details: [],
    };
  }
}

/**
 * Get course details by course title
 */
export async function getCourseDetailsByTitle(courseTitle) {
  try {
    const result = await getCourseDetailsFromSheet();
    if (!result.success) {
      return result;
    }

    const detail = result.details.find(
      d => d.courseTitle.toLowerCase().trim() === courseTitle.toLowerCase().trim()
    );

    if (!detail) {
      return {
        success: false,
        error: 'Course details not found',
        detail: null,
      };
    }

    return {
      success: true,
      detail,
    };
  } catch (error) {
    console.error('Error getting course details by title:', error);
    return {
      success: false,
      error: error.message,
      detail: null,
    };
  }
}

/**
 * Initialize CourseDetails sheet with headers
 */
export async function initializeCourseDetailsSheet() {
  try {
    const sheets = getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_COURSES_SHEET_ID || process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      throw new Error('Neither GOOGLE_COURSES_SHEET_ID nor GOOGLE_SHEET_ID is defined');
    }

    // Check if sheet exists
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    const detailsSheet = spreadsheet.data.sheets?.find(
      sheet => sheet.properties?.title === 'CourseDetails'
    );

    if (!detailsSheet) {
      // Create CourseDetails sheet
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: 'CourseDetails',
                },
              },
            },
          ],
        },
      });
    }

    // Check if headers exist
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'CourseDetails!A1:P1',
    });

    // If no headers, add them
    if (!response.data.values || response.data.values.length === 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'CourseDetails!A1:P1',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [
            [
              'Course Title',
              'Course Level',
              'Full Description',
              'Target Audience',
              'Key Concepts (JSON)',
              'Learning Outcomes (JSON)',
              'Benefits Organizations (JSON)',
              'Benefits Individuals (JSON)',
              'Prerequisites (JSON)',
              'Exam Format',
              'Exam Questions',
              'Exam Pass Percentage',
              'Exam Duration',
              'Exam Book Type',
              'Instructor Bio',
              'Created At',
            ],
          ],
        },
      });

      return {
        success: true,
        message: 'CourseDetails sheet initialized with headers',
      };
    }

    return {
      success: true,
      message: 'CourseDetails sheet already has headers',
    };
  } catch (error) {
    console.error('Error initializing course details sheet:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}