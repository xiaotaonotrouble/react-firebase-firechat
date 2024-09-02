import { create } from 'zustand'
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

export const useUserStore = create((set) => ({
  currentUser: null,
  isLoading: true,
  // create some action to manipulate state
  fetchUserInfo: async (uid) => {
    if(!uid) return set({currentUser: null, isLoading: false});

    try {
        // get our data using uid
        const docRef = doc(db, "user", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // update user using this data
            set({currentUser: docSnap.data(), isLoading: false});
        } else {
            // no user
            set({currentUser: null, isLoading: false});

        }


    } catch (err) {
        console.log(err.message)
        return set({currentUser: null, isLoading: false});
    }
  },

  resetUserStore: () => set({ currentUser: null, isLoading: false })
}))