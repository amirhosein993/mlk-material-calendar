import {Component, OnInit} from '@angular/core';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from '@angular/material/datepicker';
import {FormsModule} from '@angular/forms';
import {MatButton, MatIconButton} from '@angular/material/button';
import {Appointment} from './model/appointment';
import {CalendarViewModelService} from './service/calendar-view-model.service';
import {DatePipe, NgStyle} from '@angular/common';
import {DateAdapter, MatNativeDateModule, provideNativeDateAdapter} from '@angular/material/core';
import {CdkDrag, CdkDragHandle, CdkDropList, CdkDropListGroup} from '@angular/cdk/drag-drop';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {MatIcon} from '@angular/material/icon';
import { CalendarView } from './model/calendar-veiw.enum';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    MatInputModule, MatDatepickerModule,
    MatLabel,
    FormsModule,
    MatButton,
    DatePipe, CdkDropListGroup, MatButtonToggle, MatIconButton, MatButtonToggleGroup, MatIcon, CdkDropList, NgStyle, CdkDragHandle, CdkDrag,
  ],
  styleUrl: './calendar.component.scss',
  providers : [
    CalendarViewModelService ,
    provideNativeDateAdapter()
  ]
})
export class CalendarComponent implements OnInit{

  constructor(protected calendarViewModelService: CalendarViewModelService) {
  }

  ngOnInit(): void {
        this.calendarViewModelService.onStart();
    }

  addAppointmentClicked() {

  }

  protected readonly CalendarView = CalendarView;
}
