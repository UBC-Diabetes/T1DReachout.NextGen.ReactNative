import React from 'react';
import { Text, View } from 'react-native';

import { useTheme } from '../../theme';
import styles from './styles';
import { IUser } from '../../definitions';

const Direct = ({ roomUser }: { roomUser: IUser }): React.ReactElement => {
	const { colors } = useTheme();
	
	// Extract custom fields following ProfileView order
	const customFields = roomUser.customFields || {};
	const age = customFields.Age;
	const location = customFields.Location;
	const bio = customFields.Bio;
	const pronouns = customFields.Pronouns;
	const t1dSince = customFields['T1D Since'] || customFields.t1dSince;
	const glucoseMethod = customFields['Glucose Monitoring Method'];
	const insulinMethod = customFields['Insulin Delivery Method'];
	
	return (
		<>
			{/* Main Info Section - White background extending all the way down */}
			<View style={[styles.infoSection, { backgroundColor: colors.nextGenSurface }]}>
				{/* T1D Since - moved to top */}
				{t1dSince && (
					<View style={styles.infoRow}>
						<Text style={[styles.infoLabel, { color: colors.nextGenText }]}>T1D Since</Text>
						<Text style={[styles.infoValue, { color: colors.nextGenText }]}>{t1dSince}</Text>
					</View>
				)}
				
				{/* Glucose Monitoring Method - moved to top */}
				{glucoseMethod && (
					<View style={styles.infoRow}>
						<Text style={[styles.infoLabel, { color: colors.nextGenText }]}>Glucose Monitoring Method</Text>
						<Text style={[styles.infoValue, { color: colors.nextGenText }]}>{glucoseMethod}</Text>
					</View>
				)}
				
				{/* Insulin Delivery Method - moved to top */}
				{insulinMethod && (
					<View style={styles.infoRow}>
						<Text style={[styles.infoLabel, { color: colors.nextGenText }]}>Insulin Delivery Method</Text>
						<Text style={[styles.infoValue, { color: colors.nextGenText }]}>{insulinMethod}</Text>
					</View>
				)}
				
				{/* About (formerly Bio) - moved after device fields */}
				{bio && (
					<View style={styles.fieldRow}>
						<Text style={[styles.fieldLabel, { color: colors.nextGenText }]}>About</Text>
						<Text style={[styles.fieldValue, { color: colors.nextGenText }]}>{bio}</Text>
					</View>
				)}
				
				{/* Roles - moved after device fields */}
				{roomUser.roles?.length && (
					<View style={styles.fieldRow}>
						<Text style={[styles.fieldLabel, { color: colors.nextGenText }]}>Roles</Text>
						<View style={styles.rolesContainer}>
							{roomUser.roles.map(role =>
								role ? (
									<View
										style={[styles.roleBadge, { backgroundColor: colors.nextGenBackground }]}
										key={role}
										testID={`user-role-${role.replace(/ /g, '-')}`}
									>
										<Text style={[styles.role, { color: colors.fontTitlesLabels }]}>{role}</Text>
									</View>
								) : null
							)}
						</View>
					</View>
				)}
				
				{/* Name */}
				{roomUser.name && (
					<View style={styles.fieldRow}>
						<Text style={[styles.fieldLabel, { color: colors.nextGenText }]}>Name</Text>
						<Text style={[styles.fieldValue, { color: colors.nextGenText }]}>{roomUser.name}</Text>
					</View>
				)}
				
				{/* Username */}
				{roomUser.username && (
					<View style={styles.fieldRow}>
						<Text style={[styles.fieldLabel, { color: colors.nextGenText }]}>Username</Text>
						<Text style={[styles.fieldValue, { color: colors.nextGenText }]}>{roomUser.username}</Text>
					</View>
				)}
				
				{/* Email */}
				{roomUser.emails && roomUser.emails.length > 0 && (
					<View style={styles.fieldRow}>
						<Text style={[styles.fieldLabel, { color: colors.nextGenText }]}>Email</Text>
						<Text style={[styles.fieldValue, { color: colors.nextGenText }]}>{roomUser.emails[0].address}</Text>
					</View>
				)}
				
				{/* Age */}
				{age && (
					<View style={styles.fieldRow}>
						<Text style={[styles.fieldLabel, { color: colors.nextGenText }]}>Age</Text>
						<Text style={[styles.fieldValue, { color: colors.nextGenText }]}>{age}</Text>
					</View>
				)}
				
				{/* Location */}
				{location && (
					<View style={styles.fieldRow}>
						<Text style={[styles.fieldLabel, { color: colors.nextGenText }]}>Location</Text>
						<Text style={[styles.fieldValue, { color: colors.nextGenText }]}>{location}</Text>
					</View>
				)}
				
				{/* Pronouns */}
				{pronouns && pronouns !== 'Not Selected' && (
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
