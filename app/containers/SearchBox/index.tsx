import React, { useCallback, useState } from 'react';
import { StyleSheet, TextInputProps, View } from 'react-native';

import { useTheme } from '../../theme';
import I18n from '../../i18n';
import { FormTextInput } from '../TextInput';

const styles = StyleSheet.create({
	inputContainer: {
		margin: 16,
		marginBottom: 16,
		backgroundColor: '#112D4E',
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

	// Custom colors for the dark blue search bar
	const customColors = {
		...colors,
		surfaceRoom: '#112D4E',
		strokeLight: '#112D4E',
		fontTitlesLabels: '#FFFFFF',
		fontAnnotation: '#FFFFFF',
		fontDefault: '#FFFFFF'
	};

	return (
		<View testID='searchbox' style={{ backgroundColor: colors.nextGenLightGray }}>
			<FormTextInput
				autoCapitalize='none'
				autoCorrect={false}
				blurOnSubmit
				placeholder={placeholder ?? I18n.t('Search')}
				returnKeyType='search'
				underlineColorAndroid='transparent'
				containerStyle={styles.inputContainer}
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
