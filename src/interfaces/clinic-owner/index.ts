import { AdminInterface } from 'interfaces/admin';
import { DoctorInterface } from 'interfaces/doctor';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface ClinicOwnerInterface {
  id?: string;
  user_id: string;
  name: string;
  created_at?: any;
  updated_at?: any;
  admin?: AdminInterface[];
  doctor?: DoctorInterface[];
  user?: UserInterface;
  _count?: {
    admin?: number;
    doctor?: number;
  };
}

export interface ClinicOwnerGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  name?: string;
}
