import { parseISO, isAfter, isBefore, addDays, startOfDay } from 'date-fns';

interface EventItem {
	id: string;
	title: string;
	description?: string;
	dateTime: string;
	author?: string;
	attendees?: string[];
	meetingLink?: string;
}

interface EventGroup {
	title: string; // Date in YYYY-MM-DD format
	data: EventItem[];
}

/**
 * Filters calendar events to show only those occurring in the next two weeks
 * @param eventGroups - Array of event groups from calendar state
 * @returns Array of events occurring in the next 14 days
 */
export const getUpcomingEvents = (eventGroups: EventGroup[]): EventItem[] => {
	const now = new Date();
	const todayStart = startOfDay(now);
	const twoWeeksFromNow = addDays(todayStart, 14);

	const upcomingEvents: EventItem[] = [];

	eventGroups.forEach(group => {
		if (group.data && group.data.length > 0) {
			group.data.forEach(event => {
				try {
					const eventDate = parseISO(event.dateTime);
					const eventDayStart = startOfDay(eventDate);

					// Check if event is today or within the next 2 weeks
					const isTodayOrLater = eventDayStart.getTime() >= todayStart.getTime();
					const isWithinTwoWeeks = isBefore(eventDayStart, twoWeeksFromNow);
					const isInRange = isTodayOrLater && isWithinTwoWeeks;
					if (isInRange) {
						upcomingEvents.push(event);
					}
				} catch (error) {
					console.warn('Error parsing event date:', event.dateTime, error);
				}
			});
		}
	});

	// Sort events by date (earliest first)
	return upcomingEvents.sort((a, b) => {
		try {
			const dateA = parseISO(a.dateTime);
			const dateB = parseISO(b.dateTime);
			return dateA.getTime() - dateB.getTime();
		} catch (error) {
			return 0;
		}
	});
};

/**
 * Formats event date for display in Home View
 * @param dateTime - ISO date string
 * @returns Formatted date string (e.g., "Jun 25, 2:00 PM")
 */
export const formatEventDate = (dateTime: string): string => {
	try {
		const date = parseISO(dateTime);
		const now = new Date();
		const isToday = date.toDateString() === now.toDateString();
		const isTomorrow = date.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();

		const timeString = date.toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		});

		if (isToday) {
			return `Today, ${timeString}`;
		} else if (isTomorrow) {
			return `Tomorrow, ${timeString}`;
		} else {
			const dateString = date.toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric'
			});
			return `${dateString}, ${timeString}`;
		}
	} catch (error) {
		return 'Invalid date';
	}
};
