import {Component, Inject} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from '@angular/material/datepicker';
import {MatButton} from '@angular/material/button';
import {DateAdapter, provideNativeDateAdapter} from '@angular/material/core';

@Component({
  selector: 'app-appointment-dialog',
  imports: [
    MatDialogTitle,
    ReactiveFormsModule,
    MatDialogContent,
    MatFormField,
    MatInput,
    MatDatepickerInput,
    MatDatepickerModule,
    MatDatepickerToggle,
    MatDatepicker,
    MatDialogActions,
    MatButton,
    MatLabel
  ],
  providers : [
    provideNativeDateAdapter()
  ],
  standalone : true,
  templateUrl: './appointment-dialog.component.html',
  styleUrl: './appointment-dialog.component.scss'
})
export class AppointmentDialogComponent {
  appointmentForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AppointmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      uuid: string;
      date: Date;
      title: string;
      startTime: string;
      endTime: string;
      color: string;
    },
    private formBuilder: FormBuilder
  ) {
    this.appointmentForm = this.formBuilder.group(
      {
        title: [this.data.title || '', Validators.required],
        date: [this.data.date, Validators.required],
        startTime: [this.data.startTime || '', Validators.required],
        endTime: [this.data.startTime || '', Validators.required],
      },
      { validators: this.timeRangeValidator }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    if (this.appointmentForm.valid) {
      const data = {
        title: this.appointmentForm.controls['title'].value,
        date: this.appointmentForm.controls['date'].value,
        startTime: this.appointmentForm.controls['startTime'].value,
        endTime: this.appointmentForm.controls['endTime'].value,
        uuid: this.data.uuid,
      };
      this.dialogRef.close(data);
    }
  }

  onDeleteClick(): void {
    this.dialogRef.close({ remove: true, uuid: this.data.uuid });
  }

  timeRangeValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const startTime = control.get('startTime')?.value;
    const endTime = control.get('endTime')?.value;
    if (startTime && endTime) {
      const [startHours, startMinutes] = startTime.split(':');
      const [endHours, endMinutes] = endTime.split(':');

      const startDate = new Date();
      startDate.setHours(startHours);
      startDate.setMinutes(startMinutes);

      const endDate = new Date();
      endDate.setHours(endHours);
      endDate.setMinutes(endMinutes);

      if (startDate > endDate) {
        return { timeRangeInvalid: true };
      }
    }
    return null;
  };
}
