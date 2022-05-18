import React from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Navbar from "./navbar";
import Register from "./register"

function App() {
  return (
      <div className="App">
        <Router>
          <div>
            <Routes>
              {/*<Route path="/auctions" element={<Auctions/>}/>*/}
              <Route path="/register" element={<Register/>}/>
              <Route path="/navbar" element={<Navbar/>}/>
              {/*<Route path="/auctions/:id" element={<Auction/>}/>*/}
              {/*<Route path="*" element={<NotFound/>}/>*/}
            </Routes>
          </div>
        </Router>
      </div>
  );
}

export default App;
