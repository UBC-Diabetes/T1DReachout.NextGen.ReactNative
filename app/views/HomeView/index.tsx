import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, Image } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';
import { themes } from '../../lib/constants';
import { withTheme } from '../../theme';
import { mainTiles } from './data';
import * as allStyles from './styles';
import { Tileprops } from './interfaces';
import { navToTechSupport, navigateTo247Chat, navigateToVirtualHuddle } from './helpers';
import Navigation from '../../lib/navigation/appNavigation';
import { IApplicationState } from '../../definitions';
import { getFetchedEventsSelector } from '../../selectors/event';
import { getUpcomingEvents, formatEventDate } from './calendarHelpers';
import { fetchEventRequest, pressEventRequest } from '../../actions/calendarEvents';
import { observeSavedPosts } from './savedPostsHelpers';
import SavedPostCard from '../DiscussionBoard/Components/SavedPostCard';
import { events, logEvent } from '../../lib/methods/helpers/log';

const HomeView: React.FC = ({ theme, switchTab }) => {
	const navigation = useNavigation<NativeStackNavigationProp<any>>();
	const dispatch = useDispatch();

	const { createMainStyles, createTileStyles } = allStyles;
	const styles = createMainStyles({ theme });

	// Get calendar events from Redux
	const agendaItems = useSelector((state: IApplicationState) => getFetchedEventsSelector(state));
	const upcomingEvents = getUpcomingEvents(agendaItems || []);

	// Get server information for Avatar component
	const server = useSelector((state: IApplicationState) => state.server.server);

	// Fetch calendar events when component mounts
	useEffect(() => {
		dispatch(fetchEventRequest());
	}, [dispatch]);

	// State for saved posts
	const [savedPosts, setSavedPosts] = useState([]);

	// Subscribe to saved posts updates when screen is focused
	useFocusEffect(
		React.useCallback(() => {
			// Track saved posts section view
			logEvent(events.SAVED_POSTS_VIEWED, {
				location: 'home',
				timestamp: Date.now()
			});

			const subscription = observeSavedPosts(5, posts => {
				setSavedPosts(posts);
			});

			return () => {
				if (subscription?.unsubscribe) {
					subscription.unsubscribe();
				}
			};
		}, [])
	);

	// Header is now handled by BottomTabNavigator

	const homeViewTile = ({ icon, title, size, screen, color, disabled = false }: Tileprops, index: number) => {
		const tileStyles = createTileStyles({
			size,
			color: themes[theme][color] || color,
			theme
		});

		return (
			<Touchable
				onPress={() => {
					if (screen) {
						if (screen === '24Chat') {
							navigateTo247Chat(Navigation);
						} else if (screen === 'VirtualHuddle') {
							navigateToVirtualHuddle(Navigation);
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

				<View style={styles.tileContainer}>{mainTiles.map((item, index) => homeViewTile(item, index))}</View>

				<View style={styles.sectionContainer}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>{upcomingEvents.length === 1 ? 'Upcoming Event' : 'Upcoming Events'}</Text>
						{upcomingEvents.length > 0 && (
							<Touchable onPress={() => navigation.navigate('CalendarView')} activeOpacity={0.7}>
								<Text style={styles.viewAllLink}>View all</Text>
							</Touchable>
						)}
					</View>
					{upcomingEvents.length > 0 ? (
						<View style={styles.eventsContainer}>
							{upcomingEvents.slice(0, 3).map((event, index) => (
								<Touchable
									key={event.id}
									style={styles.eventItem}
									onPress={() => {
										dispatch(pressEventRequest(event));
										navigation.navigate('EventDetailsView');
									}}
									activeOpacity={0.7}>
									<View style={styles.eventContent}>
										<Text style={styles.eventTitle} numberOfLines={1}>
											{event.title}
										</Text>
										<Text style={styles.eventDate}>{formatEventDate(event.dateTime)}</Text>
									</View>
								</Touchable>
							))}
							{upcomingEvents.length > 3 && (
								<Touchable style={styles.viewMoreEvents} onPress={() => navigation.navigate('CalendarView')} activeOpacity={0.7}>
									<Text style={styles.viewMoreText}>View {upcomingEvents.length - 3} more events</Text>
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
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Saved Posts</Text>
						{savedPosts.length > 0 && (
							<Touchable
								onPress={() => {
									// Use the switchTab function provided by BottomTabNavigator
									if (switchTab) {
										switchTab('DiscussionHomeView', { selectedTab: 1 });
									} else {
										// Fallback to navigation if switchTab is not available
										navigation.getParent()?.navigate('BottomTabNavigator', {
											initialTab: 'DiscussionHomeView',
											params: { selectedTab: 1 }
										});
									}
								}}
								activeOpacity={0.7}>
								<Text style={styles.viewAllLink}>View all</Text>
							</Touchable>
						)}
					</View>
					{savedPosts.length > 0 ? (
						<View style={styles.savedPostsContainer}>
							{savedPosts.map((post, index) => (
								<SavedPostCard key={index} post={post} server={server} theme={theme} />
							))}
						</View>
					) : (
						<View style={styles.emptySection}>
							<Text style={styles.emptySectionText}>No saved posts</Text>
						</View>
					)}
				</View>
			</ScrollView>
		</View>
	);
};

export default withTheme(HomeView);
