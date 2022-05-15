import {StyleSheet, Platform} from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginLeft: Platform.OS === 'ios' ? 12 : 0,
    marginTop: Platform.OS === 'ios' ? 210 : 200,
  },
  firstDrawerItem: {
    borderBottomWidth: 1,
    borderRadius: 0,
    borderColor: '#E0E0E0',
    marginBottom: 16,
    paddingBottom: 18,
    marginRight: 0,
  },
  firstDrawerItemLabel: {
    fontSize: 12,
    color: '#222222',
    marginLeft: -20,
  },
});

export default styles;
