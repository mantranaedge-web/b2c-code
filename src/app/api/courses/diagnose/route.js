import { NextResponse } from 'next/server';
import { google } from 'googleapis';

// Diagnostic endpoint to check Google Sheets configuration
export async function GET() {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    checks: {},
  };

  // Check 1: Environment Variables
  diagnostics.checks.environmentVariables = {
    GOOGLE_SHEET_ID: !!process.env.GOOGLE_SHEET_ID,
    GOOGLE_SHEET_ID_value: process.env.GOOGLE_SHEET_ID ? 
      `${process.env.GOOGLE_SHEET_ID.substring(0, 10)}...` : 'NOT SET',
    GOOGLE_SERVICE_ACCOUNT_EMAIL: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    GOOGLE_SERVICE_ACCOUNT_EMAIL_value: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || 'NOT SET',
    GOOGLE_PRIVATE_KEY: !!process.env.GOOGLE_PRIVATE_KEY,
    GOOGLE_PRIVATE_KEY_format: process.env.GOOGLE_PRIVATE_KEY ? 
      (process.env.GOOGLE_PRIVATE_KEY.includes('BEGIN PRIVATE KEY') ? 'Valid format' : 'Invalid format') : 
      'NOT SET',
  };

  // Check 2: Google Sheets Client Initialization
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    diagnostics.checks.googleSheetsClient = {
      status: 'SUCCESS',
      message: 'Google Sheets client initialized successfully',
    };

    // Check 3: Spreadsheet Access
    if (process.env.GOOGLE_SHEET_ID) {
      try {
        const spreadsheet = await sheets.spreadsheets.get({
          spreadsheetId: process.env.GOOGLE_SHEET_ID,
        });

        diagnostics.checks.spreadsheetAccess = {
          status: 'SUCCESS',
          spreadsheetTitle: spreadsheet.data.properties?.title,
          sheets: spreadsheet.data.sheets?.map(sheet => ({
            title: sheet.properties?.title,
            sheetId: sheet.properties?.sheetId,
          })),
        };

        // Check 4: Courses Sheet Exists
        const courseSheet = spreadsheet.data.sheets?.find(
          sheet => sheet.properties?.title === 'Courses'
        );

        if (courseSheet) {
          diagnostics.checks.coursesSheet = {
            status: 'SUCCESS',
            message: 'Courses sheet exists',
            sheetId: courseSheet.properties?.sheetId,
          };

          // Check 5: Headers Check
          try {
            const headerResponse = await sheets.spreadsheets.values.get({
              spreadsheetId: process.env.GOOGLE_SHEET_ID,
              range: 'Courses!A1:K1',
            });

            if (headerResponse.data.values && headerResponse.data.values.length > 0) {
              diagnostics.checks.coursesHeaders = {
                status: 'SUCCESS',
                headers: headerResponse.data.values[0],
              };
            } else {
              diagnostics.checks.coursesHeaders = {
                status: 'ERROR',
                message: 'No headers found in Courses sheet',
              };
            }
          } catch (error) {
            diagnostics.checks.coursesHeaders = {
              status: 'ERROR',
              message: error.message,
            };
          }
        } else {
          diagnostics.checks.coursesSheet = {
            status: 'ERROR',
            message: 'Courses sheet does not exist. Please visit /api/courses/init to create it.',
          };
        }
      } catch (error) {
        diagnostics.checks.spreadsheetAccess = {
          status: 'ERROR',
          message: error.message,
          errorCode: error.code,
          hint: 'Check if service account has access to the spreadsheet',
        };
      }
    }
  } catch (error) {
    diagnostics.checks.googleSheetsClient = {
      status: 'ERROR',
      message: error.message,
      errorCode: error.code,
    };
  }

  // Overall Status
  const allChecks = Object.values(diagnostics.checks);
  const hasErrors = allChecks.some(check => 
    check.status === 'ERROR' || 
    (typeof check === 'object' && Object.values(check).some(v => v === false))
  );

  diagnostics.overallStatus = hasErrors ? 'ISSUES_FOUND' : 'ALL_CHECKS_PASSED';

  // Recommendations
  diagnostics.recommendations = [];

  if (!process.env.GOOGLE_SHEET_ID) {
    diagnostics.recommendations.push('Set GOOGLE_SHEET_ID environment variable');
  }
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
    diagnostics.recommendations.push('Set GOOGLE_SERVICE_ACCOUNT_EMAIL environment variable');
  }
  if (!process.env.GOOGLE_PRIVATE_KEY) {
    diagnostics.recommendations.push('Set GOOGLE_PRIVATE_KEY environment variable');
  }
  if (diagnostics.checks.coursesSheet?.status === 'ERROR') {
    diagnostics.recommendations.push('Initialize Courses sheet by visiting /api/courses/init');
  }
  if (diagnostics.checks.spreadsheetAccess?.status === 'ERROR') {
    diagnostics.recommendations.push('Verify service account has Editor access to the spreadsheet');
  }

  return NextResponse.json(diagnostics, { status: 200 });
}