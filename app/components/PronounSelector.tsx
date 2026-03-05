import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import { themes } from '../lib/constants';

interface PronounSelectorProps {
	value: string;
	onChange: (value: string) => void;
	label?: string;
	required?: boolean;
}

const PRONOUN_OPTIONS = ['he', 'him', 'she', 'her', 'they', 'them'];

export const PronounSelector: React.FC<PronounSelectorProps> = ({ value, onChange, label = 'Pronouns', required = false }) => {
	const { theme } = useTheme();
	const [selectedChips, setSelectedChips] = useState<string[]>([]);

	// Initialize from value on mount or when value changes externally
	useEffect(() => {
		if (!value || value === 'Not Selected') {
			setSelectedChips([]);
			return;
		}

		const parts = value.split('/').map(p => p.trim());

		// Only initialize if all parts are valid chip options
		const allPartsAreChips = parts.every(p => PRONOUN_OPTIONS.includes(p));

		if (allPartsAreChips && parts.length <= 2) {
			setSelectedChips(parts);
		} else {
			setSelectedChips([]);
		}
	}, [value]);

	// Generate preview text
	const previewText = selectedChips.length === 0 ? 'Select pronouns' : selectedChips.join('/');

	const handleChipPress = (pronoun: string) => {
		let newSelection: string[];

		if (selectedChips.includes(pronoun)) {
			// Deselect
			newSelection = selectedChips.filter(p => p !== pronoun);
		} else {
			// Select
			if (selectedChips.length >= 2) {
				// Replace first selected with new one
				newSelection = [selectedChips[1], pronoun];
			} else {
				newSelection = [...selectedChips, pronoun];
			}
		}

		setSelectedChips(newSelection);
		onChange(newSelection.join('/'));
	};

	return (
		<View style={styles.container}>
			<Text style={[styles.label, { color: themes[theme].titleText }]}>
				{label}
				{required && ' *'}
			</Text>

			{/* Preview */}
			<View style={[styles.previewContainer, { backgroundColor: themes[theme].backgroundColor }]}>
				<Text style={[styles.previewText, { color: themes[theme].bodyText }]}>{previewText}</Text>
			</View>

			{/* Chip Selection */}
			<View style={styles.chipsContainer}>
				{PRONOUN_OPTIONS.map(pronoun => {
					const isSelected = selectedChips.includes(pronoun);
					return (
						<TouchableOpacity
							key={pronoun}
							style={[
								styles.chip,
								{
									backgroundColor: isSelected ? themes[theme].tintColor : themes[theme].backgroundColor,
									borderColor: themes[theme].separatorColor
								}
							]}
							onPress={() => handleChipPress(pronoun)}>
							<Text
								style={[
									styles.chipText,
									{
										color: isSelected ? themes[theme].buttonText : themes[theme].bodyText
									}
								]}>
								{pronoun}
							</Text>
						</TouchableOpacity>
					);
				})}
			</View>

			<Text style={[styles.hint, { color: themes[theme].auxiliaryText }]}>Select up to 2 pronouns</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginBottom: 16,
		paddingHorizontal: 16
	},
	label: {
		fontSize: 14,
		fontWeight: '600',
		marginBottom: 8
	},
	previewContainer: {
		padding: 12,
		borderRadius: 8,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: '#E0E0E0'
	},
	previewText: {
		fontSize: 16,
		textAlign: 'center'
	},
	chipsContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8,
		marginBottom: 12
	},
	chip: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 20,
		borderWidth: 1
	},
	chipText: {
		fontSize: 14,
		fontWeight: '500'
	},
	hint: {
		fontSize: 12,
		textAlign: 'center'
	}
});
