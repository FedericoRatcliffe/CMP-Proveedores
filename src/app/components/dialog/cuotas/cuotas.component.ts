import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimeNGConfig } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-cuotas',
  standalone: true,
  imports: [
    CommonModule,
    // FormsModule,
    ReactiveFormsModule,


    ButtonModule,
    FloatLabelModule,
    InputNumberModule,
    CalendarModule,
  ],
  templateUrl: './cuotas.component.html',
  styleUrl: './cuotas.component.scss'
})
export class CuotasComponent implements OnInit {
  
  formCuotas: FormGroup;

  constructor(private fb: FormBuilder, private ref: DynamicDialogRef, private config: DynamicDialogConfig, private primengConfig: PrimeNGConfig) {
    
    const total = this.config.data.total || 0;
    const fechaEmision = this.config.data.fechaEmision || new Date();
    const numCuotas = this.config.data.numCuotas || 1;
    const cuotas = this.config.data.cuotas || []; // Cargar cuotas existentes
  
    this.formCuotas = this.fb.group({
      montoTotal: [{ value: total, disabled: true }], // Configurado como deshabilitado
      numCuotas: [numCuotas, [Validators.required, Validators.min(1), Validators.max(6)]],
      cuotas: this.fb.array([]), // FormArray dinámico para cuotas
    });
  
    // Si existen cuotas previamente configuradas, utilizarlas; de lo contrario, inicializar por defecto
    if (cuotas.length > 0) {
      this.setCuotas(cuotas);
    } else {
      this.updateCuotas(numCuotas, fechaEmision); // Inicializa con 1 cuota por defecto
    }
  }


  ngOnInit(): void {
    // Configuración global para PrimeNG
    this.primengConfig.setTranslation({
      dateFormat: 'mm.dd.yy',
    });
  }


  // Getter para acceder al FormArray de cuotas
  get cuotas(): FormArray {
    return this.formCuotas.get('cuotas') as FormArray;
  }

  // Método para configurar cuotas existentes
  setCuotas(cuotas: any[]): void {
    this.cuotas.clear(); // Limpia las cuotas actuales

    cuotas.forEach((cuota) => {
      this.cuotas.push(
        this.fb.group({
          monto: [cuota.monto, [Validators.required]],
          vencimiento: [new Date(cuota.vencimiento), [Validators.required]],
        })
      );
    });
  }


  // Método para actualizar los campos de cuotas según el número seleccionado
  updateCuotas(num: number, fechaEmision?: Date): void {
    this.cuotas.clear(); // Limpia las cuotas actuales

    const total = this.formCuotas.get('montoTotal')?.value || 0;
    const montoPorCuota = Math.floor((total / num) * 100) / 100; // Redondeo hacia abajo a 2 decimales
    let sumaParcial = 0;

    for (let i = 0; i < num; i++) {
      // Si es la última cuota, ajusta para compensar el redondeo
      const monto = i === num - 1 ? total - sumaParcial : montoPorCuota;
      sumaParcial += monto;

      // Calcula la fecha de vencimiento: suma `i` meses a la fecha de emisión
      const vencimiento = fechaEmision
        ? new Date(fechaEmision.getFullYear(), fechaEmision.getMonth() + 1 + i, fechaEmision.getDate())
        : null;

      this.cuotas.push(
        this.fb.group({
          monto: [monto, [Validators.required]], // Campo para el monto de la cuota
          vencimiento: [vencimiento, [Validators.required]], // Campo para la fecha de vencimiento
        })
      );
    }
  }


  // Escucha cambios en el número de cuotas
  onNumCuotasChange(event: any): void {
    const num = event.value;
    const fechaEmision = this.config.data.fechaEmision || new Date();
    if (num) {
      this.updateCuotas(num, fechaEmision);
    }
  }
  

  // Método para manejar el submit (opcional)
  onSubmit(): void {
    if (this.formCuotas.valid) {
      console.log(this.formCuotas.value);
    }
  }

  // Método para cerrar el diálogo
  closeDialog(data: any): void {
    this.ref.close(data);
  }

  guardarCambios(): void {
    if (this.formCuotas.valid) {
      const cuotasValue = this.cuotas.value;
      const resultado = {
        numCuotas: this.formCuotas.get('numCuotas')?.value,
        primerCuota: cuotasValue[0]?.monto || 0,
        primerVencimiento: cuotasValue[0]?.vencimiento || null,
      };
      this.ref.close(resultado); // Envía los datos al padre
    } else {
      alert('Por favor, complete todos los campos antes de guardar.');
      console.error('Formulario inválido');
    }
  }
  
}

