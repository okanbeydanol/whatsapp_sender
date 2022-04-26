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
  },
});

export const {COUNTRY_CHANGE} = countrySlice.actions;

export const getCountryStore = (state: {country: CountryResult}) =>
  state.country;

export default countrySlice.reducer;
