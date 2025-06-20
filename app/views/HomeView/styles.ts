import { Dimensions, StyleSheet } from 'react-native';

import { colors } from '../../lib/constants';

export const createMainStyles = ({ theme }: { theme: any }) =>
	StyleSheet.create({
		mainContainer: {
			backgroundColor: colors[theme].backgroundColor,
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
		sectionTitle: {
			fontSize: 20,
			lineHeight: 24,
			fontWeight: '600',
			color: '#191C20',
			marginBottom: 16
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
