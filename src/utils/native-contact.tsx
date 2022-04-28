import Contacts, {
  Contact,
  PhoneNumber,
  PostalAddress,
} from 'react-native-contacts';
import countries from '../assets/countries_details.json';

export const organizeContact = (
  userGuid: string,
  countryCode: string | null,
  phoneNumber: string | null,
): Promise<any> => {
  return new Promise(resolve => {
    getAllContact()
      .then(async (contacts: Contact[]) => {
        const contactData: ContactResponse[] = [];
        await contacts
          .reduce(
            (lastPromise, contact) =>
              lastPromise.then(async () => {
                const data: ContactResponse = {
                  userGuid,
                  name: null,
                  lastName: null,
                  fullName: null,
                  contacts: [],
                };
                data.fullName = contact.givenName + contact.familyName;
                data.lastName = contact.familyName;
                data.name = contact.givenName;
                if (
                  contact.postalAddresses &&
                  contact.postalAddresses.length > 0 &&
                  contact.phoneNumbers
                ) {
                  const availableNumber = await getAvailableNumberWithAddress(
                    contact.phoneNumbers,
                    contact.postalAddresses,
                  );
                  if (availableNumber && !availableNumber.error) {
                    availableNumber.numbers.forEach((number: any) => {
                      data.contacts && data.contacts.push(number);
                    });
                  }
                }

                if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
                  const availableNumber = await getAvailableNumber(
                    contact.phoneNumbers,
                  );
                  if (availableNumber && !availableNumber.error) {
                    availableNumber.numbers.forEach((number: any) => {
                      data.contacts && data.contacts.push(number);
                    });
                  }
                }

                if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
                  const availableNumber = await getAvailableNumberDeepScan(
                    contact.phoneNumbers,
                    countryCode,
                    phoneNumber,
                  );
                  if (availableNumber && !availableNumber.error) {
                    availableNumber.numbers.forEach((number: any) => {
                      data.contacts && data.contacts.push(number);
                    });
                  }
                }

                const cleanData = await cleanContacts(data);
                contactData.push(cleanData);
              }),
            Promise.resolve(),
          )
          .finally(async () => {
            const filtered = contactData.filter(
              (o: any) => o.contacts.length > 0,
            );
            resolve({error: false, contacts: filtered});
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
                  type: null,
                };
                await addresses
                  .reduce(
                    (lastPromiseAddresses, address) =>
                      lastPromiseAddresses.then(async () => {
                        if (address.region) {
                          const findCountry = countries.find(
                            o =>
                              o.value.toLocaleLowerCase() ===
                              address.region.toLocaleLowerCase(),
                          );
                          if (findCountry) {
                            const areaCode = findCountry.label;
                            cleanPhone.countryCode =
                              findCountry.value.toLocaleLowerCase();
                            cleanPhone.areaCode =
                              findCountry.label.split('+')[1];
                            const search = cleanPhone.digit?.startsWith(
                              areaCode.split('+')[1],
                            );
                            if (search) {
                              cleanPhone.digit = cleanPhone.digit
                                .toString()
                                .slice(
                                  +areaCode.split('+')[1].length,
                                  +cleanPhone.digit.length,
                                );
                            }
                          }
                        }

                        if (
                          cleanPhone.countryCode === null &&
                          address.country
                        ) {
                          const findCountry = countries.find(
                            o =>
                              o.value.toLocaleLowerCase() ===
                              address.country.toLocaleLowerCase(),
                          );
                          if (findCountry) {
                            const areaCode = findCountry.label;
                            cleanPhone.countryCode =
                              findCountry.value.toLocaleLowerCase();
                            cleanPhone.areaCode =
                              findCountry.label.split('+')[1];
                            const search = cleanPhone.digit?.startsWith(
                              areaCode.split('+')[1],
                            );
                            if (search) {
                              cleanPhone.digit = cleanPhone.digit
                                .toString()
                                .slice(
                                  +areaCode.split('+')[1].length,
                                  +cleanPhone.digit.length,
                                );
                            }
                          }
                        }

                        if (
                          cleanPhone.countryCode === null &&
                          address.country
                        ) {
                          const findCountry = countries.find(
                            o =>
                              o.country_name.toLocaleLowerCase() ===
                              address.country.toLocaleLowerCase(),
                          );
                          if (findCountry) {
                            const areaCode = findCountry.label;
                            cleanPhone.countryCode =
                              findCountry.value.toLocaleLowerCase();
                            cleanPhone.areaCode =
                              findCountry.label.split('+')[1];
                            const search = cleanPhone.digit?.startsWith(
                              areaCode.split('+')[1],
                            );
                            if (search) {
                              cleanPhone.digit = cleanPhone.digit
                                .toString()
                                .slice(
                                  +areaCode.split('+')[1].length,
                                  +cleanPhone.digit.length,
                                );
                            }
                          }
                        }
                        cleanPhone.type = 'address';
                      }),
                    Promise.resolve(),
                  )
                  .finally(() => {
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
              if (phone.number.match(numberPattern) !== null) {
                const cleanPhone: any = {
                  digit: phone.number.match(numberPattern)?.join(''),
                  countryCode: null,
                  areaCode: null,
                  type: null,
                };

                const findCountryWithNumber = countries.find(o =>
                  cleanPhone.digit?.startsWith(o.label.split('+')[1]),
                );
                if (findCountryWithNumber) {
                  cleanPhone.digit = cleanPhone.digit
                    .toString()
                    .slice(
                      +findCountryWithNumber.label.split('+')[1].length,
                      +cleanPhone.digit.length,
                    );
                  cleanPhone.countryCode =
                    findCountryWithNumber.value.toLocaleLowerCase();
                  cleanPhone.areaCode =
                    findCountryWithNumber.label.split('+')[1];
                }

                cleanPhone.type = 'available';
                numbers.push(cleanPhone);
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
const getAvailableNumberDeepScan = async (
  phoneNumbers: PhoneNumber[],
  countryCode: string | null,
  phoneNumber: string | null,
): Promise<any> => {
  return new Promise(async resolve => {
    const numbers: any = [];
    const numberPattern = /\d+/g;
    const phoneNumberLength = phoneNumber && +phoneNumber?.length;
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

                const country = countries.find(
                  (o: any) =>
                    o.value.toLocaleLowerCase() ===
                    countryCode?.toLocaleLowerCase(),
                );
                if (country) {
                  if (
                    phoneNumberLength !== null &&
                    +phoneNumberLength === +cleanPhone.digit.length
                  ) {
                    cleanPhone.countryCode = country.value.toLocaleLowerCase();
                    cleanPhone.areaCode = country.label.split('+')[1];
                  }

                  if (
                    cleanPhone.countryCode === null &&
                    phoneNumberLength !== null &&
                    +phoneNumberLength < +cleanPhone.digit.length
                  ) {
                    const search = cleanPhone.digit?.startsWith(
                      country.label.split('+')[1],
                    );
                    if (search) {
                      cleanPhone.countryCode =
                        country.value.toLocaleLowerCase();
                      cleanPhone.areaCode = country.label.split('+')[1];
                      cleanPhone.digit = cleanPhone.digit
                        .toString()
                        .slice(
                          +country.label.split('+')[1].length,
                          +cleanPhone.digit.length,
                        );
                    }
                  }
                  if (
                    cleanPhone.countryCode === null &&
                    phoneNumberLength !== null &&
                    +phoneNumberLength < +cleanPhone.digit.length
                  ) {
                    const diff = +cleanPhone.digit.length - +phoneNumberLength;
                    const cleanPhoneNumber = cleanPhone.digit
                      .toString()
                      .slice(+diff, +cleanPhone.digit.length);
                    const cleanAreaCode = cleanPhone.digit
                      .toString()
                      .slice(0, +diff);

                    const findCountry = countries.find(
                      o => o.label.split('+')[1] === cleanAreaCode,
                    );
                    if (findCountry) {
                      cleanPhone.digit = cleanPhoneNumber;
                      cleanPhone.countryCode =
                        findCountry.value.toLocaleLowerCase();
                      cleanPhone.areaCode = findCountry.label.split('+')[1];
                    }
                  }

                  if (
                    cleanPhone.countryCode === null &&
                    phoneNumberLength !== null &&
                    +phoneNumberLength < +cleanPhone.digit.length
                  ) {
                    const diff = +cleanPhone.digit.length - +phoneNumberLength;

                    const cleanPhoneNumber = cleanPhone.digit
                      .toString()
                      .slice(+diff, +cleanPhone.digit.length);

                    cleanPhone.digit = cleanPhoneNumber;
                    cleanPhone.countryCode = country.value.toLocaleLowerCase();
                    cleanPhone.areaCode = country.label.split('+')[1];
                  }
                }
                cleanPhone.type = 'availableDeep';
                numbers.push(cleanPhone);
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
const cleanContacts = async (
  contact: ContactResponse,
): Promise<ContactResponse> => {
  return new Promise(async resolve => {
    if (contact.contacts !== null && contact.contacts !== undefined) {
      contact.contacts = contact.contacts.filter(
        o => o.areaCode !== null && o.digit.length > 5,
      );
      let uniqueChars: any = [];
      contact.contacts.forEach(c => {
        if (uniqueChars.length === 0) {
          uniqueChars.push(c);
        } else {
          const findIndex = uniqueChars.findIndex(
            (o: any) => +o.digit === +c.digit && o.areaCode === c.areaCode,
          );
          if (findIndex === -1) {
            uniqueChars.push(c);
          }
        }
      });
      contact.contacts = uniqueChars;
      resolve(contact);
    }
  });
};

const getAllContact = async () => {
  return await Contacts.getAll();
};

export type ContactResponse = {
  userGuid: string | null;
  name: string | null;
  fullName: string | null;
  lastName: string | null;
  image?: ArrayBufferLike | null;
  contacts?: ContactPhonesResponse[] | null;
};
export type ContactPhonesResponse = {
  digit: string;
  areaCode: string;
  countryCode: string;
  type: string;
};
