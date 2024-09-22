'use client';

import Link from 'next/link';
import supabase from '../../../lib/supabase';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const description =
	"A sign up form with first name, last name, email and password inside a card. There's an option to sign up with GitHub and a link to login if you already have an account";

export default function Page() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const handleSignup = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const { data, error } = await supabase.auth.signUp({
				email,
				password,
			});
			if (error) throw error;
			if (data?.user) {
				const { error: profileError } = await supabase
					.from('users')
					.insert({ id: data.user.id, email: email, password:password});

				if (profileError) throw profileError;

				router.push('/login');
			} else {
				setError('An error occured during signup');
			}
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
			<div className="w-full flex items-center justify-center lg:min-h-[600px] xl:min-h-[800px]">
				<Card className="mx-auto max-w-lg">
					<CardHeader>
						<CardTitle className="text-3xl text-center">Sign Up</CardTitle>
						<CardDescription className="text-center">
							Enter your information to create an account!
						</CardDescription>
					</CardHeader>
					<CardContent>
						{error && <p>{error}</p>}
						<form onSubmit={handleSignup}>
							<div className="grid gap-4">
								<div className="grid gap-2">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										type="email"
										placeholder="Enter in your email"
										value={email}
										onChange={e => setEmail(e.target.value)}
										required
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="password">Password</Label>
									<Input
										id="password"
										type="password"
										placeholder="Enter in your password"
										value={password}
										onChange={e => setPassword(e.target.value)}
										required
									/>
								</div>
								<Button
									type="submit"
									className="w-full">
									Create an account
								</Button>
								<div className="mt-4 text-center text-sm text-gray-600">
									Already have an account?{' '}
									<Link
										href="/login"
										className="text-primary hover:underline">
										Log in
									</Link>
								</div>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
