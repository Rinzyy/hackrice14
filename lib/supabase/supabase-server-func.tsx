'use server';

import { redirect } from 'next/navigation';
import { createClient } from './supaserver';

export async function supabaseLogIn(email: any, password: string) {
	const supabase = createClient();
	const { data, error } = await supabase.auth.signInWithPassword({
		email: email,
		password: password,
	});
	if (data.user) {
		console.log('log in success');
		redirect('/dashboard');
	}
	if (error) {
		console.log('log in failed', error);
	}
}

export async function SupabaseSignUp(data: any) {
	const supabase = createClient();

	supabase.auth.signUp({
		email: data.email,
		password: data.password,
	});
}
