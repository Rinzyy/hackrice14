import HealthInfoCard from '@/components/healthinfo';
import supabase from '@/lib/supabase';
import { openai } from '@ai-sdk/openai';
import { streamText, convertToCoreMessages, embed } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
	const { messages } = await req.json();

	// Generate embedding for the query
	const { embedding } = await embed({
		model: openai.embedding('text-embedding-ada-002'),
		value: messages[messages.length - 1].content,
	});

	// Perform similarity search
	const { data, error } = await supabase.rpc('match_documentsv3', {
		query_embedding: embedding,
		match_threshold: 0.75, // Adjust this value as needed
		match_count: 5, // Adjust this value as needed
	});

	const modifiedMessages = [...messages];
	const lastMessageIndex = modifiedMessages.length - 1;

	if (data.length > 0) {
		modifiedMessages[lastMessageIndex] = {
			...modifiedMessages[lastMessageIndex],
			content: `${modifiedMessages[lastMessageIndex].content}\n\nAdditional context: ${data[0].content}`,
		};
	}

	console.log(data);
	if (error) {
		throw error;
	}
	const result = await streamText({
		model: openai('gpt-4-turbo'),
		system: `You will a helpful doctor. You will provide information based on user health Info.`,
		messages: convertToCoreMessages(modifiedMessages),
	});

	return result.toDataStreamResponse();
}
