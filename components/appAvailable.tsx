'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import supabase from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface AppData {
	date: string;
}

interface AppAvailableProps {
	appData: AppData | null;
}

export default function AppAvailable({ appData }: AppAvailableProps) {
	const [isOpen, setIsOpen] = useState(false);
	const router = useRouter();
	const handleRemove = async () => {
		await supabase.from('appointments').delete().eq('user_id', 2);
		setIsOpen(false);
		router.refresh();
	};

	return (
		<section>
			{appData ? (
				<div className="border-2 border-green-500 rounded-lg p-4 relative">
					<h2 className="text-xl text-green-500 font-bold mb-2 text-primary">
						Appointment
					</h2>
					<p className="text-sm">
						Your next appointment is scheduled for{' '}
						<span className="font-semibold">{appData.date}</span>
					</p>
					<AlertDialog
						open={isOpen}
						onOpenChange={setIsOpen}>
						<AlertDialogTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="absolute top-2 right-2"
								aria-label="Remove appointment">
								<Trash2 className="h-4 w-4" />
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent className=" bg-white">
							<AlertDialogHeader>
								<AlertDialogTitle>Are you sure?</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will permanently delete
									your appointment.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction onClick={handleRemove}>
									Remove
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			) : (
				<div>
					<h2 className="text-xl font-bold mb-2 text-primary">Appointment</h2>
					<div className="bg-secondary p-4 rounded-md">
						<p className="text-sm font-bold">
							You currently have no scheduled appointments.
						</p>
					</div>
				</div>
			)}
		</section>
	);
}
