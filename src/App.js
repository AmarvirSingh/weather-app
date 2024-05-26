import "../src/App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { useState } from "react";
import axios from "axios";

function App() {
  const [sentLocation, setSentLocation] = useState("");
  const [data, setData] = useState();
  const [Loading, setLoading] = useState(false);

  async function fetchData() {
    const response = await axios.post(
      `${process.env.REACT_APP_URI}/getWeather`,
      {
        location: sentLocation,
      }
    );
    setData(response.data);
  }
  const getData = async (e) => {
    setLoading(true);
    if (e.key === "Enter") {
      if (sentLocation === "") {
        console.log(`${process.env.REACT_APP_URI}/getWeather`);
        setLoading(false);
        return alert("Search Field Can not be Empty");
      }
      await fetchData();
    }
    setLoading(false);
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
        {Loading ? <div className="spinner-border"> </div> : ""}
        {data ? (
          <div className="">
            <p className="fs-3 text-light fw-bold">
              {data.location}{" "}
              <sup className="bg-info px-1  rounded-4 "> {data.country}</sup>{" "}
            </p>
            <img
              className=" w-25 "
              src={`https://openweather.site/img/wn/${data.icon}.png`}
              alt="hello"
            />
            <p className="fs-5 fw-light">{data.description}</p>
            <div className="d-flex justify-content-around ">
              <p>
                {String((data.maxTemp - 32) * (5 / 9)).slice(0, 4)}°
                <small>max</small>
              </p>
              <p>
                {String((data.temp - 32) * (5 / 9)).slice(0, 4)}°
                <small>current</small>
              </p>
              <p>
                {String((data.minTemp - 32) * (5 / 9)).slice(0, 4)}°
                <small>min</small>
              </p>
            </div>
            <p>
              {`Feels Like ${String((data.feelsLike - 32) * (5 / 9)).slice(
                0,
                4
              )} `}
            </p>
            <hr />
          </div>
        ) : (
          <div>
            {" "}
            <p>No Data</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
