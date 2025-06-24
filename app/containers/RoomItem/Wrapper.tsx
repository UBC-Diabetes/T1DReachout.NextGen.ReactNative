import React from 'react';
import { View, Image } from 'react-native';

import { DisplayMode } from '../../lib/constants';
import { useTheme } from '../../theme';
import IconOrAvatar from './IconOrAvatar';
import { IWrapperProps } from './interfaces';
import styles from './styles';
import { CustomIcon } from '../CustomIcon';
import { getIcon, getBoardIcon } from '../../views/DiscussionBoard/helpers';

const Wrapper = ({ accessibilityLabel, children, displayMode, roomName, ...props }: IWrapperProps): React.ReactElement => {
	const { colors } = useTheme();

	// Check if this is a discussion board room
	const isDiscussionBoard =
		roomName &&
		[
			'Insulin Pump Users',
			'Virtual Happy Hours',
			'Travelling',
			'CGM Users',
			'MDI Users',
			'Insurance',
			'Exercising',
			'24/7 Chatroom'
		].includes(roomName);

	return (
		<View
			style={[styles.container, displayMode === DisplayMode.Condensed && styles.containerCondensed]}
			accessibilityLabel={accessibilityLabel}
			accessible
			accessibilityRole='button'>
			{isDiscussionBoard ? (
				<View style={styles.discussionIconContainer}>
					{getBoardIcon(roomName) === 'airplane' ||
					getBoardIcon(roomName) === 'support' ||
					getBoardIcon(roomName) === 'discussionBoardIcon' ? (
						<CustomIcon
							name={
								getBoardIcon(roomName) === 'airplane'
									? 'airplane'
									: getBoardIcon(roomName) === 'support'
									? 'support'
									: 'discussions'
							}
							size={24}
							color='#FFFFFF'
						/>
					) : (
						<Image source={getIcon(getBoardIcon(roomName))} style={styles.discussionIcon} resizeMode='contain' />
					)}
				</View>
			) : (
				<IconOrAvatar displayMode={displayMode} {...props} roomName={roomName} />
			)}
			<View
				style={[
					styles.centerContainer,
					{
						borderColor: colors.strokeLight
					}
				]}>
				{children}
			</View>
		</View>
	);
};

export default Wrapper;
