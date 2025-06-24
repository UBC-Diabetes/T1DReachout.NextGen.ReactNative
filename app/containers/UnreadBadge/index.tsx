import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

import sharedStyles from '../../views/Styles';
import { getUnreadStyle } from './getUnreadStyle';
import { useTheme } from '../../theme';

const styles = StyleSheet.create({
	unreadNumberContainerNormal: {
		height: 21,
		paddingVertical: 3,
		paddingHorizontal: 5,
		borderRadius: 10.5,
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: 10
	},
	unreadNumberContainerSmall: {
		borderRadius: 10.5,
		alignItems: 'center',
		justifyContent: 'center'
	},
	unreadText: {
		fontSize: 13,
		...sharedStyles.textSemibold
	},
	textSmall: {
		fontSize: 10
	}
});

export interface IUnreadBadge {
	unread?: number;
	userMentions?: number;
	groupMentions?: number;
	style?: StyleProp<ViewStyle>;
	tunread?: any[];
	tunreadUser?: any[];
	tunreadGroup?: any[];
	small?: boolean;
	hideUnreadStatus?: boolean;
	hideMentionStatus?: boolean;
	alert?: boolean;
}

const UnreadBadge = React.memo(
	({
		unread,
		userMentions,
		groupMentions,
		style,
		tunread,
		tunreadUser,
		tunreadGroup,
		small,
		hideMentionStatus,
		hideUnreadStatus,
		alert
	}: IUnreadBadge) => {
		const { theme } = useTheme();

		
		// Show badge if there are unread messages OR if there's an alert
		const hasUnread = (unread && unread > 0) || tunread?.length;
		const shouldShowBadge = hasUnread || alert;
		
		if (!shouldShowBadge) {
			return null;
		}

		if (hideUnreadStatus && hideMentionStatus) {
			return null;
		}

		// Return null when hideUnreadStatus is true and isn't a direct mention
		if (hideUnreadStatus && !((userMentions && userMentions > 0) || tunreadUser?.length)) {
			return null;
		}

		const { backgroundColor, color } = getUnreadStyle({
			theme,
			unread,
			userMentions,
			groupMentions,
			tunread,
			tunreadUser,
			tunreadGroup,
			alert
		});

		if (!backgroundColor) {
			return null;
		}
		let text: any = unread || tunread?.length;
		
		// If there's an alert but no unread count, show a dot or "•"
		if (alert && (!text || text <= 0)) {
			text = '•';
		} else {
			if (small && text >= 100) {
				text = '+99';
			}
			if (!small && text >= 1000) {
				text = '+999';
			}
			text = text.toString();
		}

		let minWidth = 21;
		let badgeSize = 21; // Default size for normal badges
		if (small) {
			// For small badges, use a fixed circular size
			badgeSize = 20;
			minWidth = badgeSize;
		}

		return (
			<View
				style={[
					small ? styles.unreadNumberContainerSmall : styles.unreadNumberContainerNormal,
					{ 
						backgroundColor, 
						minWidth,
						width: small ? badgeSize : minWidth,
						height: small ? badgeSize : 21,
						borderRadius: small ? badgeSize / 2 : 10.5
					},
					style
				]}>
				<Text style={[styles.unreadText, small && styles.textSmall, { color }]} numberOfLines={1}>
					{text}
				</Text>
			</View>
		);
	}
);

export default UnreadBadge;
