import React from "react";
import "./index.css";
export interface Campos {
    jurisdiccion: string;
    barrio?: string;
    interseccion?: string;
}
declare const Map: React.FC<{
    className?: string;
    jurisdiccionesURL: string;
    barriosURL?: string;
    campos: Campos;
    onClick?: (data: object) => void;
}>;
export default Map;
