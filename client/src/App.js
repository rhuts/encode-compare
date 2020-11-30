import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import EncodeCompare from "./components/encodeCompare.component";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route path="/" exact component={EncodeCompare} />
        </div>
      </Router>
    );
  }
}

export default App;
