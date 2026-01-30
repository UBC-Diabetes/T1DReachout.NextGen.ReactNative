import moment from 'moment';

import { sendFileMessage, sendMessage } from '../../lib/methods';
import { Services } from '../../lib/services';
import { TAnyMessageModel } from '../../definitions';
import { themeColors } from '../../lib/constants';
import { events, logEvent } from '../../lib/methods/helpers/log';
import { withDemographics } from '../../lib/methods/helpers/userDemographics';

export const getColor = (color: string) => {
	const colorRegex = /^(#([A-Fa-f0-9]{3}){1,2}|(rgb|hsl)a?\([-.\d\s%,]+\))$/i;
	const isColor = colorRegex.test(color);

	if (isColor) {
		return color;
	}

	if (themeColors[color]) {
		return themeColors[color];
	}
};

export const getIcon = (icon: string) => {
	let imagePath;
	switch (icon) {
		case 'covid':
			imagePath = require('../../static/images/discussionboard/covid.png');
			break;
		case 'diet':
			imagePath = require('../../static/images/discussionboard/diet.png');
			break;
		case 'exercising':
			imagePath = require('../../static/images/discussionboard/exercising.png');
			break;
		case 'insulin':
			imagePath = require('../../static/images/discussionboard/insulin.png');
			break;
		case 'mdi_users':
			imagePath = require('../../static/images/discussionboard/mdi_users.png');
			break;
		case 'syringe':
			imagePath = require('../../static/images/discussionboard/syringe.png');
			break;
		case 'solidStar':
			imagePath = require(`../../static/images/discussionboard/star_solid.png`);
			break;
		case 'outlineStar':
			imagePath = require(`../../static/images/discussionboard/star_outline.png`);
			break;
		case 'solidSave':
			imagePath = require('../../static/images/discussionboard/save_solid.png');
			break;
		case 'outlineSave':
			imagePath = require('../../static/images/discussionboard/save.png');
			break;
		case 'like':
			imagePath = require('../../static/images/discussionboard/like.png');
			break;
		case 'comment':
			imagePath = require('../../static/images/discussionboard/comment.png');
			break;
		case 'arrowRight':
			imagePath = require('../../static/images/discussionboard/arrow_right.png');
			break;
		case 'arrowLeft':
			imagePath = require('../../static/images/discussionboard/arrow_left.png');
			break;
		case 'discussionBoardIcon':
			imagePath = require('../../static/images/discussion-solid.png');
			break;
		case 'arrowDown':
			imagePath = require('../../static/images/discussionboard/arrow_down.png');
			break;
		case 'selectImage':
			imagePath = require('../../static/images/discussionboard/image_picker.png');
			break;
		case 'more':
			imagePath = require('../../static/images/discussionboard/more.png');
			break;
		case 'send':
			imagePath = require('../../static/images/discussionboard/send.png');
			break;
		case 'saveMedia':
			imagePath = require('../../static/images/discussionboard/save_media_new.png');
			break;
		case 'boardUsers':
			imagePath = require('../../static/images/discussionboard/board_users.png');
			break;

		default:
			imagePath = require('../../static/images/discussionboard/image_picker.png');
			break;
	}
	return imagePath;
};

export const handleStar = async (message: TAnyMessageModel, callback?: () => void) => {
	try {
		const wasSaved = message.starred as boolean;
		await Services.toggleStarMessage(message.id, wasSaved);

		// Track post save/unsave for analytics
		try {
			if (wasSaved) {
				// Was saved, now unsaving
				logEvent(
					events.POST_UNSAVED,
					withDemographics({
						message_id: message.id,
						room_id: message.rid
					})
				);
			} else {
				// Was not saved, now saving
				logEvent(
					events.POST_SAVED,
					withDemographics({
						message_id: message.id,
						room_id: message.rid
					})
				);
			}
		} catch (e) {
			console.log('Analytics error:', e);
		}

		if (callback) {
			callback();
		}
	} catch (e) {
		console.log('e', e);
	}
};

export const handleSendMessage = async ({
	message,
	tshow,
	rid,
	callBack,
	hasAttachment,
	fileInfo,
	server,
	user
}: {
	message: string;
	tshow?: boolean;
	rid: string;
	callBack: () => void;
	hasAttachment?: boolean;
	fileInfo?: any;
	server?: string;
	user?: any;
}) => {
	if (hasAttachment) {
		await sendFileMessage(rid, fileInfo, undefined, server, user);
		if (callBack) {
			callBack();
		}
	} else {
		sendMessage(rid, message, undefined, user, tshow).then(() => {
			if (callBack) {
				callBack();
			}
		});
	}
};

export const getDate = (date: string, format?: string) => {
	const formattedDate = moment(date).format(format ?? 'MMMM D, YYYY - h:MMa');
	return moment(date) ? formattedDate : '';
};

export const getBoardIcon = (boardName: string) => {
	const name = boardName.toLowerCase();
	
	// Map board names to icon keys
	if (name.includes('covid') || name.includes('coronavirus')) {
		return 'covid';
	}
	if (name.includes('diet') || name.includes('nutrition')) {
		return 'diet';
	}
	if (name.includes('exercis') || name.includes('fitness')) {
		return 'exercising';
	}
	if (name.includes('insulin') || name.includes('pump')) {
		return 'insulin';
	}
	if (name.includes('mdi') || name.includes('injection') || name.includes('multiple daily')) {
		return 'mdi_users';
	}
	if (name.includes('syringe')) {
		return 'syringe';
	}
	if (name.includes('travel')) {
		return 'airplane'; // Use CustomIcon for travel
	}
	if (name.includes('cgm') || name.includes('continuous glucose')) {
		return 'support'; // Use CustomIcon as fallback
	}
	
	// Default fallback
	return 'discussionBoardIcon';
};
