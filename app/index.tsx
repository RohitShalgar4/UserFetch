import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';

export default function Index() {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load fonts if needed
  const [fontsLoaded] = useFonts({
    'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
    'Inter-SemiBold': require('../assets/fonts/Inter-SemiBold.ttf'),
    'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://random-data-api.com/api/users/random_user?size=80');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
      console.error('Error fetching users:', error);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < users.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" className="text-blue-500" />
        <Text className="mt-3 text-base text-gray-600">Loading user data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100 p-5">
        <Text className="text-base text-red-500 mb-5 text-center">Error: {error}</Text>
        <TouchableOpacity 
          className="bg-blue-500 py-3 px-5 rounded-md"
          onPress={fetchUsers}
        >
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!users.length) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100 p-5">
        <Text className="text-base text-red-500 mb-5 text-center">No users found</Text>
        <TouchableOpacity 
          className="bg-blue-500 py-3 px-5 rounded-md"
          onPress={fetchUsers}
        >
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentUser = users[currentIndex];

  return (
    <View className="flex-1 bg-gray-100 p-5 justify-center items-center">
      <StatusBar style="auto" />
      <View className="bg-white rounded-xl p-5 w-full max-w-md shadow-md">
        <View className="items-center">
          <Image 
            source={{ uri: currentUser.avatar }} 
            className="w-24 h-24 rounded-full mb-4 bg-gray-200"
            resizeMode="cover" 
          />
          
          <Text className="text-xl font-bold text-gray-800 mb-1">User Information</Text>
          <Text className="text-sm text-gray-500 mb-5">User {currentIndex + 1} of {users.length}</Text>
        </View>
        
        <ScrollView className="w-full mb-5" showsVerticalScrollIndicator={false}>
          <InfoRow label="ID" value={currentUser.id} />
          <InfoRow label="UID" value={currentUser.uid} />
          <InfoRow label="Password" value={currentUser.password} />
          <InfoRow label="First Name" value={currentUser.first_name} />
          <InfoRow label="Last Name" value={currentUser.last_name} />
          <InfoRow label="Username" value={currentUser.username} />
          <InfoRow label="Email" value={currentUser.email} />
        </ScrollView>

        <View className="flex-row justify-between w-full">
          <TouchableOpacity 
            className={`py-2 px-5 rounded-md min-w-[100] items-center ${currentIndex === 0 ? 'bg-gray-300' : 'bg-blue-500'}`}
            onPress={handlePrevious}
            disabled={currentIndex === 0}
          >
            <Text className="text-white font-semibold">Previous</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className={`py-2 px-5 rounded-md min-w-[100] items-center ${currentIndex === users.length - 1 ? 'bg-gray-300' : 'bg-blue-500'}`} 
            onPress={handleNext}
            disabled={currentIndex === users.length - 1}
          >
            <Text className="text-white font-semibold">Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const InfoRow = ({ label, value }) => (
  <View className="flex-row py-2 border-b border-gray-100">
    <Text className="w-1/3 font-semibold text-gray-600">{label}:</Text>
    <Text className="w-2/3 text-gray-800">{value}</Text>
  </View>
);