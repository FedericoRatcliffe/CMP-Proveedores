export interface ObtenerComprobanteResponse {
    puntoDeVenta?:    number;
    nroComprobante?:  number;
    razonSocial?:     number;
    fechaCarga?:      Date;
    fechaPago?:       Date;
    importeTotal?:    number;
    cajaDescripcion?: string;
    idComprobante?:   number;
}
