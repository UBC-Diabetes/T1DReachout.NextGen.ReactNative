import { StyleSheet } from 'react-native';

import sharedStyles from '../../views/Styles';

export const ROW_HEIGHT = 110;

export default StyleSheet.create({
	directoryItemButton: {
		height: ROW_HEIGHT,
		marginVertical: 12,
		marginHorizontal: 16,
		backgroundColor: '#FFFFFF',
		borderRadius: 10
	},
	directoryItemContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 15
	},
	directoryItemAvatar: {
		marginRight: 12
	},
	directoryItemTextTitle: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	directoryItemTextContainer: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center'
	},
	directoryItemNameContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1
	},
	directoryItemName: {
		fontSize: 16,
		fontWeight: '500',
		...sharedStyles.textMedium
	},
	directoryItemUsername: {
		fontSize: 14,
		alignItems: 'center',
		...sharedStyles.textRegular
	},
	directoryItemLabel: {
		fontSize: 14,
		paddingLeft: 10,
		...sharedStyles.textRegular
	},
	directoryItemAge: {
		fontSize: 14,
		fontWeight: '500',
		...sharedStyles.textRegular
	}
});
