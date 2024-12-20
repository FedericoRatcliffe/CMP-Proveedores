export interface HeaderComprobante {
    codigoRespuesta?: number;
    mensajeRespuesta?: string;
    comprobanteAFIP?: ComprobanteAFIP;
}

export interface ComprobanteAFIP {
    tipoComprobante?: number;
    letra?: string;
    puntoVenta?: number;
    numero?: number;
    cuitEmisor?: string;
    cuitReceptor?: string;
    fechaEmision?: string;
    fechaVencimiento?: string;
    periodoFacturado?: string;
    importeNeto?: number;
    iva?: number;
    percepciones?: number;
    otrosImpuestos?: number;
    total?: number;
}
