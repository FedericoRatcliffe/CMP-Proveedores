import { Routes } from '@angular/router';
import { GestionComprobantesComponent } from './pages/gestion-comprobantes/gestion-comprobantes.component';
import { CargaComprobanteComponent } from './pages/carga-comprobante/carga-comprobante.component';

export const routes: Routes = [
    {
        path: '',
        component: GestionComprobantesComponent
    },
    {
        path: 'subir-factura',
        component: CargaComprobanteComponent
    }
];
