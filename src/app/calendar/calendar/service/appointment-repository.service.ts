import { Injectable } from '@angular/core';
import {AppointmentService} from './appointment.service';
import {Observable} from 'rxjs';
import {Appointment} from '../model/appointment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentRepositoryService {

  constructor(private appointmentsService : AppointmentService) { }

  public getAppointments() : Observable<Appointment[]> {
    return this.appointmentsService.getAppointments();
  }
}
