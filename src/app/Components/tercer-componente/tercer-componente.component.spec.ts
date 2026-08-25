import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TercerComponenteComponent } from './tercer-componente.component';

describe('TercerComponenteComponent', () => {
  let component: TercerComponenteComponent;
  let fixture: ComponentFixture<TercerComponenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TercerComponenteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TercerComponenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
