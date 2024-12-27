/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable prettier/prettier */
import {
    View,
    SafeAreaView,
    StyleSheet,
    useColorScheme,
  } from 'react-native';
  import React, {useEffect} from 'react';
  import {useNavigation} from '@react-navigation/native';
//   import {useCurrentProvider} from '@app/model';
  import LottieView from 'lottie-react-native';
  import {Lottie} from '@/assets/Lottie';
  import {updateFirebaseTokenWhenLogin} from '@/modules/signIn/services/dbServices';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  
  const Index = () => {
    // const {data, isLoading, refetch, isSuccess} = useCurrentProvider();
    const data = {}
    const themeMode = useColorScheme();
    const navigation: any = useNavigation();
  
    const settingFirbaseTokenInDb = async () => {
      let fcmToken = await AsyncStorage.getItem('fcmToken');
      const result = await updateFirebaseTokenWhenLogin({
        providerId: data?._id,
        fcmToken,
      });
      console.log('updatedTokens:', result);
      navigation.navigate('Home');
    };
  
    useEffect(() => {
      settingFirbaseTokenInDb();
    }, [isSuccess]);
  
    return (
      <SafeAreaView
        style={[
          styles.safeAreaContainer,
          {
            backgroundColor: themeMode === 'dark' ? 'black' : '#ffffffe7',
          },
        ]}>
        {/* <Header goBack={navigation.navigate('HomeNew')} Header="Home" /> */}
        <View style={styles.noOrderText}>
          <LottieView
            style={styles.lottie}
            source={Lottie.loadingAnimation}
            autoPlay
            loop
          />
        </View>
        <Footer page={'home'} />
      </SafeAreaView>
    );
  };
  
  export default Index;
  const styles = StyleSheet.create({
    safeAreaContainer: {
      flex: 1,
    },
    noOrderText: {
      textAlign: 'center',
      marginVertical: 200,
      justifyContent: 'center',
      alignItems: 'center',
    },
    lottie: {
      width: '90%',
      height: 150,
    },
  });
  