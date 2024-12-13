import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CuotasComponent } from '../dialog/cuotas/cuotas.component';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { operarFecha } from '../../core/helpers/operar-fecha.helper';

@Component({
  selector: 'app-selector-cuotas',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './selector-cuotas.component.html',
  styleUrl: './selector-cuotas.component.scss'
})
export class SelectorCuotasComponent implements OnInit, OnChanges {
  
  @Input() total: number = 0; // Monto total del comprobante
  @Input() fechaEmision: Date | string = new Date(); // Fecha de emisión del comprobante
  @Output() cuotasCambiadas = new EventEmitter<any>(); // Notifica cambios de cuotas al componente padre
  
  numCuotas: number = 1;
  primerCuota: number = 0;
  primerVencimiento: Date | null = null;
  ref?: DynamicDialogRef;

  constructor(private dialogService: DialogService) {}

  ngOnInit(): void {
    // Inicialización si se requiere.
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['total'] || changes['fechaEmision']) {
      this.inicializarCuotas();
    }
  }

  inicializarCuotas(): void {
    if (this.total > 0 && this.fechaEmision) {
      const fechaEmisionFormatted = typeof this.fechaEmision === 'string' ? this.fechaEmision : this.formatearFecha(this.fechaEmision);
      this.numCuotas = 1;
      this.primerCuota = this.total;
      this.primerVencimiento = operarFecha(fechaEmisionFormatted, 1, 'suma', false); // Suma un mes a la fecha de emisión
      this.emitirCuotas();
    } else {
      this.numCuotas = 0;
      this.primerCuota = 0;
      this.primerVencimiento = null;
    }
  }

  editarCuotas(): void {
    if (!this.total || !this.fechaEmision) {
      alert('Debe cargar el monto total y la fecha de emisión del comprobante.');
      return;
    }

    this.ref = this.dialogService.open(CuotasComponent, {
      header: 'Editar Cuotas',
      closable: false,
      width: '35vw',
      contentStyle: { overflow: 'auto', 'background-color': '#C4CDD5' },
      styleClass: 'color-header-dialog',
      breakpoints: { '1700px': '40vw', '1280px': '55vw', '1100px': '80vw', '900px': '85vw', '640px': '90vw' },
      focusOnShow: false,
      appendTo: 'body',
      transitionOptions: '.1s ease',
      data: {
        total: this.total,
        fechaEmision: this.fechaEmision,
        numCuotas: this.numCuotas,
        primerCuota: this.primerCuota,
        cuotas: this.generarCuotasActuales(),
        primerVencimiento: this.primerVencimiento,
      },
    });

    this.ref.onClose.subscribe((result) => {
      if (result) {
        this.numCuotas = result.numCuotas;
        this.primerCuota = result.primerCuota;
        this.primerVencimiento = result.primerVencimiento;
        this.emitirCuotas();
      }
    });
  }

  generarCuotasActuales(): any[] {
    const cuotas = [];
    const cuotaImporte = this.primerCuota || 0;
    const fechaVencimiento = this.primerVencimiento ? new Date(this.primerVencimiento) : null;

    for (let i = 0; i < this.numCuotas; i++) {
      cuotas.push({
        monto: cuotaImporte,
        vencimiento: fechaVencimiento
          ? operarFecha(fechaVencimiento, i, 'suma', false) // Suma meses para cada cuota
          : null,
      });
    }

    return cuotas;
  }

  emitirCuotas(): void {
    this.cuotasCambiadas.emit({
      numCuotas: this.numCuotas,
      primerCuota: this.primerCuota,
      primerVencimiento: this.primerVencimiento,
    });
  }

  private formatearFecha(fecha: Date): string {
    // Formatea una fecha Date a 'dd/MM/yyyy'
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const año = fecha.getFullYear();
    return `${dia}/${mes}/${año}`;
  }
}
