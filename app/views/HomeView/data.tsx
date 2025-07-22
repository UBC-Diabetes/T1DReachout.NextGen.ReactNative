import { SizeTypes } from './interfaces';

export const mainTiles = [
	{
		title: 'Peer Mentor Library',
		screen: 'ProfileLibraryView',
		size: SizeTypes.LARGE,
		color: 'mossGreen',
		icon: require('../../static/images/peer-mentor-solid.png'),
		disabled: false
	},
	{
		title: '24/7 Chat Room',
		screen: '24Chat',
		size: SizeTypes.LARGE,
		color: 'magenta',
		icon: require('../../static/images/24-7-solid.png'),
		disabled: false
	},
	{
		title: 'Virtual Huddle',
		screen: 'VirtualHuddle',
		size: SizeTypes.LARGE,
		color: 'creamsicleYellow',
		icon: require('../../static/images/happy-hour-solid.png'),
		disabled: false
	}
];
