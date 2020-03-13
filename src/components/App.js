import React from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom';

import Queue from './queue';
import NoRouteMatch from './404';

const App = () => {
  return (
    <HashRouter basename="/">
      <div className="app">
        <Switch>
          <Route path="/" exact component={Queue} />
          <Route component={NoRouteMatch} />
        </Switch>
      </div>
      ;
    </HashRouter>
  );
};

export default App;
