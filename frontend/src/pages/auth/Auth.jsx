import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';


const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthProvider;