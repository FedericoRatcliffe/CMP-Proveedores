import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimeNGConfig } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { operarFecha } from '../../../core/helpers/operar-fecha.helper';

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

  constructor(
    private fb: FormBuilder,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private primengConfig: PrimeNGConfig
  ) {
    const total = this.config.data.total || 0;
    const cuotas = this.config.data.cuotas || []; // Cargar cuotas existentes
    const numCuotas = this.config.data.numCuotas || 1;

    // Configuración del formulario
    this.formCuotas = this.fb.group({
      montoTotal: [{ value: total, disabled: true }], // Total no editable
      numCuotas: [numCuotas, [Validators.required, Validators.min(1), Validators.max(6)]],
      cuotas: this.fb.array([]), // Array dinámico para las cuotas
    });

    // Si hay cuotas configuradas, úsalas; si no, inicializa por defecto
    if (cuotas.length > 0) {
      this.setCuotas(cuotas);
    } else {
      this.updateCuotas(numCuotas);
    }
  }
  

  ngOnInit(): void {
    this.primengConfig.setTranslation({ dateFormat: 'dd.mm.yy' });
  }











  get cuotas(): FormArray {
    return this.formCuotas.get('cuotas') as FormArray;
  }










  // Configura las cuotas existentes sin recalcularlas
  setCuotas(cuotas: any[]): void {
    this.cuotas.clear();
  
    cuotas.forEach((cuota, index) => {
      this.cuotas.push(
        this.fb.group({
          idCuota: [cuota.idCuota || index + 1, []], // Generar idCuota basado en el índice si no está definido
          importe: [cuota.importe, [Validators.required]],
          fecVtoCmp: [new Date(cuota.fecVtoCmp), [Validators.required]],
        })
      );
    });
  }
  
  










  // Calcula cuotas iguales por defecto, ajustando la última cuota
  updateCuotas(num: number): void {
    const total = this.formCuotas.get('montoTotal')?.value || 0;
    this.cuotas.clear();
  
    const importePorCuota = parseFloat((total / num).toFixed(2));
    let sumaParcial = 0;
  
    for (let i = 0; i < num; i++) {
      const importe = i === num - 1 ? total - sumaParcial : importePorCuota;
      sumaParcial += importe;
  
      const fecVtoCmp = this.config.data.fechaEmision
        ? operarFecha(this.config.data.fechaEmision, i + 1, 'suma', false)
        : new Date();
  
      this.cuotas.push(
        this.fb.group({
          idCuota: [i + 1, []], // Reinicia identificadores
          importe: [importe.toFixed(2), [Validators.required]],
          fecVtoCmp: [fecVtoCmp, [Validators.required]],
        })
      );
    }
  }
  
  
  









  // Recalcula las cuotas cuando cambia el número de cuotas
  onNumCuotasChange(event: any): void {
    const num = event.value;
    if (num) {
      this.updateCuotas(num);
    }
  }





















  // Guarda y cierra el diálogo devolviendo los datos configurados
  guardarCambios(): void {
    if (this.formCuotas.valid) {
      const cuotasValue = this.cuotas.value.map((cuota: any, index: number) => ({
        idCuota: cuota.idCuota || index + 1, // Asegurarse de asignar un idCuota único
        importe: cuota.importe,
        fecVtoCmp: cuota.fecVtoCmp,
      }));
  
      const resultado = {
        numCuotas: this.formCuotas.get('numCuotas')?.value,
        primerCuota: cuotasValue[0]?.importe || 0,
        primerVencimiento: cuotasValue[0]?.fecVtoCmp || null,
        cuotas: cuotasValue,
      };
  
      this.ref.close(resultado);
    } else {
      alert('Por favor, complete todos los campos antes de guardar.');
    }
  }
  
  

  closeDialog(): void {
    this.ref.close();
  }
}


