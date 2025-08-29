import React from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

import { themes } from '../../../lib/constants';
import { withTheme, useTheme } from '../../../theme';
import { DiscussionBoardCardProps } from '../DiscussionHomeView/interaces';
import { getIcon } from '../helpers';
import BoardIconStrip from './BoardIconStrip';
import IconOrAvatar from '../../../containers/RoomItem/IconOrAvatar';
import { IApplicationState } from '../../../definitions';
import { getUidDirectMessage } from '../../../lib/methods/helpers';
import { useAppSelector } from '../../../lib/hooks';

const hitSlop = { top: 10, right: 10, bottom: 10, left: 10 };
const cardColors = ['magenta', 'mossGreen', 'dreamBlue', 'creamsicleYellow', 'pink', 'superGray', 'forestGreen'];

const DiscussionBoardCard = React.memo(({ item, onPress, theme }: DiscussionBoardCardProps) => {
	const { colors } = useTheme();
	const { title, description, saved = false, icon, color, onSaveClick, avatar, f, usersCount } = item;
	// const [savedDiscussion, setSavedDiscussion] = React.useState(saved);
	const {
		// sortBy, showUnread, showFavorites, groupByType,
		displayMode,
		showAvatar
	} = useSelector((state: IApplicationState) => state.sortPreferences);
	const StoreLastMessage = useSelector((state: IApplicationState) => state.settings.Store_Last_Message);

	const id = getUidDirectMessage(item);
	const userStatus = useAppSelector(state => state.activeUsers[id || '']?.status);
	const status = item.t === 'l' ? item.visitor?.status || item.v?.status : userStatus;
	const randomColor = cardColors[Math.floor(Math.random() * cardColors.length)];

	const styles = makeStyles(colors);

	return (
		<TouchableOpacity style={styles.cardContainer} onPress={() => onPress && onPress()}>
			<View style={styles.cardContent}>
				<BoardIconStrip avatarText={avatar} type={item.t} rid={item.rid} style={styles.iconContainer} resizeMode='cover' />
				<View style={styles.textSection}>
					<Text style={styles.title}>{title}</Text>
					{description ? (
						<Text style={styles.description}>{`${description?.slice(0, 100)}${description?.length > 100 ? '...' : ''}`}</Text>
					) : (
						<></>
					)}
					<View style={styles.boardMembersContainer}>
						<Image source={getIcon('boardUsers')} style={styles.usersIcon} />
						<Text style={{ color: colors.boardMembersText }}>{usersCount} members</Text>
					</View>
				</View>
			</View>
			{/* 
			Starring a chat room is not supported yet.
			<TouchableOpacity
				style={styles.savedContainer}
				onPress={() => {
					// setSavedDiscussion(!savedDiscussion);
					onSaveClick && onSaveClick();
				}}
				hitSlop={hitSlop}
			>
				<Image source={f ? getIcon('solidStar') : getIcon('outlineStar')} style={styles.saveIcon} />
			</TouchableOpacity> */}
		</TouchableOpacity>
	);
});

export default withTheme(DiscussionBoardCard);

const makeStyles = themeColors =>
	StyleSheet.create({
		cardContainer: {
			width: '100%',
			backgroundColor: themeColors.nextGenSurface, // NextGen surface background
			borderRadius: 8,
			marginVertical: 6,
			overflow: 'hidden' // Ensure child components respect parent border radius
		},
		cardContent: {
			flexDirection: 'row',
			minHeight: 100 // Use minHeight for flexible card sizing
		},
		iconSection: {
			width: '25%', // 1/4 of the card width for icon area
			backgroundColor: themeColors.nextGenPrimary,
			borderTopLeftRadius: 8,
			borderBottomLeftRadius: 8,
			justifyContent: 'center',
			alignItems: 'center',
			alignSelf: 'stretch' // Fill the full height of the card
		},
		iconContainer: {
			width: '30%',
			alignSelf: 'stretch',
			justifyContent: 'center',
			alignItems: 'center'
		},
		boardIcon: {
			width: 50,
			height: 50
		},
		textSection: {
			flex: 1, // 3/4 of the card width for text content
			paddingVertical: 12,
			paddingHorizontal: 16,
			justifyContent: 'center'
		},
		title: {
			fontFamily: 'Inter',
			fontWeight: '600',
			fontSize: 16,
			lineHeight: 20,
			color: themeColors.nextGenText
		},
		description: {
			fontFamily: 'Inter',
			fontWeight: '400',
			fontSize: 14,
			lineHeight: 18,
			marginBottom: 8,
			color: themeColors.nextGenTextSecondary
		},
		boardMembersContainer: {
			flexDirection: 'row',
			alignItems: 'center'
		},
		usersIcon: {
			width: 16,
			height: 16,
			marginRight: 6,
			tintColor: themeColors.nextGenTextSecondary
		},
		// Legacy styles for compatibility
		mainContainer: {
			width: '100%',
			flexDirection: 'row'
		},
		textContainer: {
			flex: 1,
			paddingTop: 6,
			marginLeft: 12,
			marginRight: 15
		},
		savedContainer: {
			width: 42,
			height: 42,
			marginTop: 10,
			justifyContent: 'center',
			alignItems: 'center'
		},
		saveIcon: {
			width: 42,
			height: 42
		}
	});
