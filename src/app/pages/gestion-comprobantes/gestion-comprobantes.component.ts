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

  formBusquedaComprobante: FormGroup;
  
  selectedState = new FormGroup({
    state: new FormControl(null)
  })

  public productService = inject(ProductService);


  

  constructor( private fb: FormBuilder ) {
    this.formBusquedaComprobante = this.createFormBusquedaComprobante();
  }


  private createFormBusquedaComprobante(): FormGroup {

    return this.fb.group({
      razonSocial: [null, Validators.required],
      nroComprobante: [null],
      fechaCarga: [null],
      fechaPago: [null],
      caja: [null],
      estado: [null],
    });

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
