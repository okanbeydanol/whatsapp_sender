import {Dimensions, StyleSheet} from 'react-native';
import React from 'react';
import ActionSheet from 'react-native-actions-sheet';
import AppIconButton from '../Elements/AppIconButton';

const TemplateActionSheet = ({
  children,
  id = 'action-sheet',
  buttonsArray,
  innerRef,
}: any) => {
  return (
    <ActionSheet containerStyle={styles.containerStyle} id={id} ref={innerRef}>
      {buttonsArray.map((key: any, index: any) => (
        <React.Fragment key={'Fragment' + index}>
          <AppIconButton data={key} style={[styles.buttonStyle]} />
        </React.Fragment>
      ))}
      {children}
    </ActionSheet>
  );
};

export default TemplateActionSheet;

const styles = StyleSheet.create({
  textStyle: {
    color: '#000000',
    fontFamily: 'Montserrat-Medium',
    fontSize: 13,
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  buttonStyle: {
    width: Dimensions.get('window').width,
    borderRadius: 0,
    height: 60,
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  containerStyle: {
    flex: 1,
    marginBottom: 300,
  },
});
