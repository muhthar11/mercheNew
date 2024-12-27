import React from 'react';
import {TouchableOpacity, Image, StyleSheet} from 'react-native';

const backButton = ({goBack}: any) => {
  return (
    <TouchableOpacity onPress={goBack} style={styles.container}>
      <Image style={styles.image} source={require('@/assets/images/arrow_back.png')} />
    </TouchableOpacity>
  );
};

export default backButton;
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10,
    left: 4,
  },
  image: {
    width: 24,
    height: 24,
  },
});
