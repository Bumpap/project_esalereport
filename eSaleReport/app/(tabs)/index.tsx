import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, GestureResponderEvent, Modal, LayoutRectangle, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useRoute } from '@react-navigation/native';
// index.tsx
import { registerRootComponent } from 'expo';
import App from '../../App';
import jwtDecode from 'jwt-decode';
import { useAuth } from '../../context/authContext';
registerRootComponent(App);
import { useFocusEffect } from '@react-navigation/native';

interface DataItem {
  requestCode: string;
  status: '1' | '2' | '3' | '4';
  type: string;
  unit: string;
  depot: string;
  dateByReport: string;
  createdBy: string;
  createdDate: string;
  processingBy: string;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const Home: React.FC = () => {
  const route = useRoute();
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [tooltipVisible, setTooltipVisible] = useState<boolean>(false);
  const [tooltipText, setTooltipText] = useState<string>('');
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number; }>({ top: 0, left: 0 });
  const [tooltipDimensions, setTooltipDimensions] = useState<{ width: number, height: number }>({ width: 0, height: 0 });
  const [loginStatus, setLoginStatus] = useState<string | null>(null);
  

  const { accessToken, promptAsync } = useAuth();
  const [username, setUsername] = React.useState<string | null>(null);

  const fetchUserProfile = async () => {
    if (accessToken) {
      try {
        const response = await fetch('https://graph.microsoft.com/v1.0/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        const userData = await response.json();
        console.log('User Profile Data:', userData);
      } catch (error) {
        console.error('Failed to fetch user profile', error);
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.loginStatus) {
        setLoginStatus(route.params.loginStatus);
        const timer = setTimeout(() => setLoginStatus(null), 2000);
        return () => clearTimeout(timer);
      }
    }, [route.params?.loginStatus])
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setTimeout(() => {
      const apiData: DataItem[] = [
        { requestCode: 'REQ001', status: '1', type: 'Type A', unit: 'Unit 1', depot: 'Depot X', dateByReport: '2024-01-01', createdBy: 'User A', createdDate: '2024-01-01', processingBy: 'Processor A' },
        { requestCode: 'REQ002', status: '2', type: 'Type B', unit: 'Unit 2', depot: 'Depot Y', dateByReport: '2024-02-01', createdBy: 'User B', createdDate: '2024-02-01', processingBy: 'Processor B' },
        { requestCode: 'REQ003', status: '3', type: 'Type C', unit: 'Unit 3', depot: 'Depot Z', dateByReport: '2024-03-01', createdBy: 'User C', createdDate: '2024-03-01', processingBy: 'Processor C' },
        { requestCode: 'REQ004', status: '4', type: 'Type D', unit: 'Unit 4', depot: 'Depot W', dateByReport: '2024-04-01', createdBy: 'User D', createdDate: '2024-04-01', processingBy: 'Processor D' },
      ];
      setData(apiData);
      setLoading(false);
    }, 2000);
  };

  useEffect(() => {
    if (tooltipVisible) {
      const timer = setTimeout(() => {
        setTooltipVisible(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [tooltipVisible]);

  const handlePress = (status: string, event: GestureResponderEvent) => {
    let statusText = '';

    switch (status) {
      case '1':
        statusText = 'Waiting for Approval';
        break;
      case '2':
        statusText = 'Rejected';
        break;
      case '3':
        statusText = 'Draft';
        break;
      default:
        statusText = 'Signed';
    }

    const { pageX, pageY } = event.nativeEvent;
    const tooltipTop = ((pageY / screenHeight) * 100);
    const tooltipLeft = ((pageX / screenWidth) * 100);
    setTooltipText(statusText);
    setTooltipPosition({ top: tooltipTop, left: tooltipLeft });
    setTooltipVisible(false);
    setTimeout(() => setTooltipVisible(true), 0);
  };

  const handleLayout = (event: { nativeEvent: { layout: LayoutRectangle; } }) => {
    const { width, height } = event.nativeEvent.layout;
    setTooltipDimensions({ width, height });
  };

  const handlePressOut = () => {
    setTooltipVisible(false);
  };

  const handlPageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurentPage(page);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ fontSize: 30 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {accessToken && <Button title="Fetch User Profile" onPress={fetchUserProfile} />}
      <Header />
      {loginStatus && (
        <View style={styles.loginStatusContainer}>
          <Text style={styles.loginStatusText}>{loginStatus}</Text>
        </View>
      )}
      <View style={styles.mainContent}>
        <ScrollView horizontal contentContainerStyle={styles.scrollViewContent} style={styles.scrollview}>

          <View style={styles.table}>
            <View style={styles.headerRow}>
              <Text style={styles.headerText} numberOfLines={1}>Request code</Text>
              <Text style={styles.headerText} numberOfLines={1}>Status</Text>
              <Text style={styles.headerText} numberOfLines={1}>Type</Text>
              <Text style={styles.headerText} numberOfLines={1}>Unit</Text>
              <Text style={styles.headerText} numberOfLines={1}>Depot</Text>
              <Text style={styles.headerText} numberOfLines={1}>Date by Report</Text>
              <Text style={styles.headerText} numberOfLines={1}>Created By</Text>
              <Text style={styles.headerText} numberOfLines={1}>Created Date</Text>
              <Text style={styles.headerText} numberOfLines={1}>Processing By</Text>
            </View>

            {(data.length === 0) ? (
              <View style={styles.placeholderSpace} />
            ) : (
              data.map((item, index) => (
                <View key={index} style={[styles.dataRow, { backgroundColor: index % 2 === 0 ? '#edecec' : '#fff' }]}>
                  <Text style={styles.dataText} numberOfLines={1} ellipsizeMode='tail'>{item.requestCode}</Text>
                  <View style={styles.dataText}>
                    <TouchableOpacity onPress={(e) => handlePress(item.status, e)}
                      onPressOut={handlePressOut} onLayout={handleLayout}>
                      <View
                        style={[styles.statusCircle,
                        item.status === '1' ? styles.statusBlue :
                          item.status === '2' ? styles.statusRed :
                            item.status === '3' ? styles.statusGreen :
                              styles.statusYellow,
                        ]}
                      />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.dataText} numberOfLines={1} ellipsizeMode='tail'>{item.type}</Text>
                  <Text style={styles.dataText} numberOfLines={1} ellipsizeMode='tail'>{item.unit}</Text>
                  <Text style={styles.dataText} numberOfLines={1} ellipsizeMode='tail'>{item.depot}</Text>
                  <Text style={styles.dataText} numberOfLines={1} ellipsizeMode='tail'>{item.dateByReport}</Text>
                  <Text style={styles.dataText} numberOfLines={1} ellipsizeMode='tail'>{item.createdBy}</Text>
                  <Text style={styles.dataText} numberOfLines={1} ellipsizeMode='tail'>{item.createdDate}</Text>
                  <Text style={styles.dataText} numberOfLines={1} ellipsizeMode='tail'>{item.processingBy}</Text>
                </View>
              ))
            )}
          </View>
        </ScrollView>
        {data.length === 0 && (
          <View style={styles.iconContainer}>
            <Feather name='inbox' size={60} color={'gray'} />
            <Text style={styles.noDataText}>No data available</Text>
          </View>
        )}
        {data.length > 0 && (
          <View style={styles.paginationWrapper}>
            <View style={styles.paginationContainer}>
              <TouchableOpacity onPress={() => handlPageChange(currentPage - 1)} disabled={currentPage === 1}>
                <Text style={styles.pageText}>&lt;</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.currentPageText}>{currentPage}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handlPageChange(currentPage + 1)} disabled={currentPage === 1}>
                <Text style={styles.pageText}>&gt;</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {tooltipVisible && (
          <View style={[styles.tooltip,
          {
            top: (tooltipPosition.top / 100) * screenHeight - (tooltipDimensions.height + (1.73 * 100)),
            left: (tooltipPosition.left / 100) * screenWidth - (tooltipDimensions.width - (0.3 * 100)),
          },
          ]}>
            <Text style={styles.tooltipText}>{tooltipText}</Text>
          </View>
        )}
      </View>

      <Footer />
    </View>
  );
}
export default Home;

const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  info: {
    fontSize: 18,
    marginVertical: 5,
  },

  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  mainContent: {
    flex: 1,
    paddingHorizontal: '2%'
  },

  scrollview: {
    flex: 1,
  },

  scrollViewContent: {
    flexDirection: 'row',
    flexWrap: 'nowrap'
  },

  table: {
    // flexDirection: 'column'
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: '2%',

    // borderBottomWidth: 1,
  },

  headerText: {
    flex: 1,
    textAlign: 'center',
    justifyContent: 'center',
    color: 'black',
    fontWeight: 'bold',
    width: 100,
  },

  placeholderSpace: {
    width: '100%',
    height: '100%',
  },

  dataRow: {
    flexDirection: 'row',
    paddingVertical: '1%',
    // borderBottomWidth: 1,
  },

  dataText: {
    flex: 1,
    textAlign: 'center',
    // paddingHorizontal: '3%',
    width: 100,
  },

  iconContainer: {
    position: 'absolute',
    top: '50%',
    left: '40%',
    justifyContent: 'center',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    alignItems: 'center',
  },

  noDataText: {
    fontSize: 18,
    color: 'gray',
  },

  paginationWrapper: {
    alignItems: 'flex-end',
    paddingRight: 10,
    paddingBottom: 10,
  },

  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  pageText: {
    marginHorizontal: 5,
    fontSize: 16,
    color: 'black',
  },

  currentPageText: {
    marginHorizontal: 5,
    fontSize: 16,
    color: '#3870d1',
    fontWeight: 'bold',
  },

  statusCircle: {
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    width: '25%',
    height: 16,
    borderRadius: 5,
  },

  statusBlue: {
    backgroundColor: '#3477ec',
  },

  statusRed: {
    backgroundColor: '#dc4040',
  },

  statusGreen: {
    backgroundColor: '#ecc53e',
  },

  statusYellow: {
    backgroundColor: '#f2f261',
  },

  tooltip: {
    position: 'absolute',
    backgroundColor: '#41413a',
    padding: 10,
    borderRadius: 5,
  },

  tooltipText: {
    color: '#fff',
  },
  loginStatusContainer: {
    backgroundColor: 'green',
    padding: 10,
    alignItems: 'center',
  },
  loginStatusText: {
    color: 'white',
    fontWeight: 'bold',
  },
})

