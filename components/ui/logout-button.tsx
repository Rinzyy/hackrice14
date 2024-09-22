import React from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import supabase from '../../lib/supabase';

const LogOutButton = (props: any) => {
	const router = useRouter();

	const handleLogout = async () => {
		await supabase.auth.signOut();

		router.push('/login'); // Redirect to the login page or any other page
	};

	return (
		<Button
			onClick={handleLogout}
			variant="ghost"
			size="sm"
			className="text-muted-foreground hover:text-black transition-colors duration-200 ease-in-out">
			Log Out
		</Button>
	);
};

export default LogOutButton;
