"use client"
import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";


export let userslice = createSlice({
    name: "user",
    initialState: {
        token: Cookies.get("token") || null
    },
    reducers: {
        userDetails: function(state, { payload }) {
            state.token = payload.token;
            if (payload.token) {
                Cookies.set("token", payload.token);
            }
        },
        logout: function(state) {
            state.token = null;
            Cookies.remove("token");
        }
    }
});

export default userslice.reducer;
export const { userDetails, logout } = userslice.actions;