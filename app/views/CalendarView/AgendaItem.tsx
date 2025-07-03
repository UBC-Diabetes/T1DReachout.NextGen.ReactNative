import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import isEmpty from 'lodash/isEmpty';
import { parseISO, format } from 'date-fns';

import { CustomIcon } from '../../containers/CustomIcon';
import { getUserSelector } from '../../selectors/login';
import { pressEventRequest } from '../../actions/calendarEvents';
import { IApplicationState } from '../../definitions';
import Avatar from '../../containers/Avatar';
import { useTheme } from '../../theme';
import testIDs from './testIds';

interface ItemProps {
	item: any;
}

const AgendaItem = (props: ItemProps) => {
	const { item } = props;
	const navigation = useNavigation<NativeStackNavigationProp<any>>();
	const dispatch = useDispatch();
	const theme = useTheme();
	const { colors } = theme;

	const { username } = useSelector((state: IApplicationState) => getUserSelector(state));
	const { attendees } = item;

	const isAttending = useMemo(() => attendees.includes(username), [attendees, username]);
	const styles = makeStyles(theme);

	const itemPressed = useCallback(
		(item: any) => {
			dispatch(pressEventRequest(item));
			navigation.navigate('EventDetailsView');
		},
		[dispatch, navigation]
	);

	if (isEmpty(item)) {
		return (
			<View style={styles.emptyItem}>
				<Text style={styles.emptyItemText}>No Events Planned Today</Text>
			</View>
		);
	}

	const getFormattedDateTime = (isoDateTime: string) => {
		const date = parseISO(isoDateTime);
		const dayOfWeek = format(date, 'EEEE');
		const time = format(date, 'h:mm a');
		return `${dayOfWeek} at ${time}`;
	};

	const formattedDate = getFormattedDateTime(item.dateTime);
	const fullTitle = `${item.title}${item.meetingLink ? ' (Meeting)' : ''}`;

	return (
		<View style={styles.itemContainer}>
			<TouchableOpacity onPress={() => itemPressed(item)} style={styles.item} testID={testIDs.agenda.ITEM}>
				<View style={styles.contentContainer}>
					<Text style={styles.itemTitleText}>{fullTitle}</Text>
					<Text style={styles.itemDateText}>{formattedDate}</Text>
					{isAttending && (
						<View style={styles.attendingContainer}>
							<CustomIcon name='check' color='white' size={16} />
							<Text style={styles.attendingText}>Attending</Text>
						</View>
					)}
				</View>
				<View style={styles.avatarContainer}>
					<View style={styles.avatarGroup}>
						{item.peers.slice(0, 3).map((user: Record<string, any>, index: number) => (
							<View key={user._id} style={[styles.avatarWrapper, { zIndex: item.peers.length - index, right: index * 15 }]}>
								<Avatar text={user.username} size={36} borderRadius={18} />
							</View>
						))}
					</View>
					{item.peers.length > 3 && (
						<View style={styles.morePeersContainer}>
							<Text style={styles.morePeersText}>{`+${item.peers.length - 3} more`}</Text>
						</View>
					)}
				</View>
			</TouchableOpacity>
		</View>
	);
};

const makeStyles = (theme: any) =>
	StyleSheet.create({
		attendingContainer: {
			backgroundColor: theme.colors.nextGenPrimary,
			paddingVertical: 4,
			paddingHorizontal: 8,
			alignItems: 'center',
			flexDirection: 'row',
			alignSelf: 'flex-start',
			marginTop: 4,
			borderRadius: 12
		},
		morePeersContainer: {
			alignSelf: 'center',
			marginTop: 4
		},
		morePeersText: {
			color: theme.colors.nextGenTextSecondary,
			fontSize: 12
		},
		attendingText: {
			color: theme.colors.nextGenSurface,
			fontSize: 12,
			fontWeight: 'bold',
			marginLeft: 4
		},
		avatarContainer: {
			flexDirection: 'column',
			marginLeft: 10
		},
		avatarGroup: {
			flexDirection: 'row-reverse'
		},
		avatarWrapper: {
			position: 'relative',
			marginLeft: -2,
			borderWidth: 2,
			borderColor: theme.colors.nextGenSurface,
			borderRadius: 18,
			overflow: 'hidden',
			width: 36,
			height: 36,
			justifyContent: 'center',
			alignItems: 'center'
		},
		itemContainer: {
			paddingBottom: 8,
			backgroundColor: theme.colors.nextGenBackground
		},
		item: {
			padding: 20,
			backgroundColor: theme.colors.nextGenSurface,
			flexDirection: 'row',
			borderRadius: 20,
			left: 15,
			width: '90%',
			shadowColor: theme.colors.nextGenBorder,
			shadowOffset: {
				width: 0,
				height: 2,
			},
			shadowOpacity: 0.1,
			shadowRadius: 3.84,
			elevation: 5,
		},
		contentContainer: {
			flex: 1
		},
		itemTitleText: {
			color: theme.colors.nextGenText,
			fontWeight: 'bold',
			fontSize: 16
		},
		itemDateText: {
			color: theme.colors.nextGenTextSecondary,
			fontSize: 14,
			marginTop: 4
		},
		emptyItem: {
			paddingLeft: 20,
			height: 52,
			justifyContent: 'center',
			borderBottomWidth: 1,
			borderBottomColor: theme.colors.nextGenBorder
		},
		emptyItemText: {
			color: theme.colors.nextGenTextSecondary,
			fontSize: 14
		}
	});

export default React.memo(AgendaItem);
