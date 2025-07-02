import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Avatar from '../../../containers/Avatar';
import { CustomIcon } from '../../../containers/CustomIcon';
import { themes } from '../../../lib/constants';
import { TSupportedThemes } from '../../../theme';

interface IProfileSectionProps {
	user: {
		username: string;
		name?: string;
	};
	siteName: string;
	baseUrl: string;
	useRealName: boolean;
	theme: TSupportedThemes;
	isMasterDetail: boolean;
	onPress: () => void;
}

const ProfileSection = ({
	user,
	siteName,
	baseUrl,
	useRealName,
	theme,
	isMasterDetail,
	onPress
}: IProfileSectionProps) => {
	const navigation = useNavigation();

	const handleEditPress = () => {
		// Navigate to profile edit page
		// Using the same pattern as other sidebar navigation
		navigation.navigate('ProfileView' as never);
	};

	return (
		<TouchableOpacity onPress={onPress} style={styles.container} testID='sidebar-profile-section'>
			<View style={styles.profileContent}>
				{/* Large round profile picture */}
				<Avatar 
					text={user.username} 
					server={baseUrl || ''}
					style={styles.avatar} 
					size={60}
					borderRadius={30}
				/>
				
				{/* Name and server info */}
				<View style={styles.textContainer}>
					<Text 
						numberOfLines={1} 
						style={[styles.username, { color: themes[theme].titleText }]}
					>
						{useRealName ? user.name : user.username}
					</Text>
					<Text 
						style={[styles.serverText, { color: themes[theme].auxiliaryText }]}
						numberOfLines={1}
					>
						{siteName}
					</Text>
				</View>

				{/* Edit pencil icon */}
				<TouchableOpacity 
					onPress={handleEditPress}
					style={styles.editButton}
					testID='sidebar-edit-profile'
				>
					<CustomIcon 
						name='edit' 
						size={16} 
						color={themes[theme].titleText} 
					/>
				</TouchableOpacity>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 16,
		paddingVertical: 20
	},
	profileContent: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	avatar: {
		marginRight: 12
	},
	textContainer: {
		flex: 1,
		justifyContent: 'center'
	},
	username: {
		fontSize: 18,
		fontWeight: '600',
		marginBottom: 4
	},
	serverText: {
		fontSize: 14,
		fontWeight: '400'
	},
	editButton: {
		width: 32,
		height: 32,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default ProfileSection;