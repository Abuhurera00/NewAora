import { View, Text, Image, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { images } from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { Link, Redirect, router } from 'expo-router'
import { GetCurrentUser, signIn } from '../../lib/appwrite';
import { Alert } from 'react-native';
// import { router } from 'expo-router';
import { useGlobalContext } from '../../context/GlobalProvider'


const SignIn = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const[isSubmitting, setIsSubmitting] = useState(false);
  const { setUser, setIsLoggedIn } = useGlobalContext();

  const submit = async () => {
    if(form.email === "" || form.password === ""){
      Alert.alert('Error', 'Please fill in all the fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // console.log('Form data:', form); // Log form data
      await signIn(form.email, form.password);
      const result = await GetCurrentUser();
      setUser(result);
      setIsLoggedIn(true);
    //  console.log('User created:', result);

    //  set it to global state
    Alert.alert("succes", "User signed in succesfully")
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
          <View className="w-full justify-center min-h-[82vh] px-4 my-6">
            <Image source={images.logo} className="w-[115px] h-[35px]" resizeMode="contain" />

            <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
              Log in to Aora
            </Text>

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
              title="Sign In"
              handlePress={submit}
              containerStyles="w-full mt-7"
              isLoading={isSubmitting} />

            <View className="justify-center pt-5 flex-row gap-2">
              <Text className="text-lg text-gray-100 font-pregular">Don't have An Account?</Text>
              <Link href="/sign-up" className="text-lg font-psemibold text-secondary">Sign Up</Link>
            </View>

          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

export default SignIn;
