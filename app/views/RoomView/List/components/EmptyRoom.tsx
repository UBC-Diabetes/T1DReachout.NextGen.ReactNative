import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useTheme } from '../../../../theme';
import ActivityIndicator from '../../../../containers/ActivityIndicator';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	emptyContainer: {
		padding: 20
	},
	emptyText: {
		fontSize: 16,
		textAlign: 'center',
		color: '#666'
	}
});

export const EmptyRoom = React.memo(({ length, rid, loading }: { length: number; rid: string; loading?: boolean }) => {
	const { colors } = useTheme();

	if (length === 0 && rid) {
		return (
			<View style={[styles.container, styles.emptyContainer, { backgroundColor: colors.backgroundColor }]}>
				<Text style={styles.emptyText}>No messages yet</Text>
			</View>
		);
	}

	return null;
});
