import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { themes } from '../lib/constants';
import { getIcon } from '../views/DiscussionBoard/helpers';
import { TSupportedThemes } from '../theme';

interface ILeftCaretProps {
	onPress?: () => void;
	theme?: TSupportedThemes;
	tintColor?: string;
	style?: object;
	testID?: string;
}

const LeftCaret: React.FC<ILeftCaretProps> = ({
	onPress,
	theme = 'light',
	tintColor,
	style,
	testID = 'left-caret-button'
}) => {
	const navigation = useNavigation();

	const handlePress = onPress || (() => {
		if (navigation.canGoBack()) {
			navigation.goBack();
		}
	});

	const iconColor = tintColor || themes[theme].actionTintColor;

	return (
		<TouchableOpacity
			onPress={handlePress}
			style={[styles.container, style]}
			hitSlop={styles.hitSlop}
			testID={testID}
			activeOpacity={0.6}
		>
			<Image
				source={getIcon('arrowLeft')}
				style={[styles.icon, { tintColor: iconColor }]}
				resizeMode="contain"
			/>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 8,
		marginLeft: 12,
		justifyContent: 'center',
		alignItems: 'center',
		minWidth: 44,
		minHeight: 44
	},
	icon: {
		width: 11,
		height: 19
	},
	hitSlop: {
		top: 20,
		bottom: 20,
		left: 20,
		right: 20
	}
});

export default LeftCaret;