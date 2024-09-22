import { createClient } from '@/lib/supabase/supaserver';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import Logout from '@/components/logout';

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const supabase = createClient();
	const {
		data: { session },
	} = await supabase.auth.getSession();
	const { data, error } = await supabase.auth.getUser();
	// if (error || !data?.user) {
	// 	redirect('/login');
	// }

	return (
		<div className="flex flex-col h-screen">
			<nav className="bg-white border-b border-gray-200 p-4">
				<div className="container mx-auto flex justify-between items-center">
					<Link href="/dashboard/chat" className="text-xl font-bold">
						HealthView
					</Link>
					<ul className="flex items-center space-x-4">
						<li>
						<Link href="/dashboard/chat" className="hover:underline">
							Chat
						</Link>
						</li>
						<li>
						<Link href="/dashboard/setting" className="hover:underline">
							Setting
						</Link>
						</li>
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
