import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { deleteStorageItem, getStorageItem, setStorageItem } from '../helpers/localStorage';
import { parseJwtPayload } from '../helpers/parseJwtPayload';
import { UserData } from '../types/apiResponses';

export function useSession() {
  const { data: currentUser, mutate } = useSWR('user', (key) => {
    const userObj: UserData | undefined = getStorageItem(key) ? JSON.parse(getStorageItem(key)!) : undefined;
    const token = parseJwtPayload(userObj!.token);

    if (!userObj || !token) return null;
    if (token.exp * 1000 < Date.now()) return null;

    return userObj;
  });

  const updateUser = (data: UserData | null) => {
    if (!data) deleteStorageItem('user');
    else setStorageItem('user', JSON.stringify(data));

    mutate(data);
  };

  return { currentUser, updateUser };
}
