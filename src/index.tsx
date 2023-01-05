import React, { useEffect } from "react";
import { geoMercator, geoPath, select, json } from "d3";

import { feature } from "topojson-client";
import "./index.css";
export interface Campos {
  jurisdiccion: string;
  barrio?: string;
  interseccion?: string;
}

export const Map: React.FC<{
  className?: string;
  jurisdiccionesURL: string;
  barriosURL?: string;
  campos: Campos;
  onClick?: (data: object) => void;
}> = ({ className, onClick, jurisdiccionesURL, barriosURL, campos }) => {
  useEffect(() => {
    const projection = geoMercator();
    const path = geoPath(projection);

    //async inmediately invoked arrow function
    (async () => {
      const jurisdicciones = await json(jurisdiccionesURL);
      const barrios = barriosURL ? await json(barriosURL) : null;
      const topology = {
        jurisdicciones: feature(jurisdicciones, jurisdicciones.objects.comunas),
        barrios: barrios ? feature(barrios, barrios.objects.barrios) : null,
      };
      projection.fitExtent(
        [
          [0, 0],
          [600, 600],
        ],
        topology.jurisdicciones
      );

      const svg = select("#svg");

      svg
        .selectAll()
        .data(
          topology.jurisdicciones.features,
          (d) => d.properties[campos.jurisdiccion]
        )
        .join((enter) => {
          const g = enter
            .append("g")
            .attr("class", "jurisdiccion")
            .attr("id", (d) => d.properties.ID)
            .on("mouseover", function () {
              svg.selectAll(".jurisdiccion").classed("hovered", false);
              select(this).classed("hovered", true);
            })
            .on("mouseout", function () {
              svg.selectAll(".jurisdiccion").classed("hovered", false);
            })
            .on("click", function () {
              if (typeof onClick === "function") onClick({ ...this }.__data__);
            });

          //add the id as text in the center of the jurisdiccion
          g.append("text")
            .attr("x", (d) => path.centroid(d)[0])
            .attr("y", (d) => path.centroid(d)[1])
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("font-size", "1.5rem")
            .attr("fill", "#36ff6b")
            .text((d) => d.properties.ID);

          g.append("path").attr("d", path);
          if (barrios) {
            g.append("g")
              .selectAll()
              .data(
                (d) =>
                  topology.barrios.features.filter(
                    (f) =>
                      f.properties[campos.jurisdiccion] ===
                      d.properties[campos?.interseccion ?? "COMUNAS"]
                  ),
                (d) => d.properties[campos?.barrio ?? "BARRIO"]
              )
              .join("path")
              .attr("class", "barrio")
              .attr("d", path);
          }
        });
    })();
  }, []);

  return (
    <div className={className}>
      <div className="container">
        <svg id="svg" className="map"></svg>
      </div>
    </div>
  );
};
