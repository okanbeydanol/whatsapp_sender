import {TOMTOMAPIKEY} from '../constants';
import {getData} from './async-storage';

export const reverseGeocode = async (
  latLng: IlatLng,
): Promise<GeocoderResult> => {
  return new Promise((resolve, reject): any => {
    getData('[geocoderApiResult]').then(result => {
      if (result !== null) {
        console.log('%c Storage Geldi', 'background: #222; color: #bada55');
        resolve(result);
      } else {
        console.log('%c PARA GITTI', 'background: #222; color: #bada55');
        const api = `https://api.tomtom.com/search/2/reverseGeocode/${latLng.latitude},${latLng.longitude}.json?key=${TOMTOMAPIKEY}`;
        fetch(api)
          .then(async (data: Response) => {
            const geocoderResult: GeocoderResult = await data.json();
            resolve(geocoderResult);
          })
          .catch(() => {
            reject();
          });
      }
    });
  });
};

export type GeocoderResult = {
  summary: string | null;
  addresses: AddressesResult[];
};

export type SummaryResult = {
  queryTime: number;
  numResults: number;
};

export type AddressesResult = {
  address: AddressResult;
  position: string;
};

export type AddressResult = {
  buildingNumber: string;
  streetNumber: string;
  routeNumbers?: Array<any>;
  street: string;
  streetName: string;
  streetNameAndNumber: string;
  countryCode: string;
  municipality: string;
  countrySecondarySubdivision: string;
  countrySubdivisionName: string;
  postalCode: string;
  municipalitySubdivision: string;
  country: string;
  countryCodeISO3: string;
  freeformAddress: string;
  boundingBox: BoundingBoxResult;
  localName: string;
};

export type BoundingBoxResult = {
  northEast: string;
  southWest: string;
  entity: string;
};

export type IlatLng = {
  latitude: number;
  longitude: number;
};
