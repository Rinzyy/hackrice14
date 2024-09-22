'use client';
import supabase from '@/lib/supabase';
import React from 'react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

export default function Logout() {
	const router = useRouter();
	const logg = async () => {
		await supabase.auth.signOut();
		router.push('/login');
	};
	return (
		<Button
			onClick={logg}
			className="">
			Logout
		</Button>
	);
}
