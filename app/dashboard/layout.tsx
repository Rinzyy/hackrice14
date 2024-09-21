import { createClient } from '@/lib/supabase/supaserver';
import { redirect } from 'next/navigation';

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
		<>
			<main className="w-full">{children}</main>
		</>
	);
}
