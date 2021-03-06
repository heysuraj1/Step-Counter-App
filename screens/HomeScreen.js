import {
  View,
  Text,
  ScrollView,
  Modal,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import styles from "../styles/globalcss";
import TopHeader from "../components/Home/TopHeader";
import Timer from "../components/Home/Timer";
import Items from "../components/Home/Items";
import CoinsEarned from "../components/Home/CoinsEarned";
import Past7Days from "../components/Home/Past7Days";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pedometer } from "expo-sensors";
import { Center } from "native-base";
import axios from "axios";
import WallateInfo from "../components/Dashboard/WallateInfo";
import Dashboard from "./Dashboard";
import Withdrawn from "./Withdrawn";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const [pedometerAvalibility, setPedometerAvalibility] = useState("");
  const [stepcounter, setStepcounter] = useState(0);
  const [showvalue, setShowvalue] = useState();
  const [userData, setUserData] = useState();
  const [goal, setGoal] = useState();
  const [currentWallate, setCurrentWallate] = useState();
  const [activeUser, setActiveuser] = useState();
  const navigation = useNavigation();

  useEffect(() => {
    ReachedAtHomeScreen();

    // removeAll()
    subscribe();

    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem("jwt");
        let parsedValue = JSON.parse(value);
        let userId = parsedValue._id;
        setShowvalue(parsedValue);

        // console.log(userId);

        const storeData = async () => {
          try {
            await AsyncStorage.setItem("ActiveUserId", userId);
          } catch (e) {
            console.log(e);
          }
        };
        storeData();
      } catch (e) {
        console.log(e);
      }
    };

    getData();

    // another section

    const getUserData = async () => {
      try {
        const ActiveUserIdValue = await AsyncStorage.getItem("ActiveUserId");
        // console.log(ActiveUserIdValue);
        setActiveuser(ActiveUserIdValue);

        const fetchUserData = async () => {
          axios
            .post(
              "https://step-counter-dashboard.vercel.app/api/dynamic/singleUser",
              {
                activeUserId: ActiveUserIdValue,
              }
            )
            .then((acc) => {
              // console.log(acc.data);
              setUserData(acc.data);
              setGoal(acc.data[0].Goal);
              setCurrentWallate(acc.data[0].wallate);
            })
            .catch((err) => {
              console.log(err);
            });
        };

        fetchUserData();
      } catch (e) {
        console.log(e);
      }
    };

    getUserData();
  }, []);

  const subscribe = () => {
    const subscription = Pedometer.watchStepCount((res) => {
      setStepcounter(res.steps);
    });

    Pedometer.isAvailableAsync()
      .then((acc) => {
        setPedometerAvalibility(acc);
      })
      .catch((err) => {
        setPedometerAvalibility(err);
      });
  };

  const removeAll = async () => {
    await AsyncStorage.removeItem("jwt");
    await AsyncStorage.removeItem("skipActivate");
    await AsyncStorage.removeItem("skipReferal");
    await AsyncStorage.removeItem("skipPricing");
    await AsyncStorage.removeItem("ActiveUserId");
    await AsyncStorage.removeItem("ReachedAtHomeScreen");
  };

  // This is counting the distance
  let Dist = stepcounter / 1300;
  let DistanceCovered = Dist.toFixed(2);

  // This is counting the calories

  let cal = DistanceCovered * 60;
  let Calories = cal.toFixed(2);

  if (stepcounter == goal) {
    console.log("add one more coin");
  }

  const handleRequestWithdrawal = () => {
    navigation.navigate("WithdrawalRequestWindow");
  };

  const ReachedAtHomeScreen = async () => {
    try {
      await AsyncStorage.setItem("ReachedAtHomeScreen", "YES");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <ScrollView style={styles.backall}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={!pedometerAvalibility}
      >
        <View
          style={{
            backgroundColor: "white",
            width: "100%",
            height: "50%",
            borderRadius: 30,
          }}
        >
          <Center>
            <Image
              source={require("../assets/img/oops.png")}
              style={styles.tinyLogo}
            />
          </Center>

          <Text
            style={{
              textAlign: "center",
              marginHorizontal: 30,
              marginTop: 10,
              fontWeight: "bold",
            }}
          >
            Your Device Don't Support Pedometer Please Change Your Device Or
            Restart App
          </Text>
          <TouchableOpacity onPress={() => setPedometerAvalibility(true)}>
            <Text
              style={{
                marginHorizontal: 100,
                textAlign: "center",
                marginTop: 30,
                backgroundColor: "black",
                color: "white",
                borderRadius: 15,
                padding: 10,
                fontWeight: "bold",
              }}
            >
              Close Alert
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <TopHeader />
      <Timer
        activeuserid={activeUser}
        curWalleteStatus={currentWallate}
        goalValue={goal}
        stepValue={stepcounter}
      />
      <Items steps={stepcounter} calory={Calories} distance={DistanceCovered} />
      <CoinsEarned />
      {/* <Past7Days /> */}


      {/* other screens  */}

      {/* <WallateInfo/> */}
      <Dashboard />

      <View style={{ marginTop: 15, marginBottom: 20 }}>
        <TouchableOpacity onPress={handleRequestWithdrawal}>
          <Text
            style={{
              backgroundColor: "#FE0097",
              textAlign: "center",
              marginHorizontal: 80,
              padding: 10,
              borderRadius: 10,
              color: "white",
              fontWeight: "bold",
            }}
          >
            Request Withdrawal
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;