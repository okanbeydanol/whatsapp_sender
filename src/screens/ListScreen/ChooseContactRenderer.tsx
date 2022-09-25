/* eslint-disable react-hooks/exhaustive-deps */
import React, {useMemo, useRef, useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Dimensions,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
import {OptimizedHeavyScreen} from 'react-navigation-heavy-screen';
import {CheckBox, Icon} from '@rneui/themed';
import {
  DatabaseContactPhonesResponse,
  DatabaseContactResponse,
} from '../../utils/native-contact';
import {medium, primary, secondary} from '../../constants/styles/colors';
import {useDispatch} from 'react-redux';
import {DB_CONTACTS_CHANGE_UPDATE} from '../../store/slices/dbContacts';

const ViewTypes = {
  FULL: 0,
  HALF_LEFT: 1,
  HALF_RIGHT: 2,
};

let {width} = Dimensions.get('window');

const ChooseContactRenderer = ({
  dataAll,
  propsData = {},
  emitChanges,
  enableRefreshing = true,
  isRefreshing = () => null,
  refreshing = false,
}: any) => {
  const [data, setData]: any = useState([]);
  const _layoutProvider = useRef(layoutMaker()).current;
  const dispatch = useDispatch();
  let listView: any = useRef();
  const [firstLetters, setFirstLetters] = useState<
    {
      contact_id: string;
      firstLetter: string;
    }[]
  >([]);
  const dataProvider = useMemo(() => dataProviderMaker(data), [data]);
  useEffect(() => {
    if (data.length > 0) {
      const letters = [...firstLetters];
      data.map((contact: DatabaseContactResponse) => {
        if (contact.full_name.length > 0) {
          const findIndex = letters.findIndex(
            (o: {contact_id: string; firstLetter: string}) =>
              o.firstLetter === contact.full_name.substring(0, 1).toUpperCase(),
          );
          if (findIndex === -1) {
            letters.push({
              contact_id: contact.contact_id,
              firstLetter: contact.full_name.substring(0, 1).toUpperCase(),
            });
          }
        }
      });
      setFirstLetters(letters);
    }
  }, [data]);
  useEffect(() => {
    setData(dataAll);
  }, [dataAll]);

  const onRefresh = useCallback(() => {
    isRefreshing(true);
  }, []);

  const changeChecked = (item: any) => {
    const findIndex = data.findIndex(
      (o: DatabaseContactResponse) => o.contact_id === item.contact_id,
    );
    if (findIndex !== -1) {
      dispatch(DB_CONTACTS_CHANGE_UPDATE(+data[findIndex].contact_id));
    }
  };

  return (
    <OptimizedHeavyScreen style={{flex: 1}}>
      <RecyclerListView
        ref={listView}
        onEndReachedThreshold={1}
        layoutProvider={_layoutProvider}
        dataProvider={dataProvider}
        rowRenderer={(type, data2, index) =>
          rowRenderer(type, data2, index, {
            ...propsData,
            emitChanges: emitChanges,
            changeChecked: changeChecked,
            firstLetters: firstLetters,
          })
        }
        scrollViewProps={{
          refreshControl: (
            <RefreshControl
              refreshing={refreshing}
              enabled={enableRefreshing}
              onRefresh={onRefresh}
            />
          ),
        }}
      />
    </OptimizedHeavyScreen>
  );
};

const layoutMaker = () =>
  new LayoutProvider(
    (index: number) => {
      return ViewTypes.FULL;
    },
    (type, dim) => {
      dim.width = width;
      dim.height = 40;
    },
  );

const rowRenderer = (type: any, item: any, index: number, propsData: any) => {
  return (
    <View style={{display: 'flex', flexDirection: 'row'}}>
      {propsData.firstLetters.findIndex(
        (o: {contact_id: string; firstLetter: string}) =>
          +o.contact_id === +item.contact_id,
      ) !== -1 ? (
        <View
          style={{
            marginTop: 2,
            width: 36,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <Text>{item.full_name.substring(0, 1).toUpperCase()}</Text>
        </View>
      ) : (
        <View style={{marginRight: 36}}></View>
      )}
      <TouchableOpacity
        style={{
          display: 'flex',
          flexDirection: 'row',
          height: 40,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        activeOpacity={0.4}
        onPress={() => {
          console.log('%c burdaöııııııı', 'background: #222; color: #bada55');
          propsData.changeChecked(item);
          propsData.emitChanges(item);
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon
            color={!item.checked ? medium.color : '#4af2a1'}
            name="people"
            style={{marginRight: 12}}
          />
          <Text>
            {Dimensions.get('window').width - 338 < item.full_name.length
              ? item.full_name.substring(
                  0,
                  Dimensions.get('window').width - 338,
                ) + '...'
              : item.full_name}
          </Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 60,
          }}>
          <Icon
            name="cellphone-check"
            size={22}
            type="material-community"
            color={medium.color}
          />
          <Text>
            {
              item.contact_phones.filter(
                (o: DatabaseContactPhonesResponse) => +o.active === 1,
              ).length
            }
          </Text>
          <Icon
            name="cellphone-remove"
            size={22}
            type="material-community"
            color={medium.color}
          />
          <Text>
            {
              item.contact_phones.filter(
                (o: DatabaseContactPhonesResponse) => +o.active === 0,
              ).length
            }
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const dataProviderMaker = (data: any) =>
  new DataProvider((r1, r2) => {
    return r1 !== r2;
  }).cloneWithRows(data);

export default ChooseContactRenderer;
