import { Routes, Route, Link, Navigate } from "react-router-dom";
import AddTweet from "./components/AddTweet";
import Home from "./components/Home";
import Profile from "./components/Profile"
import socialdapp from "./images/socialDapp.png";
// import style from "https://www.w3schools.com/w3css/4/w3.css"
// import "./App.css";
require('dotenv').config()
//console.log(process.env.REACT_APP_WEB3_API_KEY)
console.log()
function App() {
  return (
    <div>
      {/* <Home/> */}
      {/* <Timetable /> */}
      <nav className="navbar navbar-expand-md navbar-dark bg-dark text-white">
        <div className="container-fluid">
        {/* <i className="fa-brands fa-square-twitter"></i> */}
        <img src={socialdapp} width='30px'></img>
          <a className="navbar-brand" to="#">

            Social Dapp
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item active">
                <Link className="nav-link" to="home">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="profile">
                  Profile
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="addTweet">
                  addTweet
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {/* <div className="sidebar">
        <h4>Social Dapp</h4>
        <Link class="active" to="home">Home</Link>
        <Link to="profile">Profile</Link>
      </div> */}
      <Routes>
        <Route path="/" element={<Navigate replace to="home"></Navigate>} />
        <Route path="/home" element={<Home />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/addTweet" element={<AddTweet />}></Route>
      </Routes>
      {/* <Footer/> */}
      {/* Routes */}
      
    </div>
  );
}

export default App;