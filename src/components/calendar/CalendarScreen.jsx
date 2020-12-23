import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Navbar from "../ui/Navbar";
import CalendarEvent from "./CalendarEvent";
import { useState } from "react";
import CalendarModal from "./CalendarModal";

const localizer = momentLocalizer(moment);

const events = [
    {
        title: "Boss's Happy Birthday",
        start: moment().toDate(), // like new Date()
        end: moment().add(2, "hours").toDate(),
        bgColor: "#000",
        notes: "Buy some Cake",
        user: {
            _id: "123",
            name: "Juancho",
        },
    },
];

const CalendarScreen = () => {
    const [lastView, setLastView] = useState(
        localStorage.getItem("lastView") || "month"
    );

    const onDoubleClick = (ev) => {
        console.log(ev);
    };

    const onSelect = (ev) => {
        console.log(ev);
    };

    const onViewChange = (ev) => {
        setLastView(ev);
        localStorage.setItem("lastView", ev);
    };

    const eventStyleGetter = (event, start, end, isSelected) => {
        const style = {
            backgroundColor: "#367cf7",
            borderRadius: "0px",
            opacity: 0.8,
            display: "block",
            color: "white",
        };

        return {
            style,
        };
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
                view={lastView}
            />

            <CalendarModal />
        </div>
    );
};

export default CalendarScreen;
