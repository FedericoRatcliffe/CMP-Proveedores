import { Component, ErrorHandler, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApmErrorHandler, ApmService } from '@elastic/apm-rum-angular';
import { environment } from '../environments/environment';
import { ConfirmationService, PrimeNGConfig } from 'primeng/api';
import { AuthService } from './auth/services/auth.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
  ],
  providers:[
    ApmService,
    {
      provide: ErrorHandler,
      useClass: ApmErrorHandler
    },
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  version = environment.version;



  constructor(@Inject(PLATFORM_ID) private platformId: Object, private config: PrimeNGConfig, apmService: ApmService, private _authService: AuthService) {

    if (isPlatformBrowser(this.platformId)) {

      if (environment.env != 'Development') {

        const parts = window.location.pathname.split('/');
        let pageName = window.location.pathname;
        if (parts.length > 0) {
          pageName = parts[1]
        }
        const apm = apmService.init({
          serviceName: 'fe-proveedores',
          serverUrl: environment.elastic,
          environment: environment.apm.env,
          distributedTracing: true,
          distributedTracingOrigins: environment.apm.origin,
          transactionSampleRate: 1.0, // Captura el 100% de las transacciones
          breakdownMetrics: true, // Habilita métricas detalladas
          logLevel: 'debug', // Nivel de log para facilitar el debug
          instrument: true,
          pageLoadTransactionName: pageName,
        })
      }
    }

  }



  ngOnInit() {

    this.config.setTranslation({
      accept: 'Aceptar',
      reject: 'Cancelar',
      monthNames: [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre'
      ],
      monthNamesShort: [
        'Ene',
        'Feb',
        'Mar',
        'Abr',
        'May',
        'Jun',
        'Jul',
        'Ago',
        'Sep',
        'Oct',
        'Nov',
        'Dic'
      ],
      dayNames: [
        'Domingo',
        'Lunes',
        'Martes',
        'Miercoles',
        'Jueves',
        'Viernes',
        'Sabado'
      ],
      dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
      dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
      emptyFilterMessage: 'No hay resultados',
      emptySearchMessage: 'No hay resultados',
      emptyMessage: 'No hay resultados',
      today: 'Hoy',
      clear: 'Limpiar',
      firstDayOfWeek: 1
    });
  }
  

  get isProd(): boolean {
    return environment.production;
  }
}
