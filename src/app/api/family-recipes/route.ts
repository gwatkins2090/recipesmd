import { NextResponse } from 'next/server';
import { getAllFamilyRecipes } from '@/lib/family-recipes';

export async function GET() {
  try {
    const familyRecipes = await getAllFamilyRecipes();
    return NextResponse.json(familyRecipes);
  } catch (error) {
    console.error('Error fetching family recipes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch family recipes' },
      { status: 500 }
    );
  }
}
