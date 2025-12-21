// app/api/config/route.ts
import { NextRequest, NextResponse } from 'next/server';
// import { connectToDatabase } from '@/lib/mongodb';
import Config from '@/models/Config';
import DbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await DbConnect()

    const body = await request.json();
    console.log(body ,"body is fields")
    const {
      USER_ID,
      GITHUB_TOKEN,
      GITHUB_WEBHOOK_SECRET,
      GITHUB_USERNAME,
      GITHUB_REPO,
      TWITTER_API_KEY,
      TWITTER_API_SECRET,
      TWITTER_ACCESS_TOKEN,
      TWITTER_ACCESS_SECRET,
    } = body;

    // Validate required fields
    if (!GITHUB_TOKEN || !GITHUB_USERNAME || !TWITTER_API_KEY || !TWITTER_API_SECRET || !TWITTER_ACCESS_TOKEN || !TWITTER_ACCESS_SECRET) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

  const is_verified = await User.findOne({ _id: USER_ID });
  console.log(is_verified ,"is verified or not")

    if (!is_verified) {
      return NextResponse.json(
        { error: 'Authintacation is required' },
        { status: 400 }
      );
    }

    const config = {
      USER_ID,
      GITHUB_TOKEN,
      GITHUB_WEBHOOK_SECRET,
      GITHUB_USERNAME,
      GITHUB_REPO,
      TWITTER_API_KEY,
      TWITTER_API_SECRET,
      TWITTER_ACCESS_TOKEN,
      TWITTER_ACCESS_SECRET,
    }
     
    const existingConfig = await Config.findOne({ USER_ID });
    if (existingConfig) {
      // Update existing config
      await Config.updateOne({ USER_ID }, config);
    } else {
      // Create new config          
    await Config.create(config)
    }
    return NextResponse.json({ 
      success: true, 
      message: 'Configuration saved successfully',
      config 
    });
  } catch (error) {
    console.error('Error saving configuration:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await DbConnect()
     const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('userId');
    console.log(user_id ,"user_id in get method")
    const config = await Config.findOne({USER_ID: user_id });

    if (!config) {
      return NextResponse.json({ config: null });
    }

    // Don't return sensitive tokens in GET request for security
    const { _id: _, __v: __, ...safeConfig } = config.toObject();
    
    return NextResponse.json({ 
      config: safeConfig 
    });
  } catch (error) {
    console.error('Error fetching configuration:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}