import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Property from '@/models/Property';
import dbConnect from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret') || request.headers.get('Authorization')?.split('Bearer ')[1];
  
  const expectedSecret = process.env.SEO_CRON_SECRET;
  
  if (!expectedSecret || secret !== expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  
  const properties = await Property.find({ is_visible: true });
  
  const auditResults = {
    timestamp: new Date().toISOString(),
    totalProperties: properties.length,
    issuesFound: 0,
    autoFixed: 0,
    details: [] as any[]
  };

  for (const property of properties) {
    const issues = [];
    let modified = false;

    // Check Missing Title
    if (!property.title || property.title.trim() === '') {
      issues.push('Missing Title');
      // Auto-fix title
      property.title = `${property.property_type} ${property.location || ''} ${property.province || ''}`.trim();
      modified = true;
    }

    // Check Missing Slug (Critical Error)
    if (!property.slug) {
      issues.push('Missing Slug (Cannot auto-fix)');
    }

    // Check Missing Images
    if (!property.images || property.images.length === 0) {
      issues.push('No Images (Reduces SEO/AEO value)');
    }

    // Check Missing Location
    if (!property.location) {
      issues.push('Missing Location');
    }

    if (issues.length > 0) {
      auditResults.issuesFound++;
      auditResults.details.push({
        id: property._id.toString(),
        slug: property.slug || 'N/A',
        issues,
        autoFixed: modified
      });
    }

    if (modified) {
      try {
        await property.save();
        auditResults.autoFixed++;
      } catch (error: any) {
        console.error(`Failed to save auto-fixed property ${property._id}:`, error);
        auditResults.details[auditResults.details.length - 1].saveError = error.message;
      }
    }
  }

  // Log to system console as requested by requirements
  console.log('Daily SEO Audit Results:', JSON.stringify(auditResults, null, 2));

  return NextResponse.json(auditResults);
}
