import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getDoctorById, updateDoctorById } from 'apiSdk/doctors';
import { Error } from 'components/error';
import { doctorValidationSchema } from 'validationSchema/doctors';
import { DoctorInterface } from 'interfaces/doctor';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { ClinicOwnerInterface } from 'interfaces/clinic-owner';
import { UserInterface } from 'interfaces/user';
import { getClinicOwners } from 'apiSdk/clinic-owners';
import { getUsers } from 'apiSdk/users';

function DoctorEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<DoctorInterface>(
    () => (id ? `/doctors/${id}` : null),
    () => getDoctorById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: DoctorInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateDoctorById(id, values);
      mutate(updated);
      resetForm();
      router.push('/doctors');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<DoctorInterface>({
    initialValues: data,
    validationSchema: doctorValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Doctor
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="specialization" mb="4" isInvalid={!!formik.errors?.specialization}>
              <FormLabel>Specialization</FormLabel>
              <Input
                type="text"
                name="specialization"
                value={formik.values?.specialization}
                onChange={formik.handleChange}
              />
              {formik.errors.specialization && <FormErrorMessage>{formik.errors?.specialization}</FormErrorMessage>}
            </FormControl>
            <FormControl id="availability" mb="4" isInvalid={!!formik.errors?.availability}>
              <FormLabel>Availability</FormLabel>
              <Input
                type="text"
                name="availability"
                value={formik.values?.availability}
                onChange={formik.handleChange}
              />
              {formik.errors.availability && <FormErrorMessage>{formik.errors?.availability}</FormErrorMessage>}
            </FormControl>
            <FormControl id="description" mb="4" isInvalid={!!formik.errors?.description}>
              <FormLabel>Description</FormLabel>
              <Input type="text" name="description" value={formik.values?.description} onChange={formik.handleChange} />
              {formik.errors.description && <FormErrorMessage>{formik.errors?.description}</FormErrorMessage>}
            </FormControl>
            <FormControl id="image" mb="4" isInvalid={!!formik.errors?.image}>
              <FormLabel>Image</FormLabel>
              <Input type="text" name="image" value={formik.values?.image} onChange={formik.handleChange} />
              {formik.errors.image && <FormErrorMessage>{formik.errors?.image}</FormErrorMessage>}
            </FormControl>
            <FormControl id="name" mb="4" isInvalid={!!formik.errors?.name}>
              <FormLabel>Name</FormLabel>
              <Input type="text" name="name" value={formik.values?.name} onChange={formik.handleChange} />
              {formik.errors.name && <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<ClinicOwnerInterface>
              formik={formik}
              name={'clinic_owner_id'}
              label={'Select Clinic Owner'}
              placeholder={'Select Clinic Owner'}
              fetcher={getClinicOwners}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'user_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'doctor',
  operation: AccessOperationEnum.UPDATE,
})(DoctorEditPage);
