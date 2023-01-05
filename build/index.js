var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useEffect } from "react";
import { geoMercator, geoPath, select, json } from "d3";
import { feature } from "topojson-client";
import "./index.css";
export const Map = ({ className, onClick, jurisdiccionesURL, barriosURL, campos }) => {
    useEffect(() => {
        const projection = geoMercator();
        const path = geoPath(projection);
        (() => __awaiter(void 0, void 0, void 0, function* () {
            const jurisdicciones = yield json(jurisdiccionesURL);
            const barrios = barriosURL ? yield json(barriosURL) : null;
            const topology = {
                jurisdicciones: feature(jurisdicciones, jurisdicciones.objects.comunas),
                barrios: barrios ? feature(barrios, barrios.objects.barrios) : null,
            };
            projection.fitExtent([
                [0, 0],
                [600, 600],
            ], topology.jurisdicciones);
            const svg = select("#svg");
            svg
                .selectAll()
                .data(topology.jurisdicciones.features, (d) => d.properties[campos.jurisdiccion])
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
                    if (typeof onClick === "function")
                        onClick(Object.assign({}, this).__data__);
                });
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
                        .data((d) => topology.barrios.features.filter((f) => {
                        var _a;
                        return f.properties[campos.jurisdiccion] ===
                            d.properties[(_a = campos === null || campos === void 0 ? void 0 : campos.interseccion) !== null && _a !== void 0 ? _a : "COMUNAS"];
                    }), (d) => { var _a; return d.properties[(_a = campos === null || campos === void 0 ? void 0 : campos.barrio) !== null && _a !== void 0 ? _a : "BARRIO"]; })
                        .join("path")
                        .attr("class", "barrio")
                        .attr("d", path);
                }
            });
        }))();
    }, []);
    return (React.createElement("div", { className: className },
        React.createElement("div", { className: "container" },
            React.createElement("svg", { id: "svg", className: "map" }))));
};
