import { Q } from '@nozbe/watermelondb';

import database from '../../lib/database';
import { SubscriptionType } from '../../definitions';
import { goRoom } from '../../lib/methods/helpers/goRoom';
import { Services } from '../../lib/services';
import log from '../../lib/methods/helpers/log';

const CHAT247ROOMID = '24-7-chatroom';
const VIRTUAL_HUDDLE_ROOMID = 'virtual-huddle';
const TECH_SUPPORT_USERNAME = 'tech_support';

export const navToTechSupport = async (Navigation: any): Promise<void> => {
	let query;
	try {
		const db = database.active;
		const subsCollection = db.get('subscriptions');
		query = await subsCollection.query(Q.where('name', TECH_SUPPORT_USERNAME)).fetch();
		if (query.length > 0) {
			const room = query[0];
			await Navigation.navigate('RoomView');
			goRoom({ item: room, isMasterDetail: true });
		} else {
			const result = await Services.createDirectMessage(TECH_SUPPORT_USERNAME);
			if (result.success) {
				const item = { tmid: result.room?._id, name: TECH_SUPPORT_USERNAME, t: SubscriptionType.DIRECT };
				await Navigation.navigate('RoomView');
				goRoom({ item, isMasterDetail: true });
			}
		}
	} catch (e) {
		log(e);
	}
};

export const navigateToVirtualHuddle = async (Navigation: any) => {
	if (Navigation) {
		try {
			const room = await Services.getRoomByTypeAndName('c', VIRTUAL_HUDDLE_ROOMID);
			if (room) {
				await Navigation.navigate('RoomView');
				goRoom({ item: { rid: room._id, name: room.name, t: room.t }, isMasterDetail: true });
			}
		} catch (error) {
			console.error('error', error);
		}
	}
};

export const navigateTo247Chat = async (Navigation: any) => {
	if (Navigation) {
		try {
			const room = await Services.getRoomByTypeAndName('c', CHAT247ROOMID);
			if (room) {
				await Navigation.navigate('RoomView');
				goRoom({ item: { rid: room._id, name: room.name, t: room.t }, isMasterDetail: true });
			}
		} catch (error) {
			console.error('error', error);
		}
	}
};
