import { google } from 'googleapis';

// Initialize Google Sheets API
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

// Add lead to Google Sheets
export async function addLeadToSheet(leadData) {
  try {
    const sheets = getGoogleSheetsClient();
    // Use separate Leads sheet ID if available, fallback to main sheet ID for backward compatibility
    const spreadsheetId = process.env.GOOGLE_LEADS_SHEET_ID || process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      throw new Error('Neither GOOGLE_LEADS_SHEET_ID nor GOOGLE_SHEET_ID is defined');
    }

    const { name, email, phone, company, courseName, message } = leadData;
    const timestamp = new Date().toISOString();

    // Prepare row data
    const values = [
      [
        timestamp,
        name,
        email,
        phone,
        company,
        courseName,
        message || '',
        'new', // status
      ],
    ];

    // Append to sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Leads!A:H', // Adjust range based on your sheet name
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    return {
      success: true,
      updatedRange: response.data.updates.updatedRange,
    };
  } catch (error) {
    console.error('Error adding lead to Google Sheets:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Get all leads from Google Sheets
export async function getLeadsFromSheet() {
  try {
    const sheets = getGoogleSheetsClient();
    // Use separate Leads sheet ID if available, fallback to main sheet ID for backward compatibility
    const spreadsheetId = process.env.GOOGLE_LEADS_SHEET_ID || process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      throw new Error('Neither GOOGLE_LEADS_SHEET_ID nor GOOGLE_SHEET_ID is defined');
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Leads!A2:H', // Skip header row
    });

    const rows = response.data.values || [];

    // Convert rows to lead objects
    const leads = rows.map((row, index) => ({
      id: index + 2, // Row number (starting from 2 because of header)
      timestamp: row[0] || '',
      name: row[1] || '',
      email: row[2] || '',
      phone: row[3] || '',
      company: row[4] || '',
      courseName: row[5] || '',
      message: row[6] || '',
      status: row[7] || 'new',
    }));

    return {
      success: true,
      leads: leads.reverse(), // Most recent first
    };
  } catch (error) {
    console.error('Error getting leads from Google Sheets:', error);
    return {
      success: false,
      error: error.message,
      leads: [],
    };
  }
}

// Initialize sheet with headers (call this once)
export async function initializeSheet() {
  try {
    const sheets = getGoogleSheetsClient();
    // Use separate Leads sheet ID if available, fallback to main sheet ID for backward compatibility
    const spreadsheetId = process.env.GOOGLE_LEADS_SHEET_ID || process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      throw new Error('Neither GOOGLE_LEADS_SHEET_ID nor GOOGLE_SHEET_ID is defined');
    }

    // Check if headers exist
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Leads!A1:H1',
    });

    // If no headers, add them
    if (!response.data.values || response.data.values.length === 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Leads!A1:H1',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [
            [
              'Timestamp',
              'Name',
              'Email',
              'Phone',
              'Company',
              'Course Name',
              'Message',
              'Status',
            ],
          ],
        },
      });

      return {
        success: true,
        message: 'Sheet initialized with headers',
      };
    }

    return {
      success: true,
      message: 'Sheet already has headers',
    };
  } catch (error) {
    console.error('Error initializing sheet:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}