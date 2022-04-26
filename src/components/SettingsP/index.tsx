import React, {useEffect, useRef, useState} from 'react';
import {Image, Pressable, Text, View} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import {
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {useSelector} from 'react-redux';
import useSocketBrain from '../../hooks/useSocketBrain';
import {getLoginStore} from '../../store/slices/login';
import LoginMediaSheet from '../login/LoginMediaSheet';
import styles from './style';
import profileImage from '../../assets/images/blank-profile.png';

const SettingsP = () => {
  const socketBrain = useSocketBrain();
  const [ownerData, setownerData]: any = useState(null);
  useEffect(() => {
    setTimeout(async () => {
      // if (ownerData === null) {
      //   const data: OwnerDataResponse = await getRecordOwnerTable({
      //     ownerGuid: loginStore.userGuid,
      //   });
      //   setownerData(data);
      // }
    }, 10);
  });
  const loginStore = useSelector(getLoginStore);
  const actionSheetRef = useRef<ActionSheet>(null);

  const buttonsArray = [
    {
      icon: {
        text: 'Kamera',
        name: 'camera',
        size: 15,
        color: '#000000',
        handler: () => {
          launchCamera(
            {mediaType: 'photo', includeBase64: true},
            (data: ImagePickerResponse) => {
              if (data.didCancel || data.errorCode || data.errorMessage) {
                return;
              }
              actionSheetRef.current?.hide();
              if (typeof data.assets !== 'undefined') {
                ownerData.image = data.assets[0].base64;
                setownerData(ownerData);
              }
            },
          );
        },
      },
    },
    {
      icon: {
        text: 'Galeri',
        name: 'photo',
        size: 15,
        color: '#000000',
        handler: () => {
          launchImageLibrary(
            {mediaType: 'photo', includeBase64: true},
            (data: ImagePickerResponse) => {
              if (data.didCancel || data.errorCode || data.errorMessage) {
                return;
              }
              if (typeof data.assets !== 'undefined') {
                ownerData.image = data.assets[0].base64;
                setTimeout(async () => {
                  // await updateRecordOwnerTable(ownerData, {
                  //   ownerGuid: ownerData.ownerGuid,
                  // });
                  socketBrain.user_update_profile(ownerData);
                  setownerData(ownerData);
                  //a
                }, 10);
              }
            },
          );
        },
      },
    },
    {
      icon: {
        text: 'Close',
        name: 'close',
        size: 15,
        color: '#000000',
        handler: () => {
          actionSheetRef.current?.hide();
        },
      },
    },
  ];
  const onPressImage = () => {
    actionSheetRef.current?.show();
  };
  return (
    <>
      <LoginMediaSheet buttonsArray={buttonsArray} innerRef={actionSheetRef} />
      <View style={styles.container}>
        <Pressable onPress={onPressImage}>
          <Text>SettingsP</Text>
          {ownerData !== undefined && ownerData !== null && (
            <Image
              style={styles.avatar}
              source={
                ownerData !== null && ownerData.image === null
                  ? profileImage
                  : {uri: 'data:image/jpeg;base64,' + ownerData.image}
              }
            />
          )}
        </Pressable>
      </View>
    </>
  );
};

export default SettingsP;
