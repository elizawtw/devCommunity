import "./App.scss";
import React, { useEffect, useState} from "react";
import axios from "axios";
import Welcome from "./components/Welcome";
import SidebarList from "./components/SidebarList";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import Groups from "./routes/Groups";
import Events from "./routes/Events";
import Friends from "./components/Friends";
import Posts from "./components/Posts";
import Login from "./components/Login";
import Nav from "./components/Nav";
import Chat from "./components/Chat";
import UpcomingEvents from "./routes/UpcomingEvents";
import Devcommunity from "./apis/Devcommunity";
import { ToastContainer } from "react-toastify";
import Modal from "./components/Modal";
import "react-toastify/dist/ReactToastify.css";
require('dotenv').config();

const WEATHER_API = process.env.REACT_APP_WEATHER_API_KEY;



//axios call uses ajax. but by default ajax call wont send the cookies session info to browser, then we need to manually add here as another param
axios.defaults.withCredentials = true;
function App() {
  
  const location = window.location.pathname;
  const [user, setUser] = useState({}); //do not set up initial state as NULL because JS cannot read property value with NULL. should either () or ({})
  const [visible, setVisible] = useState(false);
  const [events, setEvents] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [filter, setFilter] = useState("");
  const [weather, setWeather] = useState([]);
  const [city, setCity] = useState("");
  const [modalOpen, setModalOpen] = useState(false);



  useEffect(() => {
    console.log("line 41 window.location.pathname ", window.location.pathname);
  }, [])

  const toggle = () => {
    setVisible(!visible);
  };

  const userLogin = (email) => {
    // axios.post('http://localhost:3002/login', {email}, {withCredentials: true})
    axios.post("http://localhost:3002/login", { email }).then((res) => {
      setUser(res.data);
      return res.data;
    });
  };

  //need to wrap this function in memory, using useCallback or useMemo
  const getUserGeoLocation = () => {
      return new Promise((resolve, reject) => {
        if ("geolocation" in navigator) {
          console.log("geolocation is available");
          navigator.geolocation.getCurrentPosition((position) => {
            console.log("line 56 position:", position.coords);
            resolve(position.coords);
            // console.log(position.coords.longitude);
          });
        } else {
          console.log("geolocation is NOT available");
          reject();
        }
      });
    };
 
  const getCityByLocation = (loc) => {
    const latitude = loc.latitude;
    const longitude = loc.longitude;
    fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    ).then((data) => {
      data.json().then((bodyData) => {
        console.log("city:", bodyData.city);
        setCity(bodyData.city);
      });
    });

  }


  const getWeatherByLocation = (loc) => {
    console.log("line69 position", loc);
    const latitude = loc.latitude;
    const longitude = loc.longitude;
    
    fetch(
      `http://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API}&units=metric`
    ).then((data) => {
      data.json().then((bodyData) => {
        console.log("weather:", bodyData.current);
        setWeather(bodyData.current);
      });
    })
    .catch((err) => {
      console.log('error', err)
    })

  };

  console.log("uselocation line 98 app:", location)
  useEffect(() => {
    getUserGeoLocation()
    .then((loc) => {
      console.log("line86", loc);
      getWeatherByLocation(loc);
      getCityByLocation(loc);
    })
    //need to remove getUserGeoLocation from the dependency as it keeps calling weather api. will put it back before deploy
  }, []);


  useEffect(() => {
    // axios.post('http://localhost:3002/login', {email: 'eliza.wong@gmail.com'})
    axios.get("/users/").then((res) => {
      setUser(res.data);
      //  console.log("line42 user data:", res.data);
      return res.data;
    });
  }, []);

  // create a page component to display language / sidebar
  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (filter && filter !== "all") {
          response = await Devcommunity.post("/events/filter", {
            topic: filter,
          });
        } else {
          response = await Devcommunity.get("/events");
        }

        setEvents(response.data);
      } catch (err) {}
    };
    fetchData();
  }, [filter]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Devcommunity.get("/events/upcoming");

        setUpcoming((prev) => {
          return response.data;
        });
      } catch (err) {}
    };
    fetchData();
  }, []);

  return (
    <div className="App">
      <Router>
        {modalOpen && <Modal setOpenModal={setModalOpen} />}
       {/* { weather.length !== 0 ? < Nav user={user} weather={weather} city={city} setOpenModal={setModalOpen}/> : <Welcome/>} */}
       < Nav user={user} weather={weather} city={city} setOpenModal={setModalOpen}/>
        <div className="appContainer">
          <SidebarList toggle={toggle} />

          <div className="appContainer1">
            <Switch>
              <Route exact path="/">
                <Welcome/>
              </Route>

              <Route exact path="/login">
                <Login userLogin={userLogin} />
              </Route>

              <Route path="/home">
                <Home />
                 <Posts user={user} /> 

                {/* //loading information */}
              </Route>

              <Route exact path="/groups">
                <Groups />
              </Route>

              <Route exact path="/events">
                <Events
                  events={events}
                  setEvents={setEvents}
                  upcoming={upcoming}
                  setUpcoming={setUpcoming}
                  filter={filter}
                  setFilter={setFilter}
                />
              </Route>

              <Route path="/friends">
                <Friends user={user} />
              </Route>
            </Switch>
          </div>
          <div className="rightbar-top">
            <UpcomingEvents upcoming={upcoming} setUpcoming={setUpcoming} />

            {visible && <Chat />}
          </div>
        </div>
      </Router>

      <ToastContainer position={"top-center"} />
    </div>
  );
}

export default App;
