import React, { useRef, useState, useCallback } from 'react';
import { FlatList, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { themes } from '../../../../lib/constants';
import scrollPersistTaps from '../../../../lib/methods/helpers/scrollPersistTaps';
import ActivityIndicator from '../../../../containers/ActivityIndicator';
import { CustomIcon } from '../../../../containers/CustomIcon';
import { TAnyMessageModel } from '../../../../definitions';
import { TSupportedThemes } from '../../../../theme';
import { SCROLL_LIMIT, EDGE_DISTANCE } from '../../../RoomView/List/constants';
import Room247MessageSeparator from './Room247MessageSeparator';

interface IRoom247ListProps {
	theme: TSupportedThemes;
	messages: TAnyMessageModel[];
	renderItem: (item: TAnyMessageModel, prevItem: TAnyMessageModel) => React.ReactElement;
	loading: boolean;
	fetchMessages: () => void;
	jumpToMessageId?: string;
}

const createStyles = ({ theme }: { theme: any }) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: themes[theme].nextGenBackground // NextGen background color
		},
		list: {
			flex: 1
		},
		contentContainer: {
			paddingHorizontal: 8,
			paddingVertical: 16 // Increase padding for better visual spacing
		},
		loadingContainer: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center'
		},
		emptyContainer: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: themes[theme].nextGenBackground // NextGen background color
		},
		emptyText: {
			fontSize: 16,
			fontWeight: '500',
			color: themes[theme].nextGenTextSecondary,
			textAlign: 'center',
			marginHorizontal: 40
		},
		// Scroll to bottom button styles (adapted from NavBottomFAB)
		scrollButton: {
			position: 'absolute',
			bottom: EDGE_DISTANCE,
			right: EDGE_DISTANCE,
			width: 50,
			height: 50,
			borderRadius: 25,
			backgroundColor: themes[theme].nextGenPrimary, // NextGen primary color
			borderWidth: 1,
			borderColor: themes[theme].nextGenBorder,
			alignItems: 'center',
			justifyContent: 'center',
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.25,
			shadowRadius: 3.84,
			elevation: 5
		}
	});

// Legacy export for compatibility
const styles = createStyles({ theme: 'light' });

const Room247List = ({ theme, messages, renderItem, loading, fetchMessages, jumpToMessageId }: IRoom247ListProps) => {
	// FlatList ref for scroll control
	const flatListRef = useRef<FlatList>(null);
	const [hasScrolled, setHasScrolled] = useState(false);

	const dynamicStyles = createStyles({ theme });

	// Scroll button visibility state
	const [showScrollButton, setShowScrollButton] = useState(false);

	const viewabilityConfig = {
		itemVisiblePercentThreshold: 50
	};

	const onViewableItemsChanged = useCallback(
		({ viewableItems }) => {
			if (jumpToMessageId && !hasScrolled && viewableItems.length > 0) {
				const index = messages.findIndex(m => m.id === jumpToMessageId);
				if (index > -1) {
					flatListRef.current?.scrollToIndex({ index, animated: true });
					setHasScrolled(true);
				} else {
					console.log('[Room247List] Message not found in onViewableItemsChanged', {
						jumpToMessageId,
						totalMessages: messages.length
					});
				}
			}
		},
		[jumpToMessageId, messages, hasScrolled]
	);

	const handleScrollToIndexFailed = (info: { index: number; highestMeasuredFrameIndex: number; averageItemLength: number }) => {
		// Fallback to scrolling to offset if index fails
		flatListRef.current?.scrollToOffset({ offset: info.averageItemLength * info.index, animated: true });
	};

	let displayMessages = messages;

	if (loading && !displayMessages.length) {
		return (
			<View style={[styles.loadingContainer, { backgroundColor: themes[theme].backgroundColor }]}>
				<ActivityIndicator />
			</View>
		);
	}

	// Empty state display
	if (!displayMessages.length) {
		return (
			<View style={[styles.container, styles.emptyContainer, { backgroundColor: themes[theme].backgroundColor }]}>
				<Text style={styles.emptyText}>No messages yet</Text>
			</View>
		);
	}

	// Helper to check if two messages are on different days
	const isNewDay = (current: TAnyMessageModel, previous?: TAnyMessageModel) => {
		if (!previous) return true;
		const currDate = current.ts ? new Date(current.ts) : null;
		const prevDate = previous.ts ? new Date(previous.ts) : null;
		if (!currDate || !prevDate) return false;

		// Check if the current message is from today or yesterday
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		const isToday = currDate.toDateString() === today.toDateString();
		const isYesterday = currDate.toDateString() === yesterday.toDateString();

		// Only show separator if it's a different day AND there are messages
		return (
			currDate.toDateString() !== prevDate.toDateString() &&
			displayMessages.some(msg => {
				const msgDate = msg.ts ? new Date(msg.ts) : null;
				if (!msgDate) return false;
				return msgDate.toDateString() === currDate.toDateString();
			})
		);
	};

	// Scroll to bottom function (similar to useScroll.ts)
	const handleScrollToBottom = () => {
		flatListRef.current?.scrollToOffset({ offset: -100, animated: true });
	};

	// Scroll event handler (similar to List.tsx)
	const handleScroll = (event: any) => {
		const offsetY = event.nativeEvent.contentOffset.y;
		if (offsetY > SCROLL_LIMIT) {
			setShowScrollButton(true);
		} else {
			setShowScrollButton(false);
		}
	};

	return (
		<View style={dynamicStyles.container}>
			<FlatList
				ref={flatListRef}
				testID='room-view-messages-247'
				style={dynamicStyles.list}
				data={displayMessages}
				keyExtractor={item => item.id}
				renderItem={({ item, index }) => {
					const prevItem = displayMessages[index + 1]; // FlatList is inverted
					const showSeparator = isNewDay(item, prevItem);
					return (
						<>
							{renderItem(item, prevItem)}
							{showSeparator && <Room247MessageSeparator ts={item.ts} />}
						</>
					);
				}}
				contentContainerStyle={dynamicStyles.contentContainer}
				removeClippedSubviews={false}
				initialNumToRender={15}
				maxToRenderPerBatch={20}
				windowSize={20}
				onEndReachedThreshold={0.5}
				inverted={true} // Ensure new messages appear at the bottom
				showsVerticalScrollIndicator={false} // Hide scrollbar for cleaner look
				onEndReached={fetchMessages}
				onScroll={handleScroll}
				scrollEventThrottle={16}
				onViewableItemsChanged={onViewableItemsChanged}
				viewabilityConfig={viewabilityConfig}
				onScrollToIndexFailed={handleScrollToIndexFailed}
				maintainVisibleContentPosition={{
					minIndexForVisible: 0,
					autoscrollToTopThreshold: 0
				}}
				{...scrollPersistTaps}
			/>
			{/* Scroll to bottom button - only show when scrolled up */}
			{showScrollButton && (
				<TouchableOpacity style={dynamicStyles.scrollButton} onPress={handleScrollToBottom} testID='room-247-scroll-to-bottom'>
					<CustomIcon name='chevron-down' size={24} color={themes[theme].nextGenSurface} />
				</TouchableOpacity>
			)}
		</View>
	);
};

export default Room247List;
