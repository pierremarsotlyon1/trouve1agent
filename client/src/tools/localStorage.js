export const ID_TOKEN = 'id_token_agentsportif_user';
export const TYPE_ACCOUNT = 'type_account_agentsportif_user';
export const TYPE_USER = "type_user_getachamp";

export function getType(){
  let type_account = getLocalStorage(TYPE_ACCOUNT);

  if(!type_account){
    return 0;
  }

  return Number.parseInt(type_account);
}

export function getToken()
{
  try
  {
    return getLocalStorage(ID_TOKEN);
  }
  catch(e)
  {
    return undefined;
  }
}

export function setLocalStorage(key, value) {
  try
  {
    localStorage.setItem(key, value);
    const verif = getLocalStorage(key);

    return verif !== null && verif !== undefined;
  }
  catch(e)
  {
    return false;
  }

}

export function deleteLocalStorage(key) {
  try
  {
    localStorage.removeItem(key);
    return true;
  }
  catch(e)
  {
    return false;
  }
}

export function clearLocalStorage() {
  try
  {
    localStorage.clear();
    return true;
  }
  catch(e)
  {
    return false;
  }
}

export function getLocalStorage(key)
{
  try
  {
    return localStorage.getItem(key);
  }
  catch(e)
  {
    return undefined;
  }
}