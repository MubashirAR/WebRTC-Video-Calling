import React, { useState, useContext, useEffect, Fragment } from 'react';
import AppContext from '../../AppContext';
export default () => {
  const [isFetchingList, setIsFetchingList] = useState(false);
  const [connections, setConnections] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  const [searchResult, setSearchResult] = useState('');
  const {
    API,
    data: { loggedInUser },
  } = useContext(AppContext);
  useEffect(() => {
    if (!isFetchingList) {
      setIsFetchingList(true);
      getConnections();
    }
    return () => {
      // cleanup
    };
  });
  const getConnections = () => {
    try {
      API.User.getConnections().then(resp => {
        setConnections(resp);
      });
    } catch (error) {
      alert(error.msg || `Unexpected error while fetching your connections! Please try again`);
    }
  };
  const search = async _ => {
    try {
      let user = await API.User.searchUser({ searchKey });
      setSearchResult(user);
      console.log({ user });
    } catch (error) {
      alert(error.msg || `Unexpected error occured!`);
    }
  };
  const addConnection = async _ => {
    try {
      let resp = await API.User.addConnection({ connectionId: searchResult._id });
      await getConnections();
      alert(resp.msg);
    } catch (error) {
      alert(error.msg || `Unexpected error occured!`);
    }
  };
  const removeConnection = async id => {
    try {
      let resp = await API.User.removeConnection({ connectionId: id });
      await getConnections();
      alert(resp.msg);
    } catch (error) {
      alert(error.msg || `Unexpected error occured!`);
    }
  };
  return (
    <div>
      <h3>Connections</h3>
      <h5>Search</h5>
      <input type="text" placeholder="Search username/email" onChange={e => setSearchKey(e.target.value)} value={searchKey} />
      <button type="button" onClick={search}>
        Search
      </button>
      {searchResult ? (
        <div>
          <hr />
          <div>
            Username: {searchResult.username} Email: {searchResult.email}
          </div>
          {!connections.find(c => {
            console.log(c._id, searchResult._id);
            return c._id === searchResult._id;
          }) ? (
            <button type="button" onClick={addConnection}>
              Add Connection
            </button>
          ) : (
            'Connected'
          )}
          <hr />
        </div>
      ) : null}
      <h5>My Connections</h5>
      <hr />
      {connections.map(c => (
        <Fragment key={c._id}>
          <div>
            Username: {c.username} Email: {c.email}
          </div>
          <button type="button" onClick={_ => removeConnection(c._id)}>
            Remove Connection
          </button>
          <hr />
        </Fragment>
      ))}
    </div>
  );
};
