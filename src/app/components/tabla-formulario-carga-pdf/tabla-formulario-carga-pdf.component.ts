import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputNumberModule } from 'primeng/inputnumber';

import { ComprobanteService } from '../../core/services/comprobante.service';
import { FormsModule } from '@angular/forms';
import { CentroCostoResponse, CentroImputacionResponse } from '../../core/interfaces/centroDeCostoResponse.interface';


type ColumnaTabla = 'centroCosto' | 'centroImputacion' | 'cuentaContable';

interface FilaTabla {
  centroCosto?: CentroCostoItem;
  centroImputacion?: CentroImputacionItem;
  cuentaContable?: any;
}




interface CentroCostoItem {
  centroCosto?: CentroCostoResponse;
  valor?: number;
}

interface CentroImputacionItem {
  centroImputacion?: CentroImputacionResponse;
  valor?: number;
}




@Component({
  selector: 'tabla-formulario-carga-pdf',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    TooltipModule,
    TableModule,
    DropdownModule,
    MessagesModule,
    MessageModule,
    AutoCompleteModule,
    InputNumberModule
  ],
  providers: [
    ComprobanteService
  ],
  templateUrl: './tabla-formulario-carga-pdf.component.html',
  styleUrl: './tabla-formulario-carga-pdf.component.scss'
})
export class TablaFormularioCargaPdfComponent {
  rows: FilaTabla[] = [];

  suggestionsCentroCostos: CentroCostoResponse[] = [];
  suggestionsCentroImputacion: CentroImputacionResponse[] = [];
  suggestionsCuentasContables: any[] = [];

  errorCentroCostos = false;
  errorCentroImputacion = false;
  errorCuentasContables = false;

  constructor(private comprobanteService: ComprobanteService) {}

  private agregarCelda(columna: ColumnaTabla, columnaDatos:any) {

    // Buscar una fila incompleta para esta columna
    const filaIncompleta = this.rows.find(row => row[columna] === undefined);

    if (filaIncompleta) {
      // Si existe una fila incompleta, agregamos solo la celda en esa columna
      filaIncompleta[columna] = columnaDatos;
    } else {
      // Si no existe una fila incompleta, creamos una nueva fila
      const nuevaFila: FilaTabla = {};
      nuevaFila[columna] = columnaDatos; // Solo inicializamos la columna correspondiente
      this.rows.push(nuevaFila);
    }

  }

  private addSuggestionsCentroCostos( data:CentroCostoResponse[] ) {
    const filter = this.rows.filter(r => r.centroCosto).map(r => r.centroCosto?.centroCosto);
    this.suggestionsCentroCostos = data.filter(d => !filter.includes(d));
  }

  private addSuggestionsCentroImputacion( data:CentroImputacionResponse[] ) {
    const filter = this.rows.filter(r => r.centroImputacion).map(r => r.centroImputacion?.centroImputacion);
    this.suggestionsCentroImputacion = data.filter(d => !filter.includes(d));
  }




  agregarCentroDeCosto() {
    var existeVacia = this.rows.filter(r => r.centroCosto?.centroCosto == null).length > 0;
    if (existeVacia) return;

    var data : CentroCostoItem = {centroCosto:undefined, valor: undefined};
    this.agregarCelda('centroCosto', data);
  }

  agregarCentroDeImputacion(){
    var existeVacia = this.rows.filter(r => r.centroImputacion?.centroImputacion == null).length > 0;
    if (existeVacia) return;

    var data: CentroImputacionItem = {centroImputacion:undefined, valor:undefined};
    this.agregarCelda('centroImputacion', data);
  }

  agregarCuentaContable(){
    
  }

  eliminarCelda(rowIndex:number, columna:ColumnaTabla){

    this.rows[rowIndex][columna] = null;

    if(this.rows[rowIndex].centroCosto == null && this.rows[rowIndex].centroImputacion == null && this.rows[rowIndex].cuentaContable == null){
      this.rows.splice(rowIndex, 1);
    }


  }













  buscarCentroCostos(event: any) {
    const query = event.query;
    if (query.length < 3) {
      this.errorCentroCostos = true;
      return;
    }
    this.errorCentroCostos = false;
    this.comprobanteService.obtenerCentroDeCostos(query).subscribe(data => {
      this.addSuggestionsCentroCostos(data);
    });
  }


  
  buscarCentroImputacion(event: any) {
    const query = event.query;
    if (query.length < 3) {
      this.errorCentroImputacion = true;
      return;
    }
    this.errorCentroImputacion = false;
    this.comprobanteService.obtenerCentroDeImputacion(query).subscribe(data => {
      this.addSuggestionsCentroImputacion(data);
    });
  }

  seleccionarCentroImputacion(event: any, row: any) {
    row.centroImputacion = event;
  }


  
  buscarCuentasContables(event: any) {
    const query = event.query;
    if (query.length < 3) {
      this.errorCuentasContables = true;
      return;
    }
    this.errorCuentasContables = false;
    this.comprobanteService.obtenerCuentaContable().subscribe(data => {
      this.suggestionsCuentasContables = data;
    });
  }

  seleccionarCuentaContable(event: any, row: any) {
    row.cuentaContable = event;
  }

  
}



