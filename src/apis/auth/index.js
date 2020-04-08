export const login = async data => {

  let resp = await fetch('http://localhost:6565/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(data),
  })
  resp = await resp.json();
  if(resp.status !== 200){
    throw resp;
  }
  return resp;
};
export const register = async data => {

  let resp = await fetch('http://localhost:6565/register', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(data),
  })
  resp = await resp.json();
  console.log({resp})
  if(resp.status && resp.status !== 200){
    throw resp;
  }
  return resp;
};
