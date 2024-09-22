import { revalidatePath } from 'next/cache';
import supabase from './supabase';

export async function readItems() {
	const { data, error } = await supabase.from('test').select('*');

	if (error) {
		console.error('Error reading items:', error);
	} else {
		console.log('Items:', data);
	}
}

export async function fetchLatestApp() {
	const { data, error } = await supabase
		.from('appointments')
		.select('*')
		.order('created_at', { ascending: false })
		.limit(1)
		.single();

	if (error) {
		console.error('Error fetching latest appointment:', error);
		return null;
	} else {
		console.log('Latest appointment:', data);
		return data;
	}
}

export async function createNewAppointment(date: string, description: string) {
	const { error } = await supabase
		.from('appointments')
		.insert({ date, description });

	if (error) {
		console.error('Error fetching latest appointment:', error);
		return null;
	} else {
		console.log('Created appointment');
		revalidatePath('/dashboard/chat');
		return 'success';
	}
}
