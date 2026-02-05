import { NextRequest, NextResponse } from 'next/server';

// Flask backend URL - update this to match your Flask server
const FLASK_API_URL = process.env.FLASK_API_URL || 'http://localhost:5000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward the request to Flask backend
    const response = await fetch(`${FLASK_API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { 
          error: data.error || 'Prediction failed',
          message: data.message || 'An error occurred'
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    
    return NextResponse.json(
      {
        error: 'Connection failed',
        message: error instanceof Error 
          ? error.message 
          : 'Could not connect to prediction service. Make sure Flask backend is running on port 5000.'
      },
      { status: 500 }
    );
  }
}