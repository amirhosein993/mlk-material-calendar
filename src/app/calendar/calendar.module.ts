import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import {calendarRoute} from './calendar/calendar.route';


@NgModule({
  declarations: [],
  imports: [
    CommonModule ,
    RouterModule.forChild(calendarRoute)
  ]
})
export class CalendarModule { }
