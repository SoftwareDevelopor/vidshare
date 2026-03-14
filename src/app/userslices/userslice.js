"use client"
import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";


export let userslice = createSlice({
    name: "user",
    initialState: {
        token: Cookies.get("token") || null,
        channel:Cookies.get("channel")|| false
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
        },
        channelState: function(state, { payload }){
            state.channel=payload.channel;
            if(payload.channel){
                Cookies.set("channel",payload.channel);
            }
        }
    }
});

export default userslice.reducer;
export const { userDetails, logout, channelState } = userslice.actions;