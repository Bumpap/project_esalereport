import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import FilterModal from './FilterModal';
import StatusButton from './StatusButton';
import create from '@/app/(tabs)';
import { useNavigation } from '@react-navigation/native';

const Header = () => {
    const navigation = useNavigation();
    const [isFilterModalVisible, setFilterModalVisible] = useState(false);
    const [filters, setFilters] = useState({
        department: '',
        section: '',
        unit: '',
        depot: '',
        createdBy: '',
        processingBy: '',
        status: '',
        dateOfReport: '',
        createdDate: '',
    });

    const toggleFilterModal = () => {
        setFilterModalVisible(!isFilterModalVisible);
    };

    const applyFilters = () => {
        console.log('Applying filters:', filters);
        toggleFilterModal(); // Close the filter modal after applying filters
    };

    return (
        <View style={styles.headerContainer}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.headerButton}>
                    <Icon name="file-excel" type="font-awesome-5" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Export</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerButton} onPress={toggleFilterModal}>
                    <Icon name="filter" type="feather" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Filter</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('create')}>
                    <Icon name="plus-circle" type="feather" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Create</Text>
                </TouchableOpacity>

                {/* <StatusButton /> */}
            </View>
            {/* Filter Modal */}
            <FilterModal
                isVisible={isFilterModalVisible}
                toggleModal={toggleFilterModal}
                filters={filters}
                setFilters={setFilters}
                applyFilters={applyFilters}
            />
        </View>
    );
};
const styles = StyleSheet.create({
    headerContainer: {
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F0ECF4',
        paddingVertical: 10,
        width: '100%'
    },

    buttonContainer: {
        flexDirection: 'row',
    },
    headerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#187C84',
        padding: 2,
        borderRadius: 10,
        marginHorizontal: 10,
        minWidth: '28%', // Adjust the width
        height: 30,
    },
    buttonText: {
        color: '#fff',
        marginLeft: 5,

    },
    note: {
        marginTop: 20,
        padding: 10,
        backgroundColor: 'lightgrey',
        borderRadius: 5,
    },
});

export default Header;