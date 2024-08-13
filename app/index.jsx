import { Text, View, Image } from 'react-native'
import 'react-native-gesture-handler';
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { Redirect, router } from 'expo-router'
// import tw from 'twrnc'
// import tw from '../tailwind';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, GestureHandlerRootView } from 'react-native-gesture-handler';
import { images } from '../constants/index';
import CustomButton from '../components/CustomButton';
import { useGlobalContext } from '../context/GlobalProvider'

const Home = () => {
   const { isLoading, isLoggedIn } = useGlobalContext();

   if(!isLoading && isLoggedIn) return <Redirect href="/home" />

  return (
    <GestureHandlerRootView>
      <SafeAreaView className="bg-primary h-full">
        <ScrollView contentContainerStyle={{ height: '100%' }}>
          <View className="w-full justify-center items-center min-h-full px-4">
            <Image source={images.logo} className="w-[130px] h-[84px]" resizeMode='contain' />
            <Image source={images.cards} className="max-w-[380px] w-full h-[300px]" resizeMode='contain' />

          <View className="relative mt-5">
         <Text className="text-3xl text-white font-bold text-center">Discover Endless Possibilties with{' '}<Text className="text-secondary-200">Aora</Text>
         </Text>

         <Image source={images.path} className="w-[136px] h-[15px] absolute -bottom-2 -right-8" resizeMode='contain' />
          </View>

          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">Where creativity meets innovation: embark on a journey of limitless exploration with Aora</Text>

          <CustomButton 
              title="Continue with Email" 
              handlePress={() => router.push('/sign-in')} 
              containerStyles="w-80 mt-5" 
              textStyles="" 
              isLoading={false}
            />

          </View>
        </ScrollView>

        <StatusBar backgroundColor='#161622' style='light' />
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default Home