import { StyleSheet } from 'react-native';

import sharedStyles from '../Styles';

export default StyleSheet.create({
	container: {
		flex: 1
	},
	scroll: {
		flex: 1,
		flexDirection: 'column'
	},
	item: {
		paddingVertical: 10,
		paddingHorizontal: 20,
		justifyContent: 'center'
	},
	avatarContainer: {
		minHeight: 320,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 20,
		paddingBottom: 8,
		paddingTop: 32
	},
	avatar: {
		marginHorizontal: 10
	},
	roomTitleContainer: {
		paddingTop: 16,
		marginHorizontal: 16,
		alignItems: 'center',
		flexDirection: 'row'
	},
	roomTitle: {
		fontSize: 16,
		...sharedStyles.textAlignCenter,
		...sharedStyles.textMedium
	},
	roomUsername: {
		fontSize: 14,
		...sharedStyles.textAlignCenter,
		...sharedStyles.textRegular
	},
	roomTitleRow: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	itemLabel: {
		marginBottom: 10,
		fontSize: 14,
		...sharedStyles.textMedium
	},
	itemContent: {
		fontSize: 14,
		...sharedStyles.textRegular
	},
	itemContent__empty: {
		fontStyle: 'italic'
	},
	rolesContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap'
	},
	roleBadge: {
		padding: 6,
		borderRadius: 12,
		marginRight: 6,
		marginBottom: 6
	},
	role: {
		fontSize: 14,
		...sharedStyles.textRegular
	},
	roomButtonsContainer: {
		flexDirection: 'row',
		paddingTop: 16
	},
	roomButton: {
		alignItems: 'center',
		marginHorizontal: 4,
		justifyContent: 'space-between',
		width: 80
	},
	roomButtonText: {
		marginTop: 4
	},
	roomInfoViewTitleContainer: {
		paddingTop: 16,
		paddingHorizontal: 20,
		alignItems: 'center'
	},
	
	// New sectioned layout styles matching ConnectView
	infoSection: {
		paddingHorizontal: 20,
		paddingVertical: 16,
		marginTop: 16
	},
	infoRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 12
	},
	infoLabel: {
		fontSize: 16,
		fontWeight: '500',
		flex: 1
	},
	infoValue: {
		fontSize: 16,
		flex: 1,
		textAlign: 'right'
	},
	deviceContainer: {
		flex: 1,
		alignItems: 'flex-end'
	},
	
	// About Section styles
	aboutSection: {
		paddingHorizontal: 20,
		paddingVertical: 20,
		marginTop: 16
	},
	aboutHeader: {
		fontSize: 22, // M3 Title Large
		fontWeight: '400',
		marginBottom: 12
	},
	
	// Profile Header Section styles (horizontal layout for direct messages)
	profileHeaderSection: {
		paddingHorizontal: 20,
		paddingVertical: 24
	},
	profileRow: {
		flexDirection: 'row',
		alignItems: 'flex-start'
	},
	profileInfoContainer: {
		flex: 1,
		justifyContent: 'flex-start',
		paddingLeft: 16
	},
	
	// Direct message title styles for horizontal layout
	directTitleContainer: {
		marginBottom: 16
	},
	directNameText: {
		fontSize: 24, // M3 Headline Small
		fontWeight: '400',
		marginBottom: 4
	},
	directUsernameText: {
		fontSize: 14,
		marginBottom: 4
	},
	statusTextContainer: {
		marginTop: 4
	},
	
	// Field layout styles matching ProfileView
	fieldRow: {
		marginBottom: 16
	},
	fieldLabel: {
		fontSize: 16,
		fontWeight: '500',
		marginBottom: 4
	},
	fieldValue: {
		fontSize: 16,
		lineHeight: 20
	},
	
	// About text style
	aboutText: {
		fontSize: 16,
		lineHeight: 22
	}
});
