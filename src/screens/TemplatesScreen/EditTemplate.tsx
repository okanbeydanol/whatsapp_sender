/* eslint-disable react-hooks/exhaustive-deps */
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AppHeader from '../../components/Header/AppHeader';
import {
  badge,
  medium,
  primary,
  secondary,
  tertiary,
} from '../../constants/styles/colors';
import AppTextInput from '../../components/Elements/AppTextInput';
import {Icon, CheckBox, Image} from '@rneui/themed';
import {useLazyUpdateUserMessageTemplatesQuery} from '../../store/api/userApi';
import ActionSheet from 'react-native-actions-sheet';
import {
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import TemplateActionSheet from '../../components/TemplateScreen/templateActionSheet';
import AppButton from '../../components/Elements/AppButton';
import {batch, useDispatch, useSelector} from 'react-redux';
import {getLoginStore} from '../../store/slices/login';
import {BASE_API_URL} from '../../constants';
import {ImageArrayToUpload, uploadImage} from '../../utils/upload-image';
import {USER_MESSAGES_TEMPLATE_REPLACE} from '../../store/slices/user';
import {
  USER_MESSAGE_TEPMLATES,
  USER_MESSAGE_TEPMLATE_IMAGES,
} from '../../constants/typescript/user';
import {TemplateScreenProps} from '../../navigation/types';
import {copyFile, ExternalDirectoryPath} from 'react-native-fs';

const EditTemplate = ({
  navigation,
  route,
}: TemplateScreenProps<'EditTemplate'>) => {
  //Props
  const {template} = route.params;
  const convert: ImageArrayToUpload[] = [];
  template.images.forEach((image: USER_MESSAGE_TEPMLATE_IMAGES) => {
    convert.push({
      name: image.image_name,
      path: 'file://' + ExternalDirectoryPath + '/' + image.image_name,
      type: image.type,
    });
  });

  //Dispatch
  const dispatch = useDispatch();

  //States
  const [title, setTitle] = useState(template.title ? template.title : '');
  const [text, setText] = useState(template.text ? template.text : '');
  const [images, setImages] = useState<ImageArrayToUpload[]>(convert);
  const [type, setType] = useState(template.type);

  //Selectors
  const loginStore = useSelector(getLoginStore);

  //Queries
  const [triggerUpdateUserTemplate, update_user_template] =
    useLazyUpdateUserMessageTemplatesQuery();

  //Refs
  let ref: any = useRef();
  const actionSheetRef = useRef<ActionSheet>(null);

  //Effects
  useEffect(() => {
    setTimeout(() => {
      actionSheetRef.current?.hide();
    }, 200);
  });

  //update_user_template isSuccess
  useEffect(() => {
    if (
      typeof update_user_template.data !== 'undefined' &&
      update_user_template.isSuccess &&
      images.length > 0 &&
      type === 'media'
    ) {
      //Upload images to server
      uploadImage(
        BASE_API_URL + 'user_message_template_image_upload',
        images,
        [
          {name: 'user_guid', data: loginStore.userGuid},
          {
            name: 'message_template_guid',
            data: update_user_template.data.message_template_guid,
          },
        ],
        (sent: number, total: number) => {
          console.log('%c sent', 'background: #222; color: #bada55', sent);
          console.log('%c total', 'background: #222; color: #bada55', total);
        },
      )
        .then((res: USER_MESSAGE_TEPMLATES) => {
          updateUser(res);
        })
        .catch((err: any) => {
          Alert.alert('Hata!', err, [{text: 'OK', onPress: () => {}}]);
        });
    } else {
      if (update_user_template.data) {
        updateUser(update_user_template.data);
      }
    }
  }, [update_user_template.data, update_user_template.isSuccess]);

  //Functions
  //Close Page
  const closePress = () => {
    navigation.pop();
  };

  //Delete Media
  const deleteMedia = (uri: string) => {
    const findIndex = images.findIndex((o: any) => o.path === uri);
    if (findIndex !== -1) {
      const data = [...images];
      data.splice(findIndex, 1);
      setImages(data);
    }
  };

  // Copy Image and Set Images State
  const copyImageSetState = async (
    uri: string,
    fileName: string,
    imageType: string,
  ) => {
    //Copy image to external directory
    await copyFile(uri, ExternalDirectoryPath + '/' + fileName);
    //Add image to images array
    const imagesDatas: ImageArrayToUpload[] = [
      ...images,
      {
        name: fileName ? fileName : null,
        path: 'file://' + ExternalDirectoryPath + '/' + fileName,
        type: imageType ? imageType : null,
      },
    ];
    setImages(imagesDatas);
  };

  //ActionSheet Buttons And Callbacks Functions
  const buttonsArray = [
    {
      text: 'Kamera',
      name: 'camera',
      size: 15,
      color: '#000000',
      handler: async () => {
        //Launch Camera
        launchCamera(
          {mediaType: 'photo', includeBase64: false},
          async (data: ImagePickerResponse) => {
            if (data.didCancel || data.errorCode || data.errorMessage) {
              return;
            }
            //If image is not empty
            if (
              data.assets &&
              data.assets.length > 0 &&
              data.assets[0].uri &&
              data.assets[0].fileName &&
              data.assets[0].type
            ) {
              //Set Images
              copyImageSetState(
                data.assets[0].uri,
                data.assets[0].fileName,
                data.assets[0].type,
              );
            }
          },
        );
      },
    },
    {
      text: 'Galeri',
      name: 'photo',
      size: 15,
      color: '#000000',
      handler: () => {
        launchImageLibrary(
          {mediaType: 'photo', includeBase64: true},
          async (data: ImagePickerResponse) => {
            if (data.didCancel || data.errorCode || data.errorMessage) {
              return;
            }
            //If image is not empty
            if (
              data.assets &&
              data.assets.length > 0 &&
              data.assets[0].uri &&
              data.assets[0].fileName &&
              data.assets[0].type
            ) {
              //Set Images
              copyImageSetState(
                data.assets[0].uri,
                data.assets[0].fileName,
                data.assets[0].type,
              );
            }
          },
        );
      },
    },
    {
      text: 'Close',
      name: 'close',
      size: 15,
      color: '#000000',
      handler: () => {
        actionSheetRef.current?.hide();
      },
    },
  ];

  //Dispatch Updated User
  const updateUser = (data: USER_MESSAGE_TEPMLATES) => {
    if (
      typeof update_user_template.data !== 'undefined' &&
      update_user_template.isSuccess
    ) {
      dispatch(USER_MESSAGES_TEMPLATE_REPLACE(data));
      navigation.pop();
    }
  };

  //Begins to save template
  const saveTemplate = async () => {
    if (
      typeof title === 'undefined' ||
      !title ||
      (title && title.length === 0) ||
      title === ''
    ) {
      Alert.alert('Hata!', 'Title boş bırakılamaz!', [
        {text: 'OK', onPress: () => {}},
      ]);
      return;
    }

    if (type === 'media' && images.length === 0) {
      Alert.alert(
        'Hata!',
        'Media şablonu oluşturmak için media eklemelisiniz!',
        [{text: 'OK', onPress: () => {}}],
      );
      return;
    }
    if (
      typeof text === 'undefined' ||
      !text ||
      (text && text.length === 0) ||
      text === ''
    ) {
      Alert.alert('Hata!', 'Text boş bırakılamaz!', [
        {text: 'OK', onPress: () => {}},
      ]);
      return;
    }

    triggerUpdateUserTemplate({
      user_guid: loginStore.userGuid,
      title: title,
      text: text,
      type: type,
      message_template_guid: template.message_template_guid,
    });
  };

  return (
    <>
      <TemplateActionSheet
        buttonsArray={buttonsArray}
        innerRef={actionSheetRef}
      />
      <AppHeader style={styles.appHeader} />
      <View style={styles.header}>
        <TouchableOpacity onPress={closePress}>
          <Icon
            name="close"
            size={22}
            color={medium.color}
            style={styles.iconStyle}
          />
        </TouchableOpacity>
      </View>
      <KeyboardAwareScrollView
        keyboardOpeningTime={0}
        extraScrollHeight={0}
        extraHeight={0}
        ref={ref}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
        showsVerticalScrollIndicator={false}
        persistentScrollbar={false}
        contentContainerStyle={[styles.scrollView]}
        enableAutomaticScroll={false}
        enableResetScrollToCoords={false}>
        <View style={styles.listPageTitleWrapper}>
          <Text style={styles.listPageTitle}>Mesaj Şablonunu Düzenle</Text>
        </View>
        <View style={styles.ListTitleWrapper}>
          <Text style={styles.ListTitle}>Şablon Başlığı</Text>
        </View>
        <View>
          <Text style={styles.ListTitleDesc}>
            (Lütfen mesaj şablonu için düzgün bir başlık giriniz!)
          </Text>
        </View>
        <View style={styles.ListInputWrapper}>
          <AppTextInput
            value={title}
            onChangeText={(t: string) => {
              setTitle(t);
            }}
            placeholder="Lütfen şablon başlığı giriniz..."
          />
        </View>
        <View style={styles.ListTextWrapper2}>
          <Text style={styles.ListTextTitle2}>Whatsapp Bilgileri</Text>
        </View>
        <View style={styles.ListTextWrapper}>
          <Text style={styles.ListTextTitle}>Gönderilecek Metin Mesajı</Text>
        </View>
        <View>
          <Text style={styles.ListTitleDesc}>
            (Lütfen göndermek istediğiniz metni aşağıya yazınız!)
          </Text>
        </View>
        <View style={styles.ListInputWrapper}>
          <AppTextInput
            multiline={true}
            numberOfLines={8}
            style={{
              height: 120,
              textAlignVertical: 'top',
            }}
            value={text}
            onChangeText={(t: string) => {
              setText(t);
            }}
            placeholder="Lütfen whatsapp'ta göndermek istediğin metin mesajını giriniz..."
          />
        </View>
        <View style={styles.ListTextWrapper}>
          <Text style={styles.ListTextTitle}>Mesaj Tipi</Text>
        </View>
        <View>
          <Text style={styles.ListTitleDesc}>
            (Lütfen göndermek istediğiniz şablon tipini seçiniz!)
          </Text>
        </View>
        <View style={{display: 'flex', flexDirection: 'row', padding: 8}}>
          <CheckBox
            title="Text"
            checkedIcon="check-circle-outline"
            uncheckedIcon="checkbox-blank-circle-outline"
            checked={type === 'text' ? true : false}
            size={20}
            iconType="material-community"
            onPress={() => {
              batch(() => {
                setType('text');
              });
            }}
            containerStyle={styles.checkboxContainer}
            textStyle={styles.checkboxText}
          />
          <CheckBox
            title="Media"
            checkedIcon="check-circle-outline"
            uncheckedIcon="checkbox-blank-circle-outline"
            checked={type !== 'text' ? true : false}
            size={20}
            iconType="material-community"
            onPress={() => {
              setType('media');
            }}
            containerStyle={styles.checkboxContainer}
            textStyle={styles.checkboxText}
          />
        </View>
        {type === 'media' && (
          <>
            <View style={styles.ListTextWrapper}>
              <Text style={styles.ListTextTitle}>Gönderilecek Medyalar</Text>
            </View>
            <View>
              <Text style={styles.ListTitleDesc}>
                (Lütfen göndermek istediğiniz resimleri tek tek ekleyiniz!)
              </Text>
            </View>
            <View
              style={{
                width: '100%',
                paddingLeft: 16,
                paddingTop: 16,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                flex: 1,
                flexWrap: 'wrap',
              }}>
              {images.map((imageData: ImageArrayToUpload, index: any) => (
                <React.Fragment key={'Fragment' + index}>
                  {index < (Dimensions.get('window').width / 146) * 2 && (
                    <TouchableOpacity
                      style={{
                        marginRight: 16,
                        display: 'flex',
                        marginBottom: 16,
                      }}
                      onPress={() => {
                        if (imageData.path !== null) {
                          deleteMedia(imageData.path);
                        }
                      }}>
                      {imageData.path !== null && (
                        <Image
                          source={{
                            uri: imageData.path,
                          }}
                          containerStyle={{
                            width: 80,
                            height: 80,
                            borderRadius: 12,
                          }}
                          PlaceholderContent={<ActivityIndicator />}
                        />
                      )}
                    </TouchableOpacity>
                  )}
                </React.Fragment>
              ))}
              {images.length < (Dimensions.get('window').width / 98) * 2 && (
                <TouchableOpacity
                  style={{
                    width: 80,
                    height: 80,
                    backgroundColor: tertiary.color,
                    borderRadius: 12,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    actionSheetRef.current?.show();
                  }}
                  activeOpacity={0.8}>
                  <Icon
                    style={{padding: 0, margin: 0, marginRight: 2}}
                    name="add"
                    size={32}
                    color={medium.color}
                  />
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
        <View style={{width: '100%', paddingStart: 16, marginTop: 16}}>
          <AppButton onPress={saveTemplate} title="Save" />
        </View>
      </KeyboardAwareScrollView>
    </>
  );
};

export default EditTemplate;

const styles = StyleSheet.create({
  swipeableRightContainer: {
    paddingRight: 16,
  },
  checkboxContainer: {padding: 0, margin: 0},
  checkboxText: {
    color: secondary.color,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    fontWeight: '600',
  },
  checkboxEditContainer: {display: 'flex', flexDirection: 'row'},
  swipeableLeftContainer: {
    paddingLeft: 16,
  },
  scrollView: {
    paddingRight: 15,
    paddingLeft: 15,
  },
  tabsContainerStyle: {
    paddingBottom: 16,
    paddingRight: 16,
    paddingLeft: 16,
  },
  listPageTitleWrapper: {
    width: '100%',
    height: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listPageTitle: {
    color: primary.color,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 22,
    fontWeight: '600',
  },
  listMessageTemplateWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 16,
    marginLeft: 16,
    marginBottom: 8,
  },
  listMessageTemplatesWrapper: {height: 226},
  listMessageTemplate: {
    color: primary.color,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 22,
    fontWeight: '600',
  },
  ListTitleWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginLeft: 16,
    marginBottom: 8,
  },
  ListTitle: {
    color: primary.color,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 22,
    fontWeight: '600',
  },
  ListTitleDesc: {
    color: secondary.color,
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    fontWeight: '500',
    paddingLeft: 16,
    marginBottom: 8,
  },
  ListTextTitle: {
    color: primary.color,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 22,
    fontWeight: '600',
  },
  listAddContactListWrapper: {
    alignItems: 'flex-start',
    marginLeft: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: secondary.color,
    borderStyle: 'solid',
    borderRadius: 12,
    padding: 16,
  },
  listAddContactList: {},
  listAddContactWrapper: {
    marginTop: 66,
    alignItems: 'center',
    marginLeft: 16,
    marginBottom: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listAddContactEmptyWrapper: {
    alignItems: 'center',
    marginLeft: 16,
    marginBottom: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listAddContact: {
    color: primary.color,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    fontWeight: '600',
  },
  listAddContactEmpty: {
    color: secondary.color,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    fontWeight: '600',
  },
  ListInputWrapper: {
    alignItems: 'center',
  },
  ListTextWrapper: {
    alignItems: 'flex-start',
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  ListTextTitle2: {
    color: badge.color,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 22,
    fontWeight: '600',
  },
  ListTextWrapper2: {
    alignItems: 'center',
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  iconStyle: {
    marginLeft: 16,
  },
  addIconStyle: {
    marginRight: 16,
  },
  header: {
    backgroundColor: primary.color,
    height: 60,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  appHeader: {
    height: 0,
  },
});
