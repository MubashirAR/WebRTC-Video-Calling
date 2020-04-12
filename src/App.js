import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Routes from './Routes';
import AppContext from './AppContext';
import { Auth, User } from './apis';

function App() {
  const [isCheckingLogin, setIsCheckingLogin] = useState(false);
  const [isCheckedLogin, setIsCheckedLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState({});
  const login = async (...data) => {
    let res = await Auth.login(...data);
    let resp = await Auth.me(...data);
    setIsLoggedIn(true);
    setLoggedInUser(resp && resp.user || {});
    return res;
  };
  const API = { Auth: { ...Auth, login }, User };
  useEffect(() => {
    console.log('render..');
    if (!isCheckingLogin) {
      console.log('checking');
      setIsCheckingLogin(true);
      try {
        let promise = Auth.me()
          .then(res => {
            setLoggedInUser(res && res.user || {});
            setIsLoggedIn(true);
            setIsCheckedLogin(true);
          })
          .catch(e => {
            setIsCheckedLogin(true);
            // setIsLoggedIn(false);
          });
      } catch (error) {}
    }
    return () => {
      // cleanup
      console.log('unmounting');
    };
  }, [1]);
  return (
    <AppContext.Provider value={{ API, data: { loggedInUser }, isCheckedLogin, isLoggedIn }}>
      <div className="App">
        <Routes />
      </div>
    </AppContext.Provider>
  );
}

export default App;
