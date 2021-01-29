import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Navbar from "../ui/Navbar";
import CalendarEvent from "./CalendarEvent";
import { useState } from "react";
import CalendarModal from "./CalendarModal";
import { useDispatch, useSelector } from "react-redux";
import { uiOpenModal } from "../../actions/ui";
import {
    eventSetActive,
    eventDeleted,
    eventStartedLoading,
} from "../../actions/events";
import AddNewFav from "../ui/AddNewFav";
import DeleteEventFab from "../ui/DeleteEventFab";
import { useEffect } from "react";

const localizer = momentLocalizer(moment);

const CalendarScreen = () => {
    const dispatch = useDispatch();
    const { events, activeEvent } = useSelector((state) => state.calendar);
    const { uid } = useSelector((state) => state.auth);

    const [lastView, setLastView] = useState(
        localStorage.getItem("lastView") || "month"
    );

    useEffect(() => {
        dispatch(eventStartedLoading());
    }, [dispatch]);

    const onDoubleClick = () => {
        dispatch(uiOpenModal());
    };

    const onSelect = (ev) => {
        dispatch(eventSetActive(ev));
    };

    const onViewChange = (ev) => {
        setLastView(ev);
        localStorage.setItem("lastView", ev);
    };

    const eventStyleGetter = (event, start, end, isSelected) => {
        const style = {
            backgroundColor: uid === event.user._id ? "#367cf7" : "#465660",
            borderRadius: "0px",
            opacity: 0.8,
            display: "block",
            color: "white",
        };

        return {
            style,
        };
    };

    const handleEventDelete = () => {
        dispatch(eventDeleted());
        dispatch(eventSetActive(null));
    };

    const getDeleteButton = () => {
        if (activeEvent) {
            return <DeleteEventFab deleteEvent={handleEventDelete} />;
        }
    };

    const onSelectSlot = (ev) => {
        console.log(ev);
        dispatch(eventSetActive(null));
    };

    return (
        <div className="calendar-screen">
            <Navbar />

            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                eventPropGetter={eventStyleGetter}
                components={{
                    event: CalendarEvent,
                }}
                onDoubleClickEvent={onDoubleClick}
                onSelectEvent={onSelect}
                onView={onViewChange}
                onSelectSlot={onSelectSlot}
                selectable={true}
                view={lastView}
            />

            <AddNewFav />
            {getDeleteButton()}

            <CalendarModal />
        </div>
    );
};

export default CalendarScreen;
