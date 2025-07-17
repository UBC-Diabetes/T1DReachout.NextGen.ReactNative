import { CommonActions } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { Platform, StyleSheet, TouchableOpacity, Image } from 'react-native';

import Avatar from '../../containers/Avatar';
import { themes } from '../../lib/constants';
import { useAppNavigation } from '../../lib/hooks/navigation';
import { isIOS } from '../../lib/methods/helpers';
import { TSupportedThemes } from '../../theme';
import { getIcon } from '../DiscussionBoard/helpers';
import { HeaderBackButton } from '@react-navigation/elements';

const hitSlop = { top: 15, bottom: 15, left: 15, right: 15 };

const styles = StyleSheet.create({
	container: {
		marginLeft: -15,
		...Platform.select({
			ios: {
				minWidth: 34
			}
		})
	},
	avatar: {
		borderRadius: 10
	}
});

interface ILeftButtonsProps {
	rid?: string;
	tmid?: string;
	unreadsCount: number | null;
	baseUrl: string;
	userId?: string;
	token?: string;
	title?: string;
	t: string;
	theme: TSupportedThemes;
	goRoomActionsView: Function;
	isMasterDetail: boolean;
}

const LeftButtons = ({
	rid,
	tmid,
	unreadsCount,
	baseUrl,
	userId,
	token,
	title,
	t,
	theme,
	goRoomActionsView,
	isMasterDetail
}: ILeftButtonsProps): React.ReactElement | null => {
	const navigation = useAppNavigation();
	const { goBack } = navigation;
	const onPress = useCallback(() => goRoomActionsView(), []);

	const handleGoBack = useCallback(() => {
		// With proper navigation stack, we should always be able to go back
		if (navigation.canGoBack()) {
			goBack();
		} else {
			// Fallback - this shouldn't happen with proper navigation
			console.log('No navigation stack available - this indicates an issue');
		}
	}, [navigation, goBack]);

	if (!isMasterDetail || tmid) {
		let label = ' ';
		let labelLength = 1;
		let marginLeft = 0;
		let fontSize = 0;
		if (unreadsCount) {
			label = unreadsCount > 99 ? '+99' : unreadsCount.toString() || ' ';
			labelLength = label.length ? label.length : 1;
			marginLeft = -2 * labelLength;
			fontSize = labelLength > 1 ? 14 : 17;
		}
		return (
			<HeaderBackButton
				label={label}
				onPress={handleGoBack}
				labelStyle={{
					fontSize,
					marginLeft
				}}
				backImage={() => <Image source={getIcon('arrowLeft')} style={{ width: 11, height: 19 }} resizeMode='contain' />}
				tintColor={themes[theme].headerTintColor}
				testID='header-back'
			/>
		);
	}

	if (baseUrl && userId && token) {
		return <Avatar rid={rid} text={title} size={30} type={t} style={styles.avatar} onPress={onPress} />;
	}
	return null;
};

export default LeftButtons;
