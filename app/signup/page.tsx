'use client';
import React, { useState } from 'react';

export default function SignUpPage() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle form submission logic here
		console.log('Name:', name);
		console.log('Email:', email);
		console.log('Password:', password);
	};

	return (
		<div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
			<h1>Sign Up</h1>
			<form onSubmit={handleSubmit}>
				<div style={{ marginBottom: '10px' }}>
					<label htmlFor="name">Name:</label>
					<input
						type="text"
						id="name"
						value={name}
						onChange={e => setName(e.target.value)}
						style={{ width: '100%', padding: '8px', marginTop: '5px' }}
					/>
				</div>
				<div style={{ marginBottom: '10px' }}>
					<label htmlFor="email">Email:</label>
					<input
						type="email"
						id="email"
						value={email}
						onChange={e => setEmail(e.target.value)}
						style={{ width: '100%', padding: '8px', marginTop: '5px' }}
					/>
				</div>
				<div style={{ marginBottom: '10px' }}>
					<label htmlFor="password">Password:</label>
					<input
						type="password"
						id="password"
						value={password}
						onChange={e => setPassword(e.target.value)}
						style={{ width: '100%', padding: '8px', marginTop: '5px' }}
					/>
				</div>
				<button
					type="submit"
					style={{ padding: '10px 20px', cursor: 'pointer' }}
				>
					Sign Up
				</button>
			</form>
		</div>
	);
}
