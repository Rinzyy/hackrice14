'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import supabase from '@/lib/supabase';
import {
	AlertCircle,
	FileText,
	Image as ImageIcon,
	Loader2,
	X,
} from 'lucide-react';

interface UploadedFile {
	url: string;
	pathname: string;
	ContentType?: string;
}

export default function MultiFileUpload() {
	const [files, setFiles] = useState<File[]>([]);
	const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
	const [isUploading, setIsUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [progress, setProgress] = useState(0);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setFiles(prevFiles => [...prevFiles, ...Array.from(e.target.files!)]);
		}
	};

	const removeFile = (index: number) => {
		setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
	};

	const uploadFiles = async () => {
		setIsUploading(true);
		setError(null);
		setProgress(0);
		const newUploadedFiles: UploadedFile[] = [];

		try {
			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				try {
					const { data: existingFiles, error: listError } =
						await supabase.storage.from('pdf').list('uploads', {
							limit: 100,
							search: file.name,
						});

					if (listError) throw listError;

					const fileExists = existingFiles?.some(
						existingFile => existingFile.name === file.name
					);

					if (fileExists) {
						console.log(`File ${file.name} already exists. Skipping upload.`);
						continue;
					}

					const { data, error } = await supabase.storage
						.from('pdf')
						.upload(`uploads/${file.name}`, file, { upsert: true });

					if (error) throw error;

					if (data) {
						newUploadedFiles.push({
							url: data.path,
							pathname: data.path,
							ContentType: file.type,
						});
					}
				} catch (err) {
					console.error(`Error uploading ${file.name}:`, err);
				}

				setProgress(((i + 1) / files.length) * 100);
			}

			setUploadedFiles(prevFiles => [...prevFiles, ...newUploadedFiles]);
			setFiles([]);
		} catch (err) {
			setError('An error occurred while uploading files. Please try again.');
			console.error(err);
		} finally {
			setIsUploading(false);
			setProgress(0);
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
								className="mt-1 border-blue-500 text-blue-500 cursor-pointer hover:cursor-pointer"
							/>
						</div>
						{files.length > 0 && (
							<div className="mt-4">
								<h2 className="text-lg font-semibold mb-2">Selected Files:</h2>
								<ul className="list-disc pl-5">
									{files.map((file, index) => (
										<li
											key={index}
											className="flex items-center justify-between"
										>
											<span>{file.name}</span>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => removeFile(index)}
											>
												<X className="h-4 w-4" />
											</Button>
										</li>
									))}
								</ul>
							</div>
						)}
						<Button
							onClick={uploadFiles}
							disabled={files.length === 0 || isUploading}
						>
							{isUploading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Uploading... {Math.round(progress)}%
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
						{uploadedFiles.length > 0 && (
							<div>
								<h2 className="text-lg font-semibold mb-2">Uploaded Files:</h2>
								<ul className="list-disc pl-5">
									{uploadedFiles.map((file, index) => (
										<li key={index}>
											{file.ContentType?.includes('image') ? (
												<ImageIcon className="inline-block mr-2 h-4 w-4" />
											) : (
												<FileText className="inline-block mr-2 h-4 w-4" />
											)}
											{file.pathname}
										</li>
									))}
								</ul>
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
