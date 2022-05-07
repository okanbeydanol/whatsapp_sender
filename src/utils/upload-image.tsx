import ReactNativeBlobUtil, {FetchBlobResponse} from 'react-native-blob-util';
import {USER_MESSAGE_TEPMLATES} from '../constants/typescript/user';
const ragex =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/;
export const uploadImage = async (
  serverUrl: string,
  imageArrayToUpload: ImageArrayToUpload[],
  extraData: ExtraData[],
  uploadProgress: (sent: number, total: number) => void,
): Promise<USER_MESSAGE_TEPMLATES> => {
  return new Promise((resolve, reject): any => {
    if (
      typeof serverUrl === 'undefined' ||
      serverUrl === null ||
      serverUrl === '' ||
      typeof imageArrayToUpload === 'undefined' ||
      imageArrayToUpload === null ||
      imageArrayToUpload.length === 0 ||
      serverUrl.match(ragex) === null
    ) {
      reject('Gönderdiğiniz bilgiler yanlış!');
    }
    if (imageArrayToUpload && imageArrayToUpload?.length > 0) {
      const body = [];
      const imageNames = [];
      for (let index = 0; index < imageArrayToUpload.length; index++) {
        const data: ImageArrayToUpload = imageArrayToUpload[index];
        body.push({
          name: data.name.replace('.' + data.name.split('.').pop(), ''),
          filename: data.name,
          type: 'image/jpeg',
          data: ReactNativeBlobUtil.wrap(data.path),
        });
        imageNames.push({
          name: data.name.replace('.' + data.name.split('.').pop(), ''),
        });
      }

      body.push({
        name: 'imageNames',
        data: JSON.stringify(imageNames),
      });

      if (extraData) {
        extraData.forEach((d: ExtraData) => {
          body.push({
            name: d.name,
            data: d.data,
          });
        });
      }

      ReactNativeBlobUtil.fetch(
        'POST',
        serverUrl,
        {
          'Content-Type': 'multipart/form-data',
        },
        body,
      )
        .uploadProgress((sent: number, total: number) => {
          uploadProgress(sent, total);
        })
        .then((resp: FetchBlobResponse) => {
          let status =
            resp.respInfo.status === 1223 ? 204 : resp.respInfo.status;
          if (status === 0) {
            status = resp.data ? 200 : 0;
          }
          if (status >= 200 && status <= 300) {
            resolve(JSON.parse(resp.data));
          } else {
            reject('Failed to load ' + resp.data);
          }
        })
        .catch(err => {
          reject(err);
        });
    }
  });
};

export type ImageArrayToUpload = {
  name: string;
  path: string;
  type: string;
};
export type ExtraData = {
  name: string;
  data: any;
};
