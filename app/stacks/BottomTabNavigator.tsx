import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { withTheme } from '../theme';

import { CustomIcon } from '../containers/CustomIcon';
import { useTheme } from '../theme';
import { getUserSelector } from '../selectors/login';
import { IApplicationState } from '../definitions';
import * as HeaderButton from '../containers/HeaderButton';
import Avatar from '../containers/Avatar';
import StatusBar from '../containers/StatusBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { themes } from '../lib/constants';
import Touchable from 'react-native-platform-touchable';
import HomeView from '../views/HomeView';
import RoomsListView from '../views/RoomsListView';
import DiscussionHomeView from '../views/DiscussionBoard/DiscussionHomeView';

interface IBottomNavBarItem {
	icon: string;
	title: string;
	screen: string;
	testID: string;
	component: React.ComponentType<any>;
	headerConfig: {
		showDrawer: boolean;
		showProfile: boolean;
		showSearch: boolean;
		title?: string;
	};
}

const NAV_ITEMS: IBottomNavBarItem[] = [
	{
		icon: 'message',
		title: 'Direct Messaging',
		screen: 'RoomsListView',
		testID: 'bottom-nav-messaging',
		component: RoomsListView,
		headerConfig: {
			showDrawer: true,
			showProfile: false,
			showSearch: true,
			title: 'Messaging'
		}
	},
	{
		icon: 'home',
		title: 'Home',
		screen: 'HomeView',
		testID: 'bottom-nav-home',
		component: HomeView,
		headerConfig: {
			showDrawer: true,
			showProfile: true,
			showSearch: false,
			title: 'Welcome'
		}
	},
	{
		icon: 'clipboard',
		title: 'Boards',
		screen: 'DiscussionHomeView',
		testID: 'bottom-nav-boards',
		component: DiscussionHomeView,
		headerConfig: {
			showDrawer: true,
			showProfile: false,
			showSearch: true,
			title: 'Boards'
		}
	}
];

const BottomTabNavigator: React.FC<any> = ({ navigation, theme, route, ...props }) => {
	// Check if a specific tab was requested via route params
	const initialTab = route?.params?.initialTab || 'HomeView';
	const [activeTab, setActiveTab] = useState(initialTab);
	const { colors } = useTheme();
	const user = useSelector((state: IApplicationState) => getUserSelector(state));
	const isMasterDetail = useSelector((state: IApplicationState) => state.app.isMasterDetail);
	const userName = user?.username || '';

	// Update active tab when route params change
	useEffect(() => {
		if (route?.params?.initialTab && route.params.initialTab !== activeTab) {
			setActiveTab(route.params.initialTab);
		}
	}, [route?.params?.initialTab]);

	// Find the current active component and header config
	const activeItem = NAV_ITEMS.find(item => item.screen === activeTab);
	const ActiveComponent = activeItem?.component || HomeView;
	const headerConfig = activeItem?.headerConfig;

	const handleTabPress = (screen: string) => {
		setActiveTab(screen);

		// When navigating to DiscussionHomeView via bottom nav, reset to Discussion Boards tab
		if (screen === 'DiscussionHomeView') {
			navigation.setParams({
				...route?.params,
				params: { selectedTab: 0 } // 0 = DISCUSSION_BOARDS tab
			});
		}
	};

	const renderHeader = () => {
		if (!headerConfig || isMasterDetail) return null;

		return (
			<View style={[styles.header, { backgroundColor: colors.nextGenBackground }]}>
				<View style={styles.headerLeft}>
					{headerConfig.showDrawer && (
						<HeaderButton.Drawer navigation={navigation} testID='bottom-tab-drawer' onPress={() => navigation.toggleDrawer()} />
					)}
				</View>

				<View style={styles.headerCenter}>
					{headerConfig.title && <Text style={[styles.headerTitle, { color: colors.nextGenText }]}>{headerConfig.title}</Text>}
				</View>

				<View style={styles.headerRight}>
					{headerConfig.showProfile && userName && (
						<HeaderButton.Container>
							<Touchable style={styles.profileContainer} onPress={() => navigation.navigate('ProfileView')}>
								<Avatar text={userName} size={24} borderRadius={12} />
							</Touchable>
						</HeaderButton.Container>
					)}
					{headerConfig.showSearch && (
						<HeaderButton.Container>
							<HeaderButton.Item
								iconName='search'
								color={colors.nextGenText}
								onPress={() => {
									// Handle search based on active tab
									if (activeTab === 'DiscussionHomeView') {
										// Navigate to discussion search view
										navigation.navigate('DiscussionSearchView');
									} else if (activeTab === 'RoomsListView') {
										// Navigate to search messages view
										navigation.navigate('DiscussionSearchView');
									}
								}}
								testID='bottom-tab-search'
							/>
						</HeaderButton.Container>
					)}
				</View>
			</View>
		);
	};

	const renderTabBar = () => (
		<View style={[styles.tabBarContainer, { backgroundColor: colors.nextGenBackground, borderTopColor: colors.nextGenBorder }]}>
			{NAV_ITEMS.map((item, index) => {
				const active = activeTab === item.screen;
				return (
					<TouchableOpacity
						key={index}
						style={styles.tabItem}
						onPress={() => handleTabPress(item.screen)}
						testID={item.testID}
						activeOpacity={0.7}>
						<CustomIcon name={item.icon} size={24} color={active ? themes.dark.nextGenPrimary : colors.nextGenText} />
						<Text
							style={[
								styles.tabText,
								{
									color: active ? themes.dark.nextGenPrimary : colors.nextGenText
								}
							]}>
							{item.title}
						</Text>
					</TouchableOpacity>
				);
			})}
		</View>
	);

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar />
			{renderHeader()}
			<View style={styles.content}>
				<ActiveComponent
					navigation={navigation}
					theme={theme}
					route={{
						...route,
						params: route?.params?.params || {}
					}}
					switchTab={(tabName: string, params?: any) => {
						setActiveTab(tabName);
						// If switching to DiscussionHomeView with specific params, handle them
						if (tabName === 'DiscussionHomeView' && params?.selectedTab !== undefined) {
							// The DiscussionHomeView will pick up these params from the route
							navigation.setParams({
								...route?.params,
								params: { ...route?.params?.params, ...params }
							});
						}
					}}
					{...props}
				/>
			</View>
			{renderTabBar()}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	content: {
		flex: 1
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		height: 56,
		paddingHorizontal: 16
	},
	headerLeft: {
		flex: 1,
		alignItems: 'flex-start'
	},
	headerCenter: {
		flex: 2,
		alignItems: 'center'
	},
	headerRight: {
		flex: 1,
		alignItems: 'flex-end'
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: '400'
	},
	profileContainer: {
		marginRight: 8
	},
	tabBarContainer: {
		flexDirection: 'row',
		paddingVertical: 8,
		paddingHorizontal: 16,
		justifyContent: 'space-around',
		alignItems: 'center',
		borderTopWidth: 1
	},
	tabItem: {
		flex: 1,
		alignItems: 'center',
		paddingVertical: 4
	},
	tabText: {
		fontSize: 12,
		fontWeight: '500',
		marginTop: 4,
		textAlign: 'center'
	}
});

export default withTheme(BottomTabNavigator);
