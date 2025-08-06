import { PixelRatio, StyleSheet } from 'react-native';

import sharedStyles from '../../views/Styles';

export const ROW_HEIGHT = 100 * PixelRatio.getFontScale(); // Increased height for card layout
export const ROW_HEIGHT_CONDENSED = 80 * PixelRatio.getFontScale();
export const ACTION_WIDTH = 80;
export const SMALL_SWIPE = ACTION_WIDTH / 2;
export const LONG_SWIPE = ACTION_WIDTH * 2.5;

export default StyleSheet.create({
	flex: {
		flex: 1
	},
	container: {
		flexDirection: 'row',
		alignItems: 'center', // Changed from center to flex-start for better content layout
		paddingLeft: 14,
		height: ROW_HEIGHT,
		marginVertical: 12, // Further increased margin for better card separation
		marginHorizontal: 16,
		borderRadius: 8,
		paddingVertical: 16, // Increased padding for better spacing
		position: 'relative' // Enable absolute positioning for badge
	},
	containerCondensed: {
		height: ROW_HEIGHT_CONDENSED
	},
	centerContainer: {
		flex: 1,
		paddingVertical: 4,
		paddingRight: 14,
		justifyContent: 'center'
	},
	title: {
		fontSize: 18,
		fontWeight: 'bold'
	},
	alert: {
		...sharedStyles.textSemibold
	},
	row: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'flex-start'
	},
	wrapUpdatedAndBadge: {
		alignItems: 'flex-end'
	},
	titleContainer: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start'
	},
	titleAndDateContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	date: {
		fontSize: 12,
		marginLeft: 4,
		fontWeight: '400'
	},
	updateAlert: {
		...sharedStyles.textSemibold
	},
	status: {
		marginRight: 2
	},
	markdownText: {
		flex: 1,
		fontSize: 14,
		...sharedStyles.textRegular
	},
	avatar: {
		marginRight: 10
	},
	upperContainer: {
		overflow: 'hidden'
	},
	actionsContainer: {
		position: 'absolute',
		left: 0,
		right: 0,
		height: ROW_HEIGHT
	},
	actionsLeftContainer: {
		flexDirection: 'row',
		position: 'absolute',
		left: 0,
		right: 0,
		height: ROW_HEIGHT
	},
	actionLeftButtonContainer: {
		position: 'absolute',
		height: ROW_HEIGHT,
		justifyContent: 'center',
		top: 0,
		right: 0
	},
	actionRightButtonContainer: {
		position: 'absolute',
		height: ROW_HEIGHT,
		justifyContent: 'center',
		top: 0
	},
	actionButton: {
		width: ACTION_WIDTH,
		height: '100%',
		alignItems: 'center',
		justifyContent: 'center'
	},
	tagContainer: {
		alignSelf: 'center',
		alignItems: 'center',
		borderRadius: 4,
		marginHorizontal: 4
	},
	tagText: {
		fontSize: 13,
		paddingHorizontal: 4,
		...sharedStyles.textSemibold
	},
	typeIcon: {
		height: ROW_HEIGHT,
		justifyContent: 'center'
	},
	badgePosition: {
		position: 'absolute',
		bottom: 4,
		right: 8,
		zIndex: 1 // Ensure badge appears above other content
	},
	badgeInline: {
		marginLeft: 8,
		alignSelf: 'flex-end'
	},
	discussionIconContainer: {
		width: 40,
		height: 40,
		borderRadius: 8,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 10
	},
	discussionIcon: {
		width: 24,
		height: 24
	}
});
