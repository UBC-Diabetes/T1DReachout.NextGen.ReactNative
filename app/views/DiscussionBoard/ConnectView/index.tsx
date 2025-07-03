import React, { useEffect } from 'react';
import { View, Text, Dimensions, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import Avatar from '../../../containers/Avatar/Avatar';
import { IApplicationState } from '../../../definitions';
import Status from '../../../containers/Status/Status';
import { Services } from '../../../lib/services';
import { getRoomTitle, getUidDirectMessage } from '../../../lib/methods/helpers';
import { goRoom } from '../../../lib/methods/helpers/goRoom';
import { createStyles } from './styles';
import { CustomIcon } from '../../../containers/CustomIcon';

import { withTheme } from '../../../theme';
import { themes, colors } from '../../../lib/constants';

const playIcon = require('../../../static/images/discussionboard/play_icon.png');
const screenWidth = Dimensions.get('window').width;

const ConnectView: React.FC = ({ route, theme }: { route: any; theme: string }) => {
	const navigation = useNavigation<StackNavigationProp<any>>();
	const server = useSelector((state: IApplicationState) => state.server.server);
	const isMasterDetail = useSelector((state: IApplicationState) => state.app.isMasterDetail);

	const [username, setUsername] = React.useState(null);
	const [userInfo, setUserInfo] = React.useState({});

	const user = route.params?.user;

	const styles = createStyles({ theme });

	const fetchData = async (userId: string) => {
		if (user) {
			setUsername(user.username);
		}
		const roomUserId = getUidDirectMessage(
			{
				rid: userId,
				t: 'd'
			},
			(avoidLegacy = true)
		);
		const result = await Services.getUserInfo(roomUserId);
		if (result?.user) {
			setUserInfo(result.user);
			setUsername(result.user.username);
		}
	};

	useEffect(() => {
		if (route.params?.user) {
			const userId = route.params?.user.id ?? route.params?.user._id;
			fetchData(userId);
		}
	}, [route.params?.user]);

	const handleCreateDirectMessage = async (onPress: (rid: string) => void) => {
		try {
			const result = await Services.createDirectMessage(username);
			if (result.success) {
				const {
					room: { rid }
				} = result;
				if (rid) {
					onPress(rid);
				}
			}
		} catch {}
	};

	const goToRoom = (rid: string) => {
		const room = { rid: rid, t: 'd' };

		const params = {
			rid: room.rid,
			name: getRoomTitle(room),
			t: room.t,
			roomUserId: getUidDirectMessage(room)
		};

		if (room.rid) {
			try {
				goRoom({ item: params, isMasterDetail: true, popToRoot: true });
			} catch (e) {
				console.log(e);
			}
		}
	};

	let age,
		location,
		bio,
		t1dSince,
		pronouns,
		videoUrl = '';

	const devices = [];

	const { customFields, name, roles } = userInfo || {};

	if (customFields) {
		age = customFields.Age;
		location = customFields.Location;
		bio = customFields.Bio;
		pronouns = customFields.Pronouns;
		t1dSince = customFields['T1D Since'];
		videoUrl = customFields.VideoUrl;
		videoUrl = videoUrl.replace('https://youtu.be/', 'https://www.youtube.com/embed/');
		videoUrl = `${videoUrl}?autoplay=1`;
		if (customFields['Glucose Monitoring Method'] !== '') {
			devices.push(customFields['Glucose Monitoring Method']);
		}
		if (customFields['Insulin Delivery Method'] !== '') {
			devices.push(customFields['Insulin Delivery Method']);
		}
	}

	const isPronounsPresent = pronouns?.length && pronouns !== 'Not Selected';

	const isVideoUrlPresent = !!videoUrl && videoUrl !== '' && videoUrl !== '?autoplay=1';

	// Generate all possible peer supporter role combinations
	const generateRolePatterns = () => {
		const roleTypes = ['CASUAL', 'FORMAL', 'INFORMAL', 'SOUNDING BOARD'];
		const patterns = [];
		
		// Hybrid roles with slashes (all combinations)
		for (let i = 0; i < roleTypes.length; i++) {
			for (let j = 0; j < roleTypes.length; j++) {
				if (i !== j) {
					const type1 = roleTypes[i];
					const type2 = roleTypes[j];
					const displayType1 = type1.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
					const displayType2 = type2.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
					
					patterns.push({
						pattern: new RegExp(`^${type1}\\s*\\/\\s*${type2}\\s+PEER SUPPORTER\\.?\\s*`, 'i'),
						displayName: `${displayType1}/${displayType2} Peer Supporter`
					});
				}
			}
		}
		
		// Single role types with period variations
		roleTypes.forEach(type => {
			const displayType = type.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
			patterns.push({
				pattern: new RegExp(`^${type}\\.?\\s+PEER SUPPORTER\\.?\\s*`, 'i'),
				displayName: `${displayType} Peer Supporter`
			});
			patterns.push({
				pattern: new RegExp(`^PEER SUPPORTER\\s+${type}\\.?\\s*`, 'i'),
				displayName: `${displayType} Peer Supporter`
			});
		});
		
		// Just "CASUAL." with period at the end (standalone)
		patterns.push({
			pattern: /^CASUAL\.\s*/i,
			displayName: 'Casual'
		});
		
		// Generic peer supporter
		patterns.push({
			pattern: /^PEER SUPPORTER\.?\s*/i,
			displayName: 'Peer Supporter'
		});
		
		return patterns;
	};

	const rolePatterns = generateRolePatterns();

	// Function to extract role from bio text and clean the description
	const extractRoleFromBio = (bioText: string) => {
		if (!bioText) return { role: '', cleanedBio: '' };
		
		for (const { pattern, displayName } of rolePatterns) {
			if (pattern.test(bioText)) {
				const cleanedBio = bioText.replace(pattern, '').trim();
				return { role: displayName, cleanedBio };
			}
		}
		
		return { role: '', cleanedBio: bioText };
	};

	// Extract role information
	const roleFromArray = roles?.find(role => role.toLowerCase().includes('peer supporter')) || '';
	const { role: roleFromBio, cleanedBio } = extractRoleFromBio(bio || '');
	
	// Use the more specific role from bio if available, otherwise fall back to roles array
	const displayRole = roleFromBio || roleFromArray;
	const bioDescription = cleanedBio;

	return (
		<View style={styles.mainContainer}>
			<ScrollView>
				{/* Profile Header Section - Gray Background */}
				<View style={styles.profileHeaderSection}>
					<View style={styles.profileRow}>
						{/* Left: Circular Profile Picture with Play Button */}
						<View style={styles.avatarContainer}>
							{username && (
								<>
									<Avatar text={username} style={styles.circularAvatar} size={80} server={server} borderRadius={40} />
									{isVideoUrlPresent && (
										<TouchableOpacity
											style={styles.playButtonContainer}
											onPress={() => {
												navigation.navigate('VideoPlayerView', { videoUrl: `${videoUrl}` });
											}}>
											<View style={styles.playButton}>
												<CustomIcon name='play' size={18} color={colors[theme].nextGenSurface} />
											</View>
										</TouchableOpacity>
									)}
								</>
							)}
						</View>

						{/* Right: Name, Age, Online Status, Hometown, Connect Button */}
						<View style={styles.profileInfoContainer}>
							{/* Name, Age, and Online Status */}
							<View style={styles.nameRow}>
								<Text style={styles.nameText}>{age ? `${name}, ${age}` : `${name ?? ''}`}</Text>
								<View style={styles.onlineStatusDot}>
									<Status size={12} id={user._id} />
								</View>
							</View>

							{/* Pronouns (if present) */}
							{isPronounsPresent && <Text style={styles.pronounsText}>{`(${pronouns})`}</Text>}

							{/* Hometown */}
							<Text style={styles.hometownText}>{location ?? ''}</Text>

							{/* Connect Button */}
							<TouchableOpacity style={styles.connectButton} onPress={() => handleCreateDirectMessage(goToRoom)}>
								<Text style={styles.connectButtonText}>Connect</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>

				{/* T1D Info Section - White Background */}
				<View style={styles.infoSection}>
					<View style={styles.infoRow}>
						<Text style={styles.infoLabel}>T1D Since</Text>
						<Text style={styles.infoValue}>{t1dSince !== '' ? t1dSince : '-'}</Text>
					</View>
					<View style={styles.infoRow}>
						<Text style={styles.infoLabel}>Device</Text>
						<View style={styles.deviceContainer}>
							{devices.length > 0 ? (
								devices.map((device, index) => (
									<Text style={styles.infoValue} key={index}>
										{device}
									</Text>
								))
							) : (
								<Text style={styles.infoValue}>-</Text>
							)}
						</View>
					</View>
				</View>

				{/* About Section - Gray Background */}
				<View style={styles.aboutSection}>
					<Text style={styles.aboutHeader}>About</Text>
					{displayRole ? (
						<>
							<Text style={styles.aboutText}>{displayRole}</Text>
							{bioDescription && (
								<Text style={[styles.aboutText, { marginTop: 12 }]}>{bioDescription}</Text>
							)}
						</>
					) : (
						<Text style={styles.aboutText}>{bioDescription}</Text>
					)}
				</View>
			</ScrollView>
		</View>
	);
};

export default withTheme(ConnectView);
