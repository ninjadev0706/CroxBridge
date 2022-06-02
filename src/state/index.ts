import { configureStore } from "@reduxjs/toolkit";
import farmsReducer from "./farms";
import croxPoolsReducer from "./croxPools";
import poolsReducer from "./pools";

export default configureStore({
  devTools: process.env.NODE_ENV !== "production",
  reducer: {
    farms: farmsReducer,
    pools: poolsReducer,
    croxPools: croxPoolsReducer,
  },
});
