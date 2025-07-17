import React from 'react';
import { View } from 'react-native';

import Avatar from '../Avatar';
import { DisplayMode } from '../../lib/constants';
import TypeIcon from './TypeIcon';
import styles from './styles';
import { IIconOrAvatar } from './interfaces';

const IconOrAvatar = ({
	avatar,
	type,
	rid,
	showAvatar,
	userId,
	prid,
	status,
	isGroupChat,
	teamMain,
	showLastMessage,
	displayMode,
	sourceType,
	containerStyles,
	iconSize,
	borderRadius,
	view,
	isDiscussionBoard
}: IIconOrAvatar): React.ReactElement | null => {
	if (showAvatar) {
		let avatarSize = iconSize;
		if (!avatarSize) {
			avatarSize = displayMode === DisplayMode.Condensed ? 36 : 48;
		}

		const newBorderRadius = isDiscussionBoard ? 4 : borderRadius !== undefined ? borderRadius : avatarSize / 2;

		return (
			<Avatar
				text={avatar}
				size={avatarSize}
				type={type}
				style={containerStyles || styles.avatar}
				rid={rid}
				borderRadius={newBorderRadius}
			/>
		);
	}

	if (displayMode === DisplayMode.Expanded && showLastMessage) {
		return (
			<View style={styles.typeIcon}>
				<TypeIcon
					userId={userId}
					type={type}
					prid={prid}
					status={status}
					isGroupChat={isGroupChat}
					teamMain={teamMain}
					size={iconSize || 24}
					style={containerStyles || { marginRight: 12 }}
					sourceType={sourceType}
				/>
			</View>
		);
	}

	return null;
};

export default IconOrAvatar;
