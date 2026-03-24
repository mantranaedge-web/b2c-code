/**
 * Script to clear and reset Google Sheets with fresh test data
 * This will:
 * 1. Clear all existing data from Courses and CourseDetails sheets
 * 2. Keep the headers intact
 * 3. Populate with fresh test data
 */

import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Initialize Google Sheets API
const getGoogleSheetsClient = () => {
  try {
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;
    
    if (process.env.GOOGLE_PRIVATE_KEY_BASE64) {
      privateKey = Buffer.from(process.env.GOOGLE_PRIVATE_KEY_BASE64, 'base64').toString('utf-8');
    } else if (privateKey) {
      privateKey = privateKey.replace(/\\n/g, '\n');
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
    console.error('❌ Google Sheets client initialization error:', error);
    throw error;
  }
};

// Clear sheet data (keeping headers)
async function clearSheetData(sheets, spreadsheetId, sheetName, headerRow) {
  try {
    console.log(`\n🗑️  Clearing data from ${sheetName} sheet...`);
    
    // Get the last row with data
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A:Z`,
    });
    
    const rows = response.data.values || [];
    if (rows.length <= 1) {
      console.log(`   ℹ️  ${sheetName} sheet is already empty (only headers exist)`);
      return { success: true, message: 'Already empty' };
    }
    
    // Clear all data except header row
    const clearRange = `${sheetName}!A2:Z${rows.length}`;
    await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range: clearRange,
    });
    
    console.log(`   ✅ Cleared ${rows.length - 1} rows from ${sheetName}`);
    return { success: true, clearedRows: rows.length - 1 };
  } catch (error) {
    console.error(`   ❌ Error clearing ${sheetName}:`, error.message);
    return { success: false, error: error.message };
  }
}

// Populate Courses sheet
async function populateCoursesSheet(sheets, spreadsheetId) {
  try {
    console.log('\n📚 Populating Courses sheet with test data...');
    
    // Read test courses data
    const testCoursesPath = path.join(__dirname, '../test-courses.json');
    const coursesData = JSON.parse(fs.readFileSync(testCoursesPath, 'utf-8'));
    
    // Prepare rows data
    const values = coursesData.map(course => [
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
    
    console.log(`   ✅ Added ${values.length} courses to Courses sheet`);
    coursesData.forEach((course, idx) => {
      console.log(`      ${idx + 1}. ${course.title} (${course.level})`);
    });
    
    return { success: true, count: values.length };
  } catch (error) {
    console.error('   ❌ Error populating Courses sheet:', error.message);
    return { success: false, error: error.message };
  }
}

// Populate CourseDetails sheet
async function populateCourseDetailsSheet(sheets, spreadsheetId) {
  try {
    console.log('\n📋 Populating CourseDetails sheet with test data...');
    
    // Read course details template
    const detailsPath = path.join(__dirname, '../COURSE_DETAILS_TEMPLATE.json');
    const detailsData = JSON.parse(fs.readFileSync(detailsPath, 'utf-8'));
    
    // Prepare rows data
    const values = detailsData.courseDetails.map(detail => [
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
    
    console.log(`   ✅ Added ${values.length} course details to CourseDetails sheet`);
    detailsData.courseDetails.forEach((detail, idx) => {
      console.log(`      ${idx + 1}. ${detail.courseTitle} (${detail.courseLevel})`);
    });
    
    return { success: true, count: values.length };
  } catch (error) {
    console.error('   ❌ Error populating CourseDetails sheet:', error.message);
    return { success: false, error: error.message };
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting Google Sheets Reset Process...');
  console.log('=' .repeat(60));
  
  try {
    // Validate environment variables
    const spreadsheetId = process.env.GOOGLE_COURSES_SHEET_ID || process.env.GOOGLE_SHEET_ID;
    if (!spreadsheetId) {
      throw new Error('❌ Missing GOOGLE_COURSES_SHEET_ID or GOOGLE_SHEET_ID in environment');
    }
    
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
      throw new Error('❌ Missing GOOGLE_SERVICE_ACCOUNT_EMAIL in environment');
    }
    
    if (!process.env.GOOGLE_PRIVATE_KEY) {
      throw new Error('❌ Missing GOOGLE_PRIVATE_KEY in environment');
    }
    
    console.log(`\n📊 Using spreadsheet ID: ${spreadsheetId}`);
    
    // Initialize Google Sheets client
    const sheets = getGoogleSheetsClient();
    console.log('✅ Google Sheets client initialized');
    
    // Step 1: Clear Courses sheet
    const clearCoursesResult = await clearSheetData(sheets, spreadsheetId, 'Courses', 'A1:K1');
    if (!clearCoursesResult.success) {
      throw new Error(`Failed to clear Courses sheet: ${clearCoursesResult.error}`);
    }
    
    // Step 2: Clear CourseDetails sheet
    const clearDetailsResult = await clearSheetData(sheets, spreadsheetId, 'CourseDetails', 'A1:P1');
    if (!clearDetailsResult.success) {
      throw new Error(`Failed to clear CourseDetails sheet: ${clearDetailsResult.error}`);
    }
    
    // Step 3: Populate Courses sheet
    const populateCoursesResult = await populateCoursesSheet(sheets, spreadsheetId);
    if (!populateCoursesResult.success) {
      throw new Error(`Failed to populate Courses sheet: ${populateCoursesResult.error}`);
    }
    
    // Step 4: Populate CourseDetails sheet
    const populateDetailsResult = await populateCourseDetailsSheet(sheets, spreadsheetId);
    if (!populateDetailsResult.success) {
      throw new Error(`Failed to populate CourseDetails sheet: ${populateDetailsResult.error}`);
    }
    
    // Summary
    console.log('\n' + '=' .repeat(60));
    console.log('✅ RESET COMPLETE!');
    console.log('=' .repeat(60));
    console.log(`\n📊 Summary:`);
    console.log(`   • Courses added: ${populateCoursesResult.count}`);
    console.log(`   • Course Details added: ${populateDetailsResult.count}`);
    console.log(`\n🔗 View your sheet: https://docs.google.com/spreadsheets/d/${spreadsheetId}`);
    console.log('\n✨ Your Google Sheets have been reset with fresh test data!');
    
  } catch (error) {
    console.error('\n' + '=' .repeat(60));
    console.error('❌ ERROR OCCURRED');
    console.error('=' .repeat(60));
    console.error(`\n${error.message}`);
    console.error('\nStack trace:', error.stack);
    process.exit(1);
  }
}

// Run the script
main().catch(console.error);