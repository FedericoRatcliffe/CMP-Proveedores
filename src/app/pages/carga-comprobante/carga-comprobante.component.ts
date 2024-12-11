import { Component } from '@angular/core';

import { VisualizarCargaPdfComponent } from "../../components/visualizar-carga-pdf/visualizar-carga-pdf.component";
import { FormularioCargaPdfComponent } from "../../components/formulario-carga-pdf/formulario-carga-pdf.component";

@Component({
  selector: 'app-carga-comprobante',
  standalone: true,
  imports: [
    VisualizarCargaPdfComponent,
    FormularioCargaPdfComponent
],
  templateUrl: './carga-comprobante.component.html',
  styleUrl: './carga-comprobante.component.scss'
})
export class CargaComprobanteComponent {

  datosExtraidos: any;

  onDatosComprobanteRecibidos(datos: any): void {
    console.log('Datos recibidos del PDF:', datos);
    this.datosExtraidos = datos;
  }

}
