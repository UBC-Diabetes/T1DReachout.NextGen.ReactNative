import React from 'react';
import { Text, View, ViewStyle, Platform } from 'react-native';

import Touch from '../Touch';
import Avatar from '../Avatar';
import RoomTypeIcon from '../RoomTypeIcon';
import styles, { ROW_HEIGHT } from './styles';
import { themes } from '../../lib/constants';
import { TSupportedThemes, useTheme } from '../../theme';
import { CustomIcon } from '../CustomIcon';
export { ROW_HEIGHT };

interface IDirectoryItemLabel {
	text?: string;
	theme: TSupportedThemes;
}

interface IDirectoryItem {
	title: string;
	description?: string;
	avatar?: string;
	type: string;
	onPress(): void;
	testID: string;
	style?: ViewStyle;
	rightLabel?: string;
	rid?: string;
	age?: string;
	teamMain?: boolean;
	t1dSince?: string;
	devices?: string[];
}

const DirectoryItemLabel = React.memo(({ text, theme }: IDirectoryItemLabel) => {
	if (!text) {
		return null;
	}
	return <Text style={[styles.directoryItemLabel, { color: themes[theme].fontSecondaryInfo }]}>{text}</Text>;
});

const DirectoryItem = ({
	title,
	description,
	avatar,
	onPress,
	testID,
	style,
	rightLabel,
	type,
	rid,
	age,
	teamMain,
	t1dSince,
	devices
}: IDirectoryItem): React.ReactElement => {
	const { theme } = useTheme();

	return (
		<Touch onPress={onPress} style={[styles.directoryItemButton, style]} testID={testID}>
			<View style={styles.directoryItemContainer}>
				<Avatar text={avatar} size={96} type={type} rid={rid} style={styles.directoryItemAvatar} borderRadius={8} />
				<View style={styles.directoryItemTextContainer}>
					<View style={styles.directoryItemTextTitle}>
						{type !== 'd' ? <RoomTypeIcon type={type} teamMain={teamMain} /> : null}
						<View style={styles.directoryItemNameContainer}>
							<Text style={[styles.directoryItemName, { color: '#1D1B20' }]} numberOfLines={1}>
								{title}{age ? `, ${age}` : ''}
							</Text>
						</View>
					</View>
					{t1dSince ? (
						<Text style={[styles.directoryItemInfo, { color: '#1D1B20' }]} numberOfLines={1}>
							Age of diagnosis: {t1dSince} years old
						</Text>
					) : null}
					{devices && devices.length > 0 ? (
						<Text style={[styles.directoryItemInfo, { color: '#1D1B20' }]} numberOfLines={1}>
							Devices: {devices.join(', ')}
						</Text>
					) : null}
				</View>
				<View style={styles.directoryItemRightContainer}>
					<DirectoryItemLabel text={rightLabel} theme={theme} />
					<CustomIcon name="chevron-right" size={20} color={themes[theme].auxiliaryText} />
				</View>
			</View>
		</Touch>
	);
};

export default DirectoryItem;
