import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';


const FilterModal = ({ isVisible, toggleModal, filters, setFilters, applyFilters }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={toggleModal}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <ScrollView contentContainerStyle={styles.scrollView}>
                        {/* Department */}
                        <View style={styles.criteriaContainer}>
                            <Text style={styles.label}>Department</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Department"
                            onChangeText={text => setFilters({ ...filters, department: text })}
                            value={filters.department}
                        />

                        {/* Section */}
                        <View style={styles.criteriaContainer}>
                            <Text style={styles.label}>Section</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Section"
                            onChangeText={text => setFilters({ ...filters, section: text })}
                            value={filters.section}
                        />

                        {/* Unit */}
                        <View style={styles.criteriaContainer}>
                            <Text style={styles.label}>Unit</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Unit"
                            onChangeText={text => setFilters({ ...filters, unit: text })}
                            value={filters.unit}
                        />

                        {/* Depot */}
                        <View style={styles.criteriaContainer}>
                            <Text style={styles.label}>Depot</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Depot"
                            onChangeText={text => setFilters({ ...filters, depot: text })}
                            value={filters.depot}
                        />

                        {/* Created By */}
                        <View style={styles.criteriaContainer}>
                            <Text style={styles.label}>Created By</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Created By"
                            onChangeText={text => setFilters({ ...filters, createdBy: text })}
                            value={filters.createdBy}
                        />

                        {/* Processing By */}
                        <View style={styles.criteriaContainer}>
                            <Text style={styles.label}>Processing By</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Processing By"
                            onChangeText={text => setFilters({ ...filters, processingBy: text })}
                            value={filters.processingBy}
                        />

                        {/* Status */}
                        <View style={styles.criteriaContainer}>
                            <Text style={styles.label}>Status</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Status"
                            onChangeText={text => setFilters({ ...filters, status: text })}
                            value={filters.status}
                        />

                        {/* Date of Report */}
                        <View style={styles.criteriaContainer}>
                            <Text style={styles.label}>Date of Report</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Date of Report"
                            onChangeText={text => setFilters({ ...filters, dateOfReport: text })}
                            value={filters.dateOfReport}
                        />

                        {/* Created Date */}
                        <View style={styles.criteriaContainer}>
                            <Text style={styles.label}>Created Date</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Created Date"
                            onChangeText={text => setFilters({ ...filters, createdDate: text })}
                            value={filters.createdDate}
                        />
                    </ScrollView>

                    {/* Apply and Cancel buttons */}

                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
                        <TouchableOpacity onPress={applyFilters} style={styles.filterButton}>
                            <Text style={styles.filterButtonText}>Apply</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggleModal} style={styles.filterButton}>
                            <Text style={styles.filterButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        marginTop: 15,
    },
    modalView: {
        margin: 50,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        maxHeight: '60%'
    },
    scrollView: {
        width: '100%',
        paddingVertical: 5,

    },
    criteriaContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    label: {
        fontWeight: 'normal',
        marginTop: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        width: '100%',
    },
    filterButton: {
        // marginTop:,
        backgroundColor: '#187C84',
        padding: 10,
        borderRadius: 10,
        width: 100,
        alignItems: 'center',
        marginHorizontal: 20,
    },
    filterButtonText: {
        color: '#fff',
        fontWeight: 'normal',
    },
});

export default FilterModal;


