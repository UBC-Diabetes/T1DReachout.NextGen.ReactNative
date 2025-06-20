import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { withTheme } from '../theme';

import { CustomIcon } from '../containers/CustomIcon';
import { useTheme } from '../theme';
import { getUserSelector } from '../selectors/login';
import { IApplicationState } from '../definitions';
import * as HeaderButton from '../containers/HeaderButton';
import Avatar from '../containers/Avatar';
import StatusBar from '../containers/StatusBar';
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
			title: ''
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
			title: ''
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
			title: ''
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
	};

	const renderHeader = () => {
		if (!headerConfig || isMasterDetail) return null;

		return (
			<View style={[styles.header, { backgroundColor: themes[theme].backgroundColor }]}>
				<View style={styles.headerLeft}>
					{headerConfig.showDrawer && (
						<HeaderButton.Drawer
							navigation={navigation}
							testID='bottom-tab-drawer'
							onPress={() => navigation.toggleDrawer()}
						/>
					)}
				</View>
				
				<View style={styles.headerCenter}>
					{headerConfig.title && (
						<Text style={[styles.headerTitle, { color: themes[theme].titleText }]}>
							{headerConfig.title}
						</Text>
					)}
				</View>

				<View style={styles.headerRight}>
					{headerConfig.showProfile && userName && (
						<HeaderButton.Container>
							<Touchable 
								style={styles.profileContainer} 
								onPress={() => navigation.navigate('ProfileView')}
							>
								<Avatar text={userName} size={24} borderRadius={12} />
							</Touchable>
						</HeaderButton.Container>
					)}
					{headerConfig.showSearch && (
						<HeaderButton.Container>
							<HeaderButton.Item
								iconName='search'
								color={themes[theme].titleText}
								onPress={() => {
									// Handle search based on active tab
									if (activeTab === 'DiscussionHomeView') {
										// Handle discussion search
									} else if (activeTab === 'RoomsListView') {
										// Handle rooms search
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
		<View style={styles.tabBarContainer}>
			{NAV_ITEMS.map((item, index) => {
				const active = activeTab === item.screen;
				return (
					<TouchableOpacity
						key={index}
						style={styles.tabItem}
						onPress={() => handleTabPress(item.screen)}
						testID={item.testID}
						activeOpacity={0.7}
					>
						<CustomIcon
							name={item.icon}
							size={24}
							color={active ? colors.actionTintColor : '#1D1B20'}
						/>
						<Text
							style={[
								styles.tabText,
								{
									color: active ? colors.actionTintColor : '#1D1B20'
								}
							]}
						>
							{item.title}
						</Text>
					</TouchableOpacity>
				);
			})}
		</View>
	);

	return (
		<View style={styles.container}>
			<StatusBar />
			{renderHeader()}
			<View style={styles.content}>
				<ActiveComponent navigation={navigation} theme={theme} {...props} />
			</View>
			{renderTabBar()}
		</View>
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
		paddingHorizontal: 16,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: '#E0E0E0'
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
		fontWeight: '600'
	},
	profileContainer: {
		marginRight: 8
	},
	tabBarContainer: {
		flexDirection: 'row',
		backgroundColor: '#EBEDF0',
		paddingVertical: 8,
		paddingHorizontal: 16,
		justifyContent: 'space-around',
		alignItems: 'center',
		borderTopWidth: 1,
		borderTopColor: '#D1D5DB'
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