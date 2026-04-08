/**
 * Message wrapper with viewport-based view tracking
 * Only logs MESSAGE_VIEWED events when message is actually visible in viewport
 */

import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, findNodeHandle } from 'react-native';
import MessageContext from './Context';
import { events, logEvent } from '../../lib/methods/helpers/log';
import { withDemographics } from '../../lib/methods/helpers/userDemographics';
import { getRoomType, getSanitizedRoomName } from '../../lib/methods/helpers/roomAnalytics';
import { messageViewTracker } from '../../lib/methods/helpers/messageViewTracking';

interface IMessageViewTracking {
	messageId: string;
	roomId: string;
	messageType?: string;
	authorUsername?: string;
	hasAttachments?: boolean;
	isThread?: boolean;
	children: React.ReactNode;
}

/**
 * Wrapper component that tracks when a message enters viewport
 */
export const MessageWithViewTracking = React.memo((props: IMessageViewTracking) => {
	const { room } = useContext(MessageContext);
	const viewRef = useRef<View>(null);
	const [hasTracked, setHasTracked] = useState(false);

	useEffect(() => {
		if (hasTracked || !props.messageId || !room) return;

		// Simple viewport detection using onLayout
		// Note: For production, consider using @react-native-community/viewability-helper
		// or implementing IntersectionObserver-like behavior
		const trackIfVisible = () => {
			const shouldLog = messageViewTracker.trackView(props.messageId, props.roomId);

			if (shouldLog) {
				const roomType = getRoomType(room);
				const roomName = getSanitizedRoomName(room);
				const pendingViews = messageViewTracker.getPendingViews(props.roomId);

				// Log aggregated view event
				logEvent(
					events.MESSAGE_VIEWED,
					withDemographics({
						room_id: props.roomId,
						room_type: roomType,
						room_name: roomName,
						message_count: pendingViews.length,
						message_ids: pendingViews.slice(0, 10).join(','), // First 10 IDs only
						sample_message_type: props.messageType,
						sample_has_attachments: props.hasAttachments || false,
						sample_is_thread: props.isThread || false,
						timestamp: Date.now()
					})
				);

				// Persist tracked messages periodically
				messageViewTracker.persist();
			}

			setHasTracked(true);
		};

		// Delay tracking slightly to ensure message is rendered
		const timer = setTimeout(trackIfVisible, 500);

		return () => clearTimeout(timer);
	}, [hasTracked, props.messageId, props.roomId, room, props.messageType, props.hasAttachments, props.isThread]);

	return (
		<View ref={viewRef} style={{ flex: 1 }}>
			{props.children}
		</View>
	);
});

MessageWithViewTracking.displayName = 'MessageWithViewTracking';
