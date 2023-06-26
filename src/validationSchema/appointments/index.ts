import * as yup from 'yup';

export const appointmentValidationSchema = yup.object().shape({
  appointment_time: yup.date().required(),
  patient_id: yup.string().nullable().required(),
  doctor_id: yup.string().nullable().required(),
});
