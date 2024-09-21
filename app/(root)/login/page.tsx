"use client";

import Link from 'next/link';
import supabase from '../../../lib/supabase';
import { useState } from 'react'
import { useRouter } from 'next/navigation'

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
	"A login form with email and password. There's an option to login with Google and a link to sign up if you don't have an account.";

export default function Page() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState<string | null>(null)
	const router = useRouter()
	
	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault()
		try {
		const { error } = await supabase.auth.signInWithPassword({ email, password })
		if (error) throw error
		router.push('/dashboard')
		} 
		catch (error) {
			if (error instanceof Error) {
				setError(error.message);
			  } else {
				setError('An unknown error occurred');
			  }
		}
	}

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
			<div className="w-full h-full flex items-center justify-center lg:min-h-[600px] xl:min-h-[800px]">
				<Card className="w-full max-w-lg">
					<CardHeader>
						<CardTitle className="text-3xl text-center">Weclome Back To HealthView!</CardTitle>
						<CardDescription className='text-center'>
							Your Personal Health Record System
						</CardDescription>
					</CardHeader>
					<CardContent>
					{error && <p>{error}</p>}
					<form onSubmit={handleLogin}>
						<div className="grid gap-4">
							<div className="grid gap-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="Enter in your email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									type="password"
									placeholder='Enter in your password'
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
							</div>
							<Button
								type="submit"
								className="w-full">
								Login
							</Button>
						</div>
						<div className="text-center">
							<Link
								href="#"
								className="text-sm text-gray-600 hover:underline">
								Forgot your password?
							</Link>
						</div>
						<div className="mt-4 text-center text-sm text-gray-600">
							Don&apos;t have an account?{' '}
							<Link
								href="/signup"
								className="text-primary hover:underline">
								Sign up
							</Link>
						</div>
					</form>
					</CardContent>
				</Card>
				
			</div>
		</div>
		
	)
};
