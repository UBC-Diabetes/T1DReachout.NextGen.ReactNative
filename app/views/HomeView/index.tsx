import React from 'react';
import { ScrollView, Text, View, Image } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { themes } from '../../lib/constants';
import { withTheme } from '../../theme';
import { mainTiles } from './data';
import * as allStyles from './styles';
import { Tileprops } from './interfaces';
import { navToTechSupport, navigateTo247Chat, navigateToVirtualHappyHour } from './helpers';
import Navigation from '../../lib/navigation/appNavigation';
import { IApplicationState } from '../../definitions';
import { getFetchedEventsSelector } from '../../selectors/event';
import { getUpcomingEvents, formatEventDate } from './calendarHelpers';

const HomeView: React.FC = ({ theme }) => {
	const navigation = useNavigation<NativeStackNavigationProp<any>>();

	const { createMainStyles, createTileStyles } = allStyles;
	const styles = createMainStyles({ theme });

	// Get calendar events from Redux
	const agendaItems = useSelector((state: IApplicationState) => getFetchedEventsSelector(state));
	const upcomingEvents = getUpcomingEvents(agendaItems || []);

	// Header is now handled by BottomTabNavigator

	const homeViewTile = ({ icon, title, size, screen, color, disabled = false }: Tileprops, index: number) => {
		const tileStyles = createTileStyles({
			size,
			color: color,
			theme
		});

		return (
			<Touchable
				onPress={() => {
					if (screen) {
						if (screen === '24Chat') {
							navigateTo247Chat(Navigation);
						} else if (screen === 'VirtualHappyHour') {
							navigateToVirtualHappyHour(Navigation);
						} else if (screen === 'TechSupport') {
							navToTechSupport(Navigation);
						} else {
							navigation.navigate(screen);
						}
					}
				}}
				style={{ opacity: disabled ? 0.4 : 1, ...tileStyles.tile }}
				key={index}
				disabled={disabled}
				activeOpacity={0.6}>
				<View style={tileStyles.tileContent}>
					<View style={tileStyles.imageContainer}>
						<Image source={icon} style={tileStyles.image} resizeMode='contain' />
					</View>
					<Text style={tileStyles.text}>{title}</Text>
				</View>
			</Touchable>
		);
	};

	return (
		<View style={styles.mainContainer} testID='home-view'>
			<ScrollView style={styles.scrollContent}>
				<Text style={styles.title}>Explore</Text>
				
				<View style={styles.tileContainer}>
					{mainTiles.map((item, index) => homeViewTile(item, index))}
				</View>

				<View style={styles.sectionContainer}>
					<Text style={styles.sectionTitle}>Upcoming Event(s)</Text>
					{upcomingEvents.length > 0 ? (
						<View style={styles.eventsContainer}>
							{upcomingEvents.slice(0, 3).map((event, index) => (
								<Touchable
									key={event.id}
									style={styles.eventItem}
									onPress={() => navigation.navigate('CalendarView')}
									activeOpacity={0.7}
								>
									<View style={styles.eventContent}>
										<Text style={styles.eventTitle} numberOfLines={1}>
											{event.title}
										</Text>
										<Text style={styles.eventDate}>
											{formatEventDate(event.dateTime)}
										</Text>
									</View>
								</Touchable>
							))}
							{upcomingEvents.length > 3 && (
								<Touchable
									style={styles.viewMoreEvents}
									onPress={() => navigation.navigate('CalendarView')}
									activeOpacity={0.7}
								>
									<Text style={styles.viewMoreText}>
										View {upcomingEvents.length - 3} more events
									</Text>
								</Touchable>
							)}
						</View>
					) : (
						<View style={styles.emptySection}>
							<Text style={styles.emptySectionText}>No upcoming events</Text>
						</View>
					)}
				</View>

				<View style={styles.sectionContainer}>
					<Text style={styles.sectionTitle}>Saved Posts</Text>
					<View style={styles.emptySection}>
						<Text style={styles.emptySectionText}>No saved posts</Text>
					</View>
				</View>
			</ScrollView>
		</View>
	);
};

export default withTheme(HomeView);
