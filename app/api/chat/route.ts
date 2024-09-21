import { openai } from '@ai-sdk/openai';
import { streamText, convertToCoreMessages, StreamData } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
	const { messages } = await req.json();

	const data = new StreamData();
	data.append({ test: 'value' });

	const result = await streamText({
		model: openai('o1-mini'),
		messages: convertToCoreMessages(messages),
		onFinish() {
			data.close();
		},
	});

	return result.toDataStreamResponse({ data });
}
