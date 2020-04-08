import React, { useState } from 'react';
import { register } from '../../apis/auth';
export default () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const submit = async data => {
    try {
      let resp = await register(data);
      alert(resp.msg)
    } catch (error) {
      alert(error.msg);
    }
  };
  return (
    <div>
      <h3>Register</h3>
      <div>
        <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} value={username}></input>
        <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} value={email}></input>
      </div>
      <div>
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} value={password}></input>
        <input
          type="password"
          placeholder="Repeat Password"
          onChange={e => setConfirmPassword(e.target.value)}
          value={confirmPassword}
        ></input>
      </div>
      <div>{password === confirmPassword ? 'Passwords match' : 'Password do not match'}</div>
      <button type="button" onClick={_ => submit({ username, password, email })}>
        Signup
      </button>
    </div>
  );
};
