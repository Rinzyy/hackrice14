import supabase from './supabase';

export default async function readItems() {
	const { data, error } = await supabase.from('test').select('*');

	if (error) {
		console.error('Error reading items:', error);
	} else {
		console.log('Items:', data);
	}
}
