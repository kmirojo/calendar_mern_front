import { types } from "../types/types";

// {
//     id: "adasdasdasdasd",
//     title: "Boss's Happy Birthday",
//     start: moment().toDate(),
//     end: moment().add(2, "hours").toDate(),
//     notes: "Buy some Cake",
//     user: {
//         _id: "123",
//         name: "Juancho",
//     },
// }

const initialState = {
    events: [],
    activeEvent: null,
};

export const calendarReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.eventSetActive:
            return {
                ...state,
                activeEvent: action.payload,
            };

        case types.eventAddNew:
            return {
                ...state,
                events: [...state.events, action.payload],
            };

        case types.eventUpdated:
            return {
                ...state,
                events: state.events.map((ev) =>
                    ev.id === action.payload.id ? action.payload : ev
                ),
            };

        case types.eventDeleted:
            return {
                ...state,
                events: state.events.filter(
                    (ev) => ev.id !== state.activeEvent.id
                ),
                activeEvent: null,
            };

        case types.eventLoaded:
            return {
                ...state,
                events: [...action.payload],
            };

        case types.eventLogout:
            return {
                ...initialState,
            };

        default:
            return state;
    }
};
