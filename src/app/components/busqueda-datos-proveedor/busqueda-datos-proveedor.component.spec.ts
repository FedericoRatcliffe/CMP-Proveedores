import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaDatosProveedorComponent } from './busqueda-datos-proveedor.component';

describe('BusquedaDatosProveedorComponent', () => {
  let component: BusquedaDatosProveedorComponent;
  let fixture: ComponentFixture<BusquedaDatosProveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusquedaDatosProveedorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusquedaDatosProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
