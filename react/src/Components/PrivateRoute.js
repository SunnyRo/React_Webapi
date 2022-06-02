import React from "react";
import { Navigate, Route } from "react-router-dom";
import AuthenticationService from "./Authentication";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const user = AuthenticationService.getCurrentUser();
  return (
    <Route
      {...rest}
      render={(props) =>
        user ? (
          <Component {...props} />
        ) : (
          <Navigate
            to={{ pathname: "/signin", state: { from: props.location } }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
