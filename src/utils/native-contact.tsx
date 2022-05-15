import countries from '../assets/countries_details.json';
import uuid from 'react-native-uuid';
import {
  getAll,
  Contact,
  PhoneNumber,
  PostalAddress,
} from 'react-native-whatsapp-contacts-manager';

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
                  recordID: 0,
                  userGuid,
                  name: null,
                  lastName: null,
                  fullName: null,
                  contacts: [],
                };
                data.fullName = contact.displayName;
                data.lastName = contact.familyName;
                data.name = contact.givenName;
                data.recordID = +contact.recordID;
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
    const numbers: ContactPhonesResponse[] = [];
    const numberPattern = /\d+/g;
    if (phoneNumbers && phoneNumbers.length > 0) {
      await phoneNumbers
        .reduce(
          (lastPromise, phone: PhoneNumber) =>
            lastPromise.then(async () => {
              if (phone.number.match(numberPattern) !== null) {
                const cleanPhone: ContactPhonesResponse = {
                  id: +phone.id,
                  contact_phone_guid: uuid.v4().toString(),
                  digit:
                    phone.number.match(numberPattern)?.join('').toString() ||
                    '',
                  areaCode: null,
                  countryCode: null,
                  type: null,
                };
                await addresses
                  .reduce(
                    (lastPromiseAddresses, address: PostalAddress) =>
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
    const numbers: ContactPhonesResponse[] = [];
    const numberPattern = /\d+/g;
    if (phoneNumbers && phoneNumbers.length > 0) {
      await phoneNumbers
        .reduce(
          (lastPromise, phone) =>
            lastPromise.then(async () => {
              if (phone.number.match(numberPattern) !== null) {
                const cleanPhone: ContactPhonesResponse = {
                  id: +phone.id,
                  contact_phone_guid: uuid.v4().toString(),
                  digit:
                    phone.number.match(numberPattern)?.join('').toString() ||
                    '',
                  areaCode: null,
                  countryCode: null,
                  type: null,
                };

                const findCountryWithNumber = countries.find(o =>
                  cleanPhone.digit?.startsWith(o.label.split('+')[1]),
                );
                if (findCountryWithNumber) {
                  const exampleLength = findCountryWithNumber.number_example
                    .match(numberPattern)
                    ?.join('').length;
                  const numberLength = cleanPhone.digit
                    .toString()
                    .slice(
                      +findCountryWithNumber.label.split('+')[1].length,
                      +cleanPhone.digit.length,
                    ).length;
                  if (Math.abs((exampleLength || 0) - numberLength) < 2) {
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
    const numbers: ContactPhonesResponse[] = [];
    const numberPattern = /\d+/g;
    const phoneNumberLength = phoneNumber && +phoneNumber?.length;
    if (phoneNumbers && phoneNumbers.length > 0) {
      await phoneNumbers
        .reduce(
          (lastPromise, phone) =>
            lastPromise.then(async () => {
              if (phone.number.match(numberPattern) !== null) {
                const cleanPhone: ContactPhonesResponse = {
                  // ID exist but typescript core responder doesnt exist
                  id: +phone.id,
                  contact_phone_guid: uuid.v4().toString(),
                  digit:
                    phone.number.match(numberPattern)?.join('').toString() ||
                    '',
                  areaCode: null,
                  countryCode: null,
                  type: null,
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
      let uniqueChars: ContactPhonesResponse[] = [];
      contact.contacts.forEach((c: ContactPhonesResponse) => {
        if (uniqueChars.length === 0) {
          uniqueChars.push(c);
        } else {
          const findIndex = uniqueChars.findIndex(
            (o: ContactPhonesResponse) =>
              +o.digit === +c.digit && o.areaCode === c.areaCode,
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
  return await getAll();
};

export const contactsGetDiffForDatabase = async (
  databaseContacts: DatabaseContactResponse[],
  contactsStore: ContactResponse[],
): Promise<{contactsToUpload: any}> => {
  return new Promise(resolve => {
    if (databaseContacts && contactsStore && contactsStore.length > 0) {
      const contactsToUpload: any = [];
      contactsStore.forEach(contact => {
        const findIndex = databaseContacts.findIndex(
          (o: DatabaseContactResponse) => +o.contact_id === +contact.recordID,
        );
        if (findIndex !== -1) {
          let isItChangeInfo = false;
          let isItChangeContacts = false;
          const dContact = databaseContacts[findIndex];
          const nContact = contact;

          nContact.contacts?.forEach((n: ContactPhonesResponse) => {
            const findPhoneIndex = dContact.contact_phones?.findIndex(
              (o: DatabaseContactPhonesResponse) =>
                +o.contact_phone_id === +n.id && o.digit === n.digit,
            );
            if (findPhoneIndex === -1) {
              isItChangeContacts = true;
            }
          });

          if (
            (contact.fullName !== null &&
              dContact.full_name !== null &&
              contact.fullName?.trim() !== dContact.full_name?.trim()) ||
            (contact.lastName !== null &&
              dContact.last_name !== null &&
              contact.lastName?.trim() !== dContact.last_name?.trim()) ||
            (contact.name != null &&
              dContact.name !== null &&
              contact.name?.trim() !== dContact.name?.trim())
          ) {
            contact.fullName = dContact.full_name;
            contact.lastName = dContact.last_name;
            contact.name = dContact.name;
            isItChangeInfo = true;
          }

          if (isItChangeInfo || isItChangeContacts) {
            contactsToUpload.push({type: 'updated', data: contact});
          }
        } else {
          contactsToUpload.push({type: 'new', data: contact});
        }
        resolve({contactsToUpload: contactsToUpload});
      });
    } else {
      resolve({contactsToUpload: []});
    }
  });
};
export type ContactResponse = {
  userGuid: string | null;
  name: string | null;
  fullName: string | null;
  lastName: string | null;
  recordID: number;
  contacts: ContactPhonesResponse[] | null;
};
export type ContactPhonesResponse = {
  id: number;
  digit: string;
  contact_phone_guid: string;
  areaCode: string | null;
  countryCode: string | null;
  type: string | null;
};
export type DatabaseContactResponse = {
  id: number;
  contact_id: string;
  user_guid: string;
  name: string;
  full_name: string;
  active: number;
  checked: boolean | undefined;
  last_name: string;
  contact_phones: DatabaseContactPhonesResponse[];
  created_at: string;
  deleted_at: string;
  updated_at: string;
};
export type DatabaseContactPhonesResponse = {
  id: number;
  contact_id: string;
  contact_phone_guid: string;
  contact_phone_id: string;
  digit: string;
  active: number;
  area_code: string;
  country_code: string;
  type: string;
  created_at: string;
  deleted_at: string;
  updated_at: string;
};
