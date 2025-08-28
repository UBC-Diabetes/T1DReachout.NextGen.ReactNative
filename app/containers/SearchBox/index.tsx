import React, { useCallback, useState } from 'react';
import { StyleSheet, TextInputProps, View } from 'react-native';

import { useTheme } from '../../theme';
import I18n from '../../i18n';
import { FormTextInput } from '../TextInput';

const styles = StyleSheet.create({
	inputContainer: {
		margin: 16,
		marginBottom: 16,
		borderRadius: 25,
		paddingHorizontal: 16
	}
});

const SearchBox = ({ onChangeText, onSubmitEditing, testID, placeholder, themeColors }: TextInputProps): JSX.Element => {
	const [text, setText] = useState('');

	const theme = useTheme();
	const colors = themeColors || theme.colors;

	const internalOnChangeText = useCallback((value: string) => {
		setText(value);
		onChangeText?.(value);
	}, []);

	// Custom colors for the search bar using theme-aware primary color
	const customColors = {
		...colors,
		surfaceRoom: colors.nextGenPrimary,
		strokeLight: colors.nextGenPrimary,
		fontTitlesLabels: colors.fontWhite,
		fontAnnotation: colors.fontWhite,
		fontDefault: colors.fontWhite
	};

	return (
		<View testID='searchbox' style={{ backgroundColor: colors.nextGenBackground }}>
			<FormTextInput
				autoCapitalize='none'
				autoCorrect={false}
				blurOnSubmit
				placeholder={placeholder ?? I18n.t('Search')}
				returnKeyType='search'
				underlineColorAndroid='transparent'
				containerStyle={[styles.inputContainer, { backgroundColor: colors.nextGenPrimary }]}
				onChangeText={internalOnChangeText}
				onSubmitEditing={onSubmitEditing}
				value={text}
				testID={testID}
				onClearInput={() => internalOnChangeText('')}
				iconRight={'search'}
				themeColors={customColors}
				inputStyle={{ borderRadius: 25 }}
			/>
		</View>
	);
};

export default SearchBox;
