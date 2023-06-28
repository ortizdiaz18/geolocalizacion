const fs = require("fs");
const { parseString } = require("xml2js");
const path = require('path');

const validarCobertura = async (req, res) => {
  const { longitud, latitud } = req.query;
  const coordinatesArray = [];
  // Ruta del archivo KML
  const kmlPath = path.join(__dirname,"Prueba 1.kml");

  // Leer el archivo KML
  const kmlData = fs.readFileSync(kmlPath, "utf8");

  // Parsear el archivo KML
  parseString(kmlData, (err, result) => {
    if (err) {
      console.error("Error al parsear el archivo KML:", err);
      return;
    }

    // Obtener las coordenadas

    const placemarks = result.kml.Document[0].Folder[0].Placemark;

    placemarks.forEach((placemark) => {
      const coordinates = placemark.Point[0].coordinates[0];
      const [longitude, latitude] = coordinates.split(",");

      coordinatesArray.push({
        lat: parseFloat(latitude),
        lng: parseFloat(longitude),
      });
    });

    console.log(coordinatesArray);
  });

  function initMap() {
    // Carga el archivo KML

    const ubicacionActual = {
      lat: parseFloat(latitud),
      lng: parseFloat(longitud),
    };
    console.log(ubicacionActual);
    if (verificarRangoUbicacion(ubicacionActual, coordinatesArray)) {
      res
        .status(200)
        .json({ code: "1", msg: "La ubicación actual tiene cobertura" });
    } else {
      res
        .status(400)
        .json({ code: "0", msg: "La ubicación actual NO tiene cobertura" });
    }
  }

  // Función para verificar si una ubicación está dentro del rango
  function verificarRangoUbicacion(ubicacionActual, ubicacionesMapa) {
    for (var i = 0; i < ubicacionesMapa.length; i++) {
      var ubicacion = ubicacionesMapa[i];
      var distancia = calcularDistancia(
        ubicacion.lat,
        ubicacion.lng,
        ubicacionActual.lat,
        ubicacionActual.lng
      );

      // Define una distancia de umbral para considerar que la ubicación está dentro del rango
      var distanciaUmbral = 70; // 1000 metros

      if (distancia <= distanciaUmbral) {
        return true; // La ubicación está dentro del rango
      }
    }

    return false; // La ubicación no está dentro del rango
  }

  // Función para calcular la distancia entre dos puntos utilizando la fórmula del haversine
  function calcularDistancia(lat1, lng1, lat2, lng2) {
    var earthRadius = 6371; // Radio de la Tierra en kilómetros
    var dLat = degToRad(lat2 - lat1);
    var dLng = degToRad(lng2 - lng1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degToRad(lat1)) *
        Math.cos(degToRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var distance = earthRadius * c;
    return distance * 1000; // Convertir a metros
  }

  // Función para convertir grados a radianes
  function degToRad(degrees) {
    return degrees * (Math.PI / 180);
  }

  // Ejemplo de uso

  initMap();
};

module.exports = {
  validarCobertura,
};
