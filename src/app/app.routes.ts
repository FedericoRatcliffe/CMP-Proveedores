import { Routes } from '@angular/router';
import { GestionComprobantesComponent } from './pages/gestion-comprobantes/gestion-comprobantes.component';
import { CargaComprobanteComponent } from './pages/carga-comprobante/carga-comprobante.component';
import { NoAuthGuard } from './core/guards/no-auth.guard';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent),
        canActivate: [NoAuthGuard]
    },
    {
        path: 'logout',
        loadComponent: () => import('./auth/logout/logout.component').then(m => m.LogoutComponent)
    },
    {
        path: '403-forbidden-8fj4n39vn8v23',
        loadComponent: () => import('./pages/forbidden/forbidden.component').then(m => m.ForbiddenComponent)
    },
    {
        path: '',
        canActivate: [NoAuthGuard],
        children: [
            {
                path: 'proveedores',
                canActivate: [NoAuthGuard],
                // data: {
                //     permissions: [PERMISOS.SOC.Acceder]
                // },
                loadComponent: () => import('./pages/gestion-comprobantes/gestion-comprobantes.component').then(m => m.GestionComprobantesComponent),
            },
            {
                path: 'subir-factura',
                canActivate: [NoAuthGuard],
                // data: {
                //     permissions: [PERMISOS.SOC.Socios.Acceder]
                // },
                loadComponent: () => import('./pages/carga-comprobante/carga-comprobante.component').then(m => m.CargaComprobanteComponent),
            },
            {
                path: '**',
                redirectTo: 'proveedores'
            }

        ]
    },
    {
        path: '**',
        redirectTo: ''
    }
];



