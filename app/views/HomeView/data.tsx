import { SizeTypes } from './interfaces';

export const mainTiles = [
	{
		title: 'Peer Supporter Library',
		screen: 'ProfileLibraryView',
		size: SizeTypes.LARGE,
		color: '#112D4E',
		icon: require('../../static/images/peer-supporter-solid.png'),
		disabled: false
	},
	{
		title: '24/7 Chat Room',
		screen: '24Chat',
		size: SizeTypes.LARGE,
		color: '#112D4E',
		icon: require('../../static/images/24-7-solid.png'),
		disabled: false
	},
	{
		title: 'Virtual Happy Hour',
		screen: 'VirtualHappyHour',
		size: SizeTypes.LARGE,
		color: '#112D4E',
		icon: require('../../static/images/happy-hour-solid.png'),
		disabled: false
	}
];
