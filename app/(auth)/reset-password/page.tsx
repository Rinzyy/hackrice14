'use client';

import React, { useEffect, useState } from 'react';
import supabase from '../../../lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

export default function Page() {
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');
	const router = useRouter();

	useEffect(() => {
		// Check if we have a session
		const checkSession = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			if (!session) {
				router.push('/login');
			}
		};
		checkSession();
	}, [router]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setMessage('');
		setError('');
		try {
			const { error } = await supabase.auth.updateUser({ password });
			if (error) throw error;
			setMessage('Password updated successfully');
			setTimeout(() => router.push('/login'), 2000);
		} catch (error) {
			if (error instanceof Error) {
				setError(error.message);
			} else {
				setError('An unknown error occurred');
			}
		}
	};
	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
			<Card className="max-w-lg w-full">
				<CardHeader className="text-center">
					<CardTitle className="text-3xl">Reset Password</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit}>
						<Label>Password</Label>
						<Input
							type="password"
							placeholder="Enter in new password"
							value={password}
							onChange={e => setPassword(e.target.value)}
							required
						/>
						<Button
							type="submit"
							className="w-full mt-6">
							Reset Password
						</Button>
					</form>
					{message && <p>{message}</p>}
					{error && <p>{error}</p>}
				</CardContent>
			</Card>
		</div>
	);
}
