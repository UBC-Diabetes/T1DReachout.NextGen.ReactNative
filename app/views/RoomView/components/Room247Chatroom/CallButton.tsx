import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';

import { CustomIcon } from '../../../../containers/CustomIcon';
import { useTheme } from '../../../../theme';
import i18n from '../../../../i18n';

interface ICallButtonProps {
	onPress: () => void;
	disabled?: boolean;
}

const CallButton = ({ onPress, disabled = false }: ICallButtonProps) => {
	const { colors } = useTheme();

	return (
		<View style={styles.buttonContainer}>
			<TouchableOpacity
				onPress={disabled ? undefined : onPress}
				disabled={disabled}
				style={[
					styles.button,
					{ backgroundColor: disabled ? colors.strokeLight : colors.badgeBackgroundLevel2 }
				]}
			>
				<CustomIcon
					name='camera'
					size={16}
					style={styles.buttonIcon}
					color={disabled ? colors.fontSecondaryInfo : colors.fontWhite}
				/>
				<Text style={[
					styles.buttonText,
					{ color: disabled ? colors.fontSecondaryInfo : colors.fontWhite }
				]}>
					{disabled ? i18n.t('Call_ended') : i18n.t('Click_to_join')}
				</Text>
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
