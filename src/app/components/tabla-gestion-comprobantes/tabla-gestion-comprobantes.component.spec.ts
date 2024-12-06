import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaGestionComprobantesComponent } from './tabla-gestion-comprobantes.component';

describe('TablaGestionComprobantesComponent', () => {
  let component: TablaGestionComprobantesComponent;
  let fixture: ComponentFixture<TablaGestionComprobantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaGestionComprobantesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaGestionComprobantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
