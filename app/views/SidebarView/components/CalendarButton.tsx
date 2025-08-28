import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import { CustomIcon } from '../../../containers/CustomIcon';
import { TSupportedThemes, useTheme } from '../../../theme';
import { getUpcomingEventsCountSelector } from '../../../selectors/event';
import I18n from '../../../i18n';

interface ICalendarButtonProps {
	theme: TSupportedThemes;
}

const CalendarButton = ({ theme }: ICalendarButtonProps) => {
	const navigation = useNavigation();
	const upcomingEventsCount = useSelector(getUpcomingEventsCountSelector);
	const { colors } = useTheme();

	const handlePress = () => {
		// Navigate to calendar view
		navigation.navigate('CalendarView' as never);
	};

	return (
		<View style={styles.container}>
			<TouchableOpacity 
				onPress={handlePress}
				style={[styles.button, { backgroundColor: colors.nextGenPrimary, borderColor: colors.nextGenPrimary }]}
				testID='sidebar-calendar-button'
			>
				{/* Left side: Calendar icon + Calendar text */}
				<View style={styles.leftContent}>
					<CustomIcon 
						name='calendar' 
						size={20} 
						color='#FFFFFF' 
						style={styles.icon}
					/>
					<Text style={styles.calendarText}>
						{I18n.t('Calendar')}
					</Text>
				</View>

				{/* Right side: Event count */}
				{upcomingEventsCount > 0 && (
					<View style={styles.countContainer}>
						<Text style={styles.countText}>
							{upcomingEventsCount}
						</Text>
					</View>
				)}
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 16,
		paddingVertical: 8
	},
	button: {
		borderRadius: 25, // Fully rounded corners
		height: 48, // Standard input height
		paddingHorizontal: 16,
		paddingVertical: 10,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderWidth: 1,
		elevation: 2,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 1
		},
		shadowOpacity: 0.22,
		shadowRadius: 2.22
	},
	leftContent: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1
	},
	icon: {
		marginRight: 12
	},
	calendarText: {
		color: '#FFFFFF', // White text
		fontSize: 16,
		fontWeight: '500'
	},
	countContainer: {
		backgroundColor: 'rgba(255, 255, 255, 0.2)',
		borderRadius: 12,
		minWidth: 24,
		height: 24,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 8
	},
	countText: {
		color: '#FFFFFF',
		fontSize: 14,
		fontWeight: '600'
	}
});

export default CalendarButton;