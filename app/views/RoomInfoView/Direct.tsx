import React from 'react';
import { Text, View } from 'react-native';

import I18n from '../../i18n';
import { useTheme } from '../../theme';
import CustomFields from './CustomFields';
import Timezone from './Timezone';
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
			{/* Basic Info Section - Following ProfileView order */}
			<View style={[styles.infoSection, { backgroundColor: colors.nextGenSurface }]}>
				{/* Email - if available */}
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
				
				{/* T1D Since */}
				{t1dSince && (
					<View style={styles.fieldRow}>
						<Text style={[styles.fieldLabel, { color: colors.nextGenText }]}>T1D Since</Text>
						<Text style={[styles.fieldValue, { color: colors.nextGenText }]}>{t1dSince}</Text>
					</View>
				)}
				
				{/* Glucose Monitoring Method */}
				{glucoseMethod && (
					<View style={styles.fieldRow}>
						<Text style={[styles.fieldLabel, { color: colors.nextGenText }]}>Glucose Monitoring Method</Text>
						<Text style={[styles.fieldValue, { color: colors.nextGenText }]}>{glucoseMethod}</Text>
					</View>
				)}
				
				{/* Insulin Delivery Method */}
				{insulinMethod && (
					<View style={styles.fieldRow}>
						<Text style={[styles.fieldLabel, { color: colors.nextGenText }]}>Insulin Delivery Method</Text>
						<Text style={[styles.fieldValue, { color: colors.nextGenText }]}>{insulinMethod}</Text>
					</View>
				)}
				
				{/* Timezone */}
				{roomUser.utcOffset !== undefined && (
					<View style={styles.fieldRow}>
						<Text style={[styles.fieldLabel, { color: colors.nextGenText }]}>Timezone</Text>
						<Text style={[styles.fieldValue, { color: colors.nextGenText }]}>
							{roomUser.utcOffset > 0 ? '+' : ''}{roomUser.utcOffset}
						</Text>
					</View>
				)}
			</View>

			{/* Bio Section - Gray Background */}
			{bio && (
				<View style={[styles.aboutSection, { backgroundColor: colors.nextGenBackground }]}>
					<Text style={[styles.aboutHeader, { color: colors.nextGenText }]}>Bio</Text>
					<Text style={[styles.aboutText, { color: colors.nextGenText }]}>{bio}</Text>
				</View>
			)}

			{/* Roles Section - Gray Background */}
			{roomUser.roles?.length && (
				<View style={[styles.aboutSection, { backgroundColor: colors.nextGenBackground }]}>
					<Text style={[styles.aboutHeader, { color: colors.nextGenText }]}>Roles</Text>
					<View style={styles.rolesContainer}>
						{roomUser.roles.map(role =>
							role ? (
								<View
									style={[styles.roleBadge, { backgroundColor: colors.nextGenSecondary }]}
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

			{/* Additional Custom Fields */}
			<CustomFields customFields={roomUser.customFields} />
		</>
	);
};

export default Direct;
