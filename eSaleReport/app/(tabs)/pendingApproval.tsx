import { View, Text } from 'react-native'
import React from 'react'
import Footer from '@/components/Footer'

const Page = () => {
  return (
    <><View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Pending Approvals</Text>
    </View><Footer /></>
  );
};

export default Page;
