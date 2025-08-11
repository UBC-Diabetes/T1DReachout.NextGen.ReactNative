import { StyleSheet } from 'react-native';
import { themes } from '../../../lib/constants';
import { TSupportedThemes } from '../../../theme';

const createStyles = (theme: TSupportedThemes) => StyleSheet.create({
	mainContainer: {
		backgroundColor: themes[theme].nextGenBackground,
		flex: 1
	},
	// Search UI handled by shared SearchBox component
	searchItemContainer: {
		backgroundColor: themes[theme].nextGenSurface,
		borderRadius: 20,
		padding: 20,
		shadowColor: themes[theme].nextGenBorder,
		shadowOffset: { width: 1, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 30,
		elevation: 5,
		marginHorizontal: 20
	},
	title: {
		fontSize: 16,
		lineHeight: 19,
		fontWeight: '500',
		marginBottom: 8,
		color: themes[theme].nextGenText
	},
	description: {
		fontSize: 14,
		lineHeight: 19,
		fontWeight: '400',
		color: themes[theme].nextGenTextSecondary
	},
	searchItemArrow: {
		alignSelf: 'flex-end'
	},
	arrow: {
		height: 15,
		width: 9,
		marginRight: 8
	}
});

export default createStyles;
