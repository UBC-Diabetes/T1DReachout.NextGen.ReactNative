import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';

import { TSupportedThemes, useTheme } from '../../../theme';
import Navigation from '../../../lib/navigation/appNavigation';

interface IBrandingFooterProps {
	theme: TSupportedThemes;
}

const BrandingFooter = ({ theme }: IBrandingFooterProps) => {
	const { colors } = useTheme();
	
	const handlePress = () => {
		// Navigate to home page (BottomTabNavigator with HomeView)
		Navigation.navigate('BottomTabNavigator', { initialTab: 'HomeView' });
	};

	// Adjust opacity based on theme - lighter for dark themes for better visibility
	const logoOpacity = theme === 'light' ? 0.8 : 1.0;
	const logoStyle = theme === 'light' 
		? styles.brandingImage 
		: [styles.brandingImage, { opacity: logoOpacity, tintColor: colors.nextGenText }];

	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={handlePress} testID='sidebar-t1d-brand'>
				<Image 
					source={require('../../../static/images/T1DBrand.png')} 
					style={logoStyle} 
					resizeMode='contain' 
				/>
			</TouchableOpacity>
		</View>
	);
};


const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 32,
		alignItems: 'center',
		paddingHorizontal: 20,
		// Let touches pass through empty areas so list items remain clickable
		pointerEvents: 'box-none'
	},
	brandingImage: {
		width: 180, // Adjust size as needed
		height: 180, // Adjust size as needed
		opacity: 0.8 // Slight transparency for subtle effect
	}
});

export default BrandingFooter;
