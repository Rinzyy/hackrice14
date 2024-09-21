'use client';

import { useState } from 'react';
// import { put } from '@vercel/blob';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
	AlertCircle,
	FileText,
	Image as ImageIcon,
	Loader2,
} from 'lucide-react';

interface UploadedFile {
	url: string;
	pathname: string;
	contentType: string;
}

export default function MultiFileUpload() {
	const [files, setFiles] = useState<File[]>([]);
	const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
	const [isUploading, setIsUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setFiles(Array.from(e.target.files));
		}
	};

	const uploadFiles = async () => {
		setIsUploading(true);
		setError(null);
		const newUploadedFiles: UploadedFile[] = [];

		try {
			for (const file of files) {
				// const blob = await put(file.name, file, {
				// 	access: 'public',
				// });
				// newUploadedFiles.push(blob as UploadedFile);
			}
			setUploadedFiles([...uploadedFiles, ...newUploadedFiles]);
			setFiles([]);
		} catch (err) {
			setError('An error occurred while uploading files. Please try again.');
			console.error(err);
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<div className="max-w-md mx-auto mt-8">
			<Card>
				<CardContent className="p-6">
					<h1 className="text-2xl font-bold mb-4">Multi-File Upload</h1>
					<div className="space-y-4">
						<div>
							<Label htmlFor="file-upload">Select files (PDF or Image)</Label>
							<Input
								id="file-upload"
								type="file"
								onChange={handleFileChange}
								accept=".pdf,image/*"
								multiple
								className="mt-1"
							/>
						</div>
						<Button
							onClick={uploadFiles}
							disabled={files.length === 0 || isUploading}>
							{isUploading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Uploading...
								</>
							) : (
								'Upload Files'
							)}
						</Button>
						{error && (
							<div className="flex items-center text-red-500">
								<AlertCircle className="mr-2 h-4 w-4" />
								{error}
							</div>
						)}
					</div>
					{uploadedFiles.length > 0 && (
						<div className="mt-6">
							<h2 className="text-lg font-semibold mb-2">Uploaded Files:</h2>
							<ul className="space-y-2">
								{uploadedFiles.map((file, index) => (
									<li
										key={index}
										className="flex items-center">
										{file.contentType.includes('image') ? (
											<ImageIcon className="mr-2 h-4 w-4" />
										) : (
											<FileText className="mr-2 h-4 w-4" />
										)}
										<a
											href={file.url}
											target="_blank"
											rel="noopener noreferrer"
											className="text-blue-500 hover:underline">
											{file.pathname}
										</a>
									</li>
								))}
							</ul>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
