import axios from 'axios';
axios.defaults.withCredentials = true;
let headers = {
  'Content-Type': 'application/json',
  crossDomain: true,
  credentials: 'cross-origin',
};
let options = {
  withCredentials: true,
  credentials: 'same-origin',
};
let url = document.URL.split('/');
if(url.length > 2 && url[2].includes('localhost')) {
  url = '';
} else {
  url = 'https://mubashir-video-chat.herokuapp.com'
}
url = '/api'
const getConnections = async userId => {
  try {
    let resp = await axios({
      url: url + '/connection',
      method: 'GET',
      headers,
      ...options,
    });
    let { data } = resp;
    return data;
  } catch (error) {
    throw error.response.data;
  }
};
const addConnection = async ({ connectionId }) => {
  try {
    let resp = await axios({
      url: url + '/user/addConnection',
      method: 'PUT',
      headers,
      data: JSON.stringify({ connectionId }),
      ...options,
    });
    let { data } = resp;
    return data;
  } catch (error) {
    throw error.response.data;
  }
};
const removeConnection = async ({ connectionId }) => {
  try {
    let resp = await axios({
      url: url + '/user/removeConnection',
      method: 'PUT',
      headers,
      data: JSON.stringify({ connectionId }),
      ...options,
    });
    let { data } = resp;
    return data;
  } catch (error) {
    throw error.response.data;
  }
};
const searchUser = async params => {
  console.log({ params });
  try {
    let resp = await axios({
      url: url + '/user/search',
      method: 'GET',
      headers,
      params,
      ...options,
    });
    let { data } = resp;
    return data;
  } catch (error) {
    throw error.response.data;
  }
};
export default {
  getConnections,
  addConnection,
  removeConnection,
  searchUser,
};
