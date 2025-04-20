import create from "zustand";
import { persist } from "zustand/middleware";
type State = {
  token: any;
};
type Actions = {
  setToken: (token: string) => void;
};
export const useAuthStore = create(
  persist<State & Actions>(
    (set) => ({
      token: null,
      setToken: (token: string) =>
        set(() => ({
          token
        })),
    }),
    {
      name: "auth",
    }
  )
);
