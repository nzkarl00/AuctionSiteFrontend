import create from 'zustand';

interface UserState {
    userToken: String;
    setToken: (token: String) => void;
}

const useStore = create<UserState>((set) => ({
    userToken: '',
    setToken: (token: String) => set(() => {
        return {userToken: token}
    })
}))

export const useUserStore = useStore
