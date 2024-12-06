import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaComprobanteComponent } from './carga-comprobante.component';

describe('CargaComprobanteComponent', () => {
  let component: CargaComprobanteComponent;
  let fixture: ComponentFixture<CargaComprobanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargaComprobanteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CargaComprobanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
