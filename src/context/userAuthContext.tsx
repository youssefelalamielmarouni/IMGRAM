import React, { Children, createContext, use } from "react";
import { signInWithEmailAndPassword, User,createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

interface IUserAuthProviderProps {
    Children: React.ReactNode;
}

type AuthContextData = {
    user: User | null;
    logIn: typeof logIn;
    signUp: typeof signUp;
    logOut: typeof logOut;
    googleSignIn: typeof googleSignIn;
};

const logIn = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
};

const signUp = async (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth,email, password);
};

const logOut = () => {
    return signOut( auth);
};

const googleSignIn = () => {
    const GoogleAuthProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, GoogleAuthProvider);
};

export const userAuthContext = createContext<AuthContextData>({
    user: null,
    logIn,
    signUp,
    logOut,
    googleSignIn,
});

import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

export const UserAuthProvider = React.FunctionComponent<IUserAuthProviderProps>= ({Children}) => {
   const [user, setUser] = useState<User | null>(null);
   useEffect(() => {
       const unsubscribe = auth.onAuthStateChanged(auth, (user) => {
           if (user) {
            console.log("User logged in:", user);
               setUser(user);
           }
           return () => { unsubscribe();};
       });
   
    const value: AuthContextData = {
        user: null,
        logIn,
        signUp,
        logOut,
        googleSignIn,
    };
    return( <userAuthContext.Provider value={value}>{Children}</userAuthContext.Provider>);
};

export const useUserAuth = () => {
    return React.useContext(userAuthContext);
};