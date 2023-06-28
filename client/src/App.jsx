import "./styles/map.css";
import React, { useEffect, useState } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const App = () => {
  const [longitud, setLongitud] = useState(0);
  const [latitud, setLatitud] = useState(0);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyAjd2NH6l2xOuXkXeQ8dYa9WiSYCOYiJVg",
  });

  const validaCobertura = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
    } else {
      console.log("La geolocalización no es soportada por este navegador.");
    }
  };

  const handleSuccess = (position) => {
    const { latitude, longitude } = position.coords;
    setLongitud(longitude);
    setLatitud(latitude);
  };

  const handleError = (error) => {
    console.log("Error al obtener la ubicación:", error.message);
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  } else if (longitud == 0 && latitud == 0) {
    return (
      <div className="globalContainer">
        <button onClick={validaCobertura()}>Validar cobertura</button>
        <GoogleMap
          zoom={10}
          center={{ lat: 44, lng: -80 }}
          mapContainerClassName="map-container"
        ></GoogleMap>
      </div>
    );
  } else {
    return (
      <div className="globalContainer">
        <GoogleMap
          zoom={15}
          center={{ lat: latitud, lng: longitud }}
          mapContainerClassName="map-container"
        >
          <Marker position={{ lat: latitud, lng: longitud }} />
        </GoogleMap>
      </div>
    );
  }
};

export default App;
