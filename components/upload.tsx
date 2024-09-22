'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
	AlertCircle,
	FileText,
	Image as ImageIcon,
	Loader2,
	X,
	Upload,
} from 'lucide-react';
import supabase from '../lib/supabase';
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
	const fileInputRef = useRef<HTMLInputElement>(null);
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setFiles(prevFiles => [...prevFiles, ...Array.from(e.target.files)]);
		}
	};
	const createFileList = (files: File[]): FileList => {
		const dataTransfer = new DataTransfer();
		files.forEach(file => dataTransfer.items.add(file));
		return dataTransfer.files;
	};

	const removeFile = (index: number) => {
		setFiles(prevFiles => {
			const updatedFiles = prevFiles.filter((_, i) => i !== index);

			if (fileInputRef.current) {
				if (updatedFiles.length === 0) {
					fileInputRef.current.value = '';
				} else {
					// Reset to the latest file(s)
					fileInputRef.current.files = createFileList(updatedFiles);
				}
			}

			return updatedFiles;
		});
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
					const {
						data: existingFiles,
						error: listError,
					} = await supabase.storage.from('pdf').list('uploads', {
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
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
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
		<Card className="w-full max-w-lg mx-auto mt-8 shadow-lg">
			<CardHeader className="pb-3">
				<CardTitle className="text-2xl font-bold text-center">
					Multi-File Upload
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="space-y-2">
					<Label htmlFor="file-upload" className="text-sm font-medium">
						Select files (PDF or Image)
					</Label>
					<div className="flex items-center space-x-4">
						<Input
							id="file-upload"
							type="file"
							onChange={handleFileChange}
							accept=".pdf,image/*"
							multiple
							ref={fileInputRef}
							className="cursor-pointer file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 transition-all duration-300"
						/>
					</div>
				</div>
				{files.length > 0 && (
					<div className="space-y-2">
						<h2 className="text-lg font-semibold">Selected Files:</h2>
						<ScrollArea className="h-[120px] w-full rounded-md border">
							<ul className="p-4 space-y-2">
								{files.map((file, index) => (
									<li
										key={index}
										className="flex items-center justify-between bg-secondary rounded-lg p-2 transition-all duration-300 hover:bg-secondary/80"
									>
										<span className="text-sm truncate max-w-[200px]">
											{file.name}
										</span>
										<Button
											variant="ghost"
											size="icon"
											onClick={() => removeFile(index)}
											className="h-8 w-8 rounded-full text-destructive hover:text-destructive/90 hover:bg-destructive/20"
										>
											<X className="h-4 w-4" />
											<span className="sr-only">Remove {file.name}</span>
										</Button>
									</li>
								))}
							</ul>
						</ScrollArea>
					</div>
				)}
				<div className="space-y-4">
					<Button
						onClick={uploadFiles}
						disabled={files.length === 0 || isUploading}
						className="w-full py-2 transition-all duration-300"
					>
						{isUploading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Uploading... {Math.round(progress)}%
							</>
						) : (
							<>
								<Upload className="mr-2 h-4 w-4" />
								Upload Files
							</>
						)}
					</Button>
				</div>
				{error && (
					<div className="flex items-center p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
						<AlertCircle className="mr-2 h-4 w-4 flex-shrink-0" />
						<p>{error}</p>
					</div>
				)}
				{uploadedFiles.length > 0 && (
					<div className="space-y-2">
						<h2 className="text-lg font-semibold">Uploaded Files:</h2>
						<ScrollArea className="h-[120px] w-full rounded-md border">
							<ul className="p-4 space-y-2">
								{uploadedFiles.map((file, index) => (
									<li
										key={index}
										className="flex items-center space-x-2 bg-secondary rounded-lg p-2"
									>
										{file.ContentType?.includes('image') ? (
											<ImageIcon className="h-4 w-4 text-primary" />
										) : (
											<FileText className="h-4 w-4 text-primary" />
										)}
										<span className="text-sm truncate max-w-[200px]">
											{file.pathname}
										</span>
									</li>
								))}
							</ul>
						</ScrollArea>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
