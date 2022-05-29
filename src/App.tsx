import React from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Navbar from "./Navbar";
import Register from "./Register"
import Auctions from "./Auctions";
import Auction from "./Auction";
import NotFound from "./NotFound";
import MyProfile from "./MyProfile";
import CreateAuction from "./CreateAuction";
import MyAuctions from "./MyAuctions";

function App() {
  return (
      <div className="App">
        <Router>
          <div>
            <Routes>
              <Route path="/my-auctions" element={<MyAuctions/>}/>
              <Route path="/auctions" element={<Auctions/>}/>
              <Route path="/create-auction" element={<CreateAuction/>}/>
              <Route path="/register" element={<Register/>}/>
              <Route path="/navbar" element={<Navbar pageName={"Default"}/>}/>
              <Route path="/auctions/:id" element={<Auction/>}/>
              <Route path="/users/:id" element={<MyProfile/>}/>
              <Route path="*" element={<NotFound/>}/>
            </Routes>
          </div>
        </Router>
      </div>
  );
}

export default App;
