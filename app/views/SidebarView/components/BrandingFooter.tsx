import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { TSupportedThemes } from '../../../theme';

interface IBrandingFooterProps {
	theme: TSupportedThemes;
}

const BrandingFooter = ({ theme }: IBrandingFooterProps) => {
	return (
		<View style={styles.container}>
			<Text style={styles.brandingText}>T1D</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
		paddingBottom: 80, // Move up higher by increasing bottom padding
		paddingHorizontal: 20
	},
	brandingText: {
		fontFamily: 'System', // Will need to map to actual Title Page font family
		fontWeight: '700', // Title Page font weight equivalent
		fontSize: 32, // Larger text size
		lineHeight: 38.4, // 120% of font size
		letterSpacing: -0.64, // -2% letter spacing
		color: '#112D4E', // Blue text color instead of background
		textAlign: 'center'
	}
});

export default BrandingFooter;