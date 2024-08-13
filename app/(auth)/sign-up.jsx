import { View, Text, Image, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { images } from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { Link, Redirect, router } from 'expo-router'
import { createUser } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'


const SignUp = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [isLogged, setIsLogged] = useState(false);
  const { setUser, setIsLoggedIn } = useGlobalContext();

  const submit = async () => {
    if(form.username === "" || form.email === "" || form.password === ""){
      Alert.alert('Error', 'Please fill in all the fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // console.log('Form data:', form); // Log form data
     const result = await createUser(form.email, form.password, form.username);
     setUser(result);
     setIsLoggedIn(true);
    //  console.log('User created:', result);

    //  set it to global state

    router.replace('/home')
    } catch (error) {
      Alert.alert('Error', error.message)
    } finally{
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
              Sign up to Aora
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
              title="Password"
              value={form.password}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              placeholder=""
              otherStyles="mt-7"
            />

            <CustomButton
              title="Sign Up"
              handlePress={submit}
              containerStyles="w-full mt-7"
              textStyles=""
              isLoading={isSubmitting} />

            <View className="justify-center pt-5 flex-row gap-2">
              <Text className="text-lg text-gray-100 font-pregular">Have An account already?</Text>
              <Link href="/sign-in" className="text-lg font-psemibold text-secondary">Sign in</Link>
            </View>

          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

export default SignUp;
