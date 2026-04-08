/**
 * Message View Tracking Helper
 * Tracks when messages enter viewport with throttling to avoid event spam
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const MESSAGE_VIEWS_KEY = 'MESSAGE_VIEWS_TRACKED';
const THROTTLE_INTERVAL_MS = 5000; // Only log views every 5 seconds per room
const MAX_TRACKED_MESSAGES = 1000; // Prevent storage bloat

interface ViewTrackingState {
	lastLogTime: Record<string, number>; // roomId -> timestamp
	viewedMessages: Set<string>; // Set of message IDs already tracked
}

class MessageViewTracker {
	private state: ViewTrackingState = {
		lastLogTime: {},
		viewedMessages: new Set()
	};
	private pendingViews: Map<string, string[]> = new Map(); // roomId -> messageIds[]
	private initialized = false;

	/**
	 * Initialize tracker - load previously viewed messages
	 */
	async init(): Promise<void> {
		if (this.initialized) return;

		try {
			const stored = await AsyncStorage.getItem(MESSAGE_VIEWS_KEY);
			if (stored) {
				const data = JSON.parse(stored);
				this.state.viewedMessages = new Set(data.viewedMessages || []);
			}
		} catch (e) {
			console.log('[MessageViewTracker] Error loading state:', e);
		}

		this.initialized = true;
	}

	/**
	 * Track a message view (called when message enters viewport)
	 * @param messageId - Message ID
	 * @param roomId - Room ID
	 * @returns true if should log event, false if throttled/already tracked
	 */
	trackView(messageId: string, roomId: string): boolean {
		if (!this.initialized) {
			console.warn('[MessageViewTracker] Not initialized, call init() first');
			return false;
		}

		// Check if already tracked (first-time view only)
		if (this.state.viewedMessages.has(messageId)) {
			return false;
		}

		// Add to pending views for this room
		if (!this.pendingViews.has(roomId)) {
			this.pendingViews.set(roomId, []);
		}
		this.pendingViews.get(roomId)!.push(messageId);

		// Mark as viewed
		this.state.viewedMessages.add(messageId);

		// Check throttle
		const now = Date.now();
		const lastLog = this.state.lastLogTime[roomId] || 0;

		if (now - lastLog >= THROTTLE_INTERVAL_MS) {
			// Time to log - return pending views for this room
			this.state.lastLogTime[roomId] = now;
			return true;
		}

		return false;
	}

	/**
	 * Get pending views for a room and clear them
	 */
	getPendingViews(roomId: string): string[] {
		const views = this.pendingViews.get(roomId) || [];
		this.pendingViews.set(roomId, []);
		return views;
	}

	/**
	 * Persist tracked messages to storage
	 */
	async persist(): Promise<void> {
		try {
			// Limit stored message IDs to prevent bloat
			const viewedArray = Array.from(this.state.viewedMessages);
			const toStore = viewedArray.slice(-MAX_TRACKED_MESSAGES);

			await AsyncStorage.setItem(
				MESSAGE_VIEWS_KEY,
				JSON.stringify({
					viewedMessages: toStore
				})
			);

			// Update in-memory set
			this.state.viewedMessages = new Set(toStore);
		} catch (e) {
			console.log('[MessageViewTracker] Error persisting state:', e);
		}
	}

	/**
	 * Clear all tracked views (for testing/reset)
	 */
	async clear(): Promise<void> {
		this.state = {
			lastLogTime: {},
			viewedMessages: new Set()
		};
		this.pendingViews.clear();
		await AsyncStorage.removeItem(MESSAGE_VIEWS_KEY);
	}

	/**
	 * Get statistics
	 */
	getStats() {
		return {
			totalTracked: this.state.viewedMessages.size,
			roomsActive: Object.keys(this.state.lastLogTime).length,
			pendingRooms: this.pendingViews.size
		};
	}
}

export const messageViewTracker = new MessageViewTracker();
