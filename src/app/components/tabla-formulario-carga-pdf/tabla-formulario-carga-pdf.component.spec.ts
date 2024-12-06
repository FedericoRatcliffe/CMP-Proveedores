import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaFormularioCargaPdfComponent } from './tabla-formulario-carga-pdf.component';

describe('TablaFormularioCargaPdfComponent', () => {
  let component: TablaFormularioCargaPdfComponent;
  let fixture: ComponentFixture<TablaFormularioCargaPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaFormularioCargaPdfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaFormularioCargaPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
