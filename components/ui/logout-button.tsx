import React from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import supabase from '../../lib/supabase';

type Props = {};

const LogOutButton = (props: Props) => {
	const router = useRouter();

	const handleLogout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error('Error logging out:', error.message);
		} else {
			router.push('/login'); // Redirect to the login page or any other page
		}
	};

	return (
		<Button
			onClick={handleLogout}
			variant="ghost"
			size="sm"
			className="text-muted-foreground hover:text-black transition-colors duration-200 ease-in-out"
		>
			Log Out
		</Button>
	);
};

export default LogOutButton;
