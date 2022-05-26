import create from 'zustand';

interface UserState {
    userId: number;
    userToken: string;
    setToken: (token: string) => void;
    setUserId: (Id: number) => void;
}
const getIdLocalStorage = (key: string): number =>
    JSON.parse(window.localStorage.getItem(key) as string);
const setIdLocalStorage = (key: string, value:number) =>
    window.localStorage.setItem(key, JSON.stringify(value));
const getTokenLocalStorage = (key: string): string =>
    JSON.parse(window.localStorage.getItem(key) as string);
const setTokenLocalStorage = (key: string, value:string) =>
    window.localStorage.setItem(key, JSON.stringify(value));

const useStore = create<UserState>((set) => ({
    userId: getIdLocalStorage('id'),
    userToken: getTokenLocalStorage('token'),
    setUserId: (id: number) => set(() => {
        setIdLocalStorage('id', id)
        return {userId: id}
    }),
    setToken: (token: string) => set(() => {
        setTokenLocalStorage('token', token)
        return {userToken: token}
    })
}))

export const useUserStore = useStore
