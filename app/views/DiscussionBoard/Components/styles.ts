import { StyleSheet } from 'react-native';
import { colors } from '../../../lib/constants';

export const createSavedPostCardStyles = ({ theme }: { theme: any }) => {
	return StyleSheet.create({
		savedPostItem: {
			backgroundColor: colors[theme].nextGenSurface,
			marginVertical: 4,
			marginHorizontal: 4,
			borderRadius: 8
		},
		savedPostContent: {
			padding: 12
		},
		savedPostHeader: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'flex-start',
			marginBottom: 6
		},
		profileImageContainer: {
			marginRight: 8
		},
		profileImage: {
			width: 24,
			height: 24,
			borderRadius: 12
		},
		savedPostInfo: {
			flex: 1,
			marginRight: 8
		},
		savedPostAuthor: {
			fontSize: 14,
			fontWeight: '600',
			color: colors[theme].nextGenText
		},
		savedPostDate: {
			fontSize: 12,
			color: colors[theme].nextGenTextSecondary,
			fontWeight: '400'
		},
		bookmarkButton: {
			padding: 4
		},
		bookmarkIcon: {
			width: 18,
			height: 18,
			tintColor: colors[theme].nextGenPrimary
		},
		savedPostText: {
			fontSize: 14,
			color: colors[theme].nextGenText,
			lineHeight: 18,
			marginBottom: 8
		},
		savedPostStats: {
			flexDirection: 'row',
			justifyContent: 'flex-start'
		},
		savedPostStat: {
			fontSize: 12,
			color: colors[theme].nextGenTextSecondary,
			marginRight: 16
		}
	});
};
