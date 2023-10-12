import "./App.css";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Home from "./pages/Home/Home";
import Navigation from "./components/shared/Navigation/Navigation";
import Authenticate from "./pages/Authenticate/Authenticate";
import Activate from "./pages/Activate/Activate";
import Dashboard from "./pages/Dashboard/Dashboard";
import { useSelector, useDispatch } from "react-redux";
import { setAuth } from "./store/authSlice";
import { useEffect } from "react";
import { getUser } from "./http";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const res = await getUser();
        dispatch(setAuth({ user: res.data.user, auth: res.data.auth }));
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  return (
    <BrowserRouter>
      <Switch>
        <GuestRoute path="/" exact>
          <Home />
        </GuestRoute>
        <GuestRoute path="/authenticate">
          <Navigation />
          <Authenticate />
        </GuestRoute>
        <SemiProtectedRoute path="/activate">
          <Navigation />
          <Activate />
        </SemiProtectedRoute>
        <ProtectedRoute path="/dashboard">
          <Navigation />
          <Dashboard />
        </ProtectedRoute>
      </Switch>
    </BrowserRouter>
  );
}

const GuestRoute = ({ children, ...rest }) => {
  const { isAuth } = useSelector((state) => state.auth);
  return (
    <Route
      {...rest}
      render={({ location }) => {
        return isAuth ? (
          <Redirect
            to={{
              pathname: "/dashboard",
              state: { from: location },
            }}
          />
        ) : (
          children
        );
      }}
    ></Route>
  );
};

const SemiProtectedRoute = ({ children, ...rest }) => {
  const { user, isAuth } = useSelector((state) => state.auth);
  return (
    <Route
      {...rest}
      render={({ location }) => {
        return !isAuth ? (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location },
            }}
          />
        ) : isAuth && !user.activated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/dashboard",
              state: { from: location },
            }}
          />
        );
      }}
    ></Route>
  );
};

const ProtectedRoute = ({ children, ...rest }) => {
  const { user, isAuth } = useSelector((state) => state.auth);
  return (
    <Route
      {...rest}
      render={({ location }) => {
        return !isAuth ? (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location },
            }}
          />
        ) : isAuth && !user.activated ? (
          <Redirect
            to={{
              pathname: "/activate",
              state: { from: location },
            }}
          />
        ) : (
          children
        );
      }}
    ></Route>
  );
};

export default App;
