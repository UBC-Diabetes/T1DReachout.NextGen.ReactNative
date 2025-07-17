import React from 'react';
import { StyleSheet, ViewStyle, View, Image } from 'react-native';

import { OmnichannelRoomIcon } from './OmnichannelRoomIcon';
import { CustomIcon, TIconsName } from '../CustomIcon';
import { themes } from '../../lib/constants';
import Status from '../Status';
import { useTheme } from '../../theme';
import { TUserStatus, IOmnichannelSource } from '../../definitions';
import { getIcon, getBoardIcon } from '../../views/DiscussionBoard/helpers';

const styles = StyleSheet.create({
	icon: {
		marginRight: 4
	},
	discussionIconContainer: {
		width: 40,
		height: 40,
		backgroundColor: '#112D4E', // Same blue as boards view
		borderRadius: 8,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 4
	},
	discussionIcon: {
		width: 24,
		height: 24
	}
});

interface IRoomTypeIcon {
	type?: string;
	userId?: string | null;
	isGroupChat?: boolean;
	teamMain?: boolean;
	status?: TUserStatus;
	size?: number;
	style?: ViewStyle;
	sourceType?: IOmnichannelSource;
	roomName?: string;
}

const RoomTypeIcon = React.memo(
	({ userId, type, isGroupChat, status, style, teamMain, size = 16, sourceType, roomName }: IRoomTypeIcon) => {
		const { theme } = useTheme();

		if (!type) {
			return null;
		}

		const iconStyle = [styles.icon, style];

		if (type === 'd' && !isGroupChat && userId) {
			return <Status id={userId} style={iconStyle} size={size} status={status} />;
		}

		if (type === 'l') {
			return <OmnichannelRoomIcon style={iconStyle} size={size} type={type} status={status} sourceType={sourceType} />;
		}

		// TODO: move this to a separate function
		let icon: TIconsName = 'channel-private';
		if (teamMain) {
			icon = `teams${type === 'p' ? '-private' : ''}`;
		} else if (type === 'discussion') {
			icon = 'discussions';
		} else if (type === 'c') {
			icon = 'channel-public';
		} else if (type === 'd' && isGroupChat) {
			icon = 'message';
		}

		return <CustomIcon name={icon} size={size} color={themes[theme].fontTitlesLabels} style={iconStyle} />;
	}
);

export default RoomTypeIcon;
