'use client';

import { useState } from 'react';
import { useChat } from 'ai/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ChatCompo() {
	const { messages, input, handleInputChange, handleSubmit } = useChat();

	return (
		<div className="flex flex-col h-screen max-w-md mx-auto p-4">
			<ScrollArea className="flex-grow mb-4 border rounded-md p-4">
				{messages.map(m => (
					<div
						key={m.id}
						className={`mb-4 ${
							m.role === 'user' ? 'text-right' : 'text-left'
						}`}>
						<div
							className={`inline-block p-2 rounded-lg ${
								m.role === 'user'
									? 'bg-blue-500 text-white'
									: 'bg-gray-200 text-black'
							}`}>
							{m.content}
						</div>
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
