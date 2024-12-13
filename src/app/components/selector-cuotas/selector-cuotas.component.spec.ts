import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorCuotasComponent } from './selector-cuotas.component';

describe('SelectorCuotasComponent', () => {
  let component: SelectorCuotasComponent;
  let fixture: ComponentFixture<SelectorCuotasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectorCuotasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectorCuotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
