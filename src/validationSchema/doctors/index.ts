import * as yup from 'yup';

export const doctorValidationSchema = yup.object().shape({
  specialization: yup.string(),
  availability: yup.string(),
  description: yup.string(),
  image: yup.string(),
  name: yup.string().required(),
  clinic_owner_id: yup.string().nullable(),
  user_id: yup.string().nullable().required(),
});
