import supabase from '@/lib/supabase';
import { openai } from '@ai-sdk/openai';
import { streamText, convertToCoreMessages, embed, tool } from 'ai';
import { z } from 'zod';

const updateTool = tool({
	description: 'Create an appointment if user requested',
	parameters: z.object({
		date: z.string().describe('The date of the appointment to update'),
		reason: z.string().describe('The reason for updating the appointment'),
	}),
	execute: async ({ date, reason }) => {
		const { error } = await supabase
			.from('appointments')
			.insert({ date, description: reason, user_id: 2 });

		if (error) {
			console.error('Error updating appointment:', error);
			return { success: false, error: error.message };
		} else {
			console.log('Updated appointment');
			return { success: true };
		}
	},
});

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
		match_threshold: 0.78, // Adjust this value as needed
		match_count: 5, // Adjust this value as needed
	});

	const modifiedMessages = [...messages];
	const lastMessageIndex = modifiedMessages.length - 1;

	if (data.length > 0) {
		modifiedMessages[lastMessageIndex] = {
			...modifiedMessages[lastMessageIndex],
			content: `${modifiedMessages[lastMessageIndex].content}\n\n My context: ${data[0].content}`,
		};
	}

	console.log(data);
	if (error) {
		throw error;
	}
	const result = await streamText({
		model: openai('gpt-4o-mini'),
		system: `I want you to act as a helpful doctor John . Based on user context information, I want you to provide detailed information on symptoms, treatment options, and preventive measures.`,
		tools: {
			updateAppointment: updateTool,
		},
		maxSteps: 2,
		messages: convertToCoreMessages(modifiedMessages),
	});

	return result.toDataStreamResponse();
}
