const mapping: Record<string, string> = {
  admins: 'admin',
  appointments: 'appointment',
  'clinic-owners': 'clinic_owner',
  doctors: 'doctor',
  patients: 'patient',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
