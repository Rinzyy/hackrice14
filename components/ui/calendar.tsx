'use client';
import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { fetchLatestApp } from '@/lib/supabaseFunc';
import dayjs, { Dayjs } from 'dayjs';

export default function BasicDateCalendar() {
	const [value, setValue] = React.useState<Dayjs | null>(dayjs());

	React.useEffect(() => {
		const fetchData = async () => {
			const appData = await fetchLatestApp();
			if (appData.date) {
				setValue(dayjs(appData.date));
			}
		};
		fetchData();
	}, []);

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<DateCalendar
				className="max-h-50"
				value={value}
				onChange={newValue => setValue(newValue)}
				sx={{
					'& .MuiPickersDay-root.Mui-selected': {
						backgroundColor: '#4db854',
						color: 'white',
						':hover': {
							backgroundColor: 'black',
							color: 'white',
							transition: 'all 0.15s ease-in-out',
						},
					},
				}}
				readOnly
			/>
		</LocalizationProvider>
	);
}
