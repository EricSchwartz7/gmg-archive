import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';

import Parent from './pages/Parent/Parent';

class App extends Component {
  render () {
    return (
      <BrowserRouter>
        <div className="App">
          <Parent />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
