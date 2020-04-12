import React, { useState, useEffect, useContext, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
// import { login, me } from '../../apis/auth';
import AppContext from '../../AppContext';
export default () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { API, isLoggedIn, isCheckedLogin } = useContext(AppContext);
  const submit = async data => {
    console.log('submit');
    try {
      let resp = await API.Auth.login(data);
      alert(resp.msg);
    } catch (error) {
      console.log({ error });
      alert(error.msg);
    }
  };
  return (
    <div>
      {isCheckedLogin ? (
        isLoggedIn ? (
          <Redirect to="/call" />
        ) : (
          <Fragment>
            <h3>Login</h3>
            <div>
              <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} value={username}></input>
              <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} value={password}></input>
            </div>
            <button type="button" onClick={_ => submit({ username, password })}>
              Login
            </button>
          </Fragment>
        )
      ) : (
        'loading'
      )}
    </div>
  );
};
