// app/api/process-file/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { TokenTextSplitter } from 'langchain/text_splitter';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import supabase from '@/lib/supabase';
import { embed } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { filename } = body;

		if (!filename) {
			return NextResponse.json(
				{ message: 'filename is required' },
				{ status: 400 }
			);
		}

		const { data, error: fileError } = await supabase.storage
			.from('pdf')
			.download(filename);

		if (fileError) {
			console.error('Error downloading file:', fileError);
			return NextResponse.json(
				{ message: 'Error downloading file' },
				{ status: 500 }
			);
		}

		// Initialize PDF Loader with the downloaded data
		const loader = new PDFLoader(data, {
			parsedItemSeparator: ' ',
		});

		const docs = await loader.load();
		const textSplitter = new TokenTextSplitter({
			encodingName: 'gpt2',
			chunkSize: 1000,
			chunkOverlap: 0,
		});

		console.log('Loaded Documents:', docs);

		const documentsWithEmbeddings = await Promise.all(
			docs.map(async (doc: any, index: number) => {
				try {
					const { embedding } = await embed({
						model: openai.embedding('text-embedding-ada-002'),
						value: doc.pageContent,
					});

					return {
						content: doc.pageContent,
						embedding,
						docID: 12, // You might want to make this dynamic
					};
				} catch (embeddingError) {
					console.error(
						`Error generating embedding for chunk ${index}:`,
						embeddingError
					);
					throw embeddingError;
				}
			})
		);

		const mappedData = documentsWithEmbeddings.map((doc: any) => ({
			content: doc.content,
			vector: doc.embedding,
			docID: doc.docID,
		}));

		console.log('Mapped Data:', mappedData);

		// Insert embeddings into Supabase
		const { error: insertError } = await supabase
			.from('docs')
			.insert(mappedData);

		if (insertError) {
			console.error('Error inserting embeddings:', insertError);
			return NextResponse.json(
				{ message: 'Error inserting embeddings' },
				{ status: 500 }
			);
		}

		return NextResponse.json({ message: 'Success' }, { status: 200 });
	} catch (error) {
		console.error('Unexpected error:', error);
		return NextResponse.json(
			{ message: 'Internal Server Error' },
			{ status: 500 }
		);
	}
}
