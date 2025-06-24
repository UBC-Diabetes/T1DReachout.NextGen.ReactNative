import React, { useState } from 'react';
import { View, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import Touchable from 'react-native-platform-touchable';
import { settings as RocketChatSettings } from '@rocket.chat/sdk';

import { getAvatarURL } from '../../lib/methods/helpers/getAvatarUrl';
import { SubscriptionType } from '../../definitions';
import Emoji from '../markdown/Emoji';
import { IAvatar } from './interfaces';

const Avatar = React.memo(
	({
		server,
		style,
		avatar,
		children,
		userId,
		token,
		onPress,
		emoji,
		getCustomEmoji,
		avatarETag,
		isStatic,
		rid,
		blockUnauthenticatedAccess,
		serverVersion,
		text,
		size = 25,
		borderRadius = 4,
		type = SubscriptionType.DIRECT,
		avatarExternalProviderUrl,
		roomAvatarExternalProviderUrl,
		cdnPrefix
	}: IAvatar) => {
		const [imageError, setImageError] = useState(false);

		if ((!text && !avatar && !emoji && !rid) || !server) {
			return null;
		}

		const avatarStyle = {
			width: size,
			height: size,
			borderRadius
		};

		// Helper function to get initials from text
		const getInitials = (str: string): string => {
			if (!str) return '';
			const words = str.trim().split(/\s+/);
			if (words.length === 1) {
				return words[0].charAt(0).toUpperCase();
			}
			return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
		};

		// Fallback text avatar component
		const TextAvatar = () => (
			<View style={[
				avatarStyle, 
				{ 
					backgroundColor: '#112D4E', 
					justifyContent: 'center', 
					alignItems: 'center' 
				}
			]}>
				<Text style={{
					color: '#FFFFFF',
					fontSize: size * 0.4,
					fontWeight: 'bold'
				}}>
					{getInitials(text || '')}
				</Text>
			</View>
		);

		let image;
		if (emoji) {
			image = <Emoji getCustomEmoji={getCustomEmoji} isMessageContainsOnlyEmoji literal={emoji} style={avatarStyle} />;
		} else if (imageError && text) {
			// Render fallback text avatar with deep blue background
			image = <TextAvatar />;
		} else {
			let uri = avatar;
			if (!isStatic) {
				uri = getAvatarURL({
					type,
					text,
					size,
					userId,
					token,
					avatar,
					server,
					avatarETag,
					serverVersion,
					rid,
					blockUnauthenticatedAccess,
					avatarExternalProviderUrl,
					roomAvatarExternalProviderUrl,
					cdnPrefix
				});
			}

			image = (
				<FastImage
					style={avatarStyle}
					source={{
						uri,
						headers: RocketChatSettings.customHeaders,
						priority: FastImage.priority.high
					}}
					onError={() => setImageError(true)}
				/>
			);
		}

		if (onPress) {
			image = <Touchable onPress={onPress}>{image}</Touchable>;
		}

		return (
			<View style={[avatarStyle, style]} testID='avatar'>
				{image}
				{children}
			</View>
		);
	}
);

export default Avatar;
