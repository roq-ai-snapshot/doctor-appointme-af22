import { UserInterface } from 'interfaces/user';
import { ClinicOwnerInterface } from 'interfaces/clinic-owner';
import { GetQueryInterface } from 'interfaces';

export interface AdminInterface {
  id?: string;
  user_id: string;
  clinic_owner_id: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  clinic_owner?: ClinicOwnerInterface;
  _count?: {};
}

export interface AdminGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  clinic_owner_id?: string;
}
