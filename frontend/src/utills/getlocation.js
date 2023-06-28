import { allcontinents, allcountries } from "../assets/json/location";

const continentsOptions = (isNegative, possibleLocations) => {
  console.log(isNegative, "possibleLocations", possibleLocations);
  const continents = [
    { value: isNegative ? "ALL" : "ALL", label: isNegative ? "ALL" : "ALL" },
  ];
  console.log(continents);
  possibleLocations
    .filter((options) => options.instances > (isNegative ? -1 : 3))
    .forEach((location) => {
      if (!location.value.includes("_")) {
        const existingContinent = allcontinents.find(
          (continent) => continent.code === location.value
        );
        continents.push({
          value: location.value,
          label: existingContinent ? existingContinent.name : location.value,
        });
      }
    });
  return continents;
};
const countriesOptions = (continentCode, isNegative, possibleLocations) => {
  const countries = [
    { value: isNegative ? "ALL" : "ALL", label: isNegative ? "ALL" : "ALL" },
  ];
  possibleLocations
    .filter((options) => options.instances > (isNegative ? -1 : 3))
    .forEach((location) => {
      if (
        !location.value.split("_")[2] &&
        location.value.startsWith(`${continentCode}_`)
      ) {
        const existingCountry = allcountries.find(
          (country) => country.code === location.value.split("_")[1]
        );
        countries.push({
          value: location.value.split("_")[1],
          label: existingCountry
            ? existingCountry.name
            : location.value.split("_")[1],
        });
      }
    });
  return countries;
};
const regionsOptions = (
  continentCode,
  countryCode,
  isNegative,
  possibleLocations
) => {
  const regions = [
    { value: isNegative ? "ALL" : "ALL", label: isNegative ? "ALL" : "ALL" },
  ];
  possibleLocations
    .filter((options) => options.instances > (isNegative ? -1 : 3))
    .forEach((location) => {
      if (location.value.startsWith(`${continentCode}_${countryCode}_`)) {
        regions.push({
          value: location.value.split("_")[2],
          label: location.value.split("_")[2],
        });
      }
    });
  return regions;
};
const getLocation = (geo) => {
  const specifiedLocation = geo.slice(2);
  const locations = specifiedLocation.split("_");
  const continentCode = locations[0];
  const countryCode = locations[1];
  const regionName = locations[2];
  const continentExists = allcontinents.find(
    (continent) => continent.code === continentCode
  ) || { name: "ALL" };
  const countryExists = allcountries.find(
    (country) => country.code === countryCode
  ) || { name: "ALL" };
  console.log(continentExists, countryExists, regionName);
  return continentExists.name + " " + countryExists.name + " " + regionName;
};
export { continentsOptions, countriesOptions, regionsOptions, getLocation };
