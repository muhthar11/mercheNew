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
} from "react-native";
import React, { useContext, useState } from "react";
import { Formik } from "formik";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/assets/Colors";
import { UserContext } from "@/context/UserContext";
import Toast from "react-native-simple-toast";
import { Base64 } from "js-base64";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from "@/components/elements/Loading";
import Logo from "@/components/elements/Logo";
import { useRouter } from "expo-router";

let fontScale = Dimensions.get("window").fontScale;

const Login = () => {
  console.log("welcome to login");
  const { emailPasswordLogin } = useContext(UserContext)!;
  const themeMode = useColorScheme();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    email: "",
    password: "",
  };
  const validate = (values: { password: any; email: string }) => {
    const errors: any = {};
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Invalid email address";
    }
    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 6) {
      errors.password = "Password must be at least 6 characters long.";
    }
    return errors;
  };
  const userLogin = async (values: any) => {
    setIsLoading(true);
    // console.log('values', values);
    const email = values.email;
    const password = values.password;
    try {
      const result = await emailPasswordLogin(email, password);
      // console.log(
      //   "result",
      //   result,
      //   "app.currentUser",
      //   JSON.stringify(app.currentUser)
      // );
      setIsLoading(false);
      AsyncStorage.setItem("email", JSON.stringify(Base64.encode(email)));
      AsyncStorage.setItem("password", JSON.stringify(Base64.encode(password)));
      // navigation.navigate("TokenLoading");
      // router.replace("/home");
    } catch (err) {
      Toast.showWithGravity("Login Failed", Toast.LONG, Toast.BOTTOM);
      setIsLoading(false);
    }
  };
  return (
    <SafeAreaView
      style={[
        styles.safeAreaContainer,
        {
          backgroundColor: themeMode === "dark" ? "black" : "#ffffffe7",
        },
      ]}
    >
      <Logo />
      <Text style={styles.header}>Welcome back.</Text>
      <View style={styles.detailsForm}>
        <Formik
          initialValues={initialValues}
          onSubmit={userLogin}
          validate={validate}
        >
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
                  autoCorrect={false}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  placeholder={"Email"}
                  placeholderTextColor={Colors.lightGrey2}
                  // placeholderStyle={styles.placeholder}
                  style={[styles.input, { color: Colors[themeMode].black }]}
                />
                {errors.email && touched.email ? (
                  <Text style={styles.error}>{errors.email}</Text>
                ) : null}

                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  placeholder={
                    "Password"
                  }
                  // value="+962 507851348"
                  placeholderTextColor={Colors.lightGrey2}
                  // placeholderStyle={styles.placeholder}
                  style={[styles.input, { color: Colors[themeMode].black }]}
                  secureTextEntry={true}
                />
                {errors.password && touched.password ? (
                  <Text style={styles.error}>{errors.password}</Text>
                ) : null}
                <View style={styles.forgotPassword}>
                  <TouchableOpacity
                  // onPress={() => navigation.navigate("ForgotPassword")}
                  >
                    <Text style={styles.forgot}>Forgot your password?</Text>
                  </TouchableOpacity>
                </View>
                {!isLoading ? (
                  <Pressable
                    style={[styles.instancePosition]}
                    onPress={() => handleSubmit()}
                  >
                    {/* onPress={() => navigation.navigate('Home')}> */}
                    <View style={[styles.buttonStyle]}>
                      <Text style={styles.buttonText}>Login</Text>
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
                  <Text style={styles.signup}>Don’t have an account? </Text>
                  <TouchableOpacity
                    onPress={() => router.push('/signUp')}
                  >
                    <Text style={styles.link}>Sign up</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        </Formik>
      </View>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 21,
    color: Colors.primary,
    fontWeight: "bold",
    paddingVertical: 12,
  },
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginTop: 12,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: Colors.secondary,
  },
  signup: {
    color: Colors.textMain,
  },
  link: {
    fontWeight: "bold",
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
    width: "100%",
    height: 50,
    borderRadius: 5,
    paddingHorizontal: 15,
  },
  error: {
    color: "red",
    margin: 5,
  },
  instancePosition: {
    // paddingHorizontal: 20,
    marginVertical: 10,
    marginTop: 20,
    width: "100%",
  },
  buttonStyle: {
    backgroundColor: Colors.primary,
    borderRadius: 5,
    paddingVertical: 10,
    width: "100%",
    minHeight: 50,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    textTransform: "uppercase",
    fontWeight: "700",
    lineHeight: 26,
    color: Colors.white,
    textAlign: "center",
    fontSize: 16 / fontScale,
    //   fontFamily:
    //     Platform.OS === 'ios'
    //       ? FontFamily.ios.outfitSemibold
    //       : FontFamily.android.outfitSemibold,
  },
  detailsForm: {
    width: "100%",
    textAlign: "center",
    marginTop: 5,
    // marginBottom: 350,
  },
});
