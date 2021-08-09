import React, { useState, useEffect } from "react";
import {
  View,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  FlatList,
  Text,
  RefreshControl,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import * as axios from "axios";
import styles from "HomeStyles";

const BASE_URL = "https://min-api.cryptocompare.com/data/pricemulti";
const FSYMS = "ETH,DASH,BTC";
const TSYMS = "BTC,USD,EUR";
const API_KEY =
  "1e81f42d5fd7737868e5ade628776c124a30e5f3d41206d875b29da9ca65a3df";

const LogonComponent = (props) => {
  const [isFetching, setFetching] = useState(false);
  const [data, setData] = useState([]);
  const [isConnected, setConnectivityState] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    NetInfo.addEventListener(handleConnectivityChange);
    NetInfo.fetch().done((isConnected) => {
      setConnectivityState(isConnected);
    });

    getCryptoData();

    let interval = setInterval(() => {
      getCryptoData();
    }, 10 * 1000); //60 seconds

    return () => {
      clearInterval(interval);
    };
  }, []);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getCryptoData();
  }, []);

  const handleConnectivityChange = (isConnected) => {
    if (isConnected) {
      setConnectivityState(isConnected);
    } else {
      setConnectivityState(isConnected);
    }
  };

  const Item = ({ title, value }) => {
    return (
      <View style={styles.item}>
        <Text style={{fontSize: 18, fontWeight: 'bold'}}>{title}</Text>
        <View style={{ flexDirection: "row", flex: 1, marginTop: 10 }}>
          <View style={{ flex: 1 }}>
            <Text>BTC</Text>
            <Text style={{marginTop: 5}}>{value.BTC}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text>USD</Text>
            <Text style={{marginTop: 5}}>{value.USD}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text>EUR</Text>
            <Text style={{marginTop: 5}}>{value.EUR}</Text>
          </View>
        </View>
      </View>
    );
  };
  const renderItem = ({ item }) => (
    <Item title={item.name} value={item.value} />
  );

  const getCryptoData = () => {
    setFetching(true);
    return new Promise((resolve) => {
      axios
        .get(
          BASE_URL +
            "?fsyms=" +
            FSYMS +
            "&tsyms=" +
            TSYMS +
            "&api_key=" +
            API_KEY,
          {
            headers: {
              "content-type": "application/json",
            },
          }
        )
        .then((response) => {
          setRefreshing(false);
          setFetching(false);
          resolve(response);
          if (response != null) {
            // console.log("response: hey hey: " + JSON.stringify(response.data));
            let dataObj = response.data;

            var dataArray = [];
            var keys = Object.keys(dataObj);
            keys.forEach(function (key) {
              let childObject = { name: key, value: dataObj[key] };
              dataArray.push(childObject);
            });
            setData(dataArray);
          }
        })
        .catch((err) => {
          resolve(err);
          setFetching(false);
          setRefreshing(false);
        });
    });
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : null}
      style={styles.container}
    >
      {
        <SafeAreaView
          style={{
            flex: 1,
          }}
        >
          <View style={styles.container}>
            <FlatList
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              data={data}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
            />
          </View>
        </SafeAreaView>
      }
    </KeyboardAvoidingView>
  );
};

export default LogonComponent;
