import { NextResponse } from 'next/server';
import { addLeadToSheet, getLeadsFromSheet } from '../../../lib/googleSheets.js';
import { sendLeadNotification } from '../../../lib/email.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, company, courseName, message } = body;

    // Validate required fields
    if (!name || !email || !phone || !company || !courseName) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Add lead to Google Sheets
    const sheetResult = await addLeadToSheet({
      name,
      email,
      phone,
      company,
      courseName,
      message: message || '',
    });

    if (!sheetResult.success) {
      console.error('Failed to add lead to Google Sheets:', sheetResult.error);
      return NextResponse.json(
        { error: 'Failed to submit lead. Please try again.' },
        { status: 500 }
      );
    }

    // Send email notification to sales team
    const emailResult = await sendLeadNotification({
      name,
      email,
      phone,
      company,
      courseName,
      message,
    });

    if (!emailResult.success) {
      console.error('Failed to send email notification:', emailResult.error);
      // Don't fail the request if email fails, just log it
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Lead submitted successfully',
        lead: {
          name,
          email,
          courseName,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Lead submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit lead. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    // Get all leads from Google Sheets
    const result = await getLeadsFromSheet();

    if (!result.success) {
      console.error('Failed to get leads from Google Sheets:', result.error);
      return NextResponse.json(
        { error: 'Failed to fetch leads' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        count: result.leads.length,
        leads: result.leads,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get leads error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}