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
  providers: [
    ComprobanteService
  ],
  templateUrl: './visualizar-carga-pdf.component.html',
  styleUrl: './visualizar-carga-pdf.component.scss'
})
export class VisualizarCargaPdfComponent implements OnInit {

  @Output() datosComprobante = new EventEmitter<any>();
  // @Output() datosComprobante = new EventEmitter<{ comprobanteAFIP: any }>();;

  esPDF : boolean = false;
  esJPG : boolean = false;

  pdfSrc: SafeResourceUrl | null = null;
  nombreArchivo: string | null = null;

  constructor(
    private sanitizer: DomSanitizer,
    private comprobanteService: ComprobanteService
  ) { }

  ngOnInit(): void {
    this.limpiarPdfSource();
  }

  handleFileInputChange(event: Event, fileType: 'pdf' | 'jpg'): void {
    const archivo = this.getArchivoSeleccionado(event);

    if (!archivo) return;

    const extension = this.getExtensionArchivo(archivo);
    if (!this.isTipoArchivoValido(fileType, extension)) {
      alert(`Por favor, selecciona un archivo de tipo ${fileType.toUpperCase()}.`);
      return;
    }

    this.nombreArchivo = archivo.name;
    this.updateFileTypeFlags(extension);

    this.esPDF ? this.procesarPDF(archivo) : this.procesarJPG(archivo);
  }

  // Restablece la fuente del PDF a una URL vacía y segura.
  private limpiarPdfSource(): void {
    this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl('');
  }



  // Recupera el archivo seleccionado del evento de entrada o devuelve null si no se selecciona ningún archivo.
  private getArchivoSeleccionado(event: Event): File | null {
    const input = event.target as HTMLInputElement;
    return input.files?.[0] || null;
  }



  // Extrae la extensión del archivo del nombre para determinar su tipo.
  private getExtensionArchivo(file: File): string {
    return file.name.split('.').pop()?.toLowerCase() || '';
  }



  // Verifica si la extensión del archivo coincide con el tipo esperado (PDF o JPG).
  private isTipoArchivoValido(fileType: 'pdf' | 'jpg', extension: string): boolean {
    const validExtensions = ['pdf', 'jpg', 'jpeg'];
    return fileType === 'pdf' || fileType === 'jpg'
      ? validExtensions.includes(extension)
      : false;
  }



  // Actualiza las banderas que indican si el archivo es un PDF o un JPG basado en su extensión.
  private updateFileTypeFlags(extension: string): void {
    this.esPDF = extension === 'pdf';
    this.esJPG = ['jpg', 'jpeg'].includes(extension);
  }



  // Maneja el procesamiento y la carga de un archivo PDF.
  private procesarPDF(file: File): void {
    this.setRecursoSeguroURL(file);
    this.subirPDF(file);
  }


  // Sube el archivo PDF al servidor mediante una llamada al servicio.
  private subirPDF(file: File): void {
    this.comprobanteService.enviarArchivoPDF(file).subscribe({
      next: (response) => this.handlePDFRespuesta(response, file),
      error: (error) => console.error('Error al enviar el archivo PDF:', error)
    });
  }

  

  // Procesa la respuesta del servidor para extraer y emitir los datos de comprobanteAFIP, si están disponibles.
  private handlePDFRespuesta(response: any, file: File): void {
    if (response?.comprobanteAFIP) {
      this.datosComprobante.emit({ ...response.comprobanteAFIP, archivo: file });
    } else {
      console.warn('El archivo no contiene datos de comprobanteAFIP');
    }
  }



  // Maneja el procesamiento y la visualización de un archivo de imagen JPG.
  private procesarJPG(file: File): void {
    const imageUrl = URL.createObjectURL(file);
    this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(imageUrl);
    this.uploadJPG(file); // Envia el archivo JPG al backend
  }

  private uploadJPG(file: File): void {
    this.comprobanteService.enviarArchivoPDF(file).subscribe({
      next: (response) => this.handleJPGRespuesta(response),
      error: (error) => console.error('Error al enviar el archivo JPG:', error)
    });
  }

  private handleJPGRespuesta(response: any): void {
    if (response?.datosImagen) {
      this.datosComprobante.emit(response.datosImagen);
    } else {
      console.warn('El archivo JPG no contiene datos esperados.');
    }
  }




  private setRecursoSeguroURL(file: File): void {
    const url = URL.createObjectURL(file);
    this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}

