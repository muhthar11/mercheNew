/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    TextInput,
    Platform,
    Dimensions,
    Pressable,
    TouchableOpacity,
    ScrollView,
    useColorScheme,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { registerDetails } from '@/modules/signIn/services/dbServices';
import { Colors } from '@/assets/Colors';
import { Dropdown } from 'react-native-element-dropdown';
import BackButton from '@/components/elements/BackButton';
import Logo from '@/components/elements/Logo';
import Loading from '@/components/elements/Loading';
import { UserContext, app } from '@/context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

let fontScale = Dimensions.get('window').fontScale;

const Signup = () => {
    const router = useRouter();
    const { i18n } = useTranslation();
    const navigation: any = useNavigation();
    const themeMode = useColorScheme();

    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState();
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [type, setType] = useState(null);

    useEffect(() => {
        const checkAuthStatus = async () => {
          try {
            const storedUser = await AsyncStorage.getItem("user");
            console.log('storedUser ==', storedUser);
            setUser(storedUser);
          } catch (authError) {
            console.error("Error during authentication check:", authError);
          }
        };
    
        checkAuthStatus();
      }, []);
    

    const initialValues = {
        businessName: '',
        businessDescription: '',
        email: '',
        mobileNo: '',
        password: '',
    };
    const validate = (values: {
        businessName: any;
        businessDescription: any;
        email: string;
        mobileNo: string;
        password: any;
    }) => {
        const errors: any = {};
        if (!values.businessName) {
            errors.businessName = 'Business Name is required';
        }
        if (!values.businessDescription) {
            errors.businessDescription = 'Business Description is required';
        }
        if (!values.email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(values.email)) {
            errors.email = 'Invalid email address';
        }
        if (!values.mobileNo) {
            errors.mobileNo = 'Mobile number is required';
        }
        if (!values.password) {
            errors.password = 'Password is required';
        } else if (values.password.length < 6) {
            errors.password = 'Password must be at least 6 characters long.';
        }
        return errors;
    };

    const userRegister = async (values: any) => {
        setIsLoading(true);
        console.log('values', values);
        const email = values.email;
        const password = values.password;
        try {
            if (type) {
                const result: any = await registerDetails({
                    user: user,
                    email: values.email,
                    userName: values.businessName,
                    phoneNumber: values.mobileNo,
                    description: values.businessDescription,
                    type: type,
                });
                console.log('result:', result);
                if (result) {
                    try {
                        const reslt = await app.emailPasswordAuth.registerUser({
                            email,
                            password,
                        });
                        // console.log('reslt:', reslt);
                        setIsLoading(false);
                        navigation.navigate('Login');
                    } catch (error) {
                        console.log('error:', error);
                    }
                }
            } else {
                setIsLoading(false);
            }
        } catch (err) {
            setIsLoading(false);
            // console.log('err=', err);
        }
    };

    const options = [
        { type: 'e-commerce', value: 1, label: 'Online Retailers' },
        { type: 'booking-services', value: 2, label: 'Spa and Salon Appointments' },
        { type: 'booking-services', value: 3, label: 'Healthcare Appointments' },
    ];

    return (
        <SafeAreaView
            style={[
                styles.safeAreaContainer,
                {
                    backgroundColor: themeMode === 'dark' ? 'black' : '#ffffffe7',
                },
            ]}>
            {/* <BackButton goBack={navigation.goBack} /> */}
            <Logo />
            <Text style={styles.header}>Create Account</Text>
            <ScrollView style={{ width: '100%' }}>
                <View style={styles.detailsForm}>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={userRegister}
                        validate={validate}>
                        {({
                            handleChange,
                            handleBlur,
                            //   setFieldValue,
                            handleSubmit,
                            touched,
                            values,
                            errors,
                        }) => {
                            return (
                                <View style={styles.form}>
                                    <TextInput
                                        autoCapitalize="none"
                                        onChangeText={handleChange('businessName')}
                                        onBlur={handleBlur('businessName')}
                                        value={values.businessName}
                                        autoCorrect={false}
                                        placeholder={
                                            i18n.language === 'en' ? 'Business Name' : 'الاسم التجاري'
                                        }
                                        placeholderTextColor={Colors.lightGrey2}
                                        style={[styles.input, { color: Colors[themeMode].textMain }]}
                                    />
                                    {errors.businessName && touched.businessName ? (
                                        <Text style={styles.error}>{errors.businessName}</Text>
                                    ) : null}
                                    <TextInput
                                        autoCapitalize="none"
                                        onChangeText={handleChange('businessDescription')}
                                        onBlur={handleBlur('businessDescription')}
                                        value={values.businessDescription}
                                        autoCorrect={false}
                                        placeholder={
                                            i18n.language === 'en'
                                                ? 'Business Description'
                                                : 'وصف العمل'
                                        }
                                        placeholderTextColor={Colors.lightGrey2}
                                        style={[styles.input, { color: Colors[themeMode].textMain }]}
                                    />
                                    {errors.businessDescription && touched.businessDescription ? (
                                        <Text style={styles.error}>
                                            {errors.businessDescription}
                                        </Text>
                                    ) : null}

                                    <Dropdown
                                        style={[styles.input, { color: Colors[themeMode].textMain }]}
                                        placeholderStyle={styles.placeholderStyle}
                                        selectedTextStyle={styles.selectedTextStyle}
                                        inputSearchStyle={styles.inputSearchStyle}
                                        iconStyle={styles.iconStyle}
                                        data={options || []}
                                        search
                                        maxHeight={300}
                                        labelField="label"
                                        valueField="value"
                                        placeholder={!isFocus ? 'Select Business Type *' : '...'}
                                        searchPlaceholder="Search Business Type *"
                                        value={value}
                                        onFocus={() => setIsFocus(true)}
                                        onBlur={() => setIsFocus(false)}
                                        onChange={(item): any => {
                                            if (item) {
                                                setValue(item);
                                                setType(item.type);
                                                // console.log('item:', item);
                                            }
                                        }}
                                    />
                                    <TextInput
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        onChangeText={handleChange('mobileNo')}
                                        onBlur={handleBlur('mobileNo')}
                                        value={values.mobileNo}
                                        placeholder={
                                            i18n.language === 'en'
                                                ? 'Mobile Number'
                                                : 'رقم الهاتف المحمول'
                                        }
                                        // value="+962 507851348"
                                        placeholderTextColor={Colors.lightGrey2}
                                        // placeholderStyle={styles.placeholder}
                                        style={[styles.input, { color: Colors[themeMode].textMain }]}
                                    />
                                    {errors.mobileNo && touched.mobileNo ? (
                                        <Text style={styles.error}>{errors.mobileNo}</Text>
                                    ) : null}

                                    <TextInput
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        onChangeText={handleChange('email')}
                                        onBlur={handleBlur('email')}
                                        value={values.email}
                                        placeholder={
                                            i18n.language === 'en' ? 'Email ID' : 'البريد الالكتروني'
                                        }
                                        placeholderTextColor={Colors.lightGrey2}
                                        // placeholderStyle={styles.placeholder}
                                        style={[styles.input, { color: Colors[themeMode].textMain }]}
                                    />
                                    {errors.email && touched.email ? (
                                        <Text style={styles.error}>{errors.email}</Text>
                                    ) : null}
                                    <TextInput
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        onChangeText={handleChange('password')}
                                        onBlur={handleBlur('password')}
                                        value={values.password}
                                        placeholder={
                                            i18n.language === 'en' ? 'Password' : 'كلمة المرور'
                                        }
                                        // value="+962 507851348"
                                        placeholderTextColor={Colors.lightGrey2}
                                        // placeholderStyle={styles.placeholder}
                                        style={[styles.input, { color: Colors[themeMode].textMain }]}
                                        secureTextEntry={true}
                                    />
                                    {errors.password && touched.password ? (
                                        <Text style={styles.error}>{errors.password}</Text>
                                    ) : null}

                                    {!isLoading ? (
                                        <Pressable
                                            style={[styles.instancePosition]}
                                            onPress={() => handleSubmit()}>
                                            <View style={[styles.buttonStyle]}>
                                                <Text style={styles.buttonText}>Sign up</Text>
                                            </View>
                                        </Pressable>
                                    ) : (
                                        <View style={[styles.instancePosition]}>
                                            <View style={[styles.buttonStyle]}>
                                                <Loading type="bar" />
                                            </View>
                                        </View>
                                    )}

                                    <View style={styles.row}>
                                        <Text style={styles.signup}>Already have an account? </Text>
                                        <TouchableOpacity
                                            onPress={() =>  router.push('/login')}>
                                            <Text style={styles.link}>Login</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            );
                        }}
                    </Formik>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Signup;

const styles = StyleSheet.create({
    safeAreaContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 21,
        color: Colors.primary,
        fontWeight: 'bold',
        paddingVertical: 12,
    },
    forgotPassword: {
        width: '100%',
        alignItems: 'flex-end',
        marginTop: 12,
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 4,
    },
    forgot: {
        fontSize: 13,
        color: Colors.secondary,
    },
    signup: {
        color: Colors.primary,
    },
    link: {
        fontWeight: 'bold',
        color: Colors.blue,
    },
    form: {
        marginTop: 10,
        marginHorizontal: 30,
    },
    input: {
        fontSize: 14 / fontScale,
        borderWidth: 1,
        borderColor: Colors.lightGrey2,
        //   fontFamily:
        //     Platform.OS === 'ios' ? FontFamily.ios.outfit : FontFamily.android.outfit,
        marginTop: 15,
        width: '100%',
        height: 50,
        borderRadius: 5,
        paddingHorizontal: 15,
    },
    error: {
        color: 'red',
        margin: 5,
    },
    instancePosition: {
        // paddingHorizontal: 20,
        marginVertical: 10,
        marginTop: 20,
        width: '100%',
    },
    buttonStyle: {
        backgroundColor: Colors.primary,
        borderRadius: 5,
        paddingVertical: 10,
        width: '100%',
        minHeight: 50,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        textTransform: 'uppercase',
        fontWeight: '700',
        lineHeight: 26,
        color: Colors.white,
        textAlign: 'center',
        fontSize: 16 / fontScale,
        //   fontFamily:
        //     Platform.OS === 'ios'
        //       ? FontFamily.ios.outfitSemibold
        //       : FontFamily.android.outfitSemibold,
    },
    detailsForm: {
        width: '100%',
        textAlign: 'center',
        marginTop: 5,
        // marginBottom: 350,
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});


