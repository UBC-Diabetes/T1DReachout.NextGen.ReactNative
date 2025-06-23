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
import { navToTechSupport, navigateTo247Chat, navigateToVirtualHappyHour } from './helpers';
import Navigation from '../../lib/navigation/appNavigation';
import { IApplicationState } from '../../definitions';
import { getFetchedEventsSelector } from '../../selectors/event';
import { getUpcomingEvents, formatEventDate } from './calendarHelpers';
import { fetchEventRequest, pressEventRequest } from '../../actions/calendarEvents';
import { 
	observeSavedPosts, 
	formatSavedPostDate, 
	truncatePostContent, 
	getPostAuthorName,
	getPostReactionsCount,
	getPostRepliesCount
} from './savedPostsHelpers';

const HomeView: React.FC = ({ theme }) => {
	const navigation = useNavigation<NativeStackNavigationProp<any>>();
	const dispatch = useDispatch();

	const { createMainStyles, createTileStyles } = allStyles;
	const styles = createMainStyles({ theme });

	// Get calendar events from Redux
	const agendaItems = useSelector((state: IApplicationState) => getFetchedEventsSelector(state));
	const upcomingEvents = getUpcomingEvents(agendaItems || []);

	// Fetch calendar events when component mounts
	useEffect(() => {
		dispatch(fetchEventRequest());
	}, [dispatch]);

	// State for saved posts
	const [savedPosts, setSavedPosts] = useState([]);

	// Subscribe to saved posts updates when screen is focused
	useFocusEffect(
		React.useCallback(() => {
			const subscription = observeSavedPosts(3, (posts) => {
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
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>
							{upcomingEvents.length === 1 ? 'Upcoming Event' : 'Upcoming Events'}
						</Text>
						{upcomingEvents.length > 0 && (
							<Touchable
								onPress={() => navigation.navigate('CalendarView')}
								activeOpacity={0.7}
							>
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
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Saved Posts</Text>
						{savedPosts.length > 0 && (
							<Touchable
								onPress={() => {
									// Navigate to Discussion Boards with Saved Posts tab
									navigation.navigate('BottomTabNavigator', { 
										initialTab: 'DiscussionHomeView',
										params: { selectedTab: 1 }, // SAVED_POSTS tab
										key: `savedpost-${Date.now()}` // Force fresh navigation
									});
								}}
								activeOpacity={0.7}
							>
								<Text style={styles.viewAllLink}>View all</Text>
							</Touchable>
						)}
					</View>
					{savedPosts.length > 0 ? (
						<View style={styles.savedPostsContainer}>
							{savedPosts.map((post, index) => (
								<Touchable
									key={post.id || index}
									style={styles.savedPostItem}
									onPress={() => {
										// Navigate to Discussion Boards with Saved Posts tab
										navigation.navigate('BottomTabNavigator', { 
											initialTab: 'DiscussionHomeView',
											params: { selectedTab: 1 }, // SAVED_POSTS tab
											key: `savedpost-${Date.now()}` // Force fresh navigation
										});
									}}
									activeOpacity={0.7}
								>
									<View style={styles.savedPostContent}>
										<View style={styles.savedPostHeader}>
											<Text style={styles.savedPostAuthor} numberOfLines={1}>
												{getPostAuthorName(post)}
											</Text>
											<Text style={styles.savedPostDate}>
												{formatSavedPostDate(post._raw?.ts || post.ts)}
											</Text>
										</View>
										<Text style={styles.savedPostText} numberOfLines={2}>
											{truncatePostContent(post._raw?.msg || post.msg, 100)}
										</Text>
										<View style={styles.savedPostStats}>
											<Text style={styles.savedPostStat}>
												❤️ {getPostReactionsCount(post)}
											</Text>
											<Text style={styles.savedPostStat}>
												💬 {getPostRepliesCount(post)}
											</Text>
										</View>
									</View>
								</Touchable>
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
