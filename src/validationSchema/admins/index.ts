import * as yup from 'yup';

export const adminValidationSchema = yup.object().shape({
  user_id: yup.string().nullable().required(),
  clinic_owner_id: yup.string().nullable().required(),
});
