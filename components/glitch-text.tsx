'use client';

import { useState, useEffect } from 'react';

const GlitchText = () => {
	const [text, setText] = useState('');
	const finalText = 'Hello HackRice 14';
	const characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';

	useEffect(() => {
		let interval: NodeJS.Timeout;

		const glitchEffect = () => {
			let iterations = 0;
			clearInterval(interval);

			interval = setInterval(() => {
				setText(prevText =>
					prevText
						.split('')
						.map((char, index) => {
							if (index < iterations) {
								return finalText[index];
							}
							return characters[Math.floor(Math.random() * characters.length)];
						})
						.join('')
				);

				if (iterations >= finalText.length) {
					clearInterval(interval);
				}

				iterations += 1 / 3;
			}, 30);
		};

		glitchEffect();

		return () => clearInterval(interval);
	}, []);

	return (
		<div className="min-h-screen flex items-center justify-center bg-black">
			<div className="glitch-container relative">
				<h1 className="text-6xl font-mono text-green-400 mb-4">{text}</h1>
				<div className="glitch-effect"></div>
			</div>
			<style jsx>{`
				.glitch-container {
					position: relative;
					display: inline-block;
				}
				.glitch-effect {
					content: '${text}';
					position: absolute;
					top: 0;
					left: 2px;
					width: 100%;
					height: 100%;
					background: black;
					overflow: hidden;
					animation: glitch 0.3s infinite;
				}
				@keyframes glitch {
					0% {
						clip-path: inset(40% 0 61% 0);
					}
					20% {
						clip-path: inset(92% 0 1% 0);
					}
					40% {
						clip-path: inset(43% 0 1% 0);
					}
					60% {
						clip-path: inset(25% 0 58% 0);
					}
					80% {
						clip-path: inset(54% 0 7% 0);
					}
					100% {
						clip-path: inset(58% 0 43% 0);
					}
				}
			`}</style>
		</div>
	);
};

export default GlitchText;
