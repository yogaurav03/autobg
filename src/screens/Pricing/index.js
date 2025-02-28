import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Purchases from "react-native-purchases";
import { useAppState } from "../../context/AppStateContext";
import { APIURLS } from "../../utils/ApiUrl";
import api from "../../utils/Api";
import { moderateScale } from "../../utils/Scaling";
import { Club, LeftArrow, ValueMoneyCon } from "../../assets/icons";
import { ActivityIndicator } from "react-native-paper";
import Loader from "../../components/Loader";

const PricingScreen = () => {
  const navigation = useNavigation();
  const { state, dispatch } = useAppState();
  const [monthlyPlansData, setMonthlyPlan] = useState(null);
  const [isYearlyOn, setisYearlyOn] = useState(false);
  const [selectedCredits, setSelectedCredits] = useState(0);
  const [totalPrice, setTotalPrice] = useState(null);
  const [monthlySubs, setMonthlySubs] = useState([]);
  const [selectedOption, setSelectedOption] = useState({});
  const [addressAdded, setAddressAdded] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addressForm, setAddressForm] = useState({
    selectedCountry: "",
    selectedState: "",
    selectedCity: "",
    selectedAddress: "",
    selectedZip: "",
  });
  const { planId, isPayGo } = selectedOption?.newProduct || {};

  const getProducts = async (newProduct) => {
    try {
      const offerings = await Purchases.getOfferings();
      const packages = offerings?.current?.availablePackages || [];
      const packagesPayGo =
        offerings?.all?.pay_as_you_go_plan?.availablePackages || [];

      const monthlySubscriptions = [];
      const yearlySubscriptions = [];
      const payGo = [];

      packagesPayGo.forEach((item) => {
        if (item.product?.subscriptionPeriod === null) {
          newProduct?.forEach((newProd) => {
            if (item.product.price === newProd.planMonthPriceInr) {
              // Merge the objects by adding the newProduct info to the package
              item.newProduct = newProd;
            }
          });
          payGo.push(item);
        }
      });

      setMonthlySubs(payGo);

      // packages.forEach((item) => {
      //   if (item.product?.subscriptionPeriod === "P1M") {
      //     newProduct.forEach((newProd) => {
      //       if (item.product.price === newProd.planMonthPriceInr) {
      //         // Merge the objects by adding the newProduct info to the package
      //         item.newProduct = newProd;
      //       }
      //     });
      //     monthlySubscriptions.push(item);
      //   } else if (item.product?.subscriptionPeriod === "P1Y") {
      //     newProduct.forEach((newProd) => {
      //       if (item.product.pricePerYear === newProd.planYearPriceInr) {
      //         item.newProduct = newProd;
      //       }
      //     });
      //     yearlySubscriptions.push(item);
      //   } else if (item.product?.subscriptionPeriod === null) {
      //     newProduct.forEach((newProd) => {
      //       if (item.product.price === newProd.planYearPriceInr) {
      //         item.newProduct = newProd;
      //       }
      //     });
      //     payGo.push(item);
      //   }
      // });

      // setMonthlySubs(isYearlyOn ? yearlySubscriptions : monthlySubscriptions);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    const fetchPlansData = async () => {
      try {
        if (state.token) {
          const response = await api.get(APIURLS.getPlans, state.token);
          const allPlans = response.listOfPlans;
          console.log("response", response);

          // Filter the plans based on isPayGo value
          const monthlyPlans = allPlans.filter((plan) => plan.isPayGo === 0);
          const yearlyPlans = allPlans.filter((plan) => plan.isPayGo === 1);

          getProducts(yearlyPlans);
        }
      } catch (error) {
        console.error("Failed to fetch plans data:", error);
      }
    };

    fetchPlansData();
  }, [isYearlyOn]);

  const handleAddressFormSubmit = () => {
    if (
      addressForm.selectedState &&
      addressForm.selectedCity &&
      addressForm.selectedAddress &&
      addressForm.selectedZip
    ) {
      setAddressAdded(true);
      setAddressModalVisible(false);
      setTimeout(() => {
        purchasePlan();
      }, 200);
    } else {
      Alert.alert("Please fill in all address fields.");
    }
  };

  const updatePayment = async (buyId, code) => {
    const params = {
      buyId: JSON.stringify(buyId),
      status: JSON.stringify(code),
    };
    try {
      const data = await api.put(APIURLS.updatePayment, params, state.token);
      console.log("data", data);
      setLoading(false);

      if (data.code == 1) {
        Alert.alert("Purchase Successful", "Thank you for your purchase!", [
          {
            text: "OK",
            onPress: () => {
              console.log("Navigating to MainScreen");
              navigation.navigate("MainScreen");
            },
          },
        ]);
      } else if (data.code == 0) {
        Alert.alert("Purchase Failed", data?.messsage);
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Purchase Failed", "Your purchase could not be validated.");
      console.error("Failed to update payment:", error);
    }
  };

  const purchasePlan = async () => {
    const params = {
      userId: state?.profileData?.userDetails?.id,
      planId: planId,
      planType: 2,
      planCurrency: selectedOption?.product?.currencyCode,
      selectedCountry: addressForm.selectedCountry,
      selectedState: addressForm.selectedState,
      selectedCity: addressForm.selectedCity,
      selectedAddress: addressForm.selectedAddress,
      selectedZip: addressForm.selectedZip,
    };
    try {
      const data = await api.post(APIURLS.buyPlans, params, state.token);
      console.log("data", data);
      setLoading(false);

      if (data.code == 1) {
        handlePurchase(data);
      }
    } catch (error) {
      setLoading(false);

      console.error("Failed to buy plan data:", error);
    }
  };

  const handleAdress = () => {
    setAddressModalVisible(true);
  };

  const handlePurchase = async (data) => {
    try {
      if (!selectedOption) {
        Alert.alert(
          "No Package Selected",
          "Please select a package to purchase."
        );
        return;
      }
      setLoading(true);

      // Trigger purchase process for the selected package
      const purchaseInfo = await Purchases.purchasePackage(selectedOption);
      // Check if the purchase was successful by checking active entitlements
      if (purchaseInfo.customerInfo.entitlements.active) {
        console.log("purchaseInfo", purchaseInfo);
        updatePayment(data?.buyId, 1);
      } else {
        setLoading(false);
        updatePayment(data?.buyId, 0);
      }
    } catch (error) {
      console.log("error", error);
      if (error.userCancelled) {
        // Handle user cancellation
        setLoading(false);
        updatePayment(data?.buyId, 0);
      } else {
        console.error("Purchase Error:", error);
        setLoading(false);
        updatePayment(data?.buyId, 0);
      }
    }
  };

  const countryRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
  const zipCodeRegex = /^\d{5}(-\d{4})?$/;

  const validateField = (text, regex) => {
    return regex.test(text);
  };

  return (
    <SafeAreaView style={styles.safeareaviewContainer}>
      {loading && <Loader />}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.viewcontainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconStyle}
          >
            <LeftArrow />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <Modal
            animationType="slide"
            transparent={true}
            visible={addressModalVisible}
            onRequestClose={() => {
              setAddressModalVisible(false);
            }}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.modalContainer}
            >
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={styles.formHeading}>Enter your address</Text>
                      <TouchableOpacity
                        onPress={() => setAddressModalVisible(false)}
                      >
                        <Text style={{ fontSize: 20 }}>X</Text>
                      </TouchableOpacity>
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="Country"
                      value={addressForm.selectedCountry}
                      onChangeText={(text) => {
                        if (text === "" || validateField(text, countryRegex)) {
                          setAddressForm({
                            ...addressForm,
                            selectedCountry: text,
                          });
                        } else {
                          console.log("Invalid selectedCountry name");
                        }
                      }}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="State"
                      value={addressForm.selectedState}
                      onChangeText={(text) => {
                        if (text === "" || validateField(text, countryRegex)) {
                          setAddressForm({
                            ...addressForm,
                            selectedState: text,
                          });
                        } else {
                          console.log("Invalid selectedState name");
                        }
                      }}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="City"
                      value={addressForm.selectedCity}
                      onChangeText={(text) => {
                        if (text === "" || validateField(text, countryRegex)) {
                          setAddressForm({
                            ...addressForm,
                            selectedCity: text,
                          });
                        } else {
                          console.log("Invalid selectedCity name");
                        }
                      }}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Address"
                      value={addressForm.selectedAddress}
                      onChangeText={(text) => {
                        setAddressForm({
                          ...addressForm,
                          selectedAddress: text,
                        });
                      }}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="ZIP Code"
                      value={addressForm.selectedZip}
                      maxLength={6}
                      onChangeText={(text) =>
                        setAddressForm({ ...addressForm, selectedZip: text })
                      }
                      keyboardType="numeric"
                    />
                    <TouchableOpacity
                      style={styles.submitButton}
                      onPress={handleAddressFormSubmit}
                    >
                      <Text style={styles.submitButtonText}>
                        Submit Address
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </Modal>

          <View style={styles.container}>
            <Text style={styles.heading}>BOOST YOUR</Text>
            <Text style={styles.subHeading}>ONLINE CONVERSIONS</Text>

            <View style={styles.subContainer}>
              {/* <View style={styles.chooseContainer}>
                <View style={styles.rowContainer}>
                  <Text style={styles.pay}>
                    Pay <Text style={styles.montly}>monthly</Text>
                  </Text>

                  <Switch
                    value={isYearlyOn}
                    onValueChange={(value) => {
                      setisYearlyOn(value), setTotalPrice(null);
                    }}
                    thumbColor={isYearlyOn ? "#f4f3f4" : "#f4f3f4"}
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                  />

                  <Text style={styles.pay}>
                    Pay <Text style={styles.montly}>yearly</Text>
                  </Text>
                </View>
                <Text style={styles.save}>SAVE 15%</Text>
              </View> */}
              <View style={styles.subscribeContainer}>
                <View style={styles.subs}>
                  <Club width={33} height={38} />
                  <Text style={styles.subscribe}>Subscribe</Text>
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      flex: 1,
                      marginRight: -45,
                    }}
                  >
                    <ValueMoneyCon height={50} />
                    <Text
                      style={{
                        position: "absolute",
                        fontSize: 12,
                        fontWeight: "700",
                        color: "#FFFFFF",
                        top: 10,
                        right: 40,
                      }}
                    >
                      Value for money
                    </Text>
                  </View>
                </View>
                <Text style={styles.plans}>Plans</Text>
                <View style={styles.plansContainer}>
                  {monthlySubs?.map((option) => (
                    <View>
                      <TouchableOpacity
                        key={option.identifier}
                        style={styles.option}
                        onPress={() => {
                          setSelectedCredits(option.product.price),
                            setTotalPrice(option.product.price);
                          // isYearlyOn
                          //   ? setTotalPrice(option.product.pricePerYearString)
                          //   : setTotalPrice(option.product.pricePerMonthString);
                          setSelectedOption(option);
                        }}
                      >
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <TouchableOpacity
                            style={{
                              borderWidth: 1,
                              width: 18,
                              height: 18,
                              borderRadius: 10,
                              marginRight: 10,
                              justifyContent: "center",
                              alignItems: "center",
                              backgroundColor: "#FFF",
                              borderColor: "#000",
                            }}
                            onPress={() => {
                              setSelectedCredits(option.product.price),
                                setTotalPrice(option.product.price);
                              // isYearlyOn
                              //   ? setTotalPrice(option.product.pricePerYearString)
                              //   : setTotalPrice(option.product.pricePerMonthString);
                              setSelectedOption(option);
                            }}
                          >
                            <View
                              style={{
                                width: 12,
                                height: 12,
                                borderRadius: 10,
                                backgroundColor:
                                  selectedCredits === option.product.price
                                    ? "#105CA8"
                                    : "#FFF",
                              }}
                            />
                          </TouchableOpacity>

                          <Text
                            style={[
                              styles.optionText,
                              selectedCredits === option.product.price &&
                                styles.optionTextSelected,
                            ]}
                          >
                            {Platform.OS === "ios"
                              ? option.product.title
                              : option.product.title?.split(" (")[0]}
                          </Text>
                        </View>
                        <Text
                          style={[
                            styles.optionPrice,
                            selectedCredits === option.product.price &&
                              styles.optionPriceSelected,
                          ]}
                        >
                          {/* ₹
                        {isYearlyOn
                          ? (
                              option.product.pricePerMonth /
                              option.product.title.match(/\d+/)[0]
                            )?.toFixed(2)
                          : (
                              option.product.pricePerMonth /
                              option.product.title.match(/\d+/)[0]
                            )?.toFixed(2)}{" "} */}
                          {(
                            option.product.price /
                            option.product.title.match(/\d+/)[0]
                          )?.toFixed(2)}{" "}
                          {option.product?.currencyCode}/{" "}
                          <Text style={[styles.perImgPriceMonthly]}>Image</Text>
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                  <View style={styles.totalContainer}>
                    {/* {totalPrice ? (
                      <Text style={styles.totalText}>
                        {totalPrice}/ {isYearlyOn ? "year" : "month"}
                      </Text>
                    ) : null} */}
                    {totalPrice ? (
                      <Text style={styles.totalText}>
                        {totalPrice} {selectedOption?.product?.currencyCode}
                      </Text>
                    ) : null}
                  </View>
                  <TouchableOpacity
                    onPress={() => handleAdress()}
                    style={{
                      backgroundColor: "#00305F",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 10,
                      borderRadius: 10,
                      marginTop: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 16,
                        fontWeight: "800",
                      }}
                    >
                      Choose
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeareaviewContainer: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flex: 1,
    backgroundColor: "#EAF7FF",
  },
  viewcontainer: {
    flex: 1,
    padding: Platform.OS === "android" ? 10 : 20,
  },
  iconStyle: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    color: "#87B2CA",
    marginLeft: 10,
    fontSize: moderateScale(12),
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    width: "100%",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  formHeading: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#00305F",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  addressContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
  addAddressText: {
    color: "#00305F",
    fontSize: 16,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  changeAddressText: {
    color: "#FF4500",
    fontSize: 16,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  container: {
    flex: 1,
    backgroundColor: "#EAF7FF",
    alignItems: "center",
    marginTop: 20,
  },
  heading: {
    color: "#00305F",
    fontSize: moderateScale(44),
    fontWeight: "800",
  },
  subHeading: {
    color: "#37CFFF",
    fontSize: moderateScale(25),
    fontWeight: "800",
  },
  subContainer: {
    backgroundColor: "#C7EAFF",
    padding: 14,
    borderRadius: 10,
    width: "100%",
    marginTop: 20,
  },
  chooseContainer: {
    backgroundColor: "#00305F",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pay: {
    fontWeight: "500",
    fontSize: moderateScale(14),
    color: "#FFFFFF",
  },
  montly: {
    fontWeight: "900",
    fontSize: moderateScale(14),
    color: "#FFFFFF",
  },
  save: {
    color: "#00D361",
    fontWeight: "700",
    fontSize: 14,
  },
  subscribeContainer: {
    backgroundColor: "#105CA8",
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 10,
    marginVertical: 8,
    paddingTop: 20,
  },
  subs: {
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  plans: {
    color: "#34CDFE",
    fontSize: 22,
    fontWeight: "700",
    marginVertical: 10,
  },
  subscribe: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    marginLeft: 10,
  },
  plansContainer: {
    padding: 20,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 16,
    color: "#fff",
  },
  optionTextSelected: {
    fontWeight: "bold",
    color: "#fff",
  },
  optionPrice: {
    fontSize: 16,
    color: "#a5d4f3",
  },
  perImgPriceMonthly: {
    fontSize: 16,
  },
  optionPriceSelected: {
    fontWeight: "bold",
    color: "#fff",
  },
  totalContainer: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    alignItems: "center",
  },
  totalText: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default PricingScreen;
