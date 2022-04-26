import Contacts, {
  Contact,
  PhoneNumber,
  PostalAddress,
} from 'react-native-contacts';
import countries from '../assets/countries_details.json';

export const organizeContact = (ownerGuid: string): Promise<any> => {
  return new Promise(resolve => {
    getAllContact()
      .then(async (contacts: Contact[]) => {
        const contactData: OwnerResponse[] = [];
        await contacts
          .reduce(
            (lastPromise, contact) =>
              lastPromise.then(async () => {
                const data: OwnerResponse = {
                  contactGuid: null,
                  ownerGuid,
                  name: null,
                  lastName: null,
                  fullName: null,
                  image: null,
                  contacts: [],
                };
                data.fullName = contact.givenName + contact.familyName;
                data.lastName = contact.familyName;
                data.name = contact.givenName;
                let availableNumber = null;
                if (
                  contact.postalAddresses &&
                  contact.postalAddresses.length > 0 &&
                  contact.phoneNumbers
                ) {
                  availableNumber = await getAvailableNumberWithAddress(
                    contact.phoneNumbers,
                    contact.postalAddresses,
                  );
                } else if (contact.phoneNumbers) {
                  availableNumber = await getAvailableNumber(
                    contact.phoneNumbers,
                  );
                }

                if (availableNumber && !availableNumber.error) {
                  data.contacts = availableNumber.numbers;
                  contactData.push(data);
                }
              }),
            Promise.resolve(),
          )
          .finally(async () => {
            resolve({error: false, contacs: contactData});
          })
          .catch(async error => {
            resolve({error: true, message: error.message});
          });
      })
      .catch((error: any) => {
        resolve({error: true, message: error.message});
      });
  });
};

const getAvailableNumberWithAddress = async (
  phoneNumbers: PhoneNumber[],
  addresses: PostalAddress[],
): Promise<any> => {
  return new Promise(async resolve => {
    const numbers: {digit: any; countryCode: null; areaCode: null}[] = [];
    const numberPattern = /\d+/g;
    if (phoneNumbers && phoneNumbers.length > 0) {
      await phoneNumbers
        .reduce(
          (lastPromise, phone) =>
            lastPromise.then(async () => {
              if (phone.number.match(numberPattern) !== null) {
                const cleanPhone: any = {
                  digit: phone.number.match(numberPattern)?.join(''),
                  countryCode: null,
                  areaCode: null,
                };
                await addresses
                  .reduce(
                    (lastPromiseAddresses, address) =>
                      lastPromiseAddresses.then(async () => {
                        if (address.region) {
                          const findCountry = countries.find(
                            o =>
                              o.value.toLowerCase() ===
                              address.region.toLowerCase(),
                          );
                          if (findCountry) {
                            const areaCode = findCountry.label;
                            const search = cleanPhone.digit?.startsWith(
                              areaCode.split('+')[1],
                            );
                            if (search) {
                              cleanPhone.digit = cleanPhone.digit?.split(
                                areaCode.split('+')[1],
                              )[1];
                            }
                          }
                        }
                      }),
                    Promise.resolve(),
                  )
                  .finally(() => {
                    const findType = addresses.find(
                      o => o.label === phone.label,
                    );
                    if (findType) {
                      const findCountry = countries.find(
                        o =>
                          o.value.toLowerCase() ===
                          findType.region.toLowerCase(),
                      );
                      if (findCountry) {
                        cleanPhone.areaCode = findCountry.label;
                        cleanPhone.countryCode =
                          findCountry.value.toLowerCase();
                      }
                    } else {
                      const findHome = addresses.find(o => o.label === 'home');
                      if (findHome) {
                        const findCountry = countries.find(
                          o =>
                            o.value.toLowerCase() ===
                            findHome.region.toLowerCase(),
                        );
                        if (findCountry) {
                          cleanPhone.areaCode = findCountry.label;
                          cleanPhone.countryCode =
                            findCountry.value.toLowerCase();
                        }
                      } else {
                        const findAdress = addresses[0];
                        if (findAdress) {
                          const findCountry = countries.find(
                            o =>
                              o.value.toLowerCase() ===
                              findAdress.region.toLowerCase(),
                          );
                          if (findCountry) {
                            cleanPhone.areaCode = findCountry.label;
                            cleanPhone.countryCode =
                              findCountry.value.toLowerCase();
                          }
                        }
                      }
                    }
                    numbers.push(cleanPhone);
                  })
                  .catch(async error => {
                    resolve({error: true, message: error.message});
                  });
              }
            }),
          Promise.resolve(),
        )
        .finally(async () => {
          resolve({error: false, numbers});
        })
        .catch(async error => {
          resolve({error: true, message: error.message});
        });
    }
  });
};
const getAvailableNumber = async (
  phoneNumbers: PhoneNumber[],
): Promise<any> => {
  return new Promise(async resolve => {
    const numbers: any = [];
    const numberPattern = /\d+/g;
    if (phoneNumbers && phoneNumbers.length > 0) {
      await phoneNumbers
        .reduce(
          (lastPromise, phone) =>
            lastPromise.then(async () => {
              const cleanPhone: any = {
                digit: phone.number.match(numberPattern)?.join(''),
                countryCode: null,
                areaCode: null,
              };

              const findCountryWithNumber = countries.find(o =>
                cleanPhone.digit?.startsWith(o.label.split('+')[1]),
              );
              if (findCountryWithNumber) {
                cleanPhone.digit = cleanPhone.digit.split(
                  findCountryWithNumber.label.split('+')[1],
                )[1];
                cleanPhone.countryCode =
                  findCountryWithNumber.value.toLowerCase();
                cleanPhone.areaCode = findCountryWithNumber.label;
              }
              numbers.push(cleanPhone);
            }),
          Promise.resolve(),
        )
        .finally(async () => {
          resolve({error: false, numbers});
        })
        .catch(async error => {
          resolve({error: true, message: error.message});
        });
    }
  });
};

const getAllContact = async () => {
  return await Contacts.getAll();
};

export type OwnerResponse = {
  contactGuid: string | null;
  ownerGuid: string | null;
  name: string | null;
  fullName: string | null;
  lastName: string | null;
  image?: ArrayBufferLike | null;
  contacts?: OwnerPhonesResponse[] | null;
};
export type OwnerPhonesResponse = {
  contactGuid: string | null;
  digit: string | null;
  areaCode: string | null;
  countryCode: string | null;
};
