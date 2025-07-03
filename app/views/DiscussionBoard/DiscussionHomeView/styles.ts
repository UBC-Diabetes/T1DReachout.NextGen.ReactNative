import { StyleSheet } from 'react-native';

const makeStyles = themeColors =>
	StyleSheet.create({
		mainContainer: {
			flex: 1,
			alignItems: 'center',
			backgroundColor: themeColors.nextGenBackground // NextGen background to match Home View
		},
		discussionBoardsSeparator: {
			height: 1,
			width: '100%',
			backgroundColor: themeColors.nextGenBorder,
			marginVertical: 16
		},
		footer: {
			height: 80
		}
	});

export default makeStyles;
