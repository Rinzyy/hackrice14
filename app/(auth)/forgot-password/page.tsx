'use client';

import React, { useState } from 'react';
import supabase from '../../../lib/supabase';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';

export default function Page(){
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setMessage('');
        setError('');

        try{
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
              });
        
              if (error) throw error;
              setMessage('Password reset email sent. Check your inbox.');
        }catch (error) {
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
					<CardTitle className="text-3xl">
						Forgot Password?
					</CardTitle>
				</CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            placeholder="Enter in your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Button type="submit" className="w-full mt-6">Send Reset Link</Button>
                    </form>
                    {message && <p>{message}</p>}
                    {error && <p>{error}</p>}
                </CardContent>
            </Card>
      </div>
        
    )
};