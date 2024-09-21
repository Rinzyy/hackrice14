'use client';

import { useChat } from 'ai/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import remarkGfm from 'remark-gfm';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MemoizedReactMarkdown } from './markdown';

export default function ChatCompo() {
	const { messages, input, handleInputChange, handleSubmit, data } = useChat();

	return (
		<div className="flex flex-col h-screen w-[80%] mx-auto p-4">
			<ScrollArea className="flex-grow mb-4 border rounded-md p-4">
				{messages.map(m => (
					<div
						key={m.id}
						className={`mb-4 ${
							m.role === 'user' ? 'text-right' : 'text-left'
						}`}>
						<MemoizedReactMarkdown
							className={'markdown'}
							remarkPlugins={[remarkGfm]}
							components={{
								ul({ children }) {
									return (
										<ul className="marker:text-zinc-500 list-disc pl-5 pb-3 mt-2">
											{children}
										</ul>
									);
								},
								ol({ children }) {
									return (
										<ol className="marker:text-zinc-500 list-decimal pl-5 pb-3 listco">
											{children}
										</ol>
									);
								},
								li({ children }) {
									return <li className=" mb-2">{children}</li>;
								},
								p({ children }) {
									return <p className=" my-2 last:mb-0">{children}</p>;
								},
								h1({ children }) {
									return (
										<h1 className=" font-bold mt-3 text-3xl">{children}</h1>
									);
								},
								h2({ children }) {
									return (
										<h2 className=" font-bold mt-3 text-3xl">{children}</h2>
									);
								},
								h3({ children }) {
									return (
										<h3 className=" text-2xl font-semibold">{children}</h3>
									);
								},
								h4({ children }) {
									return <h4 className=" text-xl font-semibold">{children}</h4>;
								},
								table({ children }) {
									return (
										<div className="relative w-[22rem] md:w-[46rem] overflow-x-scroll">
											<table className="w-full text-sm text-left rtl:text-right text-zinc-500 dark:text-zinc-300 ">
												{children}
											</table>
										</div>
									);
								},
								thead({ children }) {
									return <thead className="bg-zinc-50">{children}</thead>;
								},
								tbody({ children }) {
									return (
										<tbody className="bg-white divide-y divide-zinc-200">
											{children}
										</tbody>
									);
								},
								tr({ children }) {
									return <tr>{children}</tr>;
								},
								th({ children }) {
									return (
										<th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
											{children}
										</th>
									);
								},
								td({ children }) {
									return (
										<td className="px-6 py-4 whitespace-nowrap">{children}</td>
									);
								},
							}}>
							{m.content}
						</MemoizedReactMarkdown>
					</div>
				))}
			</ScrollArea>
			<form
				onSubmit={handleSubmit}
				className="flex space-x-2">
				<Input
					value={input}
					onChange={handleInputChange}
					placeholder="Type your message..."
					className="flex-grow"
				/>
				<Button type="submit">Send</Button>
			</form>
		</div>
	);
}
