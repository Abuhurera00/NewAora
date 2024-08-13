

// import { Account, Avatars, Client, Databases, ID } from 'react-native-appwrite';

// export const config = {
//   endpoint: "https://cloud.appwrite.io/v1",
//   platform: "com.hurera.aora",
//   projectId: "668e3498000d762b0b3e",
//   databaseId: "668e37070025c96d1fab",
//   userCollectionId: "668e3748001d149c7b8a",
//   videoCollectionId: "668e3787002248ac84b4",
//   storageId: "668e3a3b003b3b674189"
// };

// const client = new Client();
// client
//   .setEndpoint(config.endpoint)
//   .setProject(config.projectId)
//   .setPlatform(config.platform);

// const account = new Account(client);
// const avatars = new Avatars(client);
// const databases = new Databases(client);

// function generateValidUserId() {
//   // Generate a random string of 36 characters containing only valid characters
//   const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-.';
//   let userId = '';
//   for (let i = 0; i < 36; i++) {
//     userId += chars.charAt(Math.floor(Math.random() * chars.length));
//   }
//   // Ensure it doesn't start with a special character
//   if (/^[.-]/.test(userId)) {
//     return generateValidUserId();
//   }
//   return userId;
// }

// export const createUser = async (email, password, username) => {
//   try {
//     console.log('Creating user with:', email, password, username);

//     // Generate a valid user ID
//     const userId = generateValidUserId();

//     const newAccount = await account.create(
//       userId,
//       email,
//       password,
//       username
//     );

//     if (!newAccount) throw new Error('Account creation failed');

//     const avatarUrl = avatars.getInitials(username);

//     await signIn(email, password);

//     const newUser = await databases.createDocument(
//       config.databaseId,
//       config.userCollectionId,
//       userId,
//       {
//         accountId: newAccount.$id,
//         email,
//         password,
//         avatar: avatarUrl,
//       }
//     );

//     return newUser;
//   } catch (error) {
//     console.error('Error in fyfghcreateUser:', error);
//     throw new Error(error.message || 'Unknown error occurred');
//   }
// };

// export const signIn = async (email, password) => {
//   try {
//     const session = await account.createEmailPasswordSession(email, password);
//     console.log('User signed in:', session);
//     return session;
//   } catch (error) {
//     console.error('Error signing in:', error);
//     throw new Error(error.message || 'Sign in failed');
//   }
// };


























































import { Account, Avatars, Client, Databases, ID, Query, Storage } from 'react-native-appwrite';

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.hurera.aora",
  projectId: "668e3498000d762b0b3e",
  databaseId: "668e37070025c96d1fab",
  userCollectionId: "668e3748001d149c7b8a",
  videoCollectionId: "668e3787002248ac84b4",
  bookingCollectionId: "669cac260009c41b6dd1",
  storageId: "668e3a3b003b3b674189"
};

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  bookingCollectionId,
  storageId
} = config;

const client = new Client();
client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

function generateValidUserId() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-.';
  let userId = '';
  for (let i = 0; i < 36; i++) {
    userId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  if (/^[.-]/.test(userId)) {
    return generateValidUserId();
  }
  return userId;
}

export const createUser = async (email, password, username) => {
  try {
    console.log('Creating user with:', email, password, username);

    // Attempt to log out any active session
    try {
      await account.deleteSession('current');
    } catch (error) {
      console.warn('No active session to log out:', error);
    }

    // Generate a valid user ID
    const userId = generateValidUserId();

    const newAccount = await account.create(
      userId,
      email,
      password,
      username
    );

    if (!newAccount) throw new Error('Account creation failed');

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      userId,
      {
        accountId: newAccount.$id,
        email,
        username, // Ensure username is included here
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    console.error('Error in createUser:', error);
    throw new Error(error.message || 'Unknown error occurred');
  }
};

// export const signIn = async (email, password) => {
//   try {
//     const session = await account.createEmailPasswordSession(email, password);
//     console.log('User signed in:', session);
//     return session;
//   } catch (error) {
//     console.error('Error signing in:', error);
//     throw new Error(error.message || 'Sign in failed');
//   }
// };

export const signIn = async (email, password) => {
  try {
    // Attempt to delete any active session for the user
    // try {
    //   await account.deleteSession('current');
    // } catch (error) {
    //   console.warn('No active session to log out:', error);
    // }

    // Create a new session
    const session = await account.createEmailPasswordSession(email, password);
    console.log('User signed in:', session);
    return session;
  } catch (error) {
    console.error('Error signing in:', error);
    throw new Error(error.message || 'Sign in failed');
  }
};



export const GetCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    )

    if (!currentUser) throw Error;

    return currentUser.documents[0];


  } catch (error) {
    console.log(error)
  }
}


export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.orderDesc('$createdAt')]
    )
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}




export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.orderDesc('$createdAt', Query.limit(7))]
    )
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}



export const searchPosts = async (query) => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.search('title', query)]
    )
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}


export const getUserPosts = async (userId) => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.equal('creator', userId), Query.orderDesc('$createdAt')]
    )
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}



export const signOut = async () => {
  try {
   const session = await account.deleteSession('current');

   return session;
  } catch (error) {
    throw new Error(error);
  }
}


export const getFilePreview =  async (fileId, type) => {
  let fileUrl;

  try {
    if(type === 'video'){
      fileUrl= storage.getFileView(storageId, fileId)
    }else if(type === 'image'){
      fileUrl = storage.getFilePreview(storageId, fileId, 2000, 2000, 'top', 100)
    } else{
      throw new Error('Invalid file type')
    }

    if(!fileUrl) throw Error;
     
    return fileUrl;
  } catch (error) {
    throw new Error(error)
  }
}


export const uploadFile = async (file, type) => {
  if(!file) return;

  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri
  }

  try {
    const uploadedFile = await storage.createFile(
      storageId, 
      generateValidUserId(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);

    return fileUrl;
  } catch (error) {
    throw new Error(error)
  }
}

export const createVideo = async (form) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, 'image'),
      uploadFile(form.video, 'video')
    ])

    const newPost = await databases.createDocument(
      databaseId, videoCollectionId,generateValidUserId(), {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId
      }
    )

    return newPost;
  } catch (error) {
    throw new Error(error)
  }
}





export const createBooking = async (email, username, date, phone) => {
  try {
    // Create a new booking document
    const newBooking = await databases.createDocument(
      config.databaseId,       // Replace with your Appwrite database ID
      config.bookingCollectionId,  // Replace with your Appwrite collection ID for bookings
      generateValidUserId(),            // Use ID.unique() to auto-generate a unique ID
      {
        email,
        username,
        date,
        phone
      }
    );

    return newBooking;
  } catch (error) {
    console.error('Error in createBooking:', error);
    throw new Error(error.message || 'Booking creation failed');
  }
};




export const getAllBookings = async () => {
  try {
    const bookings = await databases.listDocuments(
      databaseId,
      bookingCollectionId,
      [Query.orderDesc('$createdAt')]
    );
    return bookings.documents;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw new Error(error.message || 'Failed to fetch bookings');
  }
};



export const deleteBooking = async (bookingId) => {
  try {
    await databases.deleteDocument(databaseId, bookingCollectionId, bookingId);
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw new Error(error.message || 'Failed to delete booking');
  }
};

export const updateBooking = async (booking) => {
  try {
    const updatedBooking = await databases.updateDocument(
      databaseId,
      bookingCollectionId,
      booking.id,
      {
        username: booking.username,
        email: booking.email,
        date: booking.date,
        phone: booking.phone,
      }
    );
    return updatedBooking;
  } catch (error) {
    console.error('Error updating booking:', error);
    throw new Error(error.message || 'Failed to update booking');
  }
};



// export const getAllPosts = async () => {
//   try {
//     const posts = await databases.listDocuments(
//       databaseId,
//       videoCollectionId
//     );
//     return posts.documents.map(post => ({
//       ...post,
//       creator: post.creator || { username: 'unknown', avatar: '' },
//     }));
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

























// export const getAllPosts = async () => {
//   try {
//     const posts = await databases.listDocuments(
//       databaseId,
//       videoCollectionId
//     );
//     return posts.documents.map(post => {
//       if (!post.creator) {
//         console.warn('Post without creator:', post);
//       }
//       return {
//         ...post,
//         creator: post.creator || { username: 'unknown', avatar: '' },
//       };
//     });
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };



