import create from 'zustand';

interface UserState {
    userId: number;
    userToken: String;
    setToken: (token: String) => void;
    setUserId: (Id: number) => void;
}

const useStore = create<UserState>((set) => ({
    userId: -1,
    userToken: '',
    setToken: (token: String) => set(() => {
        return {userToken: token}
    }),
    setUserId: (Id: number) => set(() => {
        return {userId: Id}
    })
}))

export const useUserStore = useStore
