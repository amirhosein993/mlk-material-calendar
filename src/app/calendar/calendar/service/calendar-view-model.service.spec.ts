import { TestBed } from '@angular/core/testing';

import { CalendarViewModelService } from './calendar-view-model.service';

describe('CalendarViewModelService', () => {
  let service: CalendarViewModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalendarViewModelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
