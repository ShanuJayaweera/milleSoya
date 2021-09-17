import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import auth from '../Helpers/login';

const GuardedRoute = ({ component: Component, ...rest }) => (
return(  
    <Route
    {...rest}
    render={(props) => {
        auth.isAuthenticated() === true ? (
            <Component {...props} />
          ) : (
            <Redirect to="/" />
          );
    }}
  />)
);
