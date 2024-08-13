import { View, Text, Image, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { images } from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { useGlobalContext } from '../../context/GlobalProvider';
import { createBooking } from '../../lib/appwrite';
import { router } from 'expo-router';


const BookNow = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    date: '',
    phone: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { setUser, setIsLoggedIn } = useGlobalContext();

  const submit = async () => {
    if (form.username === "" || form.email === "" || form.date === "" || form.phone === "") {
      Alert.alert('Error', 'Please fill in all the fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createBooking(form.email, form.username, form.date, form.phone);
      Alert.alert('Success', 'Form submitted successfully');

      // Reset form fields
      setForm({
        username: '',
        email: '',
        date: '',
        phone: ''
      });

      router.push('/home');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <GestureHandlerRootView>
      <SafeAreaView className="bg-primary h-full">
        <ScrollView>
          <View className="w-full justify-center min-h-[650px] px-4 my-6">
            <Image source={images.logo} className="w-[115px] h-[35px]" resizeMode="contain" />

            <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
              Book Now to Aora
            </Text>

            <FormField
              title="Username"
              value={form.username}
              handleChangeText={(e) => setForm({ ...form, username: e })}
              placeholder=""
              otherStyles="mt-10"
            />

            <FormField
              title="Email"
              value={form.email}
              handleChangeText={(e) => setForm({ ...form, email: e })}
              placeholder=""
              otherStyles="mt-7"
              keyboardType="email-address"
            />

            <FormField
              title="Date"
              value={form.date}
              handleChangeText={(e) => setForm({ ...form, date: e })}
              placeholder="YYYY-MM-DD"
              otherStyles="mt-7"
            />

            <FormField
              title="Phone"
              value={form.phone}
              handleChangeText={(e) => setForm({ ...form, phone: e })}
              placeholder=""
              otherStyles="mt-7"
            />

            <CustomButton
              title="Book Now"
              handlePress={submit}
              containerStyles="w-full mt-7"
              textStyles=""
              isLoading={isSubmitting}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

export default BookNow;
