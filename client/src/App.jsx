import "./styles/map.css";
import { useEffect, useState } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import image from "./assets/logobitwan.webp";
import encabezado from "./assets/encabezado.webp";
import antena from "./assets/antena.png";
import ubicacion from "./assets/ubicacion.png";
import Swal from "sweetalert2";
import { Route, Routes, useNavigate, Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ isActive }) => {
  if (isActive) {
    // Renderizar el contenido de la página de aterrizaje si está autenticado
    return <Outlet />;
  } else {
    // Redirigir al usuario a la página de inicio de sesión si no está autenticado
    return <Navigate to="/" replace />;
  }
};

const Landing = ({ setIsActive }) => {
  const navigate = useNavigate();
  useEffect(() => {
    Swal.fire({
      icon: "warning",
      title: "Activar ubicación",
      text: "Vamos a validar su cobertura, por favor active el GPS",
      confirmButtonText: "Activar",
      customClass: {
        confirmButton: "botonPopUp",
      },
    }).then(() => {
      setIsActive(true);
      navigate("cobertura");
    });
  });
};
const Cobertura = () => {
  const [longitud, setLongitud] = useState(0);
  const [latitud, setLatitud] = useState(0);
  const [coordinates, setCoordinates] = useState({});
  const [direccion, setDireccion] = useState("");
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBJUnzRS-9L6X2_nSglcAY9dCBBHo1SJgA",
  });
  const [locationEnabled, setLocationEnabled] = useState(true);

  useEffect(() => {
    if ("geolocation" in navigator) {
      // El navegador soporta la geolocalización
      const watchId = navigator.geolocation.watchPosition(
        () => {
          setLocationEnabled(true);
        },
        () => {
          setLocationEnabled(false);
        }
      );

      // Devolver una función de limpieza para detener la vigilancia cuando el componente se desmonte
      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
      // El navegador no soporta la geolocalización
      setLocationEnabled(false);
    }
  }, []);

  const onLoad = (marker) => {
    // Realiza la geocodificación inversa cuando se carga el marcador
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: marker.getPosition() }, (results, status) => {
      if (status === "OK") {
        if (results[0]) {
          // Obtiene la dirección aproximada
          console.log(results);
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

  useEffect(() => {
    if (coordinates.code == 1) {
      Swal.fire({
        icon: "success",
        title: "Wow...",
        text: "En tu direccion tenemos cobertura!",
        footer:
          '<a href="https://wa.me/573176995294?text=Contratar%20servicio">Quieres contratar el servicio?</a>',
        customClass: {
          confirmButton: "botonPopUp",
        },
      });
    } else if (coordinates.code == 0) {
      Swal.fire({
        icon: "error",
        title: " ",
        text: "No tenemos cobertura en esta ubicación",
        footer:
          '<a href="https://wa.me/573176995294?text=Asesor">Quieres hablar con un asesor?</a>',
        confirmButtonText: "Solicitar Cobertura",
        customClass: {
          confirmButton: "botonPopUp",
          htmlContainer: "ContainerPop",
        },
      });
    }
    // console.log("cobertura:" + coordinates.code);
  }, [coordinates]);

  const enableGPS = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          Swal.fire({
            icon: "success",
            text: "Se avtivo el GPS correctamente",
            confirmButtonText: "Ok",
            customClass: {
              confirmButton: "botonPopUp",
            },
          }).then(() => {
            window.location.reload();
          });
        },
        () => {
          // Ocurrió un error al obtener la posición
          Swal.fire({
            icon: "error",
            text: "No se pudo activar la geolocalización en este dispositivo.",
            confirmButtonText: "Ok",
            customClass: {
              confirmButton: "botonPopUp",
            },
          }).then(() => {
            window.location.reload();
          });
        },
        { enableHighAccuracy: true }
      );
    } else {
      // El navegador no soporta la geolocalización
      Swal.fire({
        icon: "error",
        text: "La geolocalización no es compatible con este navegador.",
        confirmButtonText: "Ok",
        customClass: {
          confirmButton: "botonPopUp",
        },
      }).then(() => {
        window.location.reload();
      });
    }
  };

  useEffect(() => {
    if (!locationEnabled) {
      Swal.fire({
        icon: "error",
        title: "Para continuar...",
        text: "Debes tener la ubicación del dispositivo activo",
        confirmButtonText: "Activar",
        customClass: {
          confirmButton: "botonPopUp",
        },
      }).then(() => {
        enableGPS();
      });
    }
  }, [locationEnabled]);
  const validaCobertura = () => {
    if (latitud != 0 && longitud != 0) {
      const fetchData = async () => {
        try {
          const response = await fetch(
            //`https://geoserver-production.up.railway.app/api/v1/cobertura?latitud=${latitud}&longitud=${longitud}`
            `http://localhost:3000/api/v1/cobertura?latitud=${latitud}&longitud=${longitud}`
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
    return (
      <div className="containerLoader">
        <div className="loader"></div>
      </div>
    );
  } else if (longitud == 0 && latitud == 0) {
    return (
      <div className="containerLoader">
        <div className="loader"></div>
      </div>
    );
  } else {
    return (
      <div className="globalContainer">
        <div className="bodyContainer">
          <div className="buttonContainer">
            <div className="header">
              <img className="logoBitwan" src={image} alt="" />
              <h1 className="titulo">Valida tu cobertura</h1>
            </div>
            <div className="containerUbicacion">
              <img className="imgUbicacion" src={ubicacion} alt="" />
              <div className="containerInfoDireccion">
                <h5>Tu ubicación es: </h5>
                <p>{direccion}</p>
              </div>
            </div>
            {/* <p className="aviso">
              Si quieres validar la cobertura para esta dirección da click en
              "Validar Cobertura"
            </p> */}
            <button className="buttonValidar" onClick={() => validaCobertura()}>
              Validar cobertura{" "}
              <img className="imgAntena" src={antena} alt="" />
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

const App = () => {
  const [isActive, setIsActive] = useState(false);
  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing setIsActive={setIsActive} />} />
        <Route
          path="/cobertura"
          element={<ProtectedRoute isActive={isActive} />}
        >
          <Route index element={<Cobertura />} />
        </Route>
      </Routes>
    </div>
  );
};
export default App;
