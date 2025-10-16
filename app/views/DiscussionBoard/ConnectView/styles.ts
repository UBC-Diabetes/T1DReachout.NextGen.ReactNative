import { StyleSheet } from 'react-native';
import { colors } from '../../../lib/constants';

export const createStyles = ({ theme }: { theme: any }) =>
	StyleSheet.create({
		// Main container with NextGen background
		mainContainer: {
			flex: 1,
			backgroundColor: colors[theme].nextGenBackground
		},

		// Profile Header Section (Gray background)
		profileHeaderSection: {
			backgroundColor: colors[theme].nextGenBackground,
			paddingHorizontal: 15,
			paddingVertical: 24
		},
		profileRow: {
			flexDirection: 'column',
			alignItems: 'center'
		},

		// Avatar container with circular profile picture
		avatarContainer: {
			position: 'relative',
			alignItems: 'center',
			marginBottom: 24
		},
		circularAvatar: {
			// Avatar component handles the circular shape via borderRadius prop
		},

		// Play button positioned to bisect the profile picture edge at 4:30 position (half on, half off)
		playButtonContainer: {
			position: 'absolute',
			bottom: 5, // Adjusted for 200px avatar
			right: 100 // Adjusted for 200px avatar
		},
		playButton: {
			width: 40,
			height: 40,
			borderRadius: 22,
			backgroundColor: colors[theme].nextGenPrimary,
			justifyContent: 'center',
			alignItems: 'center',
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.25,
			shadowRadius: 3.84,
			elevation: 5
		},

		// Profile info container (centered)
		profileInfoContainer: {
			alignItems: 'center',
			marginBottom: 24
		},

		// Name and age row with online status
		nameRow: {
			flexDirection: 'row',
			alignItems: 'center',
			marginBottom: 4
		},
		nameText: {
			fontSize: 24, // M3 Headline Small
			fontWeight: '400',
			color: colors[theme].nextGenText,
			marginRight: 8
		},
		onlineStatusDot: {
			// Status component handles its own styling
		},

		// Pronouns text
		pronounsText: {
			fontSize: 14,
			color: colors[theme].nextGenTextSecondary,
			marginBottom: 4
		},

		// Hometown text
		hometownText: {
			fontSize: 16, // M3 Title Medium
			fontWeight: '500',
			color: colors[theme].nextGenTextSecondary,
			marginBottom: 12
		},

		// Connect button - large centered button
		connectButton: {
			backgroundColor: colors[theme].nextGenPrimary,
			paddingHorizontal: 48,
			paddingVertical: 16,
			borderRadius: 24,
			alignSelf: 'center',
			minWidth: 200
		},
		connectButtonText: {
			fontSize: 20,
			fontWeight: '600',
			color: colors[theme].nextGenSurface,
			textAlign: 'center'
		},

		// T1D Info Section (White background)
		infoSection: {
			backgroundColor: colors[theme].nextGenSurface,
			paddingHorizontal: 20,
			paddingVertical: 16,
			marginTop: 16
		},
		infoRow: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'flex-start',
			marginBottom: 12
		},
		infoLabel: {
			fontSize: 16,
			fontWeight: '500',
			color: colors[theme].nextGenText
		},
		infoValue: {
			fontSize: 16,
			color: colors[theme].nextGenText,
			flex: 1,
			textAlign: 'right'
		},
		deviceContainer: {
			flex: 1,
			alignItems: 'flex-end'
		},

		// About Section (Gray background)
		aboutSection: {
			backgroundColor: colors[theme].nextGenBackground,
			paddingHorizontal: 20,
			paddingVertical: 20,
			marginTop: 16
		},
		aboutHeader: {
			fontSize: 22, // M3 Title Large
			fontWeight: '400',
			color: colors[theme].nextGenText,
			marginBottom: 12
		},
		aboutText: {
			fontSize: 16,
			lineHeight: 22,
			color: colors[theme].nextGenText
		},
		rolePill: {
			backgroundColor: colors[theme].nextGenSurface,
			paddingHorizontal: 12,
			paddingVertical: 6,
			borderRadius: 16,
			alignSelf: 'flex-start',
			marginBottom: 12
		},
		rolePillText: {
			fontSize: 14,
			fontWeight: '500',
			color: colors[theme].nextGenText
		}
	});

// Legacy export for compatibility
const makeStyles = (themes: any, theme: string) => createStyles({ theme });

export default makeStyles;
