import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputNumber, InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';


import { BusquedaDatosProveedorComponent } from "../busqueda-datos-proveedor/busqueda-datos-proveedor.component";
import { ComprobanteService } from '../../core/services/comprobante.service';
import { SelectorCuotasComponent } from "../selector-cuotas/selector-cuotas.component";
import { TablaFormularioCargaPdfComponent } from '../tabla-formulario-carga-pdf/tabla-formulario-carga-pdf.component';
import { TipoComprobanteAFIP } from '../../core/interfaces/tipoComprobanteAFIP.interface';

// import dayjs from 'dayjs';

@Component({
  selector: 'formulario-carga-pdf',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,

    ButtonModule,
    CalendarModule,
    CheckboxModule,
    DropdownModule,
    FloatLabelModule,
    InputGroupAddonModule,
    InputGroupModule,
    InputNumberModule,
    InputTextModule,
    SkeletonModule,
    TooltipModule,

    BusquedaDatosProveedorComponent,
    SelectorCuotasComponent,
    TablaFormularioCargaPdfComponent,
],
  providers: [
    ComprobanteService,
    DialogService
  ],
  templateUrl: './formulario-carga-pdf.component.html',
  styleUrl: './formulario-carga-pdf.component.scss'
})
export class FormularioCargaPdfComponent implements OnInit, OnChanges {

  @Input() datosComprobante: any;

  datosProveedor: any = null; // Propiedad para almacenar los datos del proveedor


  // Indicadores
  isLoading: boolean = false; // Indica si hay una carga activa para mostrar un estado visual.
  mostrarCuitReceptorNoCooperacionWarning: boolean = false; // Muestra advertencia si el CUIT receptor no es el esperado.
  mostrarCuitReceptorCooperacionWarning: boolean = false; // Muestra advertencia si el CUIT receptor es el esperado.

  // Formularios
  formEnviarFactura: FormGroup; // Formulario principal para enviar factura.
  formEmail: FormGroup; // Formulario para manejar datos de email.

  // Variables
  tipoComprobante: TipoComprobanteAFIP[] | undefined; // Lista de tipos de comprobantes obtenida del servicio.
  selectedTipoComprobante: TipoComprobanteAFIP | undefined; // Comprobante seleccionado en el formulario.
  cuitReceptor = ''; // CUIT del receptor del comprobante.
  
  numCuotas: number | null = null;
  primerCuota: number | null = null;
  primerVencimiento: Date | null = null;

  cuotasArray?: [];


  // Email
  esMSG = false; // Indica si el archivo cargado es de tipo MSG.
  nombreArchivoEmail: string | null = null; // Nombre del archivo cargado para email.

  ref?: DynamicDialogRef; // Referencia al diálogo dinámico.

  constructor(
    private fb: FormBuilder,
    private comprobanteService: ComprobanteService,) {

    this.formEnviarFactura = this.createFormEnviarFactura();
    this.formEmail = this.createFormEmail();

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datosComprobante'] && this.datosComprobante) {
      this.mapearDatosAlFormulario(this.datosComprobante);
      this.cuitReceptor = this.datosComprobante.cuitReceptor || '';
      this.validarCuitReceptor();
      this.sugerirFechaPago();
      // this.formEnviarFactura.patchValue({ archivo: this.datosComprobante.archivo });

      this.formEnviarFactura.patchValue({
        archivo: this.datosComprobante.archivo,
        total: this.datosComprobante.total,
        fechaEmision: this.datosComprobante.fechaEmision,
      });
    }
  }

  ngOnInit(): void {
    this.cargarTiposComprobantes();
    this.suscribirCambiosFormulario();
  }

  private suscribirCambiosFormulario(): void {
    this.formEnviarFactura.get('fechaVencimiento')?.valueChanges.subscribe(() => this.sugerirFechaPago()); // Observa cambios en la fecha de vencimiento.
    this.formEnviarFactura.get('facturaAbonada')?.valueChanges.subscribe(() => this.sugerirFechaPago()); // Observa cambios en el estado de factura abonada.
  }

  //MAPEO DE DATOS
  private mapearDatosAlFormulario(datos: any): void {
    this.formEnviarFactura.patchValue({
      tipoComprobante: datos.tipoComprobante ?? null,
      puntoVenta: datos.puntoVenta ?? null,
      numero: datos.numero ?? null,
      importeNeto: datos.importeNeto ?? null,
      iva: datos.iva ?? null,
      otrosImpuestos: datos.otrosImpuestos ?? null,
      total: datos.total ?? null,
      fechaEmision: datos.fechaEmision || null,
      fechaVencimiento: datos.fechaVencimiento,
    }); // Asigna valores desde los datos del comprobante al formulario.
  }

  //FORMULARIOS
  private createFormEnviarFactura(): FormGroup {
    return this.fb.group({
      tipoComprobante: [null, Validators.required],
      puntoVenta: [null, Validators.required],
      numero: [null, Validators.required],
      importeNeto: [null, Validators.required],
      iva: [null, Validators.required],
      otrosImpuestos: [null, Validators.required],
      total: [null, Validators.required],
      fechaEmision: [null, Validators.required],
      fechaVencimiento: [null, Validators.required],
      facturaAbonada: [null, Validators.required],
      fechaPago: [null, Validators.required],
      archivo: [null, Validators.required],
    }); // Formulario inicial para capturar datos de la factura.
  }

  private createFormEmail(): FormGroup {
    return this.fb.group({
      email: [null],
    }); // Formulario para capturar el email.
  }


  //VALIDAR CUIT
  private validarCuitReceptor(): void {
    const cuitCooperacion = '30500047174'; // CUIT esperado para identificar cooperación.
    this.mostrarCuitReceptorNoCooperacionWarning = this.cuitReceptor !== cuitCooperacion && !!this.cuitReceptor;
    this.mostrarCuitReceptorCooperacionWarning = this.cuitReceptor === cuitCooperacion;
  }

  onProveedorSeleccionado(proveedor: any): void {
    this.datosProveedor = proveedor;
  }


  private cargarTiposComprobantes(): void {
    this.comprobanteService.obtenerTiposComprobantesAFIP().subscribe({
      next: (data) => (this.tipoComprobante = data),
      error: (err) => console.error('Error al obtener los tipos de comprobantes AFIP', err),
    }); // Carga los tipos de comprobantes desde el servicio.
  }



  
  actualizarCuotas(event: { numCuotas: number; primerCuota: number; primerVencimiento: Date, cuotasArray:[] }): void {
    this.numCuotas = event.numCuotas || null;
    this.primerCuota = event.primerCuota || null;
    this.primerVencimiento = event.primerVencimiento || null;
    this.cuotasArray = event.cuotasArray || []; // Almacena el array de cuotas procesadas
  }
  
  
  
  private sugerirFechaPago(): void {
    const fechaCarga = new Date();
    fechaCarga.setHours(0, 0, 0, 0); // Fecha actual sin horas, minutos ni segundos.

    const fechaVencimientoControl = this.formEnviarFactura.get('fechaVencimiento');
    const facturaAbonada = this.formEnviarFactura.get('facturaAbonada')?.value;

    if (!this.formEnviarFactura.get('total')?.value) {
      this.formEnviarFactura.patchValue({ fechaPago: null });
      return; // Si no hay total, limpia la fecha de pago.
    }

    if (facturaAbonada) return; // Si está abonada, no sugiere fecha de pago.

    const fechaVencimiento = fechaVencimientoControl?.value
      ? new Date(fechaVencimientoControl.value.split('/').reverse().join('-') + 'T00:00:00')
      : null;

    const fechaCargaMas15Dias = new Date(fechaCarga);
    fechaCargaMas15Dias.setDate(fechaCargaMas15Dias.getDate() + 15); // Calcula 15 días adicionales.

    const fechaSugerida = fechaVencimiento && fechaVencimiento < fechaCargaMas15Dias
      ? fechaVencimiento
      : fechaCargaMas15Dias; // Usa fecha de vencimiento si es antes de 15 días desde la carga.

    this.formEnviarFactura.patchValue({ fechaPago: fechaSugerida });
  }



  //EMAIL
  onFileInputChange(event: Event, fileType: 'msg'): void {
    const input = event.target as HTMLInputElement;

    if (input.files?.length) {
      const archivo = input.files[0];
      const extension = archivo.name.split('.').pop()?.toLowerCase();

      if (fileType === 'msg' && extension === 'msg') {
        this.nombreArchivoEmail = archivo.name; // Guarda el nombre del archivo cargado.
        this.esMSG = true; // Marca que el archivo cargado es de tipo MSG.
        alert('Archivo MSG cargado.');
      } else {
        alert(`Por favor, selecciona un archivo de tipo ${fileType.toUpperCase()}.`); // Valida el tipo de archivo.
      }
    }
  }








  //ENVIAR FORMULARIO COMPLETO
  enviarFormulario(): void {
    const archivo = this.formEnviarFactura.get('archivo')?.value;

    if (!archivo) {
      console.error('No hay archivo cargado para enviar.');
      return;
    }

    const reader = new FileReader();

    // Leer el archivo como ArrayBuffer y convertirlo a Blob
    reader.onload = () => {
      const blobData = new Blob([reader.result as ArrayBuffer], { type: archivo.type }); // Convierte el archivo en Blob
      const fileExtension = archivo.name.split('.').pop()?.toLowerCase(); // Obtén la extensión del archivo
      const fileName = archivo.name; // Obtén el nombre original del archivo

      if (!this.cuotasArray || this.cuotasArray.length === 0) {
        console.error('Las cuotas no están configuradas.');
        return;
      }

      const data = {
        cuitEmisor: this.datosComprobante?.cuitEmisor,
        cuitReceptor: this.datosComprobante?.cuitReceptor,
        tipoComprobante: this.formEnviarFactura.get('tipoComprobante')?.value,
        puntoVenta: this.formEnviarFactura.get('puntoVenta')?.value,
        numero: this.formEnviarFactura.get('numero')?.value,
        importeNeto: this.formEnviarFactura.get('importeNeto')?.value,
        iva: this.formEnviarFactura.get('iva')?.value,
        otrosImpuestos: this.formEnviarFactura.get('otrosImpuestos')?.value,
        total: this.formEnviarFactura.get('total')?.value,
        fechaEmision: this.formEnviarFactura.get('fechaEmision')?.value,
        fechaVencimiento: this.formEnviarFactura.get('fechaVencimiento')?.value,
        facturaAbonada: this.formEnviarFactura.get('facturaAbonada')?.value,
        fechaPago: this.formEnviarFactura.get('fechaPago')?.value,
        archivo: blobData, // Archivo en Blob
        extension: fileExtension, // Extensión del archivo
        nombreArchivo: fileName, // Nombre del archivo
        proveedor: this.datosProveedor.ctacod, //Se envia el ID del proveedor
        cuotas: this.cuotasArray,
      };

      // Enviar el formulario con el archivo
      // this.comprobanteService.enviarFormulario(data).subscribe({
      //   next: (response) => console.log('Formulario enviado con éxito:', response),
      //   error: (error) => console.error('Error al enviar el formulario:', error),
      // });

      console.log(data);
      // console.log(blobData);
      // console.log(fileExtension);
      // console.log(fileName);
    };

    reader.readAsArrayBuffer(archivo); // Lee el archivo como ArrayBuffer para luego convertirlo a Blob
  }




}
