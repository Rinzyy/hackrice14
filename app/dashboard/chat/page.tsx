import ChatCompo from '@/components/chat/chat';
import Leftside from '@/components/leftside';
import React from 'react';

export default function Page() {
	return (
		<div className=" flex flex-row gap-3 ">
			<Leftside />
			<ChatCompo />
		</div>
	);
}
