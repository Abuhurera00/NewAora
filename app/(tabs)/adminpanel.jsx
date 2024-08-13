// import React, { useState, useEffect } from 'react';
// import { View, Text, ScrollView, Alert } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { getAllBookings } from '../../lib/appwrite'; // Assuming you have a function to fetch all bookings

// const AdminPanel = () => {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const fetchedBookings = await getAllBookings();
//         setBookings(fetchedBookings);
//       } catch (error) {
//         Alert.alert('Error', 'Failed to fetch bookings');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookings();
//   }, []);

//   return (
//     <GestureHandlerRootView>
//       <SafeAreaView className="bg-primary h-full">
//         <ScrollView>
//           <View className="w-full justify-center min-h-[650px] px-4 my-6">
//             <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
//               Admin Panel - Bookings
//             </Text>

//             {loading ? (
//               <Text className="text-white">Loading...</Text>
//             ) : bookings.length > 0 ? (
//               bookings.map((booking, index) => (
//                 <View key={index} className="bg-black-200 p-4 my-2 rounded">
//                   <Text className="text-white">Username: {booking.username}</Text>
//                   <Text className="text-white">Email: {booking.email}</Text>
//                   <Text className="text-white">Date: {booking.date}</Text>
//                   <Text className="text-white">Phone: {booking.phone}</Text>
//                 </View>
//               ))
//             ) : (
//               <Text className="text-white">No bookings found.</Text>
//             )}
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     </GestureHandlerRootView>
//   );
// };

// export default AdminPanel;






































































import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, Button, TextInput, Modal, RefreshControl  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CustomButton from '../../components/CustomButton';
import { StatusBar } from 'expo-status-bar'

import { getAllBookings, deleteBooking, updateBooking } from '../../lib/appwrite'; // Assuming you have these functions
import FormField from '../../components/FormField';

const AdminPanel = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editForm, setEditForm] = useState({ id: '', username: '', email: '', date: '', phone: '' });
    const [refreshing, setRefreshing] = useState(false);

    const fetchBookings = async () => {
        try {
            const fetchedBookings = await getAllBookings();
            setBookings(fetchedBookings);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        

        fetchBookings();
    }, [editModalVisible]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchBookings();
        setRefreshing(false);
    };

    const handleDeleteBooking = async (bookingId) => {
        try {
            await deleteBooking(bookingId);
            Alert.alert('Success', 'Booking deleted successfully');
            setBookings(bookings.filter((booking) => booking.$id !== bookingId));
        } catch (error) {
            Alert.alert('Error', 'Failed to delete booking');
        }
    };

    const handleEditBooking = (booking) => {
        setEditForm({
            id: booking.$id,
            username: booking.username,
            email: booking.email,
            date: booking.date,
            phone: booking.phone
        });
        setEditModalVisible(true);
    };

    const handleSaveEdit = async () => {
        try {
            await updateBooking(editForm);
            Alert.alert('Success', 'Booking updated successfully');
            setBookings(bookings.map(booking => (booking.$id === editForm.id ? { ...editForm, $id: editForm.id } : booking)));
            setEditModalVisible(false);
        } catch (error) {
            Alert.alert('Error', 'Failed to update booking');
        }
    };

    // const handleSaveEdit = async () => {
    //     // Optimistically update the UI
    //     const updatedBookings = bookings.map(booking =>
    //         booking.$id === editForm.id ? { ...editForm, $id: editForm.id } : booking
    //     );
    //     setBookings(updatedBookings);
    
    //     try {
    //         await updateBooking(editForm);
    //         Alert.alert('Success', 'Booking updated successfully');
    //         setEditModalVisible(false);
    //     } catch (error) {
    //         Alert.alert('Error', 'Failed to update booking');
    //         // Rollback UI update if needed
    //     }
    // };
    

    return (
        <GestureHandlerRootView>
            <SafeAreaView className="bg-primary h-full">
                <ScrollView  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                    <View className="w-full justify-center min-h-[650px] px-4 my-6">
                        <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
                            Admin Panel - Bookings
                        </Text>

                        {loading ? (
                            <Text className="text-white">Loading...</Text>
                        ) : bookings.length > 0 ? (
                            bookings.map((booking, index) => (
                                <View key={index} className="bg-black-200 h-auto p-4 my-2 rounded-2xl">
                                    <Text className="text-white">Username: {booking.username}</Text>
                                    <Text className="text-white">Email: {booking.email}</Text>
                                    <Text className="text-white">Date: {booking.date}</Text>
                                    <Text className="text-white">Phone: {booking.phone}</Text>
                                    {/* <Button title="Delete" onPress={() => handleDeleteBooking(booking.$id)} /> */}
                                    {/* <Button title="Edit" onPress={() => handleEditBooking(booking)} /> */}
                                    <View className="d-flex mt-2 flex-row justify-end items-center">
                                        <CustomButton
                                            title="Delete"
                                            handlePress={() => handleDeleteBooking(booking.$id)}
                                            containerStyles="w-[100px] mr-2"
                                            textStyles=""
                                        />
                                        <CustomButton
                                            title="Edit"
                                            handlePress={() => handleEditBooking(booking)}
                                            containerStyles="w-[100px]"
                                            textStyles=""
                                        />
                                    </View>
                                </View>
                            ))
                        ) : (
                            <Text className="text-white">No bookings found.</Text>
                        )}
                    </View>
                </ScrollView>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={editModalVisible}
                    onRequestClose={() => {
                        setEditModalVisible(!editModalVisible);
                    }}
                >
                    <View className="w-full flex-1 justify-center items-center">
                        <View className="bg-primary p-5 w-[80%] rounded-2xl">
                            <Text className="text-gray-100 text-2xl text-semibold font-psemibold">Edit Booking</Text>
                            <FormField
                                title="Username"
                                placeholder="Username"
                                value={editForm.username}
                                handleChangeText={(text) => setEditForm({ ...editForm, username: text })}
                                otherStyles="w-full"
                            />
                            <FormField
                                title="Email"
                                placeholder="Email"
                                value={editForm.email}
                                handleChangeText={(text) => setEditForm({ ...editForm, email: text })}
                            />
                            <FormField
                                title="Date"
                                placeholder="Date"
                                value={editForm.date}
                                handleChangeText={(text) => setEditForm({ ...editForm, date: text })}
                            />
                            <FormField
                                title="Phone"
                                placeholder="Phone"
                                value={editForm.phone}
                                handleChangeText={(text) => setEditForm({ ...editForm, phone: text })}
                            />
                            {/* <TextInput
                                placeholder="Email"
                                value={editForm.email}
                                onChangeText={(text) => setEditForm({ ...editForm, email: text })}
                            />
                            <TextInput
                                placeholder="Date"
                                value={editForm.date}
                                onChangeText={(text) => setEditForm({ ...editForm, date: text })}
                            />
                            <TextInput
                                placeholder="Phone"
                                value={editForm.phone}
                                onChangeText={(text) => setEditForm({ ...editForm, phone: text })}
                            /> */}
                            {/* <Button title="Save" onPress={handleSaveEdit} />
                            <Button title="Cancel" onPress={() => setEditModalVisible(false)} /> */}
                            <View className="flex-row justify-center items-center mt-4">
                            <CustomButton
                                title="Save"
                                handlePress={handleSaveEdit}
                                containerStyles="w-[100px] mr-2"
                                textStyles=""
                            />
                            <CustomButton
                                title="Cancel"
                                handlePress={() => setEditModalVisible(false)}
                                containerStyles="w-[100px]"
                                textStyles=""
                            />
                            </View>
                        </View>
                    </View>
                </Modal>

                <StatusBar backgroundColor='#161622' style='light' />
            </SafeAreaView>
        </GestureHandlerRootView>
    );
};

export default AdminPanel;
