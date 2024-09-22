'use client';
import supabase from '@/lib/supabase';
import React from 'react';
import { Button } from './ui/button';

export default function Logout() {
	const logg = async () => {
		await supabase.auth.signOut();
	};
	return (
		<Button
			onClick={logg}
			className="">
			Logout
		</Button>
	);
}
