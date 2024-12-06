import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioCargaPdfComponent } from './formulario-carga-pdf.component';

describe('FormularioCargaPdfComponent', () => {
  let component: FormularioCargaPdfComponent;
  let fixture: ComponentFixture<FormularioCargaPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioCargaPdfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioCargaPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
