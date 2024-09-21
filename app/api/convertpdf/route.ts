import { NextApiRequest, NextApiResponse } from 'next';
import { TokenTextSplitter } from 'langchain/text_splitter';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import supabase from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { embed } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function GET(req: NextApiRequest) {
	// Extract bucket name and file path from the request body
	// const { bucketName, filePath } = req.body;

	// if (!bucketName || !filePath) {
	// 	return res
	// 		.status(400)
	// 		.json({ message: 'Bucket name and file path are required' });
	// }

	// try {
	// Step 1: Fetch the file from Supabase Storage
	const { data, error: fileError } = await supabase.storage
		.from('pdf')
		.download('phase2.pdf');

	if (fileError) {
		return NextResponse.json({ message: 'Error' });
	}

	// 	// Step 2: Read the content of the file
	const loader = new PDFLoader(data, {
		parsedItemSeparator: ' ',
	});

	const docs = await loader.load();
	const textSplitter = new TokenTextSplitter({
		encodingName: 'gpt2', // Ensure this encoding is supported
		chunkSize: 1000,
		chunkOverlap: 0,
	});

	console.log(docs);

	// const documents = await textSplitter.createDocuments(docs as any);

	// if (!documents || documents.length === 0) {
	// 	return NextResponse.json({ message: 'No documents created from text' });
	// }

	// Step 4: Generate embeddings for each document
	const documentsWithEmbeddings = await Promise.all(
		docs.map(async (doc, index) => {
			try {
				const { embedding } = await embed({
					model: openai.embedding('text-embedding-ada-002'), // Use a valid embedding model
					value: doc.pageContent,
				});

				return {
					content: doc.pageContent,
					embedding, // Array of numbers
					docID: 12,
				};
			} catch (embeddingError) {
				console.error(
					`Error generating embedding for chunk ${index}:`,
					embeddingError
				);
				throw embeddingError; // This will be caught by the outer try-catch
			}
		})
	);

	const mappedData = documentsWithEmbeddings.map(doc => ({
		content: doc.content,
		vector: doc.embedding,
		docID: doc.docID,
	}));
	console.log(mappedData);
	// Step 5: Insert embeddings into Supabase
	const { error: insertError } = await supabase.from('docs').insert(mappedData);

	if (insertError) {
		console.error('Error inserting embeddings:', insertError);
		return NextResponse.json({ message: 'error' });
	}
	return NextResponse.json({ message: 'success' });
}
