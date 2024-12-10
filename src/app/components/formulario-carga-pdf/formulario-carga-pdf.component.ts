import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyPipe, DatePipe, NgIf } from '@angular/common';

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

import { ComprobanteService } from '../../core/services/comprobante.service';
import { TipoComprobanteAFIP } from '../../core/interfaces/tipoComprobanteAFIP.interface';
import { CuotasComponent } from '../dialog/cuotas/cuotas.component';
import { TablaFormularioCargaPdfComponent } from '../tabla-formulario-carga-pdf/tabla-formulario-carga-pdf.component';

// import dayjs from 'dayjs';

import { addDays, parse, format, isBefore, subDays } from 'date-fns';




@Component({
  selector: 'formulario-carga-pdf',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
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

    TablaFormularioCargaPdfComponent,
],
  providers:[
    ComprobanteService,
    DialogService
  ],
  templateUrl: './formulario-carga-pdf.component.html',
  styleUrl: './formulario-carga-pdf.component.scss'
})
export class FormularioCargaPdfComponent implements OnInit, OnChanges {

  @Input() datosComprobante: any; // Recibe los datos del comprobante

  // CARD Y WARNINGS
  razonSocialCard: string = 'RAZÓN SOCIAL';
  cuitEmisor: string = 'xxxxxxxxxxx';
  condIva: string = 'xxxx';
  domicilio: string = 'xxxx';

  isLoading: boolean = false;

  cuitReceptor: string = '';
  mostrarCuitReceptorNoCooperacionWarning: boolean = false;
  mostrarCuitReceptorCooperacionWarning: boolean = false;

  // LLENAR CAMPO FORMULARIO
  tipoComprobante: TipoComprobanteAFIP[] | undefined;
  selectedTipoComprobante: TipoComprobanteAFIP | undefined;

  formEnviarFactura: FormGroup;
  formObtenerProveedor: FormGroup;
  formEmail: FormGroup;

  // VARIABLES PARA ALMACENAR VALORES
  numCuotas: number | null = null;
  primerCuota: number | null = null;
  primerVencimiento: Date | null = null;

  ref?: DynamicDialogRef;

  //EMAIL
  esMSG: boolean = false;
  nombreArchivoEmail: string | null = null;



  constructor(private fb: FormBuilder, private _comprobanteService: ComprobanteService, private _dialogService: DialogService) {
    this.formEnviarFactura = this.fb.group({

      tipoComprobante: [null, [Validators.required]],

      puntoVenta: [null, [Validators.required]],

      numero: [null, [Validators.required]],

      importeNeto: [null, [Validators.required]],

      iva: [null, [Validators.required]],

      otrosImpuestos: [null, [Validators.required]],

      total: [null, [Validators.required]],

      fechaEmision: [null, [Validators.required]],

      fechaVencimiento: [null, [Validators.required]],

      facturaAbonada: [null, [Validators.required]],

      fechaPago: [null, [Validators.required]],

    });

    this.formObtenerProveedor = this.fb.group({
      cadena: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(11)] ],
    });

    this.formEmail = this.fb.group({
      email: [null],
    });

  }


  ngOnChanges(changes: SimpleChanges): void {

    if (changes['datosComprobante'] && this.datosComprobante) {

      // Mapeo de los datos al formulario
      this.mapearDatosAlFormulario(this.datosComprobante);

      // Asignación del CUIT receptor y validación
      this.cuitReceptor = this.datosComprobante.cuitReceptor || '';
      this.validarCuitReceptor();

      // Otras funcionalidades existentes
      this.sugerirFechaPago();
      this.inicializarCuotasPorDefecto();
    }

  }

  private validarCuitReceptor(): void {
    const cuitCooperacion = '30500047174'; // CUIT esperado
    this.mostrarCuitReceptorNoCooperacionWarning = this.cuitReceptor !== cuitCooperacion && !!this.cuitReceptor;
    this.mostrarCuitReceptorCooperacionWarning = this.cuitReceptor === cuitCooperacion;
  }

  ngOnInit(): void {

    this.cargarTiposComprobantes();

    // Lógica adicional para actualizar fechaPago si cambia fechaVencimiento o facturaAbonada
    this.formEnviarFactura.get('fechaVencimiento')?.valueChanges.subscribe(() => {
      this.sugerirFechaPago();
    });


    this.formEnviarFactura.get('facturaAbonada')?.valueChanges.subscribe(() => {
      this.sugerirFechaPago();
    });


  }


  //MAPEAR DATOS
  private mapearDatosAlFormulario(datos: any): void {

    // Asignar los valores del comprobante a los campos del formulario
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
      facturaAbonada: datos.facturaAbonada ?? false,
      // fechaPago: datos.fechaPago ? new Date(datos.fechaPago) : null,
    });

    // Actualizar cuotas si existen
    this.numCuotas = datos.numCuotas ?? null;
    this.primerCuota = datos.primerCuota ?? null;
    this.primerVencimiento = datos.primerVencimiento ? new Date(datos.primerVencimiento) : null;
  }


  //EMAIL MSG
  onFileInputChange(event: Event, fileType:'msg'): void {

    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const archivo = input.files[0];
      const extension = archivo.name.split('.').pop()?.toLowerCase();

      if (fileType === 'msg' && extension === 'msg') {
        this.nombreArchivoEmail = archivo.name;
        this.esMSG = true;

        alert('Archivo MSG cargado.');
      } else {
        alert(`Por favor, selecciona un archivo de tipo ${fileType.toUpperCase()}.`);
      }
    }

  }





  // BUSCAR PROVEEDOR LLENAR CARD
  buscarProveedor() {

    const tipo = '01'; // Valor que se manda hardcodiado obligatorio
    const cadena = this.formObtenerProveedor.get('cadena')?.value;


    if (cadena) {

      this.isLoading = true; // Activa el indicador de carga Skeleton

      // Llamada al servicio con tipo y cadena de busqueda
      this._comprobanteService.obtenerProveedor(tipo, cadena).subscribe({

        next: (data) => {
          if (data && data.length > 0) {
            console.log('Datos recibidos del proveedor:', data[0]);

            // LLENADO DE CARD
            this.razonSocialCard = data[0].descripcion;
            this.cuitEmisor = data[0].cuit;
            this.condIva = data[0].condIva;
            this.domicilio = data[0].domicilio;
          } else {
            console.warn('No se encontró ningún proveedor con los datos proporcionados.');
          }
        },

        error: (error) => {
          console.error('Error obteniendo el proveedor', error);
        },

        complete: () => {
          this.isLoading = false;
          console.log('Obtencion de proveedor completada.');
        }

      });
    } else {
      console.warn('Debe ingresar un nombre o CUIT');
    }
  }

  //CARGAR TIPOS DE COMPROBANTES
  private cargarTiposComprobantes() {
    this._comprobanteService.obtenerTiposComprobantesAFIP().subscribe({
      next: (data: TipoComprobanteAFIP[]) => {
        this.tipoComprobante = data;
      },
      error: (err) => {
        console.error('Error al obtener los tipos de comprobantes AFIP', err);
      }
    });
  }








  //INICIALIZAR CUOTAS
  private inicializarCuotasPorDefecto(): void {

    const montoTotal = this.formEnviarFactura.get('total')?.value || 0; // obtiene el monto total
    const fechaEmision = this.formEnviarFactura.get('fechaEmision')?.value || new Date(); // fecha de emision

    this.numCuotas = 1; // inicia con 1 cuota
    this.primerCuota = montoTotal; // la unica cuota es igual al total
    //this.primerVencimiento = new Date(fechaEmision); // vencimiento basado en fecha de emision
    this.primerVencimiento = this.operarFecha(fechaEmision, 30, 'suma');

    // Ajustar el vencimiento: por ejemplo, sumar 30 días
    //this.primerVencimiento.setDate(this.primerVencimiento.getDate() + 30);
  }

  //DIALOG
  editarCuotas(event: any) {

    const totalComprobante = this.formEnviarFactura.get('total')?.value;
    const fechaEmision = this.formEnviarFactura.get('fechaEmision')?.value;

    if (!totalComprobante || !fechaEmision) {
      alert('Debe cargar el monto total y la fecha de emisión del comprobante.');
      return;
    }


    this.ref = this._dialogService.open(CuotasComponent, {
      header: 'Editar Cuotas',
      closable: false,
      width: '35vw',
      contentStyle: {
        overflow: 'auto',
        'background-color': '#C4CDD5',
      },
      styleClass: 'color-header-dialog',
      breakpoints: {
        '1700px': '40vw',
        '1280px': '55vw',
        '1100px': '80vw',
        '900px': '85vw',
        '640px': '90vw'
      },
      focusOnShow: false,
      appendTo: 'body',
      transitionOptions: '.1s ease',
      data: {
        total: totalComprobante,
        fechaEmision: new Date(fechaEmision),

        numCuotas: this.numCuotas, // Pasar el valor actual de las cuotas
        primerCuota: this.primerCuota, // Pasar el importe actual de la primera cuota
        cuotas: this.generarCuotasActuales(), // Pasar el estado actual de todas las cuotas
        primerVencimiento: this.primerVencimiento, // Pasar la fecha de vencimiento actual
      },
    });

    this.ref.onClose.subscribe((result) => {
      if (result) {
        // Actualiza la vista con los datos recibidos del componente hijo
        this.numCuotas = result.numCuotas;
        this.primerCuota = result.primerCuota;
        this.primerVencimiento = result.primerVencimiento;
      }
    });
  }

  //GENERAR CUOTAS
  private generarCuotasActuales(): any[] {
    const cuotas = [];
    const cuotaImporte = this.primerCuota || 0;
    const fechaVencimiento = this.primerVencimiento ? new Date(this.primerVencimiento) : null;

    for (let i = 0; i < (this.numCuotas || 1); i++) {
      cuotas.push({
        monto: cuotaImporte,
        vencimiento: fechaVencimiento
          ? new Date(fechaVencimiento.getFullYear(), fechaVencimiento.getMonth() + i, fechaVencimiento.getDate())
          : null,
      });
    }

    return cuotas;
  }


  //LOGICA FECHA DE PAGO
  private sugerirFechaPago(): void {
    const fechaCarga = new Date();fechaCarga.setHours(0, 0, 0, 0);  // Fecha actual como fecha de carga
    const fechaVencimientoControl = this.formEnviarFactura.get('fechaVencimiento');
    const facturaAbonada = this.formEnviarFactura.get('facturaAbonada')?.value;

    // Validar si existen datos suficientes
    const hayDatosSuficientes = !!this.formEnviarFactura.get('total')?.value;

    if (!hayDatosSuficientes) {
      // Si no hay datos, limpiar la fecha de pago
      this.formEnviarFactura.patchValue({
        fechaPago: null,
      });
      console.log('No hay datos suficientes para sugerir fecha de pago.');
      return;
    }

    // Si la factura ya está abonada, no se hace sugerencia
    if (facturaAbonada) {
      console.log('Factura abonada: No se sugiere fecha de pago.');
      return;
    }

    const fechaVencimiento = fechaVencimientoControl?.value
    ? new Date(fechaVencimientoControl.value.split('/').reverse().join('-') + 'T00:00:00')
    : null;


    // Calcula fechaCarga + 15 días
    const fechaCargaMas15Dias = new Date(fechaCarga);
    fechaCargaMas15Dias.setDate(fechaCargaMas15Dias.getDate() + 15);

    let fechaSugerida;

    if (fechaVencimiento) {
      // Usa la fecha de vencimiento si es anterior a fechaCarga + 15 días
      fechaSugerida = fechaVencimiento < fechaCargaMas15Dias ? fechaVencimiento : fechaCargaMas15Dias;
    } else {
      // Si no hay fecha de vencimiento, usa fechaCarga + 15 días
      fechaSugerida = fechaCargaMas15Dias;
    }

    // Asignar la fecha sugerida al campo fechaPago
    this.formEnviarFactura.patchValue({
      fechaPago: fechaSugerida,
    });

    console.log('Fecha sugerida de pago:', fechaSugerida.toLocaleDateString());
  }


  private operarFecha(dateString: string, dias: number, operacion: 'suma' | 'resta'): Date {
    const date = parse(dateString, 'dd/MM/yyyy', new Date());
    const result = operacion === 'suma' ? addDays(date, dias) : subDays(date, dias);

    return result;
  }

}
