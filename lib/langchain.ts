import supabase from './supabase';
import { ChatOpenAI } from '@langchain/openai';
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import { OpenAIEmbeddings } from '@langchain/openai';

export const embeddings = new OpenAIEmbeddings();
export const vectorStore = new SupabaseVectorStore(embeddings, {
	client: supabase,
	tableName: 'documents',
	queryName: 'match_documents',
});

export const model = new ChatOpenAI({
	modelName: 'gpt-3.5-turbo',
	temperature: 0.7,
});
