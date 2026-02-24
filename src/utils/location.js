import { State } from "country-state-city";

export const getCountryName = (countryCode) => {
  if (!countryCode) return "";
  try {
    const regionNames = new Intl.DisplayNames(['es'], { type: 'region' });
    return regionNames.of(countryCode.toUpperCase());
  } catch (error) {
    console.warn("Error:", error)
    return countryCode; 
  }
};

export const getStateName = (countryCode, stateCode) => {
  if (!countryCode || !stateCode) return "";
  
  const state = State.getStateByCodeAndCountry(stateCode, countryCode);
  return state ? state.name : stateCode;
};

export const formatLocation = (countryCode, stateCode, cityName) => {
  const country = getCountryName(countryCode);
  const state = getStateName(countryCode, stateCode);
  
  const parts = [cityName, state, country].filter(Boolean);

  return parts.length > 0 ? parts.join(", ") : "Ubicación desconocida";
};