import { PatientInterface } from 'interfaces/patient';
import { DoctorInterface } from 'interfaces/doctor';
import { GetQueryInterface } from 'interfaces';

export interface AppointmentInterface {
  id?: string;
  patient_id: string;
  doctor_id: string;
  appointment_time: any;
  created_at?: any;
  updated_at?: any;

  patient?: PatientInterface;
  doctor?: DoctorInterface;
  _count?: {};
}

export interface AppointmentGetQueryInterface extends GetQueryInterface {
  id?: string;
  patient_id?: string;
  doctor_id?: string;
}
