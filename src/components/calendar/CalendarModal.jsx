import React, { useState } from "react";
import Modal from "react-modal";
import DateTimePicker from "react-datetime-picker";
import moment from "moment";
import Swal from "sweetalert2";
import { useSelector, useDispatch } from "react-redux";
import { uiCloseModal } from "../../actions/ui";
import {
    eventSetActive,
    eventStartUpdate,
    eventStartAddNew,
} from "../../actions/events";
import { useEffect } from "react";

const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
    },
};

Modal.setAppElement("#root");

const now = moment().minutes(0).seconds(0).add(1, "hours"); // Actual time
const nowPlus1 = now.clone().add(1, "hours"); // Actual time + 1 hour

const initEvent = {
    title: "",
    notes: "",
    start: now.toDate(),
    end: nowPlus1.toDate(),
};

const CalendarModal = () => {
    const { isModalOpen } = useSelector((state) => state.ui);
    const { activeEvent } = useSelector((state) => state.calendar);
    const dispatch = useDispatch();

    const [dateStart, setDateStart] = useState(now.toDate());
    const [dateEnd, setDateEnd] = useState(nowPlus1.toDate());
    const [isTitleValid, setIsTitleValid] = useState(true);

    const [formValues, setFormValues] = useState(initEvent);

    const { notes, title, start, end } = formValues;

    useEffect(() => {
        if (activeEvent) {
            setFormValues(activeEvent);
        } else {
            setFormValues(initEvent);
        }
    }, [activeEvent, setFormValues]);

    const handleInputChange = ({ target }) => {
        setFormValues({
            ...formValues,
            [target.name]: target.value,
        });
    };

    const closeModal = () => {
        dispatch(uiCloseModal());
        setFormValues(initEvent);
        dispatch(eventSetActive(null));
    };

    const handleStartDateChange = (ev) => {
        setDateStart(ev);
        setFormValues({
            ...formValues,
            start: ev,
        });
    };

    const handleEndDateChange = (ev) => {
        setDateEnd(ev);

        setFormValues({
            ...formValues,
            end: ev,
        });
    };

    const handleSubmitForm = (ev) => {
        ev.preventDefault();

        const momentStart = moment(start);
        const momentEnd = moment(end);

        if (momentStart.isSameOrAfter(momentEnd)) {
            return Swal.fire(
                "Error",
                "End date must be after the start date",
                "error"
            );
        }

        if (title.trim().length < 2) {
            return setIsTitleValid(false);
        }

        // If selected event exists update it, if not, add it
        if (activeEvent) {
            dispatch(eventStartUpdate(formValues));
        } else {
            // formValues.end = dateEnd
            dispatch(eventStartAddNew(formValues));
        }

        setIsTitleValid(true);
        closeModal();
    };

    const setTitle = activeEvent ? "Event Edit" : "New Event";

    return (
        <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            style={customStyles}
            closeTimeoutMS={200}
            contentLabel="Example Modal"
            className="modal"
            overlayClassName="modal-fondo"
        >
            <h1> {setTitle} </h1>
            <hr />
            <form className="container" onSubmit={handleSubmitForm}>
                <div className="form-group">
                    <label>Fecha y hora inicio</label>
                    <DateTimePicker
                        onChange={handleStartDateChange}
                        value={dateStart}
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label>Fecha y hora fin</label>
                    <DateTimePicker
                        onChange={handleEndDateChange}
                        value={dateEnd}
                        minDate={dateStart}
                        className="form-control"
                    />
                </div>

                <hr />
                <div className="form-group">
                    <label>Titulo y notas</label>
                    <input
                        type="text"
                        className={`form-control ${
                            !isTitleValid && "is-invalid"
                        }`}
                        placeholder="Título del evento"
                        name="title"
                        autoComplete="off"
                        value={title}
                        onChange={handleInputChange}
                    />
                    <small id="emailHelp" className="form-text text-muted">
                        Una descripción corta
                    </small>
                </div>

                <div className="form-group">
                    <textarea
                        type="text"
                        className="form-control"
                        placeholder="Notas"
                        rows="5"
                        name="notes"
                        value={notes}
                        onChange={handleInputChange}
                    ></textarea>
                    <small id="emailHelp" className="form-text text-muted">
                        Información adicional
                    </small>
                </div>

                <button
                    type="submit"
                    className="btn btn-outline-primary btn-block"
                >
                    <i className="far fa-save"></i>
                    <span> Guardar</span>
                </button>
            </form>
        </Modal>
    );
};

export default CalendarModal;
