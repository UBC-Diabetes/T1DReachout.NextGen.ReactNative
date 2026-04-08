/**
 * Room Analytics Helper
 * Identifies room types and provides analytics utilities for tracking room usage
 */

/**
 * Gets the analytics-friendly room type identifier
 * @param room - Room object with rid, name, and t (type) properties
 * @returns Room type for analytics: '247_chat', 'discussion_board', 'direct_message', 'private_group', or 'other'
 */
export const getRoomType = (room: { rid?: string; name?: string; t?: string }): string => {
	if (!room) return 'unknown';

	// Check if it's the 24/7 chat room by name (more reliable than hardcoded ID)
	if (room.name === '24-7-chatroom' || room.name?.toLowerCase().includes('24') && room.name?.toLowerCase().includes('chat')) {
		return '247_chat';
	}

	// Check if it's a discussion board (public channel, not 24/7, not GENERAL)
	if (room.t === 'c' && room.rid !== 'GENERAL') {
		return 'discussion_board';
	}

	// Other room types
	switch (room.t) {
		case 'd':
			return 'direct_message';
		case 'p':
			return 'private_group';
		case 'l':
			return 'livechat';
		default:
			return 'other';
	}
};

/**
 * Gets sanitized room name for analytics (removes PII)
 * @param room - Room object
 * @returns Sanitized room name or type identifier
 */
export const getSanitizedRoomName = (room: { rid?: string; name?: string; t?: string }): string => {
	const roomType = getRoomType(room);

	// For direct messages, don't include names (PII)
	if (roomType === 'direct_message') {
		return 'direct_message';
	}

	// For 24/7 chat, use consistent name
	if (roomType === '247_chat') {
		return '24_7_chat';
	}

	// For discussion boards, use the actual name
	if (roomType === 'discussion_board' && room.name) {
		return room.name;
	}

	return roomType;
};

/**
 * Room time tracker for calculating time spent in rooms
 */
class RoomTimeTracker {
	private startTimes: Map<string, number> = new Map();

	/**
	 * Mark room entry
	 */
	enter(rid: string): void {
		this.startTimes.set(rid, Date.now());
	}

	/**
	 * Mark room exit and calculate duration
	 * @returns Duration in seconds, or 0 if no entry recorded
	 */
	exit(rid: string): number {
		const startTime = this.startTimes.get(rid);
		if (!startTime) return 0;

		const duration = Math.floor((Date.now() - startTime) / 1000);
		this.startTimes.delete(rid);
		return duration;
	}

	/**
	 * Clear tracking for a room (e.g., on app background)
	 */
	clear(rid: string): void {
		this.startTimes.delete(rid);
	}

	/**
	 * Clear all tracking
	 */
	clearAll(): void {
		this.startTimes.clear();
	}
}

export const roomTimeTracker = new RoomTimeTracker();
