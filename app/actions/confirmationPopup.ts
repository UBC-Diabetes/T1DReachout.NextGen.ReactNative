export const showConfirmationPopup = (data: any) => ({
	type: 'SHOW_CONFIRMATION_POPUP',
	data
});

export const hideConfirmationPopup = () => ({
	type: 'HIDE_CONFIRMATION_POPUP'
});

export const showRemoveEventPopup = (data: any) => ({
	type: 'SHOW_REMOVE_EVENT_POPUP',
	data
});

export const hideRemoveEventPopup = () => ({
	type: 'HIDE_REMOVE_EVENT_POPUP'
});
