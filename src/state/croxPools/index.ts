/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";
import farmsConfig from "config/constants/pools";
import fetchCroxPools from "./fetchCroxPools";
import {
  fetchCroxPoolUserEarnings,
  fetchCroxPoolUserAllowances,
  fetchCroxPoolUserTokenBalances,
  fetchCroxPoolUserStakedBalances,
  fetchCroxPoolUserNextHarvestUntil,
} from "./fetchCroxPoolsUser";
import { FarmsState, Farm } from "../types";

const initialState: FarmsState = { data: [...farmsConfig] };

export const farmsSlice = createSlice({
  name: "CroxPools",
  initialState,
  reducers: {
    setFarmsPublicData: (state, action) => {
      const liveFarmsData: Farm[] = action.payload;
      state.data = state.data.map((farm) => {
        const liveFarmData = liveFarmsData.find((f) => f.pid === farm.pid);
        return { ...farm, ...liveFarmData };
      });
    },
    setFarmUserData: (state, action) => {
      const { arrayOfUserDataObjects } = action.payload;
      arrayOfUserDataObjects.forEach((userDataEl) => {
        const { index } = userDataEl;
        state.data[index] = { ...state.data[index], userData: userDataEl };
      });
    },
  },
});

// Actions
export const { setFarmsPublicData, setFarmUserData } = farmsSlice.actions;

// Thunks
export const fetchCroxPoolsPublicDataAsync = () => async (dispatch) => {
  const farms = await fetchCroxPools();
  dispatch(setFarmsPublicData(farms));
};
export const fetchCroxPoolUserDataAsync = (account) => async (dispatch) => {
  const userFarmAllowances = await fetchCroxPoolUserAllowances(account);
  const userFarmTokenBalances = await fetchCroxPoolUserTokenBalances(account);
  const userStakedBalances = await fetchCroxPoolUserStakedBalances(account);
  const userFarmEarnings = await fetchCroxPoolUserEarnings(account);
  const userNextHarvestUntil = await fetchCroxPoolUserNextHarvestUntil(account);

  const arrayOfUserDataObjects = userFarmAllowances.map(
    (farmAllowance, index) => {
      return {
        index,
        allowance: userFarmAllowances[index],
        tokenBalance: userFarmTokenBalances[index],
        stakedBalance: userStakedBalances[index],
        earnings: userFarmEarnings[index],
        nextHarvestUntil: userNextHarvestUntil[index],
      };
    }
  );

  dispatch(setFarmUserData({ arrayOfUserDataObjects }));
};

export default farmsSlice.reducer;
