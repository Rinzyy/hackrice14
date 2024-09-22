'use client';
import ChatCompo from '@/components/chat/chat';
import Leftside from '@/components/leftside';
import React from 'react';
import LogOutButton from '@/components/ui/logout-button';

export default function Page() {
	return (
		<div className=" flex flex-row gap-5 ">
			<Leftside />
			<ChatCompo />
			<LogOutButton />
		</div>
	);
}
