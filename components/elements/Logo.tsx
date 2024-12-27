import {Image, StyleSheet} from 'react-native';
import React from 'react';

const logo = () => {
  return <Image source={require('@/assets/images/logo1.png')} style={styles.image} />;
};

export default logo;
const styles = StyleSheet.create({
  image: {
    width: 110,
    height: 110,
  },
});
