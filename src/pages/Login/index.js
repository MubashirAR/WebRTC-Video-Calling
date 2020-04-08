import React, { useState, useEffect } from 'react';
import { login } from '../../apis/auth';
const submit = async data => {
  try {
    let resp = await login(data);
    alert(resp.msg);
  } catch (error) {
    alert(error.msg);
  }
};
export default () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  return (
    <div>
      <h3>Login</h3>
      <div>
        <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} value={username}></input>
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} value={password}></input>
      </div>
      <button type="button" onClick={_ => submit({ username, password })}>
        Login
      </button>
    </div>
  );
};
