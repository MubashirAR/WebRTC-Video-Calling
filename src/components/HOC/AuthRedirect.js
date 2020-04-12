import React, { Fragment, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import AppContext from "../../AppContext";

export default props => {
  const { isCheckedLogin, isLoggedIn } = useContext(AppContext);
  // return 'loading';
  return isCheckedLogin ? isLoggedIn ? <Fragment>{props.children}</Fragment> : <Redirect to="/login" /> : 'loading';
};
