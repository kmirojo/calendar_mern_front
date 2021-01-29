import { types } from "../types/types";
import { fetchWithToken } from "../helpers/fetch";
import { prepareEvents } from "../helpers/prepareEvents";
import Swal from "sweetalert2";

export const eventStartAddNew = (event) => {
    return async (dispatch, getState) => {
        const { uid, name } = getState().auth;

        try {
            const resp = await fetchWithToken("events", event, "POST");
            const body = await resp.json();

            if (body.ok) {
                event.id = body.event.id;
                event.user = {
                    _id: uid,
                    name,
                };
                console.log(event);
                dispatch(eventAddNew(event));
            }
        } catch (error) {
            console.error("New Event:", error);
        }
    };
};

const eventAddNew = (event) => ({
    type: types.eventAddNew,
    payload: event,
});

export const eventSetActive = (event) => ({
    type: types.eventSetActive,
    payload: event,
});

export const eventStartUpdate = (event) => {
    return async (dispatch) => {
        try {
            const resp = await fetchWithToken(
                `events/${event.id}`,
                event,
                "PUT"
            );
            const body = await resp.json();

            if (body.ok) {
                dispatch(eventUpdated(event));
            } else {
                Swal.fire("Error", body.msg, "error");
            }
        } catch (error) {
            console.log(error);
        }
    };
};

const eventUpdated = (event) => ({
    type: types.eventUpdated,
    payload: event,
});

export const eventDeleted = () => ({ type: types.eventDeleted });

export const eventStartedLoading = () => {
    return async (dispatch) => {
        try {
            const resp = await fetchWithToken("events");
            const body = await resp.json();

            const events = prepareEvents(body.events);

            console.log(events);

            dispatch(eventsLoaded(events));
        } catch (error) {
            console.log(error);
        }
    };
};

const eventsLoaded = (events) => ({
    type: types.eventLoaded,
    payload: events,
});