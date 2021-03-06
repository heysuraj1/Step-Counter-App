import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground
} from "react-native";
import React, { useState } from "react";
import styles from "../styles/globalcss";
import BackPress from "../components/BackPress";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignupScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setrePassword] = useState("");
  const [message, setMessage] = useState();

  const [isloading, setIsloading] = useState(false);

  const handleSignup = () => {


   








    console.log("pressed")
    if (password.password !== repassword.repassword) {
      return setMessage("Both Passwords Don't Match");
    }
    setIsloading(true);


    console.log(userName.userName,email.email,password.password)

    axios
      .post("https://step-counter-dashboard.vercel.app/api/Signup", {
        username: userName.userName,
        email: email.email,
        password: password.password,
      })
      .then((acc) => {
        // console.log(acc.data);

        const stringifiedIt = JSON.stringify(acc.data);

        const storeData = async () => {
          try {
            await AsyncStorage.setItem("jwt", stringifiedIt);
          } catch (e) {
            console.log(e);
          }
        };
        storeData();

        navigation.replace("EnterReferalCode");
      })
      .catch((err) => {
        setIsloading(false);
        // setMessage(err.error);
        setMessage(err.response.data.error)
      });
  };

  return (
    <ImageBackground source={require('../assets/img/layoutBack.png')} resizeMode="cover" style={styles.image} >

    <ScrollView >
      <BackPress name="Signup" />
      <Text style={{  color: "#FE0097", textAlign: "center", marginTop: 10 }}>
        {message}
      </Text>

      <View style={{ marginTop: 20, marginHorizontal: 40 }}>
        <Text style={{ color: "white", marginLeft: 10, marginTop: 5 }}>
          Email
        </Text>
        <TextInput
          onChangeText={(text) => {
            setEmail({ email: text });
          }}
          keyboardType="email-address"
          style={styles.input}
        />
        <Text style={{ color: "white", marginLeft: 10, marginTop: 5 }}>
          User Name
        </Text>
        <TextInput
          keyboardType="default"
          onChangeText={(text) => {
            setUserName({ userName: text });
          }}
          style={styles.input}
        />
        <Text style={{ color: "white", marginLeft: 10, marginTop: 5 }}>
          Password
        </Text>
        <TextInput
          keyboardType="default"
          secureTextEntry={true}
          maxLength={25}
          style={styles.input}
          onChangeText={(text) => {
            setPassword({ password: text });
          }}
        />
        <Text style={{ color: "white", marginLeft: 10, marginTop: 5 }}>
          Re-Enter Password
        </Text>
        <TextInput
          keyboardType="default"
          secureTextEntry={true}
          maxLength={25}
          style={styles.input}
          onChangeText={(text) => {
            setrePassword({ repassword: text });
          }}
        />

        <View style={{ marginHorizontal: 40, marginTop: 20 }}>
          {/* <TouchableOpacity onPress={()=>navigation.navigate("ActivateAccount")}> */}
          {isloading ? (
            <>
              
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    backgroundColor: "#FE0097",
                    padding: 10,
                    borderRadius: 10,
                    color: "black",
                    fontWeight: "bold",
                  }}
                >
                  <ActivityIndicator color="white" />
                </Text>
             
            </>
          ) : (
            <>
              <TouchableOpacity onPress={handleSignup}>
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    backgroundColor: "#FE0097",
                    padding: 10,
                    borderRadius: 10,
                    fontWeight: "bold",
                  }}
                >
                  Signup
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text
            style={{
              textAlign: "center",
              color: "white",
              fontSize: 12,
              marginTop: 20,
            }}
          >
            Already Have An Account ?
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            color: "white",
            textAlign: "center",
            marginTop: 30,
            marginBottom: 30,
          }}
        >
          By signing up you agree with our{"\n"}{" "}
          <Text style={{ color: "#FE0097" }}> terms & conditions </Text>
        </Text>
      </View>
    </ScrollView>
    </ImageBackground>
  );
};

export default SignupScreen;
