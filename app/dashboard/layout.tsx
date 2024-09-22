import { createClient } from '@/lib/supabase/supaserver';
import Link from 'next/link';
import Logout from '@/components/logout';
import { fetchUser } from '@/lib/supabaseFunc';

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const supabase = createClient();
	await supabase.auth.getSession();
	const { data, error } = await supabase.auth.getUser();

	// Safely handle the user email
	const userEmail = data?.user?.email;
	let userData = null;

	if (userEmail) {
		userData = await fetchUser(userEmail);
	}

	let isDoctor = false;

	if (userData) {
		isDoctor = userData.isDoctor;
	}

	// Redirect in case of error or missing user data
	// if (error || !data?.user) {
	//     redirect('/login');
	// }

	return (
		<div className="flex flex-col">
			<nav className="bg-white border-b-2 p-4">
				<div className="container mx-auto flex justify-between items-center">
					<Link
						href="/dashboard/chat"
						className="text-xl font-bold">
						HealthView
					</Link>
					<ul className="flex items-center space-x-4">
						<li>
							<Link
								href="/dashboard/chat"
								className="hover:underline">
								Chat
							</Link>
						</li>

						{isDoctor && (
							<li>
								<Link
									href="/dashboard/setting"
									className="hover:underline">
									Setting
								</Link>
							</li>
						)}
						<Logout />
					</ul>
				</div>
			</nav>
			<main className="flex-grow container mx-auto p-4 overflow-auto">
				{children}
			</main>
		</div>
	);
}
