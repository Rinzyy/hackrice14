import MultiFileUpload from '@/components/upload';
import React from 'react';

export default function page() {
	return (
		<div>
			<h1 className=" flex items-center justify-center text-3xl  font-semibold">
				Hello, Doctor
			</h1>
			<MultiFileUpload />
		</div>
	);
}
