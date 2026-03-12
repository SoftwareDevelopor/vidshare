"use client"
import { createSlice } from "@reduxjs/toolkit";

export let searchSlice = createSlice({
    name: "searchresults",
    initialState: {
        searchVideos: localStorage.getItem("searchVideos") ? JSON.parse(localStorage.getItem("searchVideos")) : []
    },
    reducers: {
        searchVideos: function(state, { payload }) {
            state.searchVideos = payload.searchVideos;
            if (payload.searchVideos) {
                localStorage.setItem("searchVideos", JSON.stringify(payload.searchVideos));
            }
        }
    }
});

export default searchSlice.reducer;
export const { searchVideos } = searchSlice.actions;