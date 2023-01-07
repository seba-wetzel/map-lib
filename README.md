Primer estadio de libreria de visualizacion de mapas, para ser reutilizada y escalable.
`Queda por subir a npm`

#Instalacion
Clone el repositorio y ejecute `npm install` para instalar las dependencias.
Ejecute `npm build` para compilar el proyectom y luego `npm link` para crear un link simbolico de la libreria.
En el proyecto donde se quiera utilizar la libreria, ejecute `npm link map-lib` para crear un link simbolico a la libreria.

Dentro del proyecto, se debe importar el componente `Map` de la libreria.
`import { Map } from "map-lib";`

El componente `Map` recibe como propiedades:  
jurisdiccionesURL: string; // URL de la API que devuelve las jurisdicciones  
barriosURL: string; // URL de la API que devuelve los barrios  
campos={{
          jurisdiccion: "COMUNA", // Nombre del campo que contiene la jurisdiccion dentro del topojson
          interseccion: "COMUNAS",// Nombre del campo que contiene la interseccion entre el barrio y la jurisdiccion dentro del topojson
          barrio: "BARRIO", // Nombre del campo que contiene el barrio dentro del topojson
        }}
onClick: funcion que se ejecuta al hacer click en una jurisdiccion, recive los datos del elemento
