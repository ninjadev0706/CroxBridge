import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";
import { ResetCSS } from "crox-new-uikit";
import BigNumber from "bignumber.js";
import { useFetchPublicData } from "state/hooks";
import GlobalStyle from "./style/Global";
import PageLoader from "./components/PageLoader";
import Header from './components/Header'
import Footer from './components/Footer'
import '@szhsin/react-menu/dist/index.css';
import "react-multi-carousel/lib/styles.css";

// Route-based code splitting
// Only pool is included in the main bundle because of it's the most visited page'
const Bridge = lazy(() => import("./views/Bridge"));
const Explorer = lazy(() => import("./views/Explorer"));
const NotFound = lazy(() => import("./views/NotFound"));

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

const App: React.FC = () => {

  useFetchPublicData();

  return (
    <Router>
      <ResetCSS />
      <GlobalStyle />
      <Header />
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/explorer">
            <Explorer />
          </Route>
          <Route path="/">
            <Bridge />
          </Route>
          <Route component={NotFound} />
        </Switch>
      </Suspense>
      <Footer />
    </Router>
  );
};

export default React.memo(App);
