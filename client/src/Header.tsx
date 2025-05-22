import React, { useState , useEffect } from 'react';
import type { User } from '@firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';


const Header = () =>{

        //ログイン情報を取得
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    return(
        <>
        <header className="header">
            <h1 className="header-title">TodoBoard</h1>
            {user && <p className="header-email">ログイン中: {user.email}</p>}
        </header>
        </>
    )
}

export default Header