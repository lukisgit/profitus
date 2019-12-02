import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import PublicComponent from "pages/public/public.component"

const App: React.FC = () => {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/">
            <PublicComponent/>
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
