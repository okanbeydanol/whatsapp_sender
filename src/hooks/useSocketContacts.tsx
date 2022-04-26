import {io} from 'socket.io-client';
import {USER_CONTACT_DATA, USER_FRIEND} from '../constants';
import {OwnerResponse} from '../utils/native-contact';
const useSocketContacts = () => {
  const connectionConfig = {
    jsonp: false,
    reconnection: true,
    reconnectionDelay: 100,
    reconnectionAttempts: 100000,
    transports: ['websocket'],
  };
  const socket = io('http://192.168.1.20:1414', connectionConfig);

  const get_contacts_DB_socket = (
    organizeContactDatas: OwnerResponse[],
  ): Promise<any> => {
    return new Promise(async resolve => {
      const contacts: any = [];
      await organizeContactDatas
        .reduce(
          (lastPromise, contact) =>
            lastPromise.then(async () => {
              const c = await check_and_get_contact(contact);
              if (!c.error && c.contacts !== null) {
                contacts.push(c.contacts);
              }
            }),
          Promise.resolve(),
        )
        .finally(() => {
          resolve({error: false, contacts});
        })
        .catch(async error => {
          resolve({error: true, message: error.message});
        });
    });
  };

  const check_and_get_contact = async (contact: any): Promise<any> => {
    return new Promise(async resolve => {
      let contacts: any = null;
      await socket.emit(
        USER_CONTACT_DATA,
        contact.contacts,
        async (data: any) => {
          if (data !== null) {
            contacts = {
              contactGuid: data.ownerGuid,
              fullName: data.fullName,
              name: data.name,
              lastName: data.lastName,
              areaCode: data.areaCode,
              countryCode: data.countryCode.toLowerCase(),
              digit: data.digit,
              image: data.image,
              status: data.status,
              connected: data.connected,
            };

            // await openContactDatabase();
            // const dbContactPhone = await getRecordContactPhonesTable({
            //   digit: data.digit,
            //   areaCode: data.areaCode,
            //   countryCode: data.countryCode.toLowerCase(),
            // });

            // if (dbContactPhone.length === 0) {
            //   await insertRecordContactTable({
            //     ownerGuid: contact.ownerGuid,
            //     contactGuid: data.ownerGuid,
            //     fullName: data.fullName,
            //     name: data.name,
            //     lastName: data.lastName,
            //     image: data.image,
            //     contacts: [
            //       {
            //         contactGuid: data.ownerGuid,
            //         areaCode: data.areaCode,
            //         countryCode: data.countryCode.toLowerCase(),
            //         digit: data.digit,
            //       },
            //     ],
            //   });
            // }
          }
          resolve({error: false, contacts});
        },
      );
    });
  };

  const check_or_create_contact = async (
    nounGuid: any,
    ownerGuid: string,
  ): Promise<any> => {
    return new Promise(async resolve => {
      socket.emit(USER_FRIEND, {nounGuid, ownerGuid}, (callback: any) => {
        resolve({contact: callback});
      });
    });
  };

  return {
    get_contacts_DB_socket,
    check_or_create_contact,
  };
};

export default useSocketContacts;
