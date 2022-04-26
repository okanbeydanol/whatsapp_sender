import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key: any, value: any) => {
  try {
    if (key !== null && value !== null) {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    }
  } catch (e) {
    return e;
  }
};

export const getData = async (key: any) => {
  try {
    if (key !== null) {
      const jsonValue = await AsyncStorage.getItem(key);
      if (jsonValue === null) {
        return null;
      } else {
        return JSON.parse(jsonValue || '{}');
      }
    }
  } catch (e) {
    return e;
  }
};

export const removeData = async (key: any) => {
  try {
    if (key !== null) {
      await AsyncStorage.removeItem(key);
    }
  } catch (e) {
    return e;
  }
};

export const getAllKeys = async () => {
  try {
    return AsyncStorage.getAllKeys(value => {
      return value;
    });
  } catch (e) {
    return e;
  }
};

export const getMultiple = async (keys: any) => {
  try {
    if (keys.length > 0) {
      await AsyncStorage.multiGet(keys).then(result => {
        return result;
      });
    }
  } catch (e) {
    return e;
  }
};

export const multiSet = async (keys: any, values: any) => {
  try {
    if (keys.length > 0) {
      let keysValues: any = [];
      for (let index = 0; index < keys.length; index++) {
        keysValues.push([keys[index], values[index]]);
      }
      await AsyncStorage.multiSet(keysValues).then(result => {
        return result;
      });
    }
  } catch (e) {
    return e;
  }
};

export const multiRemove = async (keys: any) => {
  try {
    if (keys.length > 0) {
      await AsyncStorage.multiRemove(keys);
    }
  } catch (e) {
    return e;
  }
};

export const clearAll = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    return e;
  }
};

// export const saveTodoItems = async (
//   db: SQLiteDatabase,
//   todoItems: ToDoItem[],
// ) => {
//   const insertQuery =
//     `INSERT OR REPLACE INTO ${tableName}(rowid, value) values` +
//     todoItems.map(i => `(${i.id}, '${i.value}')`).join(',');

//   return db.executeSql(insertQuery);
// };
