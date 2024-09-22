'use client';
import ChatCompo from '@/components/chat/chat';
import React from 'react';
import LogOutButton from '@/components/ui/logout-button';

export default function Page() {
	return (
		<div>
			<ChatCompo />
			<LogOutButton />
		</div>
	);
}
