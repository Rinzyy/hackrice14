'use client';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import supabase from '@/lib/supabase';
import {
	AlertCircle,
	CheckCircle,
	FileText,
	Image as ImageIcon,
	Loader2,
	Upload,
	X,
} from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface UploadedFile {
	id: string;
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
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const fileInputRef = useRef<HTMLInputElement>(null);

	const createFileList = (files: File[]): FileList => {
		const dataTransfer = new DataTransfer();
		files.forEach(file => dataTransfer.items.add(file));
		return dataTransfer.files;
	};

	useEffect(() => {
		const fetchUploadedFiles = async () => {
			try {
				const { data, error } = await supabase
					.from('filelink')
					.select('*')
					.order('created_at', { ascending: false });

				if (error) {
					throw error;
				}

				if (data) {
					const mappedFiles: UploadedFile[] = data.map(
						(file: { id: string; filelink: string; name: string }) => ({
							id: file.id,
							url: file.filelink,
							pathname: file.name,
						})
					);
					setUploadedFiles(mappedFiles);
				}
			} catch (err) {
				console.error('Error fetching uploaded files:', err);
				setError('Failed to load uploaded files.');
			}
		};

		fetchUploadedFiles();
	}, []);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setFiles(prevFiles => [...prevFiles, ...Array.from(e.target.files!)]);
		}
	};

	const removeSelectedFile = (index: number) => {
		setFiles(prevFiles => {
			const updatedFiles = prevFiles.filter((_, i) => i !== index);
			if (fileInputRef.current) {
				if (updatedFiles.length === 0) {
					// Reset the file input when no files are left
					fileInputRef.current.value = '';
				} else {
					// Update the file input to reflect the remaining files
					fileInputRef.current.files = createFileList(updatedFiles);
				}
			}
			return updatedFiles;
		});
	};
	const removeFile = async (index: number) => {
		const fileToRemove = uploadedFiles[index];
		if (!fileToRemove) return;

		try {
			const { error: storageError } = await supabase.storage
				.from('pdf')
				.remove([fileToRemove.pathname]);

			if (storageError) {
				throw storageError;
			}

			const { error: dbError } = await supabase
				.from('filelink')
				.delete()
				.eq('id', fileToRemove.id);

			if (dbError) {
				throw dbError;
			}

			setUploadedFiles((prevFiles: UploadedFile[]) =>
				prevFiles.filter((_, i) => i !== index)
			);
		} catch (err) {
			console.error(`Error removing file ${fileToRemove.pathname}:`, err);
			setError('Failed to remove the file.');
		}
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
						const {
							data: { publicUrl },
						} = supabase.storage.from('pdf').getPublicUrl(data.path);

						const { error: insertError } = await supabase
							.from('filelink')
							.insert([
								{
									filelink: publicUrl,
									name: data.path,
								},
							])
							.single();

						if (insertError) throw insertError;
						if (publicUrl) {
							const filename = data.path;

							const res = await fetch('/api/convertpdf', {
								method: 'POST',
								headers: {
									'Content-Type': 'application/json',
								},
								body: JSON.stringify({ filename }),
							});

							await res.json();
						}
					}
				} catch (err) {
					console.error(`Error uploading ${file.name}:`, err);
					setError(`Failed to upload ${file.name}.`);
				}

				setProgress(((i + 1) / files.length) * 100);
			}

			setUploadedFiles(prevFiles => [...prevFiles, ...newUploadedFiles]);
			setFiles([]);
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
		} catch (err) {
			setError('An error occurred while uploading files. Please try again.');
			console.error(err);
		} finally {
			setIsUploading(false);
			setProgress(0);
			setSuccessMessage('Files uploaded successfully.');
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
											onClick={() => removeSelectedFile(index)}
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
				{successMessage && (
					<div className="flex items-center p-3 text-sm text-green-600 bg-green-100 rounded-lg">
						<CheckCircle className="mr-2 h-4 w-4 flex-shrink-0" />
						<p>{successMessage}</p>
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
										<Button
											variant="ghost"
											size="icon"
											onClick={() => removeFile(index)}
											className="h-8 w-8 rounded-full text-destructive hover:text-destructive/90 hover:bg-destructive/20"
										>
											<X className="h-4 w-4" />
										</Button>
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
