'use client';

import Link from 'next/link';
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
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import { supabaseLogIn } from '@/lib/supabase/supabase-server-func';

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error] = useState(null);
	const router = useRouter();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		await supabaseLogIn(email, password);

		router.push('/dashboard/chat');
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
			<Card className="max-w-lg w-full">
				<CardHeader className="text-center">
					<CardTitle className="text-3xl">
						Welcome Back To HealthView!
					</CardTitle>
					<CardDescription>Your Personal Health Record System</CardDescription>
				</CardHeader>
				<CardContent>
					{error && <p className="text-red-500">{error}</p>}
					<form onSubmit={handleLogin} className="space-y-4">
						<div>
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="Enter your email"
								value={email}
								onChange={(e: any) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div>
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								placeholder="Enter your password"
								value={password}
								onChange={(e: any) => setPassword(e.target.value)}
								required
							/>
						</div>
						<Button type="submit" className="w-full">
							Login
						</Button>
					</form>
					{/* <div className="text-center text-sm mt-2">
						<Link
							href="#"
							className="text-gray-600 hover:underline">
							Forgot your password?
						</Link>
					</div> */}
					<div className="text-center text-sm mt-2">
						Don&apos;t have an account?{' '}
						<Link href="/signup" className="text-primary hover:underline">
							Sign up
						</Link>
					</div>

					<div className="text-center text-sm mt-2">
						Forgot your password?{' '}
						<Link
							href="/forgot-password"
							className="text-primary hover:underline"
						>
							Reset here
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
