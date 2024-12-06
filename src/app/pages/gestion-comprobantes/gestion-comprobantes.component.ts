import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { KeyFilterModule } from 'primeng/keyfilter';


import { TablaGestionComprobantesComponent } from "../../components/tabla-gestion-comprobantes/tabla-gestion-comprobantes.component";

@Component({
  selector: 'app-gestion-comprobantes',
  standalone: true,
  imports: [
    RouterLink,
    ButtonModule,
    CalendarModule,
    DropdownModule,
    InputTextModule,
    FloatLabelModule,
    InputNumberModule,
    KeyFilterModule,

    TablaGestionComprobantesComponent
],
  templateUrl: './gestion-comprobantes.component.html',
  styleUrl: './gestion-comprobantes.component.scss'
})
export class GestionComprobantesComponent {

  nroComprobantePattern: RegExp = /^[0-9/]*$/;



}
