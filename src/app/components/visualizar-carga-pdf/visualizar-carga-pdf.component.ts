import { NgIf } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ComprobanteService } from '../../core/services/comprobante.service';

@Component({
  selector: 'visualizar-carga-pdf',
  standalone: true,
  imports: [
    NgIf
  ],
  providers:[
    ComprobanteService
  ],
  templateUrl: './visualizar-carga-pdf.component.html',
  styleUrl: './visualizar-carga-pdf.component.scss'
})
export class VisualizarCargaPdfComponent implements OnInit {

  @Output() datosComprobante: EventEmitter<any> = new EventEmitter(); // Emitirá los datos extraídos del PDF

  // PDF
  esPDF: boolean = false;
  esJPG: boolean = false;

  pdfSrc: SafeResourceUrl | null = null;
  pdfFile: File | null = null;
  
  nombreArchivo: string | null = null;

  constructor(
    private sanitizer: DomSanitizer,
    private _comprobanteService: ComprobanteService
  ) {}

  ngOnInit(): void {
    const pdfPath = '';
    this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(pdfPath);
  }

  onFileInputChange(event: Event, fileType: 'pdf' | 'jpg'): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const archivo = input.files[0];
      const extension = archivo.name.split('.').pop()?.toLowerCase();

      // Validación para el input: acepta solo PDF o JPG
      if ((fileType === 'pdf' || fileType === 'jpg') && (extension === 'pdf' || extension === 'jpg' || extension === 'jpeg')) {
        this.nombreArchivo = archivo.name;
        this.esPDF = extension === 'pdf';
        this.esJPG = extension === 'jpg' || extension === 'jpeg';

        if (this.esPDF) {
          this.handlePDFFile(archivo); // Maneja la visualización del PDF
        } else if (this.esJPG) {
          const imageUrl = URL.createObjectURL(archivo); // Genera una URL para la imagen
          this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(imageUrl); // Almacena la URL segura en pdfSrc para mostrarla
        }
      } else {
        alert(`Por favor, selecciona un archivo de tipo ${fileType.toUpperCase()}.`);
      }
    }
  }

  private handlePDFFile(file: File): void {
    this.pdfFile = file;
    const url = URL.createObjectURL(file);
    this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);

    // Llamada al servicio para enviar el archivo PDF
    this._comprobanteService.enviarArchivoPDF(file).subscribe({
      next: (response) => {
        console.log('Archivo PDF enviado exitosamente:', response);

        if (response && response.comprobanteAFIP) {
          const comprobante = response.comprobanteAFIP;

          // Emitimos los datos extraídos
          this.datosComprobante.emit(comprobante);
        } else {
          console.warn('El archivo no contiene datos de comprobanteAFIP');
        }
      },
      error: (error) => {
        console.error('Error al enviar el archivo PDF:', error);
      }
    });
  }
}

