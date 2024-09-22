import { fetchLatestApp } from '@/lib/supabaseFunc';
import React from 'react';

export default async function Leftside() {
	const appData = await fetchLatestApp();
	return (
		<aside className="bg-white p-6 rounded-lg border-2 h-auto shadow-md max-w-sm">
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
			<section>
				{appData ? (
					<div className=" border-2 border-green-500 rounded-lg p-4 ">
						<h2 className="text-xl text-green-500 font-bold mb-2 text-primary">
							Appointment
						</h2>
						<p className="text-sm">
							Your next appointment is scheduled for{' '}
							<span className="font-semibold">{appData.date}</span>
						</p>
					</div>
				) : (
					<div>
						<h2 className="text-xl  font-bold mb-2 text-primary">
							Appointment
						</h2>
						<div className="bg-secondary p-4 rounded-md">
							<p className="text-sm font-bold">
								You currently have no scheduled appointments.
							</p>
						</div>
					</div>
				)}
			</section>
		</aside>
	);
}
