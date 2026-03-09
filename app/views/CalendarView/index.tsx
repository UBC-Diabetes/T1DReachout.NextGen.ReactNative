import React, { useCallback, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ExpandableCalendar, AgendaList, CalendarProvider } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Touchable from 'react-native-platform-touchable';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../theme';
import { createEventDraft, fetchEventRequest } from '../../actions/calendarEvents';
import { getUserSelector } from '../../selectors/login';
import { getFetchedEventsSelector, getPopupSelector } from '../../selectors/event';
import { IApplicationState } from '../../definitions';
import StatusBar from '../../containers/StatusBar';
import Avatar from '../../containers/Avatar';
import * as HeaderButton from '../../containers/HeaderButton';
import AgendaItem from './AgendaItem';
import testIDs from './testIds';
import { getMarkedDates } from './helpers';
import ConfirmationPopup from './ConfirmationPopup';

const CalendarView = (): React.ReactElement => {
	const dispatch = useDispatch();
	const theme = useTheme();
	const { colors } = theme;
	const navigation = useNavigation<NativeStackNavigationProp<any>>();
	const user = useSelector((state: IApplicationState) => getUserSelector(state));
	const userName = user?.username || '';
	const isAdmin = user?.roles && user?.roles.includes('admin');

	const agendaItems = useSelector((state: IApplicationState) => getFetchedEventsSelector(state));

	const marked = getMarkedDates(agendaItems ?? []);

	const { shouldShowConfirmationPopup, confirmationPopupDetails } = useSelector((state: IApplicationState) =>
		getPopupSelector(state)
	);

	// Get authentication state
	const isAuthenticated = useSelector((state: IApplicationState) => state.login.isAuthenticated);

	const styles = makeStyles(theme);

	useEffect(() => {
		navigation.setOptions({ title: '', headerStyle: { shadowColor: 'transparent' } });
		navigation.setOptions({
			headerLeft: () => <HeaderButton.Drawer navigation={navigation} testID='calendar-view-drawer' />,
			headerRight: () => (
				<HeaderButton.Container>
					<Touchable style={{ marginRight: 20 }} onPress={() => navigation.navigate('ProfileView')}>
						{userName ? <Avatar text={userName} size={24} borderRadius={12} /> : <></>}
					</Touchable>
				</HeaderButton.Container>
			)
		});

		// Only fetch calendar events when authenticated
		if (isAuthenticated) {
			dispatch(fetchEventRequest());
		}
	}, [navigation, userName, dispatch, colors.nextGenSurface, colors.nextGenText, isAuthenticated]);

	const createEvent = useCallback(() => {
		dispatch(createEventDraft({ author: userName }));
		navigation.navigate('CreateEventView');
	}, [dispatch, navigation, userName]);

	const renderItem = useCallback(({ item }: any) => <AgendaItem item={item} />, []);

	const todaysDate = useMemo(() => new Date().toISOString().split('T')[0], []);

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: colors.backgroundColor }} testID='calendar-view'>
			<StatusBar />
			<CalendarProvider date={todaysDate}>
				<ExpandableCalendar
					testID={testIDs.expandableCalendar.CONTAINER}
					hideArrows={true}
					theme={{
						backgroundColor: colors.nextGenBackground,
						calendarBackground: colors.nextGenBackground,
						textSectionTitleColor: colors.nextGenTextSecondary,
						selectedDayBackgroundColor: colors.nextGenPrimary,
						selectedDayTextColor: colors.fontWhite,
						todayTextColor: colors.nextGenPrimary,
						dayTextColor: colors.nextGenText,
						textDisabledColor: colors.nextGenTextSecondary,
						dotColor: colors.nextGenPrimary,
						selectedDotColor: colors.fontWhite,
						arrowColor: colors.nextGenPrimary,
						monthTextColor: colors.nextGenText,
						indicatorColor: colors.nextGenPrimary,
						textDayFontWeight: '500',
						textMonthFontWeight: '600',
						textDayHeaderFontWeight: '600',
						textDayFontSize: 16,
						textMonthFontSize: 18,
						textDayHeaderFontSize: 14
					}}
					firstDay={0}
					markedDates={marked}
				/>
				<AgendaList
					sections={agendaItems ?? []}
					renderItem={renderItem}
					sectionStyle={{
						backgroundColor: colors.nextGenBackground,
						color: colors.nextGenTextSecondary,
						fontWeight: '600',
						fontSize: 12,
						lineHeight: 16,
						paddingTop: 24,
						paddingBottom: 8,
						paddingLeft: 20,
						paddingRight: 20,
						textAlign: 'left',
						textTransform: 'uppercase'
					}}
				/>
			</CalendarProvider>
			{shouldShowConfirmationPopup && <ConfirmationPopup event={confirmationPopupDetails} userName={userName} />}
			{isAdmin && (
				<View style={styles.adminButtonContainer}>
					<Touchable style={styles.adminButton} onPress={() => createEvent()}>
						<Text style={styles.adminButtonText}>Create event</Text>
					</Touchable>
				</View>
			)}
		</SafeAreaView>
	);
};

const makeStyles = (theme: any) =>
	StyleSheet.create({
		adminButtonContainer: {
			marginTop: 20,
			bottom: 20,
			width: '100%',
			backgroundColor: theme.colors.nextGenBackground
		},
		adminButton: {
			margin: 10,
			backgroundColor: theme.colors.nextGenPrimary,
			paddingVertical: 15,
			paddingHorizontal: 20,
			borderRadius: 50,
			alignItems: 'center',
			justifyContent: 'center'
		},
		adminButtonText: {
			color: theme.colors.fontWhite,
			fontSize: 20,
			fontWeight: 'bold'
		}
	});

export default CalendarView;
