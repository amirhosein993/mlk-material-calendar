import { Injectable } from '@angular/core';
import {AppointmentService} from './appointment.service';
import {map, Observable} from 'rxjs';
import {Appointment} from '../model/appointment';
import {Helper} from '../../../../helpers/helper';

@Injectable({
  providedIn: 'root'
})
export class AppointmentRepositoryService {

  constructor(private appointmentsService : AppointmentService) { }

  public getAppointments() : Observable<Appointment[]> {
    return this.appointmentsService.getAppointments().pipe(map(appointments => {
      return appointments.map(item => {
        return {
          ...item ,
         color : Helper.getRandomColor()
        }
      })
    }));
  }
}
