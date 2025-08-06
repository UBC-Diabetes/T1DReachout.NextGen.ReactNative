import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { CustomIcon } from '../CustomIcon';
import { useTheme } from '../../theme';

interface IBottomNavBarItem {
	icon: string;
	title: string;
	screen: string;
	testID: string;
}

interface IBottomNavBar {
	currentRoute?: string;
}

const NAV_ITEMS: IBottomNavBarItem[] = [
	{
		icon: 'message',
		title: 'Direct Messaging',
		screen: 'RoomsListView',
		testID: 'bottom-nav-messaging'
	},
	{
		icon: 'home',
		title: 'Home',
		screen: 'HomeView',
		testID: 'bottom-nav-home'
	},
	{
		icon: 'clipboard',
		title: 'Boards',
		screen: 'DiscussionHomeView',
		testID: 'bottom-nav-boards'
	}
];

const BottomNavBar: React.FC<IBottomNavBar> = ({ currentRoute }) => {
	const navigation = useNavigation();
	const { colors } = useTheme();

	const handleNavigation = (screen: string) => {
		navigation.navigate(screen as never);
	};

	const isActive = (screen: string) => {
		return currentRoute === screen;
	};

	return (
		<View style={[styles.container, { backgroundColor: colors.nextGenSurface, borderTopColor: colors.nextGenBorder }]}>
			{NAV_ITEMS.map((item, index) => {
				const active = isActive(item.screen);
				return (
					<TouchableOpacity
						key={index}
						style={styles.navItem}
						onPress={() => handleNavigation(item.screen)}
						testID={item.testID}
						activeOpacity={0.7}
					>
						<CustomIcon
							name={item.icon}
							size={24}
							color={active ? colors.actionTintColor : colors.nextGenText}
						/>
						<Text
							style={[
								styles.navText,
								{
									color: active ? colors.actionTintColor : colors.nextGenText
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
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		paddingVertical: 8,
		paddingHorizontal: 16,
		justifyContent: 'space-around',
		alignItems: 'center',
		borderTopWidth: 1
	},
	navItem: {
		flex: 1,
		alignItems: 'center',
		paddingVertical: 4
	},
	navText: {
		fontSize: 12,
		fontWeight: '500',
		marginTop: 4,
		textAlign: 'center'
	}
});

export default BottomNavBar;