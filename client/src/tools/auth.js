/**
 * Created by pierremarsot on 19/05/2017.
 */
import {getToken, getLocalStorage, TYPE_ACCOUNT, getType} from '../tools/localStorage';

export function isConnected(){
  const token = getToken();

  return token && token.length > 0;
}

export function isAgent(){
  return getType() === 2;
}

export function isSportif(){
  return getType() === 1;
}