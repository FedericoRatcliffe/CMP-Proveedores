import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionComprobantesComponent } from './gestion-comprobantes.component';

describe('GestionComprobantesComponent', () => {
  let component: GestionComprobantesComponent;
  let fixture: ComponentFixture<GestionComprobantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionComprobantesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionComprobantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
