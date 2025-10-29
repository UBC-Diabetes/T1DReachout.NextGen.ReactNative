import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Touchable from 'react-native-platform-touchable';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, parseISO } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';

import { useTheme } from '../../theme';
import * as HeaderButton from '../../containers/HeaderButton';
import { cancelEventEdit, createEventDraft, createEventRequest, updateEventRequest } from '../../actions/calendarEvents';
import { getUserSelector } from '../../selectors/login';
import { getCalendarEventsSelector, getDraftEventSelector } from '../../selectors/event';
import { IApplicationState } from '../../definitions';
import Avatar from '../../containers/Avatar';

const CreateEventView = () => {
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [showTimePicker, setShowTimePicker] = useState(false);
	const scrollViewRef = useRef(null);

	const dispatch = useDispatch();
	const navigation = useNavigation<NativeStackNavigationProp<any>>();
	const user = useSelector((state: IApplicationState) => getUserSelector(state));
	const { isEditing } = useSelector((state: IApplicationState) => getCalendarEventsSelector(state));
	const draftEvent = useSelector((state: IApplicationState) => getDraftEventSelector(state));
	const userName = user?.username || '';

	const { colors } = useTheme();
	const styles = makeStyles(colors);

	const backAction = () => {
		setShowDatePicker(false);
		setShowTimePicker(false);
		dispatch(cancelEventEdit());
		navigation.goBack();
	};

	useEffect(() => {
		navigation.setOptions({
			title: isEditing ? 'Edit Event' : 'Create Event',
			headerStyle: {
				backgroundColor: colors.nextGenBackground,
				shadowColor: 'transparent'
			},
			headerTitleStyle: {
				color: colors.nextGenText,
				fontSize: 18,
				fontWeight: '400'
			},
			headerTitleAlign: 'center',
			headerRight: () => (
				<HeaderButton.Container>
					<Touchable style={{ marginRight: 20 }} onPress={() => navigation.navigate('ProfileView')}>
						{userName ? <Avatar text={userName} size={24} borderRadius={12} /> : <></>}
					</Touchable>
				</HeaderButton.Container>
			)
		});

		if (!isEditing) {
			const defaultEvent = {
				description: draftEvent?.description ?? '',
				title: draftEvent?.title ?? '',
				dateTime: new Date().toISOString(),
				peers: draftEvent?.peers ?? [],
				attendees: draftEvent?.attendees ?? []
			};
			dispatch(createEventDraft(defaultEvent));
		}
	}, [colors.nextGenSurface, colors.nextGenText, isEditing]);

	const onTitleChange = (title: string) => {
		dispatch(createEventDraft({ title }));
	};
	const onDescriptionChange = (description: string) => {
		dispatch(createEventDraft({ description }));
	};
	const onMeetingLinkChange = (meetingLink: string) => {
		dispatch(createEventDraft({ meetingLink }));
	};

	const onDateChange = (event, selectedDate) => {
		setShowDatePicker(false);
		if (selectedDate) {
			const newDate = new Date(draftEvent.dateTime);
			newDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
			dispatch(createEventDraft({ dateTime: newDate.toISOString() }));
		}
	};

	const onTimeChange = (event, selectedTime) => {
		setShowTimePicker(false);
		if (selectedTime) {
			const newTime = new Date(draftEvent.dateTime);
			newTime.setHours(selectedTime.getHours(), selectedTime.getMinutes());
			dispatch(createEventDraft({ dateTime: newTime.toISOString() }));
		}
	};

	const removePeer = (username: string) => {
		const newPeers = draftEvent?.peers?.filter(peer => peer.username !== username);
		dispatch(createEventDraft({ peers: newPeers }));
	};

	const createOrUpdateEvent = async () => {
		if (isEditing) {
			dispatch(updateEventRequest());
		} else {
			dispatch(createEventRequest());
		}
		navigation.navigate('CalendarView');
	};

	const dateTime = new Date(draftEvent.dateTime);
	const displayDate = (isoString: string) => format(parseISO(isoString || new Date().toISOString()), 'MM/dd/yyyy');
	const displayTime = (isoString: string) => format(parseISO(isoString || new Date().toISOString()), 'h:mm a');

	const formattedDate = displayDate(draftEvent.dateTime);
	const formattedTime = displayTime(draftEvent.dateTime);

	const onLastInputFocus = () => {
		setTimeout(() => {
			scrollViewRef.current?.scrollToEnd({ animated: true });
		}, 100);
	};

	return (
		<SafeAreaView style={{ flex: 1 }} edges={['top']}>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 50}>
				<ScrollView style={styles.container} ref={scrollViewRef} contentInsetAdjustmentBehavior='automatic'>
					<Text style={styles.label}>Title</Text>
					<TextInput
						style={styles.input}
						value={draftEvent?.title || ''}
						onChangeText={onTitleChange}
						placeholder='Enter event title'
						placeholderTextColor={colors.placeholderText}
					/>
					<View style={styles.rowContainer}>
						<Text style={styles.label}>Date</Text>
						<TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowDatePicker(true)}>
							<Text style={styles.dateTimeText}>{formattedDate}</Text>
						</TouchableOpacity>
					</View>
					{showDatePicker && (
						<DateTimePicker
							value={dateTime}
							mode='date'
							display='spinner'
							onChange={onDateChange}
							textColor={colors.controlText}
						/>
					)}
					<View style={styles.rowContainer}>
						<Text style={styles.label}>Time</Text>
						<TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowTimePicker(true)}>
							<Text style={styles.dateTimeText}>{formattedTime}</Text>
						</TouchableOpacity>
					</View>
					{showTimePicker && (
						<DateTimePicker
							value={dateTime}
							mode='time'
							is24Hour={true}
							display='spinner'
							onChange={onTimeChange}
							textColor={colors.controlText}
						/>
					)}
					<Text style={styles.label}>Description</Text>
					<TextInput
						style={[styles.input, styles.textArea]}
						placeholder='Describe your event'
						placeholderTextColor={colors.placeholderText}
						value={draftEvent.description || ''}
						onChangeText={onDescriptionChange}
						multiline
						numberOfLines={4}
					/>
					<Text style={styles.label}>Meeting Link</Text>
					<TextInput
						style={styles.input}
						placeholder='Enter Meeting link'
						placeholderTextColor={colors.placeholderText}
						value={draftEvent.meetingLink}
						onChangeText={onMeetingLinkChange}
						onFocus={onLastInputFocus}
					/>
					<View style={styles.rowContainer}>
						<Text style={styles.sectionTitle}>Peer Mentors</Text>
						<TouchableOpacity style={styles.addPeersButton} onPress={() => navigation.navigate('SearchPeersView')}>
							<Text style={styles.addPeersButtonText}>Add Peers</Text>
						</TouchableOpacity>
					</View>
					{draftEvent?.peers?.map((peer, index) => (
						<View key={index} style={styles.peerItem}>
							<Avatar text={peer.username} size={36} borderRadius={18} />
							<Text style={styles.peerName}>{peer.username}</Text>
							<TouchableOpacity onPress={() => removePeer(peer.username)} style={styles.removePeerButton}>
								<Text style={styles.removePeerButtonText}>x</Text>
							</TouchableOpacity>
						</View>
					))}
					<TouchableOpacity style={styles.createEventButton} onPress={() => createOrUpdateEvent()}>
						<Text style={styles.createEventButtonText}>{isEditing ? 'Save' : 'Create Event'}</Text>
					</TouchableOpacity>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

const makeStyles = (colors: any) => {
	return StyleSheet.create({
		container: {
			flex: 1,
			padding: 20,
			paddingBottom: 10,
			paddingTop: Platform.OS === 'android' ? 60 : 20,
			backgroundColor: colors.nextGenBackground
		},
		input: {
			borderWidth: 1,
			borderColor: colors.nextGenBorder,
			borderRadius: 8,
			padding: 15,
			marginBottom: 15,
			fontSize: 16,
			backgroundColor: colors.nextGenSurface,
			color: colors.nextGenText
		},
		textArea: {
			height: 100,
			textAlignVertical: 'top'
		},
		label: {
			fontSize: 16,
			marginBottom: 8,
			color: colors.nextGenText
		},
		rowContainer: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			marginBottom: 16
		},
		dateTimeButton: {
			borderRadius: 8,
			padding: 12,
			minWidth: 150,
			alignItems: 'flex-end'
		},
		dateTimeText: {
			fontWeight: 'bold',
			color: colors.nextGenText
		},
		sectionTitle: {
			fontSize: 18,
			marginTop: 20,
			marginBottom: 10,
			color: colors.nextGenText
		},
		addPeersButton: {
			borderWidth: 1,
			borderColor: colors.nextGenPrimary,
			borderRadius: 25,
			padding: 10,
			alignItems: 'center',
			marginBottom: 15
		},
		addPeersButtonText: {
			color: colors.nextGenPrimary,
			fontSize: 16
		},
		peerItem: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			marginBottom: 10
		},
		peerName: {
			fontSize: 16,
			color: colors.nextGenText
		},
		removePeerButton: {
			backgroundColor: colors.nextGenBorder,
			borderRadius: 15,
			width: 32,
			height: 32,
			justifyContent: 'center',
			alignItems: 'center'
		},
		removePeerButtonText: {
			color: colors.nextGenText,
			fontSize: 16,
			marginBottom: 5
		},
		createEventButton: {
			backgroundColor: colors.nextGenPrimary,
			borderRadius: 25,
			padding: 15,
			alignItems: 'center',
			marginTop: 20,
			marginBottom: 20
		},
		createEventButtonText: {
			color: colors.fontWhite,
			fontSize: 18,
			fontWeight: 'bold'
		}
	});
};

export default CreateEventView;
