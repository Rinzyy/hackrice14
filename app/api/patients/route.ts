import { NextResponse } from 'next/server';

type ResponseData = {
	message: string;
};

export async function GET() {
	return NextResponse.json({ message: 'Hello from Patients Data API Route!' });
}
