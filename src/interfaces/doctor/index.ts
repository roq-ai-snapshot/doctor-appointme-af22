import { AppointmentInterface } from 'interfaces/appointment';
import { ClinicOwnerInterface } from 'interfaces/clinic-owner';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface DoctorInterface {
  id?: string;
  clinic_owner_id?: string;
  specialization?: string;
  availability?: string;
  description?: string;
  image?: string;
  name: string;
  created_at?: any;
  updated_at?: any;
  user_id: string;
  tenant_id: string;
  appointment?: AppointmentInterface[];
  clinic_owner?: ClinicOwnerInterface;
  user?: UserInterface;
  _count?: {
    appointment?: number;
  };
}

export interface DoctorGetQueryInterface extends GetQueryInterface {
  id?: string;
  clinic_owner_id?: string;
  specialization?: string;
  availability?: string;
  description?: string;
  image?: string;
  name?: string;
  user_id?: string;
  tenant_id?: string;
}
