const fs = require("fs");
const KmlParser = require("kml-parser");

const validarCobertura = async (req, res) => {
  const { longitud, latitud } = req.params;
  //Extrae coordenadas desde archivo kml
  const gKmlPath = "./Prueba 1.kml";
  const kmlData = fs.readFileSync(gKmlPath, "utf8");
  const kmlParser = new KmlParser();
  const kmlJson = kmlParser.toJson(kmlData);

  // Array para almacenar las coordenadas
  const coordinatesArray = [];

  kmlJson.kml.Document.Placemark.forEach((placemark) => {
    const name = placemark.name;

    // Verificar si el elemento tiene coordenadas
    if (placemark.Point && placemark.Point.coordinates) {
      const coordinateString = placemark.Point.coordinates;
      const coordinateArray = coordinateString.split(',');

      // Obtener las coordenadas
      const longitude = parseFloat(coordinateArray[0]);
      const latitude = parseFloat(coordinateArray[1]);

      coordinatesArray.push({ longitude, latitude });
    }
  });

  function initMap() {
    // Carga el archivo KML
   
      const ubicacionActual = {
        lat: latitud,
        lng: longitud,
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
