import searchSlice from "../searchresultslices/searchSlice";
import userslice  from "../userslices/userslice";
const { configureStore } = require("@reduxjs/toolkit");

let myStore=configureStore({
    reducer:{
        userdetails: userslice,
        searchVideos: searchSlice,
        channel:channelState
    }
})

export default myStore;