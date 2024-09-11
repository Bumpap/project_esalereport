import React, { Component, Context, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ImageBackground, StyleSheet, ScrollView, Modal, Button, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AntDesign, Entypo, FontAwesome, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import Qrcode from '../../components/QrCode';
import Footer from '../../components/Footer';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from './../../context/authContext'; // Adjust the import path as needed
import AsyncStorage from '@react-native-async-storage/async-storage';
import { withNavigationFocus } from '@react-navigation/native'; // Import this
import { NavigationEvents } from 'react-navigation';

interface MyProfileProps {
  navigation: any;
  activeTab: string;
  isModalVisible1: boolean;
  isModalVisible2: boolean;
  selectedImage: string | null;
  selectedImageBackground: string | null;
  isFocused: boolean; // Ensure this is passed correctly
}

interface MyProfileState {
  activeTab: string;
  isModalVisible1: boolean;
  isModalVisible2: boolean;
  selectedImage: string | null;
  selectedImageBackground: string | null;
  userProfile: any; // State to store user profile data
  loading: boolean; // State to indicate loading status
  accessToken: string | null; // State to store access token
}

class MyProfile extends Component<MyProfileProps, MyProfileState> {

  constructor(props: MyProfileProps) {
    super(props);
    this.state = {
      activeTab: 'overview',
      isModalVisible1: false,
      isModalVisible2: false,
      selectedImage: null,
      selectedImageBackground: null,
      userProfile: null,
      loading: false,
      accessToken: null, // Initialize accessToken as null
    };
  }

  async componentDidMount() {
    await this.retrieveAccessToken();
    this.fetchUserProfile();
    this.props.navigation.addListener('focus', this.fetchUserProfile); // Listen for focus event
  }

  async componentDidUpdate(prevProps: MyProfileProps, prevState: MyProfileState) {
    if (prevState.accessToken !== this.state.accessToken) {
      this.fetchUserProfile();
    }
  }

  componentWillUnmount() {
    this.props.navigation.removeListener('focus', this.fetchUserProfile); // Clean up listener
  }

  retrieveAccessToken = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (accessToken) {
        this.setState({ accessToken });
      }
    } catch (error) {
      console.error('Error retrieving access token', error);
    }
  };


  fetchUserProfile = async () => {
    try {
      this.setState({ loading: true });
      const { accessToken } = this.state; // Use accessToken from state
      if (accessToken) {
        const response = await fetch('https://graph.microsoft.com/beta/me/profile', { // Updated endpoint
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const userData = await response.json();
          console.log('User profile data:', userData);
          this.setState({ userProfile: userData, loading: false });
        } else {
          throw new Error('Failed to fetch user profile');
        }
      } else {
        throw new Error('No access token found');
      }
    } catch (error) {
      console.error('Failed to fetch user profile', error);
      this.setState({ loading: false });
    }
  };


  handleEditBackground = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        this.saveImageBackground(result.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
    }
  };

  saveImageBackground = async (imageUri: string) => {
    try {
      this.setState({ selectedImageBackground: imageUri });
    } catch (error) {
      console.error(error);
    }

  };

  handleCameraOpen = async () => {
    try {
      await ImagePicker.requestCameraPermissionsAsync();
      let result = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.front,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1
      });

      if (!result.canceled) {
        await this.saveImage(result.assets[0].uri);

      }
    } catch (error) {

    }

  };

  handleGalleryOpen = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        this.saveImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
    }
  };

  saveImage = async (imageUri: string) => {
    try {
      this.setState({ selectedImage: imageUri });
      console.log(imageUri);
    } catch (error) {
      console.error(error);
    }
    return imageUri;
  };

  handleTabPress = (tab: string) => {
    this.setState({ activeTab: tab });
  };

  toggleModalEditAvatar = () => {
    this.setState({
      isModalVisible2: !this.state.isModalVisible2,
    });
  };

  toggleModal = () => {
    this.setState({
      isModalVisible1: !this.state.isModalVisible1,
    });
  };

  renderOverViewInfo = () => {
    const { userProfile } = this.state;
    if (!userProfile) {
      return <Text>Loading profile...</Text>;
    }


    const firstName = userProfile?.names?.[0]?.first || 'N/A';
    const lastName = userProfile?.names?.[0]?.last || 'N/A';
    const id = userProfile?.positions?.[0]?.id || 'N/A';
    const userEmail = userProfile?.account?.[0]?.userPrincipalName || 'N/A';
    const displayName = userProfile?.names?.[0]?.displayName || 'N/A';

    return (
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Login:</Text>
          <Text style={styles.detailText}>
            {userEmail.split('@')[0] || 'N/A'}
          </Text>

        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Email:</Text>
          <Text style={styles.detailText}>{userEmail}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Employee Number:</Text>
          <Text style={styles.detailText}>123456</Text>

        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>First Name:</Text>
          <Text style={styles.detailText}>{firstName}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Last Name:</Text>
          <Text style={styles.detailText}>{lastName}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Sex:</Text>
          <Text style={styles.detailText}>male</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Id system:</Text>
          <Text style={styles.detailText}>{id
            ? `${id.slice(0, 6)}******${id.slice(-6)}`
            : 'N/A'}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Birth day:</Text>
          <Text style={styles.detailText}>July 2, 1990</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Job title:</Text>
          <Text style={styles.detailText}>React Native Mobile Dev</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Position:</Text>
          <Text style={styles.detailText}>Intern</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Company:</Text>
          <Text style={styles.detailText}>Opus_solution</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Unit:</Text>
          <Text style={styles.detailText}></Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Function:</Text>
          <Text style={styles.detailText}></Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Department:</Text>
          <Text style={styles.detailText}></Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Sections/Teams:</Text>
          <Text style={styles.detailText}></Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Groups:</Text>
          <Text style={styles.detailText}></Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Office location:</Text>
          <Text style={styles.detailText}></Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Belong to departments:</Text>
          <Text style={styles.detailText}>Intern 2024</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Cost Center:</Text>
          <Text style={styles.detailText}></Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Rank:</Text>
          <Text style={styles.detailText}></Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Employee type:</Text>
          <Text style={styles.detailText}></Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Rights:</Text>
          <Text style={styles.detailText}></Text>
        </View>
      </View>
    );
  };

  renderAdditionalInfo = () => {
    const { userProfile } = this.state;
    const userEmail = userProfile?.account?.[0]?.userPrincipalName || 'N/A';
    const displayName = userProfile?.names?.[0]?.displayName || 'N/A';
    return (
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Nation:</Text>
          <Text style={styles.detailText}>Viet Nam</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Phone:</Text>
          <Text style={styles.detailText}>123456789</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>ID card number:</Text>
          <Text style={styles.detailText}></Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Date of ID card:</Text>
          <Text style={styles.detailText}></Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Place of ID card</Text>
          <Text style={styles.detailText}></Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Health insurance:</Text>
          <Text style={styles.detailText}></Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Starting date</Text>
          <Text style={styles.detailText}>1/1/2000</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Starting date official:</Text>
          <Text style={styles.detailText}></Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Leaving date:</Text>
          <Text style={styles.detailText}>1/1/2000</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Start date maternity leave:</Text>
          <Text style={styles.detailText}></Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Note:</Text>
          <Text style={styles.detailText}>nothing</Text>
        </View>

        <View style={styles.newSectionDetail}>
          <View style={styles.blockTitleContainer}>
            <Icon name="briefcase" size={20} color="#000" />
            <Text style={styles.blockTitle}>Literacy</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Academic level:</Text>
            <Text style={styles.detailText}></Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Specialized qualification:</Text>
            <Text style={styles.detailText}></Text>
          </View>
        </View>

        <View style={styles.newSectionDetail}>
          <View style={styles.blockTitleContainer}>
            <MaterialIcons name="contact-page" size={23} color="#000" />
            <Text style={styles.blockTitle}>Contact Info</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Business phone:</Text>
            <Text style={styles.detailText}></Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Home phone:</Text>
            <Text style={styles.detailText}></Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Personal email:</Text>
            <Text style={styles.detailText}>{userEmail}</Text>
          </View>
        </View>

        <View style={styles.newSectionDetail}>
          <View style={styles.blockTitleContainer}>
            <FontAwesome name="bank" size={20} color="#000" />
            <Text style={styles.blockTitle}>Bank Account</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Bank name:</Text>
            <Text style={styles.detailText}></Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Branch number:</Text>
            <Text style={styles.detailText}></Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Bank branch name:</Text>
            <Text style={styles.detailText}></Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Bank account number:</Text>
            <Text style={styles.detailText}></Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Bank account name:</Text>
            <Text style={styles.detailText}></Text>
          </View>
        </View>

        <View style={styles.newSectionDetail}>
          <View style={styles.blockTitleContainer}>
            <Entypo name="address" size={20} color="#000" />
            <Text style={styles.blockTitle}>Address</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Street:</Text>
            <Text style={styles.detailText}></Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Building / flatnumber:</Text>
            <Text style={styles.detailText}></Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>City:</Text>
            <Text style={styles.detailText}>Ho Chi Minh</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Province / state</Text>
            <Text style={styles.detailText}></Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Postal code</Text>
            <Text style={styles.detailText}>70000</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Country</Text>
            <Text style={styles.detailText}>Viet Nam</Text>
          </View>
        </View>

        <View>
          <TouchableOpacity onPress={this.toggleModal}>
            <View style={styles.blockTitleContainer}>
              <View style={styles.detailRow}>
                <Icon name="file" size={20} color="#000" />
                <Text style={styles.blockTitle}>Contract Information</Text>
                <Text style={{ fontSize: 14, color: 'grey' }}> *Click to view</Text>
              </View>
            </View>
          </TouchableOpacity>
          <Modal visible={this.state.isModalVisible1} onRequestClose={this.toggleModal} animationType="slide">
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Contract Details 1</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailTitle}>Type:</Text>
                <Text style={styles.detailText}>Full-time</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailTitle}>From:</Text>
                <Text style={styles.detailText}>01/01/2022</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailTitle}>To:</Text>
                <Text style={styles.detailText}>01/01/2024</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailTitle}>Signing date:</Text>
                <Text style={styles.detailText}>01/01/2022</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailTitle}>Subject:</Text>
                <Text style={styles.detailText}>Employment Contract</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailTitle}>Department:</Text>
                <Text style={styles.detailText}>Software Development</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailTitle}>Note:</Text>
                <Text style={styles.detailText}>N/A</Text>
              </View>

              <Text style={styles.modalTitle}>Contract Details 2</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailTitle}>Type:</Text>
                <Text style={styles.detailText}>Full-time</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailTitle}>From:</Text>
                <Text style={styles.detailText}>01/01/2022</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailTitle}>To:</Text>
                <Text style={styles.detailText}>01/01/2024</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailTitle}>Signing date:</Text>
                <Text style={styles.detailText}>01/01/2022</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailTitle}>Subject:</Text>
                <Text style={styles.detailText}>Employment Contract</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailTitle}>Department:</Text>
                <Text style={styles.detailText}>Software Development</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailTitle}>Note:</Text>
                <Text style={styles.detailText}>N/A</Text>
              </View>
              <TouchableOpacity onPress={this.toggleModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>

      </View>
    );
  };

  renderFamilyInfo = () => (
    <View style={styles.detailsContainer}>
      <View style={styles.detailRow}>
        <Text style={styles.detailTitle}>Martial status:</Text>
        <Text style={styles.detailText}>Married</Text>
      </View>

      <View style={styles.newSectionDetail}>
        <View style={styles.blockTitleContainer}>
          <Icon name="briefcase" size={20} color="#000" />
          <Text style={styles.blockTitle}>Emergency contact</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Contact name:</Text>
          <Text style={styles.detailText}></Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Relationship:</Text>
          <Text style={styles.detailText}></Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Phone:</Text>
          <Text style={styles.detailText}></Text>
        </View>
      </View>

      <View style={styles.newSectionDetail}>
        <View style={styles.blockTitleContainer}>
          <MaterialIcons name="contact-page" size={23} color="#000" />
          <Text style={styles.blockTitle}>Permanent Address:</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Street:</Text>
          <Text style={styles.detailText}></Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Building / flatnumber:</Text>
          <Text style={styles.detailText}></Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>City:</Text>
          <Text style={styles.detailText}></Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Province / state:</Text>
          <Text style={styles.detailText}>Ho Chi Minh</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Postal code:</Text>
          <Text style={styles.detailText}>70000</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Country:</Text>
          <Text style={styles.detailText}>Viet Nam</Text>
        </View>
      </View>
      <View>
        <TouchableOpacity onPress={this.toggleModal}>
          <View style={styles.blockTitleContainer}>
            <View style={styles.detailRow}>
              <Icon name="file" size={20} color="#000" />
              <Text style={styles.blockTitle}>Relationships</Text>
              <Text style={{ fontSize: 14, color: 'grey' }}> *Click to view</Text>
            </View>
          </View>
        </TouchableOpacity>
        <Modal visible={this.state.isModalVisible1} onRequestClose={this.toggleModal} animationType="slide">
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Relationships 1:</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailTitle}>Contact name:</Text>
              <Text style={styles.detailText}></Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailTitle}>Birthday:</Text>
              <Text style={styles.detailText}>01/01/2022</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailTitle}>Relationship:</Text>
              <Text style={styles.detailText}></Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailTitle}>Note:</Text>
              <Text style={styles.detailText}></Text>
            </View>

            <Text style={styles.modalTitle}>Relationships 2:</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailTitle}>Contact name:</Text>
              <Text style={styles.detailText}></Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailTitle}>Birthday:</Text>
              <Text style={styles.detailText}>01/01/2022</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailTitle}>Relationship:</Text>
              <Text style={styles.detailText}></Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailTitle}>Note:</Text>
              <Text style={styles.detailText}></Text>
            </View>

            <TouchableOpacity onPress={this.toggleModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>

    </View>
  );

  renderPropertiesInfo = () => (
    <View>
      <TouchableOpacity onPress={this.toggleModal}>
        <View style={styles.blockTitleContainer}>
          <View style={styles.detailRow}>
            <Icon name="file" size={20} color="#000" />
            <Text style={styles.blockTitle}>Show more</Text>
            <Text style={{ fontSize: 14, color: 'grey' }}> *Click to view</Text>
          </View>
        </View>
      </TouchableOpacity>
      <Modal visible={this.state.isModalVisible1} onRequestClose={this.toggleModal} animationType="slide">
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Equipment</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Title:</Text>
            <Text style={styles.detailText}></Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Description:</Text>
            <Text style={styles.detailText}></Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Information:</Text>
            <Text style={styles.detailText}></Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Status:</Text>
            <Text style={styles.detailText}></Text>
          </View>

          <Text style={styles.modalTitle}>IT</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Title:</Text>
            <Text style={styles.detailText}></Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Description:</Text>
            <Text style={styles.detailText}></Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Information:</Text>
            <Text style={styles.detailText}></Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Status:</Text>
            <Text style={styles.detailText}></Text>
          </View>

          <Text style={styles.modalTitle}>Mobile:</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Title:</Text>
            <Text style={styles.detailText}></Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Description:</Text>
            <Text style={styles.detailText}></Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Information:</Text>
            <Text style={styles.detailText}></Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Status:</Text>
            <Text style={styles.detailText}></Text>
          </View>

          <TouchableOpacity onPress={this.toggleModal} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );

  renderSignatureInfo = () => {
    const { userProfile } = this.state;

    // Check if userProfile and its properties are available
    const userEmail = userProfile?.account?.[0]?.userPrincipalName || 'N/A';
    const displayName = userProfile?.names?.[0]?.displayName || 'N/A';

    const createdDateTime = userProfile?.account?.[0]?.createdDateTime || 'N/A';
    const lastModifiedDateTime = userProfile?.account?.[0]?.lastModifiedDateTime || 'N/A';

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; // Formats to YYYY-MM-DD
    };

    const formattedCreatedDateTime = formatDate(createdDateTime);
    const formattedLastModifiedDateTime = formatDate(lastModifiedDateTime);

    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
        <View style={[styles.detailRow, { borderWidth: 1, borderColor: 'black', padding: 17 }]}>
          <Qrcode />
          <View style={{ marginLeft: 40, }}>
            <Text style={styles.detailTitle}>User, {displayName}</Text>
            <Text style={styles.profileEmail}>Email: {userEmail}</Text>
            <View style={{ marginTop: 10 }}>
              <Text style={styles.detailText}>
                Created Date: {formattedCreatedDateTime}
              </Text>
              <Text style={styles.detailText}>
                Last Modified Date: {formattedLastModifiedDateTime}
              </Text>
            </View>

          </View>
        </View>
      </View>
    );
  };


  renderActiveTabContent = () => {
    const { activeTab } = this.state;
    switch (activeTab) {
      case 'overview':
        return this.renderOverViewInfo();
      case 'additional':
        return this.renderAdditionalInfo();
      case 'family':
        return this.renderFamilyInfo();
      case 'properties':
        return this.renderPropertiesInfo();
      case 'signature':
        return this.renderSignatureInfo();
      default:
        return this.renderOverViewInfo();
    }
  };

  render() {
    const { isModalVisible2, selectedImage } = this.state;
    const { selectedImageBackground } = this.state;
    const { activeTab } = this.state;
    const { userProfile, loading } = this.state;
    const userEmail = userProfile?.account[0]?.userPrincipalName || 'N/A';
    const displayName = userProfile?.names[0]?.displayName;

    if (loading) {
      return <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />;
    }

    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.backgroundContainer}>
            <ImageBackground
              source={selectedImageBackground ? { uri: selectedImageBackground } : require("../../assets/images/background-user.png")}
              style={styles.imageBackground}
            >
              <TouchableOpacity style={styles.editIconContainer} onPress={this.handleEditBackground}>
                <Text>
                  <Icon name="edit" size={20} color="#fff" /> {/* Edit icon */}
                </Text>
              </TouchableOpacity>
            </ImageBackground>
          </View>
          <View style={styles.profileContainer}>
            <View style={styles.imageContainer}>
              <Image
                source={selectedImage ? { uri: selectedImage } : require('../../assets/images/user.png')}
                style={styles.profileImage}
              />
              <TouchableOpacity style={styles.editButton} onPress={this.toggleModalEditAvatar}>
                <MaterialCommunityIcons name='camera' size={30} color={'black'} />
              </TouchableOpacity>
              <Modal visible={isModalVisible2} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Choose Your New Avatar</Text>

                    <TouchableOpacity style={styles.buttonContainer} onPress={this.handleCameraOpen}>
                      <MaterialIcons name="camera-alt" size={24} color="black" style={styles.icon} />
                      <Text style={styles.buttonText}>Open Camera</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonContainer} onPress={this.handleGalleryOpen}>
                      <MaterialIcons name="photo-library" size={24} color="black" style={styles.icon} />
                      <Text style={styles.buttonText}>Open Gallery</Text>
                    </TouchableOpacity>

                    {selectedImage && (
                      <Image source={{ uri: selectedImage }} style={styles.selectedImage} resizeMode="contain" />
                    )}

                    <TouchableOpacity style={styles.closeButton} onPress={this.toggleModalEditAvatar}>
                      <MaterialIcons name="close" size={24} color="white" />
                      <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
            {userProfile ? (
              <View>
                <Text style={styles.profileName}>Welcome, {displayName}!</Text>
                <Text style={styles.profileEmail}>Email: {userEmail}</Text>
              </View>
            ) : (
              <Text>Loading profile...</Text>
            )}
          </View>

          <View style={styles.tabContainer}>
            <TouchableOpacity style={[styles.tabItem, activeTab === 'overview' && styles.activeTab]} onPress={() => this.handleTabPress('overview')}>
              <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>Overview</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabItem, activeTab === 'additional' && styles.activeTab]} onPress={() => this.handleTabPress('additional')}>
              <Text style={[styles.tabText, activeTab === 'additional' && styles.activeTabText]}>Additional</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabItem, activeTab === 'family' && styles.activeTab]} onPress={() => this.handleTabPress('family')}>
              <Text style={[styles.tabText, activeTab === 'family' && styles.activeTabText]}>Family</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabItem, activeTab === 'properties' && styles.activeTab]} onPress={() => this.handleTabPress('properties')}>
              <Text style={[styles.tabText, activeTab === 'properties' && styles.activeTabText]}>Properties</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabItem, activeTab === 'signature' && styles.activeTab]} onPress={() => this.handleTabPress('signature')}>
              <Text style={[styles.tabText, activeTab === 'signature' && styles.activeTabText]}>Signature</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.detailsContainer}>
            {this.renderActiveTabContent()}
          </View>

        </ScrollView>
        <Footer />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  backgroundContainer: {
    width: '100%',
    height: 170,
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // modal edit avatar
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 16,
    color: 'blue'
  },
  icon: {
    marginRight: 10,
  },
  closeButton: {
    marginTop: 10,
    flexDirection: 'row',
    backgroundColor: '#187C84',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center'

  },
  closeButtonText: {
    marginTop: 2,
    fontWeight: '500',
    marginLeft: 3,
    color: '#fff',
    fontSize: 16
  },
  //

  imageContainer: {
    position: 'relative',
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  editButton: {
    position: 'absolute',
    bottom: -25,
    right: -33,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 5,
    borderWidth: 2,
    borderColor: 'black'
  },
  editIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    padding: 5,
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: -70,
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 100,
    borderColor: 'black',
    borderWidth: 2,
  },
  profileName: {
    fontSize: 25,
    marginTop: 20,
    fontWeight: 'bold',
    padding: 3,
  },
  signature_profileName: {
    fontSize: 16,
    marginTop: 20,
    fontWeight: 'bold',
    padding: 3,
  },

  profileEmail: {
    fontSize: 16,
    textDecorationLine: 'underline',
    color: 'grey',
    textAlign: 'center',
    padding: 5
  },
  detailsContainer: {
    marginHorizontal: 15,
    marginTop: 7,
    paddingBottom: 30,
  },

  detailTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },

  detailText: {
    fontSize: 14,
    color: 'grey',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',

  },
  tabItem: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 40,
  },
  activeTab: {
    backgroundColor: '#187C84',
    color: "#fff",
    borderWidth: 0.5,
    borderRadius: 40,
    borderColor: 'black'

  },
  activeTabText: {
    color: '#fff', // This will set the text color to white for the active tab
    fontWeight: 'bold'
  },
  tabText: {
    fontSize: 15,
    color: '#000',
    fontWeight: '600'
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 2
  },
  newSectionDetail: {
    marginVertical: 10, // Adjust the vertical margin to separate blocks
    paddingHorizontal: 10, // Optional: add padding if needed
    backgroundColor: '#fff', // Optional: set background color for the block
    padding: 10, // Optional: add padding inside the block
    borderRadius: 10, // Optional: add border radius
  },
  blockTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 20, // Space between the title and the details
    textDecorationLine: 'underline',
    marginLeft: 10,
    marginRight: 10
  },
  blockTitleContainer: {
    flexDirection: 'row',

  },
  //contract
  detailTitleContract: {
    fontSize: 11,
    fontWeight: 'bold',
    justifyContent: 'space-between'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginTop: 10
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginBottom: 10,
    marginTop: 10
  },

  //modal choose image
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  selectedImage: {
    alignSelf: 'center',
    width: 100,
    height: 100,
    padding: 10,
  },

});

export default MyProfile;
