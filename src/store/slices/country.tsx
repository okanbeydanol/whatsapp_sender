import {createSlice} from '@reduxjs/toolkit';

export type CountryResult = {
  country_name: string | null;
  label: string | null;
  value: string | null;
  latitude: string | null;
  longitude: string | null;
  city_name: string | null;
};

const initialState: CountryResult = {
  country_name: null,
  label: null,
  value: null,
  latitude: null,
  longitude: null,
  city_name: null,
};

export const countrySlice = createSlice({
  name: 'country',
  initialState,
  reducers: {
    COUNTRY_CHANGE: (state, action) => {
      return action.payload;
    },
    COUNTRY_CHANGE_UPDATE: (state, action) => {
      state.value = action.payload.value;
      state.label = action.payload.label;
      state.country_name = action.payload.country_name;
    },
  },
});

export const {COUNTRY_CHANGE, COUNTRY_CHANGE_UPDATE} = countrySlice.actions;

export const getCountryStore = (state: {country: CountryResult}) =>
  state.country;

export default countrySlice.reducer;
