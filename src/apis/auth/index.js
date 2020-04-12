import axios from 'axios';
axios.defaults.withCredentials = true;
let headers = {
  'Content-Type': 'application/json',
  crossDomain: true,
  credentials: 'cross-origin'
}
let options = {
  withCredentials: true,
  credentials: 'same-origin'
}
let url = document.URL.split('/');
if(url.length > 2 && url[2].includes('localhost')) {
  url = '';
} else {
  url = 'https://mubashir-video-chat.herokuapp.com'
}
url = '/api'
export const login = async params => {
  try {
    let resp = await axios({
      url: url + '/login',
      method: 'POST',
      headers,
      data: JSON.stringify(params),
      ...options
    });
    let { data } = resp;
    return data;
  } catch (error) {
    throw error.response.data;
  }
};
export const register = async params => {
  try {
    let resp = await axios({
      url: url + '/register',
      method: 'POST',
      headers,
      data: JSON.stringify(params),
      ...options
    });
    let { data } = resp;
    return data;
  } catch (error) {
    throw error.response.data;
  }
};
export const me = async params => {
  try {
    let resp = await axios({
      url: url + '/me',
      method: 'get',
      headers,
      ...options
    });
    let { data } = resp;
    return data;
    
  } catch (error) {
    console.log({error})
    // if(error.response && error.response.status === 401)
    //   window.location.href = '/login'
    throw error.response.data;
  }
};
export default {
  me,
  login,
  register
}