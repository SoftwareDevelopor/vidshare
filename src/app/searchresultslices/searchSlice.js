"use client"
import { createSlice } from "@reduxjs/toolkit";

export let searchSlice = createSlice({
    name: "searchresults",
    initialState: {
        searchVideos: (typeof window !== 'undefined' && localStorage.getItem("searchVideos")) ? JSON.parse(localStorage.getItem("searchVideos")) : []
    },
    reducers: {
        searchVideos: function(state, { payload }) {
            state.searchVideos = payload.searchVideos;
            if (typeof window !== 'undefined' && payload.searchVideos) {
                localStorage.setItem("searchVideos", JSON.stringify(payload.searchVideos));
            }
        }
    }
});

export default searchSlice.reducer;
export const { searchVideos } = searchSlice.actions;