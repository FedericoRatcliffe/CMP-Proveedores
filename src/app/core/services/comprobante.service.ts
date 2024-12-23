import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, map, switchMap, tap } from 'rxjs';

import { TipoComprobanteAFIP } from '../interfaces/tipoComprobanteAFIP.interface';
import { CentroCostoResponse } from '../interfaces/centroDeCostoResponse.interface';
import { SubirArchivoResponse } from '../interfaces/subirArchivoResponse';
import { environment } from '../../../environments/environment';
import { HeaderComprobante } from '../interfaces/leerFacturaResponse.interface';
import { ProveedoresResponse } from '../interfaces/proveedoresResponse.interface';
import { ObtenerComprobanteResponse } from '../interfaces/obtenerComprobanteResponse.interface';

@Injectable({
  providedIn: 'root'
})
export class ComprobanteService {

  constructor(private http: HttpClient) { }

  
  enviarArchivoPDF(archivo: File): Observable<HeaderComprobante> {

    const formData = new FormData();
    formData.append('file', archivo);

    return this.http.post<HeaderComprobante>(`${environment.apiBase}/Comprobante/LeerFactura`, formData);
  }

  
  subirArchivo(archivo: File): Observable<SubirArchivoResponse> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    return this.http.post<SubirArchivoResponse>(`${environment.apiCore}/Documentos/Guardar`, formData);
  }





  // --------------------------------------------------------------------
  // BUSCAR PROVEEDOR
  obtenerProveedor(tipo: string, cadena: string): Observable<ProveedoresResponse[]> {

    const params = new HttpParams()
    .set('Tipo', tipo)         // Enviar "Tipo" como parametro fijo "01"
    .set('Cadena', cadena);     // Enviar "Cadena" con el valor de busqueda

    return this.http.get<ProveedoresResponse[]>(`${environment.apiBase}/Proveedores/GetProveedores`, {params});

  }


  obtenerTiposComprobantesAFIP(): Observable<TipoComprobanteAFIP[]> {
    return this.http.get<TipoComprobanteAFIP[]>(`${environment.apiBase}/Comprobante/TiposComprobantesAFIP`);
  }


  // --------------------------------------------------------------------
  // OBTENER COSTOS IMPUTACION CONTABLE
  obtenerCentroDeCostos(termino: string): Observable<CentroCostoResponse[]> {

    const params = new HttpParams().set('soloHabilitados', termino); // Parámetro esperado por la API
    
    return this.http.get<any[]>(`${environment.apiBase}/CentroDeCostos`, { params });
    
  }


  
  obtenerCentroDeImputacion(termino: string): Observable<any[]> {



    const params = new HttpParams().set('cadena', termino).set('soloHabilitados', 's');

    return this.http.get<any[]>(`${environment.apiBase}/CentroDeImputacion`, { params });

  }


  obtenerCuentaContable(): Observable<any[]> {

    return this.http.get<any[]>(`${environment.apiBase}/CuentasContables/Asignadas`);
  }



  // --------------------------------------------------------------------
  // --------------------------------------------------------------------
  // SERVICIOS USADOS EN PANTALLA GESTION COMPROBANTES
  
  obtenerComprobantesPost(body:any): Observable<ObtenerComprobanteResponse[]> {

    return this.http.post<ObtenerComprobanteResponse[]>(`${environment.apiBase}/Comprobante/ObtenerComprobantes`, body);
    
  }

  

}
