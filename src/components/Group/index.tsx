/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {Pressable, Text, View, Animated} from 'react-native';

import styles from './style';
import {useDispatch} from 'react-redux';

import TextTry from './TextTry';

const Group = ({navigation}: any) => {
  const dispatch = useDispatch();

  // const fadeAnim = useRef(new Animated.Value(1)).current;
  // const [first, setfirst] = useState(false);
  // useEffect(() => {
  //   const a = setTimeout(() => {
  //     setfirst(false);
  //   }, 400);
  //   return () => {
  //     clearTimeout(a);
  //   };
  // }, [first]);

  useEffect(() => {
    init();
  });

  const init = async () => {
    // const t = await openContactDatabase();
    //
    // const sad = await deleteRecordContactsTable();
    // const record = await insertRecordContactTable({
    //   contactGuid: '333-333-333',
    //   ownerGuid: '123-123-123-123',
    //   name: 'deneme2',
    // });
    // const deneme = await insertRecordsContactTable([
    //   {
    //     contactGuid: '333-333-333',
    //     ownerGuid: '123-123-123-123',
    //     name: 'deneme2',
    //   },
    //   {
    //     contactGuid: '444-444-444',
    //     ownerGuid: '123-123-123-123',
    //     name: 'deneme2',
    //   },
    //   {
    //     contactGuid: '555-555-555',
    //     ownerGuid: '123-123-123-123',
    //     name: 'deneme2',
    //   },
    // ]);
  };

  const clickHandler = () => {
    // dispatch(DB_CONTACT_UPDATE({name: '2a2a', lastname: 'a1a1'}));
    // Animated.sequence([
    //   Animated.timing(fadeAnim, {
    //     toValue: 1.3,
    //     duration: 100,
    //     useNativeDriver: true,
    //   }),
    //   Animated.timing(fadeAnim, {
    //     toValue: 1,
    //     duration: 100,
    //     useNativeDriver: true,
    //   }),
    // ]).start();
    // setfirst(true);
  };

  return (
    <View style={styles.container}>
      {/* {first && <Text>Basıldı.</Text>} */}
      <Animated.View
        style={[
          {
            // transform: [{scale: fadeAnim}],
            backgroundColor: 'red',
            width: 50,
            height: 20,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}>
        <TextTry />
      </Animated.View>

      <Pressable
        onPress={clickHandler}
        style={{
          marginTop: 50,
          height: 30,
          width: 100,
          backgroundColor: '#a23e32',
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View>
          <Text style={{color: 'white'}}>Arttır</Text>
        </View>
      </Pressable>
    </View>
  );
};

export default Group;
