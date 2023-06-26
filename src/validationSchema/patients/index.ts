import * as yup from 'yup';

export const patientValidationSchema = yup.object().shape({
  user_id: yup.string().nullable().required(),
});
