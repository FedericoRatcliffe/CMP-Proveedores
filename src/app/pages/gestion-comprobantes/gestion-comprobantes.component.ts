import { Component, inject, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { KeyFilterModule } from 'primeng/keyfilter';


import { TablaGestionComprobantesComponent } from "../../components/tabla-gestion-comprobantes/tabla-gestion-comprobantes.component";
import { AllowedStatesOptions, Product } from '../../paraTablaGestion/product.interface';
import { ProductService } from '../../paraTablaGestion/product.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-gestion-comprobantes',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    
    ButtonModule,
    CalendarModule,
    DropdownModule,
    FloatLabelModule,
    InputNumberModule,
    InputTextModule,
    KeyFilterModule,

    TablaGestionComprobantesComponent
  ],
  templateUrl: './gestion-comprobantes.component.html',
  styleUrl: './gestion-comprobantes.component.scss'
})
export class GestionComprobantesComponent implements OnInit {


  facturasSeleccionadas = signal<Product[]>([]);
  products = signal<Product[]>([]);
  isLoading = signal<boolean>(false);
  nroComprobantePattern: RegExp = /^[0-9/]*$/;
  allowedStates = AllowedStatesOptions;
  
  selectedState = new FormGroup({
    state: new FormControl(null)
  })
  
  public productService = inject(ProductService);


  


  formBusquedaComprobantes: FormGroup;
  
  constructor( private fb: FormBuilder ) {
    this.formBusquedaComprobantes = this.createFormBusquedaComprobantes();
  }

  private createFormBusquedaComprobantes(): FormGroup {

    return this.fb.group({
      razonSocial: [null],
      nroComprobante: [null, Validators.required],
      fechaCarga: [null],
      fechaPago: [null],
      caja: [null],
      estado: [null],
    });

  }



  enviarFormularioBusquedaComprobantes() {
    const {
      razonSocial,
      nroComprobante,
      fechaCarga,
      fechaPago,
      caja,
      estado
    } = this.formBusquedaComprobantes.value;




  }


  limpiarFormulario(){
    this.formBusquedaComprobantes.reset()
  }









  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.isLoading.set(true);
    this.products.set([]);
    this.productService.getProductsMini().then((data: any) => {
      this.products.set(data);
      this.isLoading.set(false);
    });
  }

  onCheckboxChange(event: Product[]) {
    this.facturasSeleccionadas.set(event);
  }

  closeBar() {
    this.facturasSeleccionadas.set([]);
  }

  updateState() {
    this.productService.updateState(this.facturasSeleccionadas(), this.selectedState.get('state')!.value!);
    this.getProducts();
    this.facturasSeleccionadas.set([]);
    this.selectedState.reset();
  }

  get getReceiptText() {
    const count = this.facturasSeleccionadas().length;
    const isPlural = count > 1;
    return `${count} ${isPlural ? 'facturas' : 'factura'} ${isPlural ? 'seleccionadas' : 'seleccionada'}`;
  }

}
