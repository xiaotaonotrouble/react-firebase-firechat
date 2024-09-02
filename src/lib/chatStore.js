/*
  chatId
  user
  isCurrentUserBlocked
  isReceiverBlocked
 */
import { create } from 'zustand'
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useUserStore } from './userStore';

export const useChatStore = create((set) => ({
  
  chatId: null,
  user: null,
  isCurrentUserBlocked: false,
  isReceiverBlocked: false,

  changeChat: (chatId, user, currentUser) => {
    
    // CHECK IF CURRENT USER IS BLOCKED
    if (user.blocked.includes(currentUser.id)) {
      return set({
        chatId,
        user: null,   // if we are blocked, we are not able to see its info
        isCurrentUserBlocked: true,
        isReceiverBlocked: false,
      })
    }


    // CHECK IF RECEIVER IS BLOCKED
    else if (currentUser.blocked.includes(user.id)) {
      return set({
        chatId,
        user,   // we block him, so we can still see his info hahaha
        isCurrentUserBlocked: false,
        isReceiverBlocked: true,
      })
    }else {
      return set({
        chatId,
        user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: false,
      })
    }
  },

  changeBlock: ()=>{
    set(state=>({
      ...state,
      isReceiverBlocked: !state.isReceiverBlocked,
    }))
  },

  resetChatStore: () => set({
    chatId: null,
    user: null,
    isCurrentUserBlocked: false,
    isReceiverBlocked: false
  })
}))