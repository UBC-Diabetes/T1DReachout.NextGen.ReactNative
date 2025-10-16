import React from 'react';
import { Text, View } from 'react-native';

import { useTheme } from '../../theme';
import styles from './styles';
import { IUser } from '../../definitions';

const Direct = ({ roomUser }: { roomUser: IUser }): React.ReactElement => {
	const { colors } = useTheme();

	// Extract custom fields following ProfileView order
	const customFields = roomUser.customFields || {};
	const age = customFields.Age || '';
	const location = customFields.Location || '';
	const bio = customFields.Bio || '';
	const pronouns = customFields.Pronouns || '';
	const t1dSince = customFields['T1D Since'] || customFields.t1dSince || '';
	const glucoseMethod = customFields['Glucose Monitoring Method'] || '';
	const insulinMethod = customFields['Insulin Delivery Method'] || '';

	return (
		<>
			{/* Main Info Section - White background extending all the way down */}
			<View style={[styles.infoSection, { backgroundColor: colors.nextGenSurface }]}>
				{t1dSince && t1dSince.length && (
					<View style={styles.infoRow}>
						<Text style={[styles.infoLabel, { color: colors.nextGenText }]}>Age at diagnosis</Text>
						<Text style={[styles.infoValue, { color: colors.nextGenText }]}>{t1dSince || ''}</Text>
					</View>
				)}

				{glucoseMethod && glucoseMethod.length && (
					<View style={styles.infoRow}>
						<Text style={[styles.infoLabel, { color: colors.nextGenText }]}>Glucose Monitoring Method</Text>
						<Text style={[styles.infoValue, { color: colors.nextGenText }]}>{glucoseMethod || ''}</Text>
					</View>
				)}

				{insulinMethod && insulinMethod.length && (
					<View style={styles.infoRow}>
						<Text style={[styles.infoLabel, { color: colors.nextGenText }]}>Insulin Delivery Method</Text>
						<Text style={[styles.infoValue, { color: colors.nextGenText }]}>{insulinMethod || ''}</Text>
					</View>
				)}

				{bio && bio.length && (
					<View style={styles.fieldRow}>
						<Text style={[styles.fieldLabel, { color: colors.nextGenText }]}>About</Text>
						<Text style={[styles.fieldValue, { color: colors.nextGenText }]}>{bio || ''}</Text>
					</View>
				)}

				{Array.isArray(roomUser.roles) && roomUser.roles.length > 0 && (
					<View style={styles.fieldRow}>
						<Text style={[styles.fieldLabel, { color: colors.nextGenText }]}>Roles</Text>
						<View style={styles.rolesContainer}>
							{roomUser.roles.map((role, index) => {
								if (!role || typeof role !== 'string' || !role.length) return null;

								// Convert legacy peer supporter roles to peer mentor for display, then capitalize
								let displayRole = role.toLowerCase().includes('peer supporter')
									? role.replace(/peer supporter/i, 'Peer Mentor')
									: role;

								// Capitalize each word
								displayRole = displayRole.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());

								return (
									<View
										style={[styles.roleBadge, { backgroundColor: colors.nextGenBackground }]}
										key={`role-${index}`}
										testID={`user-role-${role.replace(/ /g, '-')}`}>
										<Text style={[styles.role, { color: colors.fontTitlesLabels }]}>{displayRole || ''}</Text>
									</View>
								);
							})}
						</View>
					</View>
				)}

				{roomUser.name && roomUser.name.length && (
					<View style={styles.fieldRow}>
						<Text style={[styles.fieldLabel, { color: colors.nextGenText }]}>Name</Text>
						<Text style={[styles.fieldValue, { color: colors.nextGenText }]}>{roomUser.name || ''}</Text>
					</View>
				)}

				{roomUser.username && roomUser.username.length && (
					<View style={styles.fieldRow}>
						<Text style={[styles.fieldLabel, { color: colors.nextGenText }]}>Username</Text>
						<Text style={[styles.fieldValue, { color: colors.nextGenText }]}>{roomUser.username || ''}</Text>
					</View>
				)}

				{roomUser.emails && roomUser.emails.length > 0 && roomUser.emails[0]?.address && (
					<View style={styles.fieldRow}>
						<Text style={[styles.fieldLabel, { color: colors.nextGenText }]}>Email</Text>
					</View>
				)}

				{/* Age */}
				{age && age.length && (
					<View style={styles.fieldRow}>
						<Text style={[styles.fieldLabel, { color: colors.nextGenText }]}>Age</Text>
						<Text style={[styles.fieldValue, { color: colors.nextGenText }]}>{age}</Text>
					</View>
				)}

				{/* Location */}
				{location && location.length && (
					<View style={styles.fieldRow}>
						<Text style={[styles.fieldLabel, { color: colors.nextGenText }]}>Location</Text>
						<Text style={[styles.fieldValue, { color: colors.nextGenText }]}>{location}</Text>
					</View>
				)}

				{/* Pronouns */}
				{pronouns && pronouns.length && pronouns !== 'Not Selected' && (
					<View style={styles.fieldRow}>
						<Text style={[styles.fieldLabel, { color: colors.nextGenText }]}>Pronouns</Text>
						<Text style={[styles.fieldValue, { color: colors.nextGenText }]}>{pronouns}</Text>
					</View>
				)}
			</View>
		</>
	);
};

export default Direct;
