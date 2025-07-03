import { StyleSheet } from 'react-native';
import { colors } from '../../../lib/constants';

export const createStyles = ({ theme }: { theme: any }) => StyleSheet.create({
	mainContainer: {
		flex: 1,
		backgroundColor: colors[theme].nextGenBackground
	},
	headerContainer: {
		margin: 20
	},
	headerText: {
		fontSize: 24,
		fontWeight: '600',
		lineHeight: 29,
		color: colors[theme].nextGenText
	},
	footer: {
		height: 90
	},
	buttonContainer: {
		position: 'absolute',
		marginHorizontal: 24,
		height: 54,
		borderRadius: 27,
		justifyContent: 'center',
		alignItems: 'center',
		left: 0,
		right: 0,
		bottom: 28,
		backgroundColor: colors[theme].nextGenPrimary,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.15,
		shadowRadius: 100,
		elevation: 5
	},
	buttonText: {
		color: colors[theme].nextGenSurface,
		fontSize: 16,
		fontWeight: '600',
		lineHeight: 19
	}
});

// Keep legacy export for compatibility
const styles = createStyles({ theme: 'light' });
export default styles;
