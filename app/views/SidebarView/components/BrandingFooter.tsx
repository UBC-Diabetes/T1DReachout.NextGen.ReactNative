import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';

import { TSupportedThemes } from '../../../theme';
import Navigation from '../../../lib/navigation/appNavigation';

interface IBrandingFooterProps {
	theme: TSupportedThemes;
}

const BrandingFooter = ({ theme }: IBrandingFooterProps) => {
	const handlePress = () => {
		// Navigate to home page (BottomTabNavigator with HomeView)
		Navigation.navigate('BottomTabNavigator', { initialTab: 'HomeView' });
	};

	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={handlePress} testID='sidebar-t1d-brand'>
				<Image source={require('../../../static/images/T1DBrand.png')} style={styles.brandingImage} resizeMode='contain' />
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
		paddingBottom: 80, // Position higher up from bottom
		paddingHorizontal: 20
	},
	brandingImage: {
		width: 180, // Adjust size as needed
		height: 180, // Adjust size as needed
		opacity: 0.8 // Slight transparency for subtle effect
	}
});

export default BrandingFooter;
