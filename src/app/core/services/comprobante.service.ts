import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, map, switchMap, tap } from 'rxjs';

import { TipoComprobanteAFIP } from '../interfaces/tipoComprobanteAFIP.interface';
import { CentroCostoResponse } from '../interfaces/centroDeCostoResponse.interface';

@Injectable({
  providedIn: 'root'
})
export class ComprobanteService {
  
  private baseUrl: string = 'https://apicmptest.cooperacionseguros.com.ar/wsproveedores';
  private tokenUrl: string = 'https://wssecuritytest.cooperacionseguros.com.ar/token';
  
  constructor(private http: HttpClient) { }

  private getToken(): Observable<string> {
    const body = {
      ClientId: 'PORTALPROVEEDORES',
      clientSecret: '3EFEE37E-4698-4657-A12F-EB9065A8F5A5'
    };

    return this.http.post<{ access_token: string }>(this.tokenUrl, body)
      .pipe(
        tap(response => {
          const token = response.access_token;
          localStorage.setItem('authTokenFactura', token);
        }),
        switchMap(response => from([response.access_token]))
      );
  }

  enviarArchivoPDF(archivo: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', archivo);
    const token = localStorage.getItem('authTokenFactura');

    if (token) {
      return this.enviarArchivoConToken(archivo, token);
    } else {
      return this.getToken().pipe(
        switchMap(token => this.enviarArchivoConToken(archivo, token))
      );
    }
  }

  private enviarArchivoConToken(archivo: File, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const formData = new FormData();
    formData.append('file', archivo);

    const uploadUrl = `${this.baseUrl}/Comprobante/LeerFactura`;

    return this.http.post<any>(uploadUrl, formData, { headers });
  }


  
  // --------------------------------------------------------------------
  // BUSCAR PROVEEDOR
  obtenerProveedor(tipo: string, cadena: string): Observable<any> {
    return this.getToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        // Creo los parametros de la solicitud "Tipo" y "Cadena"
        const params = new HttpParams()
          .set('Tipo', tipo)         // Enviar "Tipo" como parametro fijo "01"
          .set('Cadena', cadena);     // Enviar "Cadena" con el valor de busqueda

        const proveedorUrl = `${this.baseUrl}/Proveedores/GetProveedores`;

        return this.http.get<any>(proveedorUrl, { headers, params });
      })
    );
  }
  // --------------------------------------------------------------------
  // BUSCAR TIPOS DE COMPROBANTES AFIP
  obtenerTiposComprobantesAFIP(): Observable<TipoComprobanteAFIP[]> {
    return this.getToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
        const url = `${this.baseUrl}/Comprobante/TiposComprobantesAFIP`;
        return this.http.get<any[]>(url, { headers });
      }),
      map(data =>
        data.map(item => ({
          name: item.nombre,
          code: item.codigoAfip
          // code: item.codigoAfip.toString()  // convertir el codigo a string si se necesita
        }))
      )
    );
  }
  // --------------------------------------------------------------------
  // OBTENER COSTOS IMPUTACION CONTABLE
  obtenerCentroDeCostos(termino: string): Observable<CentroCostoResponse[]> {
    return this.getToken().pipe( // Reutilizamos la obtención de token
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        const params = new HttpParams().set('Cadena', termino); // Parámetro esperado por la API

        const url = `${this.baseUrl}/CentroDeCostos/ObtenerCentroDeCostos`;

        return this.http.get<any[]>(url, { headers, params });
      })
    );
  }

  obtenerCentroDeImputacion(termino: string): Observable<any[]> {
    return this.getToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
  
        const params = new HttpParams().set('Cadena', termino);
  
        const url = `${this.baseUrl}/CentroDeImputacion/ObtenerCentrosDeImputacion`;
  
        return this.http.get<any[]>(url, { headers, params });
      })
    );
  }
  
  obtenerCuentaContable(termino: string): Observable<any[]> {
    return this.getToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
        
        const params = new HttpParams().set('Cadena', termino).set('IdAplicacion', '1');
  
        const url = `${this.baseUrl}/CuentasContables/ObtenerCuentaContable`;
  
        return this.http.get<any[]>(url, { headers, params });
      })
    );
  }
  



}
