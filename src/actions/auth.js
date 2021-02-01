import { fetchWithoutToken, fetchWithToken } from "../helpers/fetch";
import { types } from "../types/types";
import Swal from "sweetalert2";
import { eventLogout } from "./events";

export const startLogin = (email, password) => {
    return async (dispatch) => {
        try {
            const resp = await fetchWithoutToken(
                "auth",
                { email, password },
                "POST"
            );
            const body = await resp.json();

            if (body.ok) {
                localStorage.setItem("token", body.token);
                localStorage.setItem("token-init-date", new Date().getTime());

                dispatch(
                    login({
                        uid: body.uid,
                        name: body.name,
                    })
                );
            } else {
                Swal.fire("Error", body.msg, "error");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };
};

export const startRegister = (email, password, name) => {
    return async (dispatch) => {
        try {
            const resp = await fetchWithoutToken(
                "auth/new",
                { email, password, name },
                "POST"
            );
            const body = await resp.json();

            if (body.ok) {
                localStorage.setItem("token", body.token);
                localStorage.setItem("token-init-date", new Date().getTime());

                dispatch(
                    login({
                        uid: body.uid,
                        name: body.name,
                    })
                );
            } else {
                Swal.fire("Error", body.msg, "error");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };
};

export const startChecking = () => {
    return async (dispatch) => {
        try {
            const resp = await fetchWithToken("auth/renew");
            const body = await resp.json();

            if (body.ok) {
                localStorage.setItem("token", body.token);
                localStorage.setItem("token-init-date", new Date().getTime());

                dispatch(
                    login({
                        uid: body.uid,
                        name: body.name,
                    })
                );
            } else {
                dispatch(checkingFinish());
            }
        } catch (error) {
            console.error("Error startChecking :", error);
            dispatch(checkingFinish());
        }
    };
};

const checkingFinish = () => ({
    type: types.authCheckingFinish,
});

const login = (user) => ({
    type: types.authLogin,
    payload: user,
});

export const startLogout = () => {
    return (dispatch) => {
        localStorage.clear();
        dispatch(eventLogout());
        dispatch(logout());
    };
};

const logout = () => ({
    type: types.authLogout,
});
