import React, { useContext } from 'react';
import { me } from '../../apis/auth';
import AppContext from '../../AppContext';
export default () => {
  const {
    data: { loggedInUser = {} },
  } = useContext(AppContext);
  return (
    <div>
      Welcome {loggedInUser.username}
      <div>
        <ul>
          {loggedInUser.username ? (
            <a href="/call">
              <li>Call</li>
            </a>
          ) : (
            <a href="/login">
              <li>Login</li>
            </a>
          )}
        </ul>
      </div>
    </div>
  );
};
