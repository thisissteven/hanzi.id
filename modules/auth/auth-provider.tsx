import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

import { newWindow } from "@/utils";
import useIsMobile from "@/hooks/useIsMobile";

type AuthContextValues = {
  isAuthenticated: boolean;
  signOut: () => void;
  signInWithGoogle: () => void;
};

const AuthContext = React.createContext({} as AuthContextValues);

export function useAuth() {
  return React.useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();

  const isAuthenticated = React.useMemo(() => status === "authenticated", [status]);

  const isMobile = useIsMobile();

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        signInWithGoogle: () => {
          if (isMobile) {
            signIn("google", { callbackUrl: "/" });
          } else {
            newWindow("/google-signin", "Sign In with Google");
          }
        },
        signOut: async () => {
          await signOut({ redirect: false });
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
