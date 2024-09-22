import { fetchLatestApp } from '@/lib/supabaseFunc';
import React from 'react';
import AppAvailable from './appAvailable';
import BasicDateCalendar from './ui/calendar';

export default async function Leftside() {
	const appData = await fetchLatestApp();
	return (
		<aside className="bg-white p-6 rounded-lg border-2 h-auto shadow-md max-w-sm ml-16">
			<section className="mb-6">
				<h2 className="text-xl font-bold mb-2 text-primary">
					Chat Information
				</h2>
				<p className="text-lg mb-2">
					You are talking to{' '}
					<span className="font-semibold">AI of Doctor John</span>
				</p>
				<p className="text-sm text-muted-foreground">
					You can ask any questions related to your previous medical history,
					prescriptions, and other health concerns.
				</p>
			</section>
			<AppAvailable appData={appData} />
			{/* <section className="mt-6">
				<h2 className="text-xl font-bold mb-2 text-primary">Calendar</h2>
				<BasicDateCalendar />
			</section> */}
		</aside>
	);
}
