import { Dimensions, StyleSheet } from 'react-native';

import { colors } from '../../lib/constants';

export const createMainStyles = ({ theme }: { theme: any }) =>
	StyleSheet.create({
		mainContainer: {
			backgroundColor: '#F8F9FA', // Light gray background for entire page
			flex: 1
		},
		scrollContent: {
			flex: 1,
			padding: 20
		},
		title: {
			fontSize: 28,
			lineHeight: 32,
			fontWeight: '400',
			color: '#191C20',
			marginBottom: 24
		},
		tileContainer: {
			flexDirection: 'row',
			justifyContent: 'space-around',
			flexWrap: 'wrap',
			marginBottom: 40
		},
		sectionHeader: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			marginBottom: 16
		},
		sectionTitle: {
			fontSize: 20,
			lineHeight: 24,
			fontWeight: '600',
			color: '#191C20'
		},
		viewAllLink: {
			fontSize: 14,
			color: '#799A79',
			fontWeight: '500'
		},
		sectionContainer: {
			marginBottom: 32
		},
		emptySection: {
			backgroundColor: '#F8F9FA',
			padding: 20,
			borderRadius: 8,
			alignItems: 'center',
			justifyContent: 'center',
			minHeight: 80
		},
		emptySectionText: {
			fontSize: 14,
			color: '#6B7280',
			fontStyle: 'italic'
		},
		eventsContainer: {
			backgroundColor: 'transparent',
			borderRadius: 8,
			padding: 4
		},
		eventItem: {
			backgroundColor: '#FFFFFF',
			marginVertical: 4,
			marginHorizontal: 4,
			borderRadius: 6
		},
		eventContent: {
			padding: 12
		},
		eventTitle: {
			fontSize: 16,
			fontWeight: '600',
			color: '#191C20',
			marginBottom: 4
		},
		eventDate: {
			fontSize: 14,
			color: '#6B7280',
			fontWeight: '400'
		},
		viewMoreEvents: {
			padding: 12,
			alignItems: 'center',
			marginVertical: 4,
			marginHorizontal: 4
		},
		viewMoreText: {
			fontSize: 14,
			color: '#799A79',
			fontWeight: '500'
		},
		savedPostsContainer: {
			backgroundColor: 'transparent',
			borderRadius: 8,
			padding: 4
		},
		savedPostItem: {
			backgroundColor: '#FFFFFF',
			marginVertical: 4,
			marginHorizontal: 4,
			borderRadius: 6
		},
		savedPostContent: {
			padding: 12
		},
		savedPostHeader: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			marginBottom: 6
		},
		savedPostAuthor: {
			fontSize: 14,
			fontWeight: '600',
			color: '#191C20',
			flex: 1,
			marginRight: 8
		},
		savedPostDate: {
			fontSize: 12,
			color: '#6B7280',
			fontWeight: '400'
		},
		savedPostText: {
			fontSize: 14,
			color: '#374151',
			lineHeight: 18,
			marginBottom: 8
		},
		savedPostStats: {
			flexDirection: 'row',
			justifyContent: 'flex-start'
		},
		savedPostStat: {
			fontSize: 12,
			color: '#6B7280',
			marginRight: 16
		},
		viewMoreSavedPosts: {
			padding: 12,
			alignItems: 'center',
			marginVertical: 4,
			marginHorizontal: 4
		},
		profileImageContainer: {
			marginRight: 20
		},
		profileImage: {
			// width: 24,
			// height: 24,
			borderRadius: 12
			// backgroundColor: 'red'
		}
	});

const screenWidth = Dimensions.get('window').width;

const isLargeMobileScreen = screenWidth > 390;

const smallTileWidth = isLargeMobileScreen ? 115 : 96;

export const createTileStyles = ({
	size,
	color,
	maxTileWidth,
	theme
}: {
	size?: 'small' | 'large';
	color: string;
	maxTileWidth?: number;
	theme: any;
}) =>
	StyleSheet.create({
		tile: {
			width: 100,
			marginVertical: 16,
			alignItems: 'center'
		},
		tileContent: {
			alignItems: 'center'
		},
		imageContainer: {
			justifyContent: 'center',
			alignItems: 'center',
			width: 90,
			height: 90,
			borderRadius: 45,
			backgroundColor: color
		},
		text: {
			fontSize: 14,
			lineHeight: 18,
			textAlign: 'center',
			fontWeight: '500',
			marginTop: 12,
			color: '#191C20'
		},
		image: {
			width: 50,
			height: 50
		}
	});
