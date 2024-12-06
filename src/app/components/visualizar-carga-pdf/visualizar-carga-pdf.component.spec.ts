import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarCargaPdfComponent } from './visualizar-carga-pdf.component';

describe('VisualizarCargaPdfComponent', () => {
  let component: VisualizarCargaPdfComponent;
  let fixture: ComponentFixture<VisualizarCargaPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizarCargaPdfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarCargaPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
