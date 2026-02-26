import { delay, put, select, takeLatest } from 'redux-saga/effects';
import { parseISO, format } from 'date-fns';
import crashlytics from '@react-native-firebase/crashlytics';

import { CREATE_EVENT, DELETE_EVENT, FETCH_EVENT, REGISTER_EVENT, DE_REGISTER_EVENT, UPDATE_EVENT } from '../actions/actionsTypes';
import { Services } from '../lib/services';

import {
    createEventSuccess,
    createEventFailure,
    createEventReset,
    fetchEventRequest,
    fetchEventSuccess,
    fetchEventFailure,
    updateEventSuccess,
    deleteEventSuccess,
    registerEventSuccess,
    deregisterEventSuccess
    } from '../actions/calendarEvents';


function convertDateFromISO(dateString) {
    const parsedDate = parseISO(dateString);

    return format(parsedDate, 'yyyy-MM-dd');
}


const parseDate = (dateString) => {
    if (!dateString) {
        return 'unknown-date';
    }
    try {
        return convertDateFromISO(dateString);
    } catch (error) {
        console.error('Date conversion error:', error);
    }
};

function groupEventsByDate(events) {
    try {
        const grouped = events.reduce((acc, { _id, event }) => {
            const item = {
                ...event,
                id: _id
            };

            const dateKey = parseDate(event.dateTime);

            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(item);
            return acc;
        }, {});

        return Object.entries(grouped)
            .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
            .map(([title, data]) => ({
                title,
                data: data.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
            }));
    } catch (error) {
        console.error('Error in groupEventsByDate:', error);
        return [];
    }
}


const handleFetchRequest = function* handleFetchCalendarEvents() {

  const { success, events, error } = yield Services.getCalendarEvents();

  const groupedEvents = groupEventsByDate(events);

  if (success) {
		yield put(fetchEventSuccess(groupedEvents));
  } else {
		yield put(fetchEventFailure(error));
  }

};

const handleCreateRequest = function* handleCreateCalendarEvent() {
  const draftEvent = yield select(state => state.calendarEvents.draftEvent);
  const user = yield select(state => state.login.user);

  // Log what we're about to send
  crashlytics().log(`Creating calendar event: ${JSON.stringify(draftEvent)}`);
  crashlytics().setAttributes({
    calendar_event_user: user?.username || 'unknown',
    calendar_event_title: draftEvent?.title || 'none',
    calendar_event_datetime: draftEvent?.dateTime || 'none',
    calendar_event_location: draftEvent?.location || 'none'
  });
  const response = yield Services.createCalendarEvent();
  const { success, error } = response;

  // Log the server response details
  crashlytics().log(`Server response - Success: ${success}, Error: ${JSON.stringify(error)}, Full response: ${JSON.stringify(response)}`);
  // Set additional attributes with response data
  crashlytics().setAttributes({
    calendar_event_response_success: String(success),
    calendar_event_has_error: String(!!error),
    calendar_event_error_message: error?.message || error?.error || 'none'
  });

  // Record as error for easier tracking in Crashlytics dashboard
  const trackingError = new Error(`Calendar event creation - User: ${user?.username}, Title: ${draftEvent?.title}, Success: ${success}, Error: ${error?.message || error?.error || 'none'}`);
  crashlytics().recordError(trackingError);

  if (success) {
		yield put(createEventSuccess());
  } else {
		yield put(createEventFailure(error));
  }

};

const handleCreateSuccess = function* handleCreateEventSuccess() {
		yield put(fetchEventRequest());
		yield put(createEventReset());
};



const handleUpdateRequest = function* handleUpdateCalendarEvent() {

  const response = yield Services.updateCalendarEvent();
  const { success, error } = response;

  if (success) {
		yield put(updateEventSuccess());
  }
};

const handleUpdateSuccess = function* handleUpdateEventSuccess() {
		yield put(createEventReset());
		yield put(fetchEventRequest());
};



const handleDeleteRequest = function* handleDeleteCalendarEvent({ data }) {

  const response = yield Services.deleteCalendarEvent(data);
  const { success, error } = response;

  if (success) {
		yield put(deleteEventSuccess());
  } else {
      console.log('error deleting event!', error);
  }
};

const handleDeleteSuccess = function* handleDeleteEventSuccess() {
		yield put(fetchEventRequest());
};

const handleRegisterRequest = function* handleRegisterCalendarEvent({ data }) {

    const response = yield Services.registerCalendarEvent(data.eventId, data.attendeeId);
  const { success, error } = response;

  if (success) {
		yield put(registerEventSuccess());
  } else {
      console.log('error registering for event!', error);
  }
};

const handleRegisterSuccess = function* handleRegisterEventSuccess() {
		yield put(fetchEventRequest());
};

const handleDeRegisterRequest = function* handleDeRegisterCalendarEvent({ data }) {

    const response = yield Services.deregisterCalendarEvent(data.eventId, data.attendeeId);
  const { success, error } = response;

  if (success) {
		yield put(deregisterEventSuccess());
  } else {
      console.log('error deregistering for event!', error);
  }
};

const handleDeRegisterSuccess = function* handleDeRegisterEventSuccess() {
		yield put(fetchEventRequest());
};


const root = function* root() {
	yield takeLatest(FETCH_EVENT.REQUEST, handleFetchRequest);
	yield takeLatest(CREATE_EVENT.REQUEST, handleCreateRequest);
	yield takeLatest(CREATE_EVENT.SUCCESS, handleCreateSuccess);
	yield takeLatest(UPDATE_EVENT.REQUEST, handleUpdateRequest);
	yield takeLatest(UPDATE_EVENT.SUCCESS, handleUpdateSuccess);
	yield takeLatest(DELETE_EVENT.REQUEST, handleDeleteRequest);
	yield takeLatest(DELETE_EVENT.SUCCESS, handleDeleteSuccess);
	yield takeLatest(REGISTER_EVENT.REQUEST, handleRegisterRequest);
	yield takeLatest(REGISTER_EVENT.SUCCESS, handleRegisterSuccess);
	yield takeLatest(DE_REGISTER_EVENT.REQUEST, handleDeRegisterRequest);
	yield takeLatest(DE_REGISTER_EVENT.SUCCESS, handleDeRegisterSuccess);
};

export default root;
