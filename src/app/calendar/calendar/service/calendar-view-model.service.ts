import {Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {Appointment} from '../model/appointment';
import {AppointmentRepositoryService} from './appointment-repository.service';
import {CalendarView} from '../model/calendar-veiw.enum';
import {MatDialog} from '@angular/material/dialog';
import {AddAppointmentComponent} from '../../add-appointment/add-appointment.component';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {EditAppointmentComponent} from '../../edit-appointment/edit-appointment.component';

@Injectable()
export class CalendarViewModelService {

  private _appointments : WritableSignal<Array<Appointment>> = signal([]);
  public get appointments(): Signal<Array<Appointment>> {
    return this._appointments.asReadonly();
  }
  private _weeks : WritableSignal<Array<Date>> = signal([]);
  public get weeks() : Signal<Array<Date>> {
    return this._weeks.asReadonly();
  }

  private _monthDays : WritableSignal<Array<Date>> = signal([]);
  public get monthDays() : Signal<Array<Date>> {
    return this._monthDays.asReadonly();
  }

  private _timeSlots : WritableSignal<Array<string>> = signal([]);
  public get timeSlots (): Signal<Array<string>> {
    return this._timeSlots.asReadonly();
  }

  public currentView: CalendarView = CalendarView.Month;
  public viewDate: Date = new Date();
  public selectedDate: Date | null = null;
  public selectedStartTime: string | undefined;
  weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  constructor(
    public appointmentsRepository : AppointmentRepositoryService ,
    public dialog: MatDialog
  ) { }

  onStart() : void{
    this.generateView(this.currentView , this.viewDate);
    this.generateTimeSlots();
    this.loadAppointments();
  }

  generateView(view: CalendarView, date: Date) {
    switch (view) {
      case CalendarView.Month:
        this.generateMonthView(date);
        break;
      case CalendarView.Week:
        this.generateWeekView(date);
        break;
      case CalendarView.Day:
        this.generateDayView(date);
        break;
      default:
        this.generateMonthView(date);
    }
  }

  drop(event: CdkDragDrop<Appointment[]>, date: Date, slot?: string) {
    const movedAppointment = event.item.data;
    movedAppointment.date = date;
    if (slot) {
      movedAppointment.startTime = slot;
      movedAppointment.endTime = slot;
    }
  }

  generateMonthView(date: Date) {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this._weeks.set([]);
    this._monthDays.set([]);
    let week: Date[] = [];

    for (let day = start.getDay(); day > 0; day--) {
      const prevDate = new Date(start);
      prevDate.setDate(start.getDate() - day);
      week.push(prevDate);
      this._monthDays.set([...this._monthDays() , prevDate]);
    }

    for (let day = 1; day <= end.getDate(); day++) {
      const currentDate = new Date(date.getFullYear(), date.getMonth(), day);
      this._monthDays.set([...this._monthDays() , currentDate]);
      week.push(currentDate);
      if (week.length === 7) {
        this._weeks.set([...this._weeks() , ...week]);
        week = [];
      }
    }

    for (let day = 1; this.monthDays().length % 7 !== 0; day++) {
      const nextDate = new Date(end);
      nextDate.setDate(end.getDate() + day);
      this._monthDays.set([...this._monthDays() , nextDate]);
    }

    for (let day = 1; week.length < 7; day++) {
      const nextDate = new Date(end);
      nextDate.setDate(end.getDate() + day);
      week.push(nextDate);
    }

    if (week.length > 0) {
      this._weeks.set([...this._weeks() , ...week]);
    }
  }

  generateWeekView(date: Date) {
    const startOfWeek = this.startOfWeek(date);
    this._monthDays.set([]);

    for (let day = 0; day < 7; day++) {
      const weekDate = new Date(startOfWeek);
      weekDate.setDate(startOfWeek.getDate() + day);
      this._monthDays.set([...this._monthDays(), weekDate]);
    }
  }

  generateDayView(date: Date) {
    this._monthDays.set([date]);
  }

  generateTimeSlots() {
    for (let hour = 0; hour <= 24; hour++) {
      const time = hour < 10 ? `0${hour}:00` : `${hour}:00`;
      this._timeSlots.set([...this._timeSlots() , time]);
    }
  }

  switchToView(view: CalendarView) {
    this.currentView = view;
    this.generateView(this.currentView, this.viewDate);
  }

  previous() {
    if (this.currentView === 'month') {
      this.viewDate = new Date(
        this.viewDate.setMonth(this.viewDate.getMonth() - 1)
      );
      this.generateMonthView(this.viewDate);
    } else if (this.currentView === 'week') {
      this.viewDate = new Date(
        this.viewDate.setDate(this.viewDate.getDate() - 7)
      );
      this.generateWeekView(this.viewDate);
    } else {
      this.viewDate = new Date(
        this.viewDate.setDate(this.viewDate.getDate() - 1)
      );
      this.generateDayView(this.viewDate);
    }
  }

  next() {
    if (this.currentView === 'month') {
      this.viewDate = new Date(
        this.viewDate.setMonth(this.viewDate.getMonth() + 1)
      );
      this.generateMonthView(this.viewDate);
    } else if (this.currentView === 'week') {
      this.viewDate = new Date(
        this.viewDate.setDate(this.viewDate.getDate() + 7)
      );
      this.generateWeekView(this.viewDate);
    } else {
      this.viewDate = new Date(
        this.viewDate.setDate(this.viewDate.getDate() + 1)
      );
      this.generateDayView(this.viewDate);
    }
  }

  startOfWeek(date: Date): Date {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(start.setDate(diff));
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  isSelected(date: Date): boolean {
    if (!this.selectedDate) {
      return false;
    }
    return (
      date.getDate() === this.selectedDate.getDate() &&
      date.getMonth() === this.selectedDate.getMonth() &&
      date.getFullYear() === this.selectedDate.getFullYear()
    );
  }

  isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  selectDate(date?: Date, startTime?: string) {
    if (date) {
      this.selectedDate = date;
    } else {
      this.selectedDate = new Date();
    }
    this.selectedStartTime = startTime;
    this.openDialog();
  }

  openDialog(): void {
    const hour = new Date().getHours();
    const minutes = new Date().getMinutes();
    const h = hour < 10 ? `0${hour}` : hour;
    const m = minutes < 10 ? `0${minutes}` : minutes;
    const dialogRef = this.dialog.open(AddAppointmentComponent, {
      width: '500px',
      panelClass: 'dialog-container',
      data: {
        date: this.selectedDate,
        title: '',
        startTime: this.selectedStartTime || `${h}:${m}`,
        endTime: this.selectedStartTime || `${h}:${m}`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addAppointment(
          {
           date: result.date,
            title : result.title,
            startTime : result.startTime,
            endTime : result.endTime
          }
        );
      }
    });
  }

  public addAppointment(appointment : Appointment): void {
      this._appointments.set([...this._appointments() , appointment]);
  }

  private loadAppointments() : void {
    this.appointmentsRepository.getAppointments().subscribe(appointments => {
      this._appointments.set(appointments);
    })
  }

  viewToday(): void {
    this.viewDate = new Date();
    this.generateMonthView(this.viewDate);
  }

  isCurrentMonth(date: Date): boolean {
    return (
      date.getMonth() === this.viewDate.getMonth() &&
      date.getFullYear() === this.viewDate.getFullYear()
    );
  }

  getAppointmentsForDateTime(date: Date, timeSlot: string): Appointment[] {
    const appointmentsForDateTime: Appointment[] = this.appointments().filter(
      (appointment) =>
        this.isSameDate(appointment.date, date) &&
        appointment.startTime <= timeSlot &&
        appointment.endTime >= timeSlot
    );

    return appointmentsForDateTime;
  }
  editAppointment(appointment: Appointment, event: Event) {
    event.preventDefault();
    const dialogRef = this.dialog.open(EditAppointmentComponent, {
      width: '500px',
      panelClass: 'dialog-container',
      data: appointment,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const index = this._appointments().findIndex(
          (appointment) => appointment.id === result.id
        );
        if (result.remove) {
          this._appointments.set(this._appointments().splice(index, 1));
        } else {
          this._appointments()[index] = result;
        }
      }
    });
  }
}
