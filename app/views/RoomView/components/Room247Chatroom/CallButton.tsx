import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';

import { CustomIcon } from '../../../../containers/CustomIcon';
import { useTheme } from '../../../../theme';
import i18n from '../../../../i18n';

interface ICallButtonProps {
	onPress: () => void;
}

const CallButton = ({ onPress }: ICallButtonProps) => {
	const { colors } = useTheme();

	return (
		<View style={styles.buttonContainer}>
			<TouchableOpacity
				onPress={onPress}
				style={[styles.button, { backgroundColor: colors.badgeBackgroundLevel2 }]}
			>
				<CustomIcon name='camera' size={16} style={styles.buttonIcon} color={colors.fontWhite} />
				<Text style={[styles.buttonText, { color: colors.fontWhite }]}>{i18n.t('Click_to_join')}</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	buttonContainer: {
		marginTop: 8,
		marginBottom: 8,
	},
	button: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 4,
	},
	buttonIcon: {
		marginRight: 8,
	},
	buttonText: {
		fontSize: 14,
		fontWeight: '600',
	},
});

export default CallButton;
