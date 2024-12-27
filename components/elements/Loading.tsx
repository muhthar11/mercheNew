/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { View, Dimensions, Text, ActivityIndicator } from 'react-native';
import LottieView from 'lottie-react-native';
import { Colors } from '@/assets/Colors';
import { Lottie } from '@/assets/Lottie';
import { useTranslation } from 'react-i18next';
const screenHeight = Math.round(Dimensions.get('window').height);

const Loading = (props: { type?: string; height?: number; justifyContent?: string; }) => {
    const { t } = useTranslation();
    const [type, setType] = useState('');
    const [height, setHeight] = useState(screenHeight - 250);
    const [justifyContent, setJustifyContent] = useState('center');

    useEffect(() => {
        if (props.type) {
            setType(props.type);
        }
    }, [props.type]);

    useEffect(() => {
        if (props.height) {
            setHeight(props.height);
        }
    }, [props.height]);

    useEffect(() => {
        if (props.justifyContent) {
            setJustifyContent(props.justifyContent);
        }
    }, [props.justifyContent]);

    switch (type) {
        case 'bar':
            return (
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 1,
                        // height: screenHeight - 250,
                        width: '100%',
                    }}>
                    <LottieView
                        style={{
                            width: 100,
                             height: 25,
                            justifyContent: 'center',
                            alignSelf: 'center',
                        }}
                        source={Lottie.loadingBar}
                        autoPlay
                        loop
                    />
                    {/* <Text style={{color: Colors.darkGrey}}>Please wait...</Text> */}
                </View>
            );

        case 'basic':
            return (
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 50,
                        width: '100%',
                    }}>
                    <ActivityIndicator
                        style={{ flex: 1, height: 30 }}
                        size="small"
                        color={Colors.primary}
                    />
                </View>
            );

        case 'default':
            return (
                <View style={{
                        alignItems: 'center',
                        justifyContent: justifyContent,
                        // justifyContent: 'flex-start',
                        paddingTop: justifyContent === 'flex-start' ? 100 : 0,
                        // flex: 1,
                        height: height,
                        width: '100%',
                    }}>
                    <>
                        <LottieView
                            style={{
                                width: 100,
                                height: 100,
                                justifyContent: 'center',
                                alignSelf: 'center',
                            }}
                            source={Lottie.loading}
                            autoPlay
                            loop
                        />
                        <Text style={{ color: Colors.darkGrey }}>
                            {t('loading.pleaseWait')}
                        </Text>
                    </>
                </View>
            );

        default:
            return <></>;
    }
};

export default Loading;
