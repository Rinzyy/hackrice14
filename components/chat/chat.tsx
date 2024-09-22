'use client';

import { useChat } from 'ai/react';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faUserMd,
	faUser,
	faPaperPlane,
	faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import remarkGfm from 'remark-gfm';
import { MemoizedReactMarkdown } from './markdown';
import { FileQuestion, ShieldQuestion } from 'lucide-react';
import Router from 'next/router';
import { useRouter } from 'next/navigation';

export default function ChatComponent() {
	const { messages, input, handleInputChange, handleSubmit } = useChat();
	const chatContainerRef = useRef<HTMLDivElement>(null);
	const lastMessageRef = useRef<HTMLDivElement | null>(null);
	const router = useRouter();
	useEffect(() => {
		if (lastMessageRef.current) {
			lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
		}
		router.refresh();
	}, [messages]);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
		}
	};

	return (
		<Card className="w-full max-w-4xl mx-auto h-full  flex flex-col">
			<CardHeader className="pb-2">
				<CardTitle className="text-2xl text-slate-600 font-bold text-center">
					AI Chat Interface
				</CardTitle>
			</CardHeader>
			<CardContent className="flex-grow flex flex-col space-y-4 overflow-hidden">
				<ScrollArea
					className="flex-grow pr-4"
					ref={chatContainerRef}>
					{messages.length === 0 ? (
						<div className="flex flex-col justify-center items-center h-[32rem]">
							<p className="text-muted-foreground  text-4xl font-bold">
								How can I help you?
							</p>
							<ShieldQuestion className="text-muted-foreground scale-[3] mt-8" />
						</div>
					) : (
						messages.map((m, index) => (
							<div
								key={m.id}
								className={`mb-4 flex ${
									m.role === 'user' ? 'justify-end' : 'justify-start'
								} items-start space-x-2 fade-in`}
								ref={index === messages.length - 1 ? lastMessageRef : null}>
								<div
									className={`rounded-full p-2 ${
										m.role === 'user' ? 'bg-primary' : 'bg-secondary'
									}`}>
									<FontAwesomeIcon
										icon={m.role === 'user' ? faUser : faUserMd}
										className={`w-4 h-4 ${
											m.role === 'user'
												? 'text-primary-foreground'
												: 'text-secondary-foreground'
										}`}
									/>
								</div>
								<div
									className={`px-4 py-2 rounded-lg max-w-[80%] break-words ${
										m.role === 'user'
											? 'bg-primary text-primary-foreground'
											: 'bg-secondary text-secondary-foreground'
									}`}
									style={{
										wordWrap: 'break-word',
										overflowWrap: 'break-word',
									}}>
									<MemoizedReactMarkdown
										remarkPlugins={[remarkGfm]}
										components={{
											p: ({ children }) => (
												<p className="mb-2 last:mb-0">{children}</p>
											),
											ul: ({ children }) => (
												<ul className="list-disc pl-4 mb-2">{children}</ul>
											),
											ol: ({ children }) => (
												<ol className="list-decimal pl-4 mb-2">{children}</ol>
											),
											li: ({ children }) => (
												<li className="mb-1">{children}</li>
											),
											h1: ({ children }) => (
												<h1 className="text-2xl font-bold mb-2">{children}</h1>
											),
											h2: ({ children }) => (
												<h2 className="text-xl font-semibold mb-2">
													{children}
												</h2>
											),
											h3: ({ children }) => (
												<h3 className="text-lg font-medium mb-2">{children}</h3>
											),
											h4: ({ children }) => (
												<h4 className="text-base font-medium mb-2">
													{children}
												</h4>
											),
											table: ({ children }) => (
												<div className="overflow-x-auto mb-2">
													<table className="w-full border-collapse">
														{children}
													</table>
												</div>
											),
											thead: ({ children }) => (
												<thead className="bg-muted">{children}</thead>
											),
											tbody: ({ children }) => <tbody>{children}</tbody>,
											tr: ({ children }) => (
												<tr className="border-b">{children}</tr>
											),
											th: ({ children }) => (
												<th className="px-4 py-2 text-left font-medium">
													{children}
												</th>
											),
											td: ({ children }) => (
												<td className="px-4 py-2">{children}</td>
											),
										}}>
										{m.content}
									</MemoizedReactMarkdown>
								</div>
							</div>
						))
					)}
				</ScrollArea>
				<form
					onSubmit={handleSubmit}
					className="flex items-center space-x-2 pt-2 border-t">
					<Textarea
						value={input}
						onChange={handleInputChange}
						onKeyDown={handleKeyDown}
						placeholder="Type your message..."
						className="flex-grow resize-none"
						rows={2}
					/>
					<Button
						type="submit"
						size="icon"
						className="h-10 w-10 shrink-0"
						aria-label="Send message">
						<FontAwesomeIcon
							icon={faPaperPlane}
							className="h-4 w-4"
						/>
					</Button>
				</form>
			</CardContent>
			<style
				jsx
				global>{`
				.fade-in {
					animation: fadeIn 0.5s ease-in-out;
				}

				@keyframes fadeIn {
					from {
						opacity: 0;
					}
					to {
						opacity: 1;
					}
				}
			`}</style>
		</Card>
	);
}
