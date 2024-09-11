import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  Button,
  Dimensions,
  NativeScrollEvent,
  Animated,
  Easing,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Footer from "@/components/Footer";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from 'expo-location';
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import YoutubePlayer from 'react-native-youtube-iframe';
import debounce from 'lodash.debounce';

const images = [
  'https://o365.vn/wp-content/uploads/fvh2.jpg',
  'https://o365.vn/wp-content/uploads/HM.jpg',
  'https://o365.vn/wp-content/uploads/CP.jpg',
  'https://o365.vn/wp-content/uploads/BVDHYD.jpg'
]

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;


const aboutUs: React.FC = () => {
  // shaking icon phone
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startShaking = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shakeAnim, {
            toValue: 3,
            duration: 100,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: -3,
            duration: 100,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 0,
            duration: 100,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.delay(2000), // Delay for 3 seconds
        ])
      ).start();
    };

    startShaking();
  }, [shakeAnim]);


  //logo
  const logos = [
    { uri: 'https://o365.vn/wp-content/uploads/petro2.png' },
    { uri: 'https://o365.vn/wp-content/uploads/acb.png' },
    { uri: 'https://o365.vn/wp-content/uploads/singtel.png' },
    { uri: 'https://o365.vn/wp-content/uploads/Picture11.png' },
    { uri: 'https://o365.vn/wp-content/uploads/pvn.jpg' },
    { uri: 'https://o365.vn/wp-content/uploads/fv1.png' },
    { uri: 'https://o365.vn/wp-content/uploads/univer2.png' },

  ];
  const fillRow = (row: Array<{ uri: string } | null>): Array<{ uri: string } | null> => {
    while (row.length < 4) {
      row.push(null);
    }
    return row;
  };

  const firstRow = fillRow(logos.slice(0, 4));
  const secondRow = fillRow(logos.slice(4, 8));

  // icon tab
  const [isActive, setIsActive] = useState(false);

  const toggleActive = () => {
    setIsActive(!isActive);
  };

  // tab 
  const [activeTab, setActiveTab] = useState('Implementation'); // State to track active tab

  const handleTabPress = (tabName: React.SetStateAction<string>) => {
    setActiveTab(tabName); // Update active tab state
    // You can add logic here to handle tab changes (e.g., fetching data for the selected tab)
  };

  const tabContent = {
    Implementation: [
      'Web App & SharePoint Design Branding UI',
      'Custom Workflows Application development',
      'Web app and SharePoint Business Intelligent',
      'Advanced Document Management System',
      'Internal/External System Integration',
      'Lotus Notes Migration to SharePoint',
      'SharePoint Upgrade and migration',
      'IT operation and maintenance service',
      'Email and data migration to Office365',
    ],
    Training: [
      'SharePoint Saturday Viet Nam Community',
      'Vietnam SharePoint UserGroup',
      'SharePoint 2010, 2013, 2016 – Application Development',
      'SharePoint 2010, 2013, 2016 – Administration & Management',
      'SharePoint Online Application Development',
      'Office365 Administraion, Operation and Management',
    ],
    Consultant: [
      'Infrastructure Planning and Designing',
      'License Advice and Recommendation',
      'Sales/Presale Support',
      'Mobile App development',
      'SharePoint HR Support',
      'Hosting and Security management',
      'SharePoint Hosting Maintaining and Operating',
    ],
  };

  //slide
  const [imgActive, setImgActive] = useState(0);

  // Function to change active image
  const changeImage = () => {
    const nextImage = (imgActive + 1) % images.length; // Calculate next image index
    setImgActive(nextImage);
  };

  // useEffect to auto slide every 1 second
  useEffect(() => {
    const interval = setInterval(() => {
      changeImage();
    }, 2800); // Change image every 1 second (1000 milliseconds)

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, [imgActive]); // Run useEffect when imgActive changes

  const onchange = (nativeEvent: NativeScrollEvent) => {
    if (nativeEvent) {
      const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
      if (slide != imgActive) {
        setImgActive(slide);
      }
    }

  }

  //animation running
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const runAnimation = () => {
      Animated.loop(
        Animated.timing(animatedValue, {
          toValue: WIDTH,
          duration: 2850, // 2 seconds
          easing: Easing.linear,
          useNativeDriver: false, // Since we're animating layout properties
        })
      ).start();
    };

    runAnimation();
  }, [animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, WIDTH],
    outputRange: [0, WIDTH]
  });

  //maps
  const predefinedRegion = {
    latitude: 10.799443569656656,
    latitudeDelta: 0.005, // Increase delta to reduce detail
    longitude: 106.63737025012118,
    longitudeDelta: 0.005,
  };

  const mapViewRef = useRef<MapView | null>(null); // Declare mapViewRef with MapView or null type
  const [mapRegion, setMapRegion] = useState(predefinedRegion);
  const [shouldAnimate, setShouldAnimate] = useState(false); // Track if animation is needed

  const backLocation = () => {
    setShouldAnimate(true);
    setMapRegion(predefinedRegion);
  };

  const handleRegionChangeComplete = (region: React.SetStateAction<{
    latitude: number; latitudeDelta: number; // Increase delta to reduce detail
    longitude: number; longitudeDelta: number;
  }>) => {
    // Update map region without triggering animation
    if (!shouldAnimate) {
      setMapRegion(region);
    }
    setShouldAnimate(false); // Reset the animation flag after region change
  };


  const [message, setMessage] = useState('');
  //email
  const openEmail = () => {
    const email = 'ngkhoa2708.joy@gmail.com'; // Replace with the recipient email
    const subject = '[Client] Contact To OPUS SOLUTION';
    const body = encodeURIComponent(message); // Encodes the message for URL safety
    const mailtoURL = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${body}`;
    Linking.openURL(mailtoURL);
  }

  //phone call
  const makePhoneCall = () => {
    if (Platform.OS === "android") {
      Linking.openURL("tel: 0932775682");
    }
    else {
      Linking.openURL("telprompt: 0932775682");
    }
  }

  //youtube video 
  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback((state: string) => {
    if (state === "ended") {
      setPlaying(false);
      Alert.alert("video has finished playing!");
    }
  }, []);




  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.aboutContainer}>
          <ImageBackground
            style={styles.imgBackground}
            source={{ uri: 'http://o365.vn/wp-content/uploads/banner21.jpg' }}
          >
            <View style={styles.overlay}>
              <Text style={styles.HeaderBackground}>DESIGN, IMPLEMENT & MANAGE
                TAILOR-MADE OUTSOURCING WEB BASE APPLICATION & SHAREPOINT DEVELOPMENT</Text>
            </View>
          </ImageBackground>
          <Text style={styles.mainHeader}>Overall</Text>
          <Text style={styles.smallHeader}>OPUS is a leading company in technology of Microsoft SharePoint, Office365 cloud application development in Vietnam with over 10 years consultant experiences. We also provide Training and Business Consult service to help our customer transform with Microsoft platform such as Office 365, SharePoint & Azure</Text>

          <Text style={styles.mainHeader}>OUR SERVICES</Text>
          <View style={styles.iconContainer}>
            {Object.keys(tabContent).map((tab, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.iconItem,
                  activeTab === tab ? styles.activeIcon : styles.inactiveIcon,
                ]}
                onPress={() => handleTabPress(tab)}
              >
                <FontAwesome
                  name={tab === 'Implementation' ? 'suitcase' : tab === 'Training' ? 'group' : 'wrench'}
                  size={26}
                  color={activeTab === tab ? "white" : "green"}
                />
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ backgroundColor: '#E6EAEA', width: '95%', height: 550, borderRadius: 30 }}>
            <View style={styles.tabContainer}>
              {Object.keys(tabContent).map((tab, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.tabItem, activeTab === tab && styles.activeTab]}
                  onPress={() => handleTabPress(tab)}
                >
                  <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.tabContent}>
              {tabContent[activeTab].map((item, index) => (
                <View key={index} style={styles.itemContainer}>
                  <FontAwesome name="check" size={20} style={styles.icon} />
                  <Text style={styles.tabContentText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          <Text style={[styles.mainHeader, { marginTop: 60 }]}>OUR WORK</Text>
          <Text style={styles.smallHeader}>Development of specific solutions, dedicated offshore team in SharePoint, Office365, asp .Net, PHP web base application, and mobile application on iOS, Android, Win Mobile, Xamarin. Below is some project that we did. </Text>
          <View style={styles.wrap}>
            <ScrollView
              onScroll={({ nativeEvent }) => onchange(nativeEvent)}
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              horizontal
              contentOffset={{ x: WIDTH * imgActive, y: 0 }}
              style={styles.wrap}
            >
              {
                images.map((e, index) =>
                  <Image
                    key={e}
                    resizeMode="cover"
                    style={styles.wrap}
                    source={{ uri: e }}

                  />
                )
              }
            </ScrollView>
            <View style={styles.wrapDot}>
              {
                images.map((e, index) =>
                  <Text
                    key={e}
                    style={imgActive == index ? styles.dotActive : styles.dotInActive}
                  >•</Text>
                )
              }

            </View>
            <Animated.View style={[styles.runningBar, { transform: [{ translateX }] }]} />

          </View>

          <View style={styles.videoContainer}>
            <YoutubePlayer
              height={300}
              play={playing}
              videoId={"QCiNqesTG7c"}
              onChangeState={onStateChange}
            />
          </View>

          <View style={{ backgroundColor: '#E6EAEA', width: '100%', height: 550, justifyContent: 'center', alignContent: 'center', marginTop: 20 }}>
            <Text style={{ textAlign: 'center', fontSize: 18, color: 'black', marginBottom: 10, fontWeight: '500' }}>OUR LOCATION</Text>
            <Text style={{ textAlign: 'center', fontSize: 14, color: 'grey', marginBottom: 30, fontWeight: '500' }}>Fl 3, HoangTam building, 138/25 Truong Cong Dinh, W14, Tan Binh, HCMC </Text>
            <View style={styles.mapContainer}>
              <MapView
                ref={mapViewRef}
                style={styles.map}
                region={mapRegion}
                onRegionChangeComplete={handleRegionChangeComplete}
              >
                <Marker coordinate={predefinedRegion} title="138/25 Truong Cong Dinh, Tan Binh" />
              </MapView>
              <Button title='Get Back Location' onPress={backLocation} />

            </View>
          </View>
          <Text style={{ textAlign: 'center', fontSize: 18, color: 'black', marginBottom: 10, fontWeight: '500', marginTop: 40 }}>OUR COLLABORATING COMPANIES</Text>
          <Text style={{ textAlign: 'center', fontSize: 14, color: 'grey', marginBottom: 20, fontWeight: '500' }}>Happy Clients </Text>
          <View style={styles.container}>
            <View style={styles.row}>
              {logos.slice(0, 4).map((logo, index) => (
                <Image key={index} source={logo} style={styles.logo} />
              ))}
            </View>
            <View style={[styles.row, { marginBottom: 30 }]}>
              {secondRow.map((logo, index) =>
                logo ? (
                  <Image key={index} source={logo} style={styles.logo} />
                ) : (
                  <View key={index} style={styles.logo} />
                )
              )}
            </View>
          </View>
          <View style={styles.contactContainer}>
            <Image
              source={require("../../assets/images/logo_Opus.png")}
              style={styles.contactImage}
              resizeMode="contain"
            />
            <Text style={styles.contactHeader}> OPUS SOLUTION COMPANY LIMITED </Text>
            <Text style={styles.contactParaStyle}> Contact Us </Text>
            <Text style={styles.contactSmallParaStyle}> Fl 3, HoangTam building, 138/25 Truong Cong Dinh, W14, Tan Binh, HCMC </Text>

            <KeyboardAvoidingView
              style={styles.contactBox}
            >
              <View style={styles.textAreaContainer}>
                <TextInput
                  style={styles.textArea}
                  placeholder="Type your message here..."
                  placeholderTextColor="grey"
                  numberOfLines={20}
                  multiline={true}
                  value={message}
                  onChangeText={setMessage}
                />
              </View>



              <View style={styles.sendContainer}>
                <TouchableOpacity
                  style={{ backgroundColor: 'white', borderRadius: 25, width: 140, height: 30, justifyContent: 'center', alignItems: 'center' }}
                  onPress={() => openEmail()}
                >
                  <Text style={styles.send}>SEND EMAIL</Text>
                </TouchableOpacity>
                <FontAwesome name='paper-plane' size={20} color='white' style={{ marginLeft: 10 }} />
              </View>
            </KeyboardAvoidingView>

          </View>
        </View>

      </ScrollView>

      {/* Call button */}
      <TouchableOpacity style={styles.callButton} onPress={makePhoneCall}>
        <Animated.View style={[styles.iconPhone, { transform: [{ translateX: shakeAnim }] }]}>
          <Feather name="phone-call" size={24} color="white" />
        </Animated.View>
      </TouchableOpacity>


      <Footer />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  callContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue', // Example background color
    padding: 10,
    borderRadius: 5,
  },
  //call phone
  iconPhone: {
    
    justifyContent: 'center',
    alignItems: 'center',
    
  },

  callButton: {
    position: 'absolute',
    bottom: 70, // Adjust as needed, above the other button
    right: 10, // Adjust as needed
    backgroundColor: '#007AFF', // Blue color
    padding: 15,
    borderRadius: 50, // Circular button
    elevation: 3, // Optional: to add some shadow on Android
    shadowColor: '#000', // Optional: to add some shadow on iOS
    shadowOffset: { width: 0, height: 2 }, // Optional: to add some shadow on iOS
    shadowOpacity: 0.8, // Optional: to add some shadow on iOS
    shadowRadius: 2, // Optional: to add some shadow on iOS
  },
  //happy user
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%', // Ensures the row takes full width
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },

  //map
  mapContainer: {
    width: '100%',
    height: 400, // Adjust the height as needed
  },
  map: {
    flex: 1,
  },
  errorMsg: {
    color: 'red',
    marginTop: 10,
  },
  successMsg: {
    color: 'green',
    marginTop: 10,
  },
  aboutContainer: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    alignItems: "center",
  },

  //slide
  wrap: {
    width: WIDTH,
    height: HEIGHT * 0.25
  },
  wrapDot: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    alignSelf: 'center'
  },
  dotActive: {
    margin: 3,
    color: 'black',

  },
  dotInActive: {
    margin: 3,
    color: 'white',
  },

  //animation running
  runningBar: {
    position: 'absolute',
    width: 500, // Width of the running bar
    height: 3, // Height of the running bar
    backgroundColor: 'green',
  },

  //backgournd
  imgBackground: {
    width: '100%', // Adjust the width as needed
    height: 200, // Adjust the height as needed
    resizeMode: 'stretch'
  },
  overlay: {
    alignItems: 'center',
  },
  HeaderBackground: {
    fontSize: 20,
    color: "#fff", // White text color to contrast with the dark overlay
    textTransform: "uppercase",
    fontWeight: "600",
    marginVertical: 10,
    textAlign: 'center', // Center the text horizontally
    marginTop: 60,
    marginBottom: 10,
    marginLeft: 22,
    marginRight: 22

  },

  // letter format
  smallHeader: {
    fontSize: 18,
    color: "black", // White text color to contrast with the dark overlay
    fontWeight: "300",
    textAlign: 'center', // Center the text horizontally
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 30
  },

  // serives
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    justifyContent: 'center',
    textAlign: 'center'
  },
  tabText: {
    fontSize: 16,
    color: '#7d7d7d',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: 'green', // Adjust color as needed
  },
  activeTabText: {
    color: 'green', // Adjust color as needed
  },
  tabContent: {
    paddingTop: 40,
    paddingLeft: 50,
    paddingRight: 50,
    paddingBottom: 5
  },
  icon: {
    marginRight: 10, // Space between the icon and the text
    color: 'green',
  },
  tabContentText: {
    fontSize: 16,
  },

  itemContainer: {
    flexDirection: 'row', // Arrange items in a row
    alignItems: 'center', // Center items vertically within the row
    marginVertical: 10, // Space between each row
  },

  //services icon
  iconContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  iconItem: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'green',
  },
  activeIcon: {
    backgroundColor: 'green',
  },
  inactiveIcon: {
    backgroundColor: 'white',
  },
  //video youtube
  videoContainer: {
    height: 200,
    width: '90%',
    marginTop: 40,
    marginBottom: 60
  },
  webview: {
    flex: 1,
  },
  //contact form
  contactContainer: {
    backgroundColor: '#187C84',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 600,
  },
  contactImage: {
    width: 100,
    height: 100,
    alignSelf: 'center'
  },
  contactHeader: {
    fontSize: 18,
    color: "white",
    textTransform: "uppercase",
    fontWeight: "500",
    padding: 10,
    marginBottom: 15
  },
  contactParaStyle: {
    fontSize: 18,
    color: "white",
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    fontWeight: '400'
  },
  contactSmallParaStyle: {
    fontSize: 13,
    color: "white",
    textAlign: 'center',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 20
  },

  //contact box
  contactBox: {
    padding: 20,
    width: '100%'
  },
  textAreaContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    backgroundColor: 'white'
  },
  textArea: {
    height: 100,
    justifyContent: 'flex-start',
    textAlign: 'left',
    textAlignVertical: 'top',

  },
  sendContainer: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'

  },
  send: {
    fontSize: 18,
    color: '#187C84',
    alignSelf: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    fontWeight: '600'
  },

  //Phonecall
  imgStyle: {
    width: 300, // Adjust the width as needed
    height: 300, // Adjust the height as needed
    resizeMode: 'contain', // Ensure the logo is contained within the dimensions
    backgroundColor: "#187C84"

  },
  mainHeader: {
    fontSize: 18,
    color: "#344055",
    textTransform: "uppercase",
    fontWeight: "600",
    marginTop: 30,
    marginBottom: 15,
    textAlign: 'center'

  },
  paraStyle: {
    fontSize: 18,
    color: "#7d7d7d",
    paddingBottom: 30,
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10
  },
  aboutLayout: {
    backgroundColor: "#4c5dab",
    paddingHorizontal: 30,
    marginVertical: 30,
  },
  aboutSubHeader: {
    fontSize: 18,
    color: "#fff",
    textTransform: "uppercase",
    fontWeight: "500",
    marginVertical: 15,

    alignSelf: "center",
  },
  aboutPara: {
    color: "#fff",
  },
  menuContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    height: 200
  },
  iconStyle: {
    width: "100%",
    height: 50,
    aspectRatio: 1,
  },
});

export default aboutUs;


