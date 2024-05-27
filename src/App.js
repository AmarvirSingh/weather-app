import "../src/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { useState } from "react";
import axios from "axios";

function App() {
  const [sentLocation, setSentLocation] = useState("");
  const [data, setData] = useState();
  const [Loading, setLoading] = useState(false);
  //const [ErrorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);

  async function fetchData() {
    const options = {
      method: "GET",
      url: `${process.env.REACT_APP_WEATHER_API}/${sentLocation}/EN`,
      headers: {
        "x-rapidapi-key": `${process.env.REACT_APP_API_KEY}`,
        "x-rapidapi-host": "open-weather13.p.rapidapi.com",
      },
    };
    const response = await axios.request(options);
    if (Number(response.data.cod) === 404) {
      console.log(response.data.cod);
      setShowError(true);
      setData();
      return; //setErrorMessage("Please enter the valid city");
    }
    setData(response.data);
    setShowError(false);
  }
  const getData = async (e) => {
    setLoading(true);
    if (e.key === "Enter") {
      if (sentLocation === "") {
        setLoading(false);
        return alert("Search Field Can not be Empty");
      }
      await fetchData();
    }
    setLoading(false);
  };

  const getDataWithCoordinates = async (lat, long) => {
    const options = {
      method: "GET",
      url: `https://open-weather13.p.rapidapi.com/city/latlon/${lat}/${long}`,
      headers: {
        "x-rapidapi-key": `${process.env.REACT_APP_API_KEY}`,
        "x-rapidapi-host": "open-weather13.p.rapidapi.com",
      },
    };

    const response = await axios.request(options);

    if (Number(response.data.cod) === 404) {
      console.log(response.data.cod);
      setShowError(true);
      setData();
      return; //setErrorMessage("Please enter the valid city");
    }
    setData(response.data);
    setShowError(false);
  };

  const getLocation = () => {
    setLoading(true);
    window.navigator.geolocation.getCurrentPosition(
      (pos) => {
        let lat = pos.coords.latitude;
        let long = pos.coords.longitude;
        getDataWithCoordinates(lat, long);
        setLoading(false);
        //        console.log("on Succssfull > ", pos.coords);
      },
      (err) => {
        setLoading(false);
        return alert("Please allow Location to get Weather.");
        //console.log("Error has occured > ", err);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div
      className="text-light"
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "rgb(195, 202, 219)",
        height: "100vh",
        maxWidth: "100vw",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="main p-3 shadow-lg  mb-0 rounded-5  text-center  "
        style={{ backgroundColor: "rgb(107, 131, 194)" }}
      >
        <input
          className=" w-75 text-light postion-absolute align-items-center m-3 px-4 p-2  rounded-5 bg-transparent"
          style={{ border: "1px solid rgb(61, 84, 143)" }}
          onKeyDown={(e) => getData(e)}
          onChange={(e) => setSentLocation(e.target.value)}
          value={sentLocation}
          placeholder="Enter Location"
        />
        <FaLocationCrosshairs size={30} onClick={getLocation} />
        {Loading ? <div className="spinner-border"> </div> : ""}
        {data ? (
          <div className="">
            <p className="fs-3 text-light fw-bold">
              {data.name}{" "}
              <sup className="bg-info px-1  rounded-4 ">
                {" "}
                {data.sys.country}
              </sup>{" "}
            </p>
            <img
              className=" w-25 "
              src={`https://openweather.site/img/wn/${data.weather[0].icon}.png`}
              alt="hello"
            />
            <p className="fs-5 fw-light">{data.weather[0].description}</p>
            <div className="d-flex justify-content-around ">
              <p>
                {String((data.main.temp_max - 32) * (5 / 9)).slice(0, 4)}°
                <small>max</small>
              </p>
              <p>
                {String((data.main.temp - 32) * (5 / 9)).slice(0, 4)}°
                <small>current</small>
              </p>
              <p>
                {String((data.main.temp_min - 32) * (5 / 9)).slice(0, 4)}°
                <small>min</small>
              </p>
            </div>
            <p>
              {`Feels Like ${String(
                (data.main.feels_like - 32) * (5 / 9)
              ).slice(0, 4)} `}
            </p>
          </div>
        ) : (
          <div>
            {" "}
            <p>No Data</p>
          </div>
        )}
        <hr />

        {showError ? (
          <p>Please enter a valid city</p>
        ) : (
          data && (
            <p>
              Location Updated at -{" "}
              {new Date().toLocaleTimeString("en-US", {
                hour12: true,
                hour: "numeric",
                minute: "numeric",
              })}
            </p>
          )
        )}
      </div>
    </div>
  );
}

export default App;
