import "./styles/map.css";
import React, { useEffect, useState } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import image from "./assets/logobitwan.webp";
import Swal from 'sweetalert2'

const App = () => {
  const [longitud, setLongitud] = useState(0);
  const [latitud, setLatitud] = useState(0);
  const [coordinates, setCoordinates] = useState({});
  const [direccion, setDireccion] = useState("");
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyAjd2NH6l2xOuXkXeQ8dYa9WiSYCOYiJVg",
  });

  const onLoad = (marker) => {
    // Realiza la geocodificación inversa cuando se carga el marcador
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: marker.getPosition() }, (results, status) => {
      if (status === "OK") {
        if (results[0]) {
          // Obtiene la dirección aproximada
          const direccion = results[0].formatted_address;
          setDireccion(direccion);
        } else {
          console.log("No se encontraron resultados de geocodificación.");
        }
      } else {
        console.log("Error de geocodificación:", status);
      }
    });
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
    } else {
      console.log("La geolocalización no es soportada por este navegador.");
    }
  }, []);

  useEffect(()=>{
    if(coordinates.code== 1){
      Swal.fire({
        icon: 'success',
        title: 'Wow...',
        text: 'En tu direccion tenemos cobertura!',
        footer: '<a href="https://wa.me/573176995294?text=Contratar%20servicio">Quieres contratar el servicio?</a>'
      })
    }else if(coordinates.code == 0){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'En este momento no tenemos cobertura en tu sector',
        footer: '<a href="https://wa.me/573176995294?text=Asesor">Quieres hablar con un asesor?</a>'
      })
    }
    console.log("cobertura:"+coordinates.code);
  },[coordinates])

  const validaCobertura = () => {
    if (latitud != 0 && longitud != 0) {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `https://open-rat-production.up.railway.app/api/v1/cobertura?latitud=${latitud}&longitud=${longitud}`
          );
          const data = await response.json();
          setCoordinates(data);
        } catch (error) {
          console.error("Error al obtener las coordenadas:", error);
        }
      };

      fetchData();
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
        <button className="buttonValidar" onClick={validaCobertura()}>
          Validar cobertura
        </button>
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
        <div className="bodyContainer">
          <div className="buttonContainer">
            <img className="logoBitwan" src={image} alt="" />
            <h5>Lu ubicación ontenida es: </h5>
            <p >{direccion}</p>
            <p className="aviso">Si quieres validar la cobertura para esta ddireccion da click en "Validar Cobertura"</p>
            <button className="buttonValidar" onClick={()=>validaCobertura()}>
              Validar cobertura
            </button>
          </div>
          <div className="containerGeneralMap">
            <GoogleMap
              zoom={15}
              center={{ lat: latitud, lng: longitud }}
              mapContainerClassName="map-container"
            >
              <Marker
                position={{ lat: latitud, lng: longitud }}
                onLoad={onLoad}
              />
            </GoogleMap>
          </div>
        </div>
      </div>
    );
  }
};

export default App;
