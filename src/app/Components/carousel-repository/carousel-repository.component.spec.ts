import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselRepositoryComponent } from './carousel-repository.component';

describe('CarouselRepositoryComponent', () => {
  let component: CarouselRepositoryComponent;
  let fixture: ComponentFixture<CarouselRepositoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarouselRepositoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarouselRepositoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
