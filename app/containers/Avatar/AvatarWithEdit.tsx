import React from 'react';
import { StyleSheet } from 'react-native';

import Button from '../Button';
import AvatarContainer from './AvatarContainer';
import { IAvatar } from './interfaces';
import I18n from '../../i18n';
import { useTheme } from '../../theme';
import { BUTTON_HIT_SLOP } from '../message/utils';
import { useAppSelector } from '../../lib/hooks';
import { compareServerVersion } from '../../lib/methods/helpers';
import { colors } from '../../lib/constants';
import sharedStyles from '../../views/Styles';

const createStyles = (theme: string) => StyleSheet.create({
	editAvatarButton: {
		marginTop: 12,
		paddingVertical: 10,
		paddingHorizontal: 20,
		marginBottom: 0,
		height: undefined,
		borderRadius: 20, // Make it oval
		backgroundColor: colors[theme].nextGenPrimary
	},
	textButton: {
		fontSize: 14,
		color: colors[theme].nextGenSurface,
		...sharedStyles.textSemibold
	}
});

interface IAvatarContainer extends Omit<IAvatar, 'size'> {
	handleEdit?: () => void;
}

const AvatarWithEdit = ({
	style,
	text = '',
	avatar,
	emoji,
	borderRadius,
	type,
	children,
	onPress,
	getCustomEmoji,
	isStatic,
	rid,
	handleEdit
}: IAvatarContainer): React.ReactElement => {
	const { theme } = useTheme();

	const { serverVersion } = useAppSelector(state => ({
		serverVersion: state.server.version
	}));

	const styles = createStyles(theme);

	return (
		<>
			<AvatarContainer
				style={style}
				text={text}
				avatar={avatar}
				emoji={emoji}
				size={120}
				borderRadius={60} // Make profile picture round
				type={type}
				children={children}
				onPress={onPress}
				getCustomEmoji={getCustomEmoji}
				isStatic={isStatic}
				rid={rid}
			/>
			{handleEdit && serverVersion && compareServerVersion(serverVersion, 'greaterThanOrEqualTo', '3.6.0') ? (
				<Button
					title={I18n.t('Edit')}
					type='primary'
					onPress={handleEdit}
					testID='avatar-edit-button'
					style={styles.editAvatarButton}
					styleText={styles.textButton}
					hitSlop={BUTTON_HIT_SLOP}
				/>
			) : null}
		</>
	);
};

export default AvatarWithEdit;
