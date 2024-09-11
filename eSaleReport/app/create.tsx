import React, { useState, useEffect } from 'react';
import {
  View, Button, Text, SafeAreaView, StyleSheet, Platform, Modal, Alert, TouchableOpacity,
  ScrollView,
  TextInput, KeyboardAvoidingView
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { StatusBar } from 'expo-status-bar';
import { shareAsync } from 'expo-sharing';
import { PDFDocument, rgb } from 'pdf-lib';
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/FontAwesome";
import { Picker } from "@react-native-picker/picker";
import Footer from '@/components/Footer';
import * as MailComposer from 'expo-mail-composer';
import { useNavigation } from '@react-navigation/native';
import index from '@/app/(tabs)';

export default function App() {
  //create request
  const navigation = useNavigation();
  const [applicant, setApplicant] = useState("Nguyen Anh Khoa");
  const [department, setDepartment] = useState("");
  const [section, setSection] = useState("");
  const [depot, setDepot] = useState("Depot");
  const [unit, setUnit] = useState("");
  const [requestDate, setRequestDate] = useState(new Date());
  const [typeOfReport, setTypeOfReport] = useState("Báo cáo bán hàng");
  const [dateOfReport, setDateOfReport] = useState(new Date());
  const [reportPrintingDate, setReportPrintingDate] = useState(new Date());
  const [note, setNote] = useState("");
  const [showDatePicker, setShowDatePicker] = useState({});
  const [checkedOptions, setCheckedOptions] = useState([]);
  // const [selectedFile, setSelectedFile] = useState(null);
  const [editingSignerId, setEditingSignerId] = useState(null);
  const [selectedApprovers, setSelectedApprovers] = useState(['', '', '', '']);
  const [signers, setSigners] = useState([
    { id: 1, name: "Nhân viên 1", selectedApprover: 'approver1' },
    { id: 2, name: "Nhân viên 2", selectedApprover: null },
    { id: 3, name: "Nhân viên hỗ trợ bán hàng (3)", selectedApprover: null },
    { id: 4, name: "Người quản lý (4)", selectedApprover: null },
  ]);

  const handleEdit = (id: number) => {
    setEditingSignerId(id);

  };

  const handleNameChange = (id: number, text: string) => {
    setSigners(
      signers.map((signer) =>
        signer.id === id ? { ...signer, name: text } : signer
      )
    );


  };

  const handleDelete = (id: number) => {
    setSigners(signers.filter((signer) => signer.id !== id));
  };

  const handleSave = () => {
    setEditingSignerId(null);
  };



  const handleAdd = () => {
    const newId = signers.length + 1;
    setSigners([
      ...signers,
      { id: newId, name: `Nhân viên ${newId}`, selectedApprover: null },
    ]);
  };

  const handleApproverChange = (signerId: number, selectedApprover: string | null) => {
    // Update signers state
    setSigners(prevSigners =>
      prevSigners.map(signer =>
        signer.id === signerId ? { ...signer, selectedApprover } : signer
      )
    );

  };


  const handleDateChange = (key: string, event: any, selectedDate: Date) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker({ ...showDatePicker, [key]: true });

    if (key === "requestDate") setRequestDate(currentDate);
    if (key === "dateOfReport") setDateOfReport(currentDate);
    if (key === "reportPrintingDate") setReportPrintingDate(currentDate);
  };

  const handleCheckChange = (option: string) => {
    if (checkedOptions.includes(option)) {
      setCheckedOptions(checkedOptions.filter((item) => item !== option));
    } else {
      setCheckedOptions([...checkedOptions, option]);
    }
  };

  const CheckBox = ({ label, checked, onPress }) => (
    <TouchableOpacity onPress={onPress}>
      <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
        <Icon name={checked ? "check-square-o" : "square-o"} size={24} />
        <Text style={{ marginLeft: 10 }}>{label}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleSaveDraft = () => {

    console.log("Save Draft:", signers);
  };

  


  const showDatePickerFor = (key: any) => {
    setShowDatePicker({ ...showDatePicker, [key]: true });
  };


  //Handle File
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showViewButton, setShowViewButton] = useState(false);
  const [signedPdfUri, setSignedPdfUri] = useState(null);
  const [signVisible, setSignVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [signingCount, setSigningCount] = useState(0);

  const signatoryNames = ['Nguyen Anh Khoa', 'Nhan vien 2', 'Nguoi ban hang', 'nguoi quan ly'];
  const signatureSpacing = 142; // Fixed spacing between signatures

  const showConfirmModal = () => setConfirmModalVisible(true);
  const hideConfirmModal = () => setConfirmModalVisible(false);

  const signDocument = async () => {
    try {
      let uri;
      let name;

      if (signedPdfUri) {
        uri = signedPdfUri;
        name = signedPdfUri.split('/').pop();
      } else {
        const { uri: originalUri, name: originalName } = selectedDocument.assets[0];
        uri = originalUri;
        name = originalName;
      }

      const existingPdfBytes = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();

      const currentSignatory = signatoryNames[signingCount % signatoryNames.length];

      // Calculate current date
      const now = new Date();
      const dateString = now.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

      // Normalize RGB values
      const r = 1 / 255;     // Red component
      const g = 175 / 255;   // Green component
      const b = 80 / 255;    // Blue component

      // Use rgb function to create color
      const color = rgb(r, g, b);

      // Draw the rectangle
      firstPage.drawRectangle({
        x: 53 + signingCount * signatureSpacing,
        y: height - 256,
        width: 70,
        height: 25,
        borderWidth: 3,
        borderColor: color,

      });

      // Draw 'SIGNED' text
      firstPage.drawText('SIGNED', {
        x: 65 + signingCount * signatureSpacing,
        y: height - 248,
        size: 12,
        color: color,

      });

      // Draw date text above the rectangle
      firstPage.drawText(dateString, {
        x: 65 + signingCount * signatureSpacing,
        y: height - 225,
        size: 7,
        color: rgb(0, 0, 0),
      });

      firstPage.drawText(currentSignatory, {
        x: 60 + signingCount * (signatureSpacing + 4),
        y: height - 267,
        size: 7,
        color: rgb(0, 0, 0),
      });
      const pdfBytes = await pdfDoc.saveAsBase64();
      const newSigningCount = signingCount + 1;
      const newSignedPdfUri = `${FileSystem.documentDirectory}signed_${newSigningCount}_${name}`;
      await FileSystem.writeAsStringAsync(newSignedPdfUri, pdfBytes, {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log('Signed PDF written to file system');

      setSignedPdfUri(newSignedPdfUri);
      setSigningCount(newSigningCount);

      await saveSelect(newSignedPdfUri, `new_signed_${newSigningCount}_${name}`);

      setModalVisible(false);
      hideConfirmModal();
      Alert.alert('Success', 'Document signed and saved successfully!');
    } catch (error) {
      console.error('Error signing document:', error);
      Alert.alert('Error', 'Failed to sign document');
    }
  };


  const selectDocument = async () => {
    try {
      const document = await DocumentPicker.getDocumentAsync({ type: '*/*' });

      if (!document.canceled) {
        console.log('Selected document:', document);
        setSelectedDocument(document);
        setShowSuccessMessage(true);
        setShowViewButton(true);
        setSignVisible(true);
        setModalVisible(true);
        setSigningCount(0);
        setSignedPdfUri(null);
      } else {
        console.log('Document selection cancelled');
      }
    } catch (error) {
      console.error('Error selecting document:', error);
      Alert.alert('Error', 'Failed to select document');
    }
  };

  const saveSelect = async (uri: string, name: string) => {
    try {
      if (Platform.OS === 'android') {
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (permissions.granted) {
          const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
          const savedUri = `${FileSystem.documentDirectory}${name}`;
          await FileSystem.writeAsStringAsync(savedUri, base64, { encoding: FileSystem.EncodingType.Base64 });
          console.log('File saved:', savedUri);
        } else {
          shareAsync(uri);
        }
      } else {
        shareAsync(uri);
      }
    } catch (error) {
      console.error('Error saving file:', error);
      Alert.alert('Error', 'Failed to save file');
    }
  };

  const handleSubmit = async () => {
    console.log('submit done');
    const userInfo = { typeOfReport, unit, depot, dateOfReport, requestDate };

    // Define the email subject
    const subject = `New eSale Report - ${typeOfReport}`;

    // Define the email body with HTML content
    const body = `
      <html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document Approval Request</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            padding: 0;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
            background-color: #f9f9f9;
        }
        h1 {
            font-size: 24px;
            color: #4CAF50;
        }
        p {
            font-size: 16px;
            line-height: 1.6;
        }
        .highlight {
            font-weight: bold;
        }
        .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Document Approval Request</h1>
        <p><span class="highlight">Applicant:</span> ${applicant}</p>
        <p>Please review the attached document and provide your approval or signature as soon as possible. If you have any questions, do not hesitate to contact us.</p>
        <p>Thank you for your prompt attention to this matter.</p>
        <div class="footer">
            <p>Best regards,</p>
            <p>khoa nguyen</p>
            
        </div>
    </div>
</body>
</html>
    `;

    // Collect selected approvers and filter out any empty or null values
    const selectedApprovers = signers
      .map(signer => signer.selectedApprover)
      .filter(approver => approver);

    // Check if there are any selected approvers
    if (!selectedApprovers || selectedApprovers.length === 0) {
      Alert.alert("Error", "Please select at least one approver.");
      return;
    }

    try {
      let documentUri = null;
      if (signedPdfUri) {
        // Use the signed document if available
        documentUri = signedPdfUri;
      } else if (selectedDocument) {
        // Fallback to the originally selected document
        documentUri = selectedDocument.assets[0].uri;
      }

      if (documentUri) {
        // Send the email using MailComposer
        const emailResult = await MailComposer.composeAsync({
          recipients: selectedApprovers,
          subject: subject,
          body: body,
          isHtml: true,
          attachments: [documentUri], // Attach the URI of the document
        });
  
        // Check if the email was sent successfully
        if (emailResult.status === 'sent') {
          Alert.alert("Success", "eSale Report Created and Email Sent to Approvers");
          navigation.navigate('index')
        } else {
          Alert.alert("Error", "Failed to send email. Please try again later.");
        }
      } else {
        Alert.alert("Error", "No document selected to sent.");
      }
    } catch (error) {
      // Handle any errors that occur during email composition
      console.error('Error sending email:', error);
      Alert.alert("Error", "Failed to send email. Please try again later.");
    }
  };


  useEffect(() => {
    if (showSuccessMessage) {
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 4000);
    }
  }, [showSuccessMessage]);

  return (
    <KeyboardAvoidingView style={{ flex: 1, }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={{ flex: 1, backgroundColor: 'white', width: '100%', justifyContent: 'center', alignContent: 'center'  }} >
        <ScrollView keyboardShouldPersistTaps='handled' style={{ flex: 1, backgroundColor: 'white', width: '98%', alignSelf: 'center', marginBottom: 50 }}>
          <Text style={styles.header}>SALES REPORT APPROVAL</Text>
          <Text style={styles.label}>Applicant</Text>
          <TextInput
            style={styles.editableFalse}
            placeholder={applicant}
            value={applicant}
            onChangeText={setApplicant}
            placeholderTextColor='gray'
            editable={false}
          />
          <Text style={styles.label}>Depot</Text>
          <TextInput
            style={styles.editableFalse}
            placeholder={depot}
            value={depot}
            placeholderTextColor='grey'
            onChangeText={setDepot}
            editable={false}
          />
          <Text style={styles.label}>Type of report</Text>
          <TextInput
            style={styles.editableFalse}
            placeholder={typeOfReport}
            placeholderTextColor='grey'
            value={typeOfReport}
            onChangeText={setTypeOfReport}
            editable={false}
          />
          <Text style={styles.label}>Department / Branch</Text>
          <TextInput
            style={styles.input}
            placeholder="Department / Branch"
            value={department}
            onChangeText={setDepartment}
            placeholderTextColor='gray'
          />
          <Text style={styles.label}>Unit</Text>
          <TextInput
            style={styles.input}
            placeholder="Select the unit"
            value={unit}
            onChangeText={setUnit}
            placeholderTextColor='grey'
          />
          <Text style={styles.label}>Date of report</Text>
          <View style={styles.dateEditableTrue}>
            <Icon
              style={styles.iconContainer}
              name="calendar"
              size={20}
              color="#000"
              editable={false}
            />
            <Text style={styles.dateText}>{dateOfReport.toDateString()}</Text>
          </View>
          <Text style={styles.label}>Section / Region</Text>
          <TextInput
            style={styles.input}
            placeholder="Select the section"
            value={section}
            onChangeText={setSection}
            placeholderTextColor='gray'
          />


          <Text style={styles.label}>Request Date</Text>
          <View style={styles.dateEditableFalse}>
            <Icon
              style={styles.iconContainer}
              name="calendar"
              size={20}
              color="#000"
              editable={false}
            />
            <Text style={styles.dateText}>{requestDate.toDateString()}</Text>
          </View>

          <Text style={styles.label}>Report printing Date</Text>
          <View style={styles.dateEditableFalse}>
            <TouchableOpacity onPress={showDatePickerFor}>
              <Icon name="calendar" size={30} color="#007AFF" />
            </TouchableOpacity>
            <Text style={styles.dateText}>{dateOfReport.toDateString()} </Text>
          </View>

          <Text style={styles.label}>Note</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter the note"
            value={note}
            onChangeText={setNote}
            placeholderTextColor='grey'
          />
          <Text style={styles.label}>
            Reason for printing report on different date:
          </Text>
          <View style={{ marginLeft: 10, marginBottom: 20 }}>
            <CheckBox
              label="Invoice SRO"
              checked={checkedOptions.includes("1")}
              onPress={() => handleCheckChange("1")}
            />
            <CheckBox
              label="The system has not yet generated invoice number(s)"
              checked={checkedOptions.includes("2")}
              onPress={() => handleCheckChange("2")}
            />
            <CheckBox
              label="Update Summary list of daily cash and sales"
              checked={checkedOptions.includes("3")}
              onPress={() => handleCheckChange("3")}
            />
            <CheckBox
              label="System error"
              checked={checkedOptions.includes("4")}
              onPress={() => handleCheckChange("4")}
            />
            <CheckBox
              label="Force majeure (natural disasters, power outages, etc.)"
              checked={checkedOptions.includes("5")}
              onPress={() => handleCheckChange("5")}
            />
            <CheckBox
              label="Sales team returned late from business trip, so Sales Assistant could not print the report on the right day."
              checked={checkedOptions.includes("6")}
              onPress={() => handleCheckChange("6")}
            />
            <CheckBox
              label="Other:"
              checked={checkedOptions.includes("7")}
              onPress={() => handleCheckChange("7")}
            />
            {checkedOptions.includes("7") && (
              <TextInput style={styles.input} placeholder="Enter the reason" />
            )}
          </View>

          <View
            style={{
              borderBottomColor: "gray",
              borderBottomWidth: 1,
              marginBottom: 10,
            }}
          ></View>
          <View style={{ marginBottom: 50, marginTop: 10 }}>
            <Text style={styles.label}>Report submitted for signature</Text>
            <View style={styles.container}>
              <TouchableOpacity
                style={styles.selectFileButton}
                onPress={selectDocument}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon
                    style={styles.iconContainer}
                    name="upload"
                    size={20}
                    color="#000"
                  />
                  <Text style={styles.selectFileButtonText}>Select File</Text>
                </View>
              </TouchableOpacity>

              {/* Confirmation Modal */}
              <Modal
                animationType="slide"
                transparent={true}
                visible={confirmModalVisible}
                onRequestClose={hideConfirmModal}
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <Text>
                      Are you sure you want to sign{" "}
                      <Text style={{ color: 'blue' }}>
                        {selectedDocument ? selectedDocument.assets[0].name : ''}
                      </Text>{" "}
                      ?
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
                      <Button title="Cancel" onPress={hideConfirmModal} />
                      <Button title="Confirm" onPress={signDocument} />
                    </View>
                  </View>
                </View>
              </Modal>

              {/* Modal to display selected document info */}
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  setModalVisible(false);
                }}
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    {selectedDocument && (
                      <>
                        <Text>Document Name: {selectedDocument.assets[0].name}</Text>
                        <Text>Document type: {selectedDocument.assets[0].mimeType}</Text>
                      </>
                    )}
                    {showSuccessMessage && (
                      <View style={styles.successMessage}>
                        <Text style={styles.successMessageText}>File has been selected !</Text>
                      </View>
                    )}
                    <Button title="Close" onPress={() => setModalVisible(false)} />
                  </View>
                </View>
              </Modal>

              {showViewButton && (
                <Button title="View Document" onPress={() => setModalVisible(true)} />
              )}
              {signVisible && (
                <Button title="Sign & Save as Document" onPress={showConfirmModal} />
              )}
              {signedPdfUri && (
                <View>
                  <Text>File had been signed:</Text>
                  <Text>{selectedDocument.assets[0].name}</Text>
                  <Text>New signed file name:</Text>
                  <Text>{signedPdfUri.split('/').pop()}</Text>
                </View>
              )}
            </View>
            <Text style={styles.label}>Documents for reference</Text>
            <View style={styles.container}>
              <TouchableOpacity
                style={styles.selectFileButton}
                onPress={selectDocument}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon
                    style={styles.iconContainer}
                    name="upload"
                    size={20}
                    color="#000"
                  />
                  <Text style={styles.selectFileButtonText}>Select File</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              borderBottomColor: "gray",
              borderBottomWidth: 1,
              marginBottom: 10,
            }}
          ></View>
          <View>
            <Text style={styles.title}>Signers</Text>
            {signers.map((signer) => (
              <View key={signer.id} style={styles.signerRow}>
                {editingSignerId === signer.id ? (
                  <TextInput
                    style={styles.inputSigner}
                    value={signer.name}
                    onChangeText={(text) => handleNameChange(signer.id, text)}
                    onBlur={handleSave}
                  />
                ) : (
                  <Text style={styles.signerName}>{signer.name}</Text>
                )}
                <View style={styles.iconContainer}>
                  {signer.name !== 'Nhân viên 1' && (
                    <TouchableOpacity onPress={() => handleEdit(signer.id)}>
                      <Icon
                        name="pencil"
                        size={25}
                        color="#007BFF"
                        style={styles.icon}
                      />
                    </TouchableOpacity>
                  )}
                  {signer.name !== 'Nhân viên 1' && (
                    <TouchableOpacity onPress={() => handleDelete(signer.id)}>
                      <Icon
                        name="close"
                        size={25}
                        color="#FF0000"
                        style={styles.icon}
                      />
                    </TouchableOpacity>
                  )}
                </View>


                <Picker
                  selectedValue={signer.selectedApprover}
                  style={styles.picker}
                  onValueChange={(itemValue) =>
                    handleApproverChange(signer.id, itemValue)
                  }
                >
                  <Picker.Item label="Select an approver" value={null} />
                  <Picker.Item label="Approver 1" value="approver1" />
                  <Picker.Item label="ngkhoa2708.joy@gmail.com" value="ngkhoa2708.joy@gmail.com" />
                  <Picker.Item label="quocvinh9026@gmail.com" value="quocvinh9026@gmail.com" />
                  <Picker.Item label="ngkhoa2708@gmail.com" value="ngkhoa2708@gmail.com" />
                  <Picker.Item label="gagaqueen772@gmail.com" value="gagaqueen772@gmail.com" />
                </Picker>
              </View>
            ))}
          </View>
          <View style={styles.buttonCenter}>
            <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
              <Text style={styles.addButtonText}>Add Signer</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.submitButton} onPress={handleSaveDraft}>
              <Text style={styles.submitButtonText}>Save Draft</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
          <StatusBar style="auto" />

        </ScrollView>
        <View>
          <Footer />
        </View>
      </View>
    </KeyboardAvoidingView>

  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 20,
    padding: 3,
  },
  editableFalse: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 20,
    marginTop: 5,
    backgroundColor: '#f0f0f0',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 20,
    marginTop: 5,
    backgroundColor: '#fff',
  },
  dateEditableFalse: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 20,
    marginTop: 5,
    backgroundColor: '#f0f0f0',
  },
  dateEditableTrue: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 20,
    marginTop: 5,
    backgroundColor: 'white',
  },
  dateText: {
    marginLeft: 10,
  },
  iconContainer: {
    marginRight: 10,
  },
  container: {
    marginTop: 10,
    marginHorizontal: 20,
  },
  selectFileButton: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  selectFileButtonText: {
    marginLeft: 10,
  },
  fileInfo: {
    marginTop: 10,
    marginLeft: 30,
  },
  fileName: {
    fontSize: 16,
    marginTop: 5,
  },
  buttonCenter: {
    alignItems: 'center',
    marginTop: 20,
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    width: '40%',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 20,
  },
  signerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 20,
  },
  signerName: {
    flex: 1,
    fontSize: 16,
    marginRight: 10,
  },
  inputSigner: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#fff',
  },
  icon: {
    padding: 8
  },
  picker: {
    width: '60%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginRight: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  successMessage: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  successMessageText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
