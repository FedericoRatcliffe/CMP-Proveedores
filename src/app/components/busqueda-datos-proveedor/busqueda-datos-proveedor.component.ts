import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ComprobanteService } from '../../core/services/comprobante.service';
import { NgIf } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';

@Component({
  selector: 'app-busqueda-datos-proveedor',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,


    SkeletonModule,
    ButtonModule,
    InputTextModule,
    InputGroupModule
  ],
  templateUrl: './busqueda-datos-proveedor.component.html',
  styleUrl: './busqueda-datos-proveedor.component.scss'
})
export class BusquedaDatosProveedorComponent {
  
  @Input() isLoading: boolean = false;
  @Output() proveedorSeleccionado = new EventEmitter<any>();

  formObtenerProveedor: FormGroup;

  ctaCod: number = 0;
  razonSocialCard: string = 'RAZÓN SOCIAL';
  cuitEmisor: string = 'xxxxxxxxxxx';
  condIva: string = 'xxxx';
  domicilio: string = 'xxxx';


  constructor(
    private fb: FormBuilder,
    private comprobanteService: ComprobanteService
  ) {
    this.formObtenerProveedor = this.fb.group({
      cadena: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(11)]],
    });
  }


  buscarProveedor(): void {
    const cadena = this.formObtenerProveedor.get('cadena')?.value;

    if (!cadena) {
      console.warn('Debe ingresar un nombre o CUIT');
      return;
    }

    this.isLoading = true;
    this.comprobanteService.obtenerProveedor('01', cadena).subscribe({
      next: (data) => this.actualizarInformacionProveedor(data),
      error: (err) => console.error('Error obteniendo el proveedor', err),
      complete: () => (this.isLoading = false),
    });
  }

  private actualizarInformacionProveedor(data: any[]): void {
    if (data?.length > 0) {
      const proveedor = data[0];
      this.ctaCod = proveedor.ctacod;
      this.razonSocialCard = proveedor.descripcion;
      this.cuitEmisor = proveedor.cuit;
      this.condIva = proveedor.condIva;
      this.domicilio = proveedor.domicilio;

      console.warn(proveedor);

      this.proveedorSeleccionado.emit(proveedor); // Notificar al componente padre.
    } else {
      console.warn('No se encontró ningún proveedor con los datos proporcionados.');
    }
  }



}
