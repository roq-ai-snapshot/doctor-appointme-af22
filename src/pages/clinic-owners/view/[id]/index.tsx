import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import React, { useState } from 'react';
import {
  Text,
  Box,
  Spinner,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  Link,
  IconButton,
  Flex,
  Center,
  Stack,
} from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { FiTrash, FiEdit2, FiEdit3 } from 'react-icons/fi';
import { getClinicOwnerById } from 'apiSdk/clinic-owners';
import { Error } from 'components/error';
import { ClinicOwnerInterface } from 'interfaces/clinic-owner';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { deleteDoctorById } from 'apiSdk/doctors';
import { deleteAdminById, createAdmin } from 'apiSdk/admins';

function ClinicOwnerViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<ClinicOwnerInterface>(
    () => (id ? `/clinic-owners/${id}` : null),
    () =>
      getClinicOwnerById(id, {
        relations: ['user', 'doctor', 'admin'],
      }),
  );

  const doctorHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteDoctorById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [adminUserId, setAdminUserId] = useState(null);
  const adminHandleCreate = async () => {
    setCreateError(null);
    try {
      await createAdmin({ clinic_owner_id: id, user_id: adminUserId });
      setAdminUserId(null);
      await mutate();
    } catch (error) {
      setCreateError(error);
    }
  };
  const adminHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteAdminById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Flex justifyContent="space-between" mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Clinic Owner Detail View
          </Text>
          {hasAccess('clinic_owner', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
            <NextLink href={`/clinic-owners/edit/${data?.id}`} passHref legacyBehavior>
              <Button
                onClick={(e) => e.stopPropagation()}
                mr={2}
                as="a"
                variant="outline"
                colorScheme="blue"
                leftIcon={<FiEdit2 />}
              >
                Edit
              </Button>
            </NextLink>
          )}
        </Flex>
        {error && (
          <Box mb={4}>
            {' '}
            <Error error={error} />{' '}
          </Box>
        )}
        {isLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <>
            <Stack direction="column" spacing={2} mb={4}>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Name:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.name}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Created At:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.created_at as unknown as string}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Updated At:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.updated_at as unknown as string}
                </Text>
              </Flex>
            </Stack>
            <Box>
              {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                <Flex alignItems="center" mb={4}>
                  <Text fontSize="lg" fontWeight="bold" as="span">
                    User:
                  </Text>
                  <Text fontSize="md" as="span" ml={3}>
                    <Link as={NextLink} href={`/users/view/${data?.user?.id}`}>
                      {data?.user?.email}
                    </Link>
                  </Text>
                </Flex>
              )}
              {hasAccess('doctor', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                <Stack spacing={2} mb={8}>
                  <Flex justifyContent="space-between">
                    <Text fontSize="lg" fontWeight="bold">
                      Doctors
                    </Text>
                    <NextLink passHref href={`/doctors/create?clinic_owner_id=${data?.id}`}>
                      <Button colorScheme="blue" mr="4" as="a">
                        Create
                      </Button>
                    </NextLink>
                  </Flex>
                  <TableContainer mb={4}>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>specialization</Th>
                          <Th>availability</Th>
                          <Th>description</Th>
                          <Th>image</Th>
                          <Th>name</Th>
                          <Th>tenant_id</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {data?.doctor?.map((record) => (
                          <Tr
                            cursor="pointer"
                            onClick={() => router.push(`/doctors/view/${record.id}`)}
                            key={record.id}
                          >
                            <Td>{record.specialization}</Td>
                            <Td>{record.availability}</Td>
                            <Td>{record.description}</Td>
                            <Td>{record.image}</Td>
                            <Td>{record.name}</Td>
                            <Td>{record.tenant_id}</Td>
                            <Td>
                              {hasAccess('doctor', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                                <NextLink
                                  onClick={(e) => e.stopPropagation()}
                                  passHref
                                  href={`/doctors/edit/${record.id}`}
                                >
                                  <Button mr={2} as="a" variant="outline" colorScheme="blue" leftIcon={<FiEdit2 />}>
                                    Edit
                                  </Button>
                                </NextLink>
                              )}
                              {hasAccess('doctor', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    doctorHandleDelete(record.id);
                                  }}
                                  colorScheme="red"
                                  variant="outline"
                                  aria-label="edit"
                                  icon={<FiTrash />}
                                />
                              )}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Stack>
              )}
            </Box>
            <Box>
              <Stack spacing={2} mb={8}>
                <Text fontSize="lg" fontWeight="bold">
                  Admins:
                </Text>
                <Flex gap={5} alignItems="flex-end">
                  <Box flex={1}>
                    <UserSelect name={'admin_user'} value={adminUserId} handleChange={setAdminUserId} />
                  </Box>
                  <Button colorScheme="blue" mt="4" mr="4" onClick={adminHandleCreate} isDisabled={!adminUserId}>
                    Create
                  </Button>
                </Flex>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Email</Th>

                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.admin?.map((record) => (
                        <Tr
                          cursor="pointer"
                          onClick={() => router.push(`/users/view/${record?.user?.id}`)}
                          key={record?.user?.id}
                        >
                          <Td>{record?.user?.email}</Td>

                          <Td>
                            {hasAccess('user', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  adminHandleDelete(record.id);
                                }}
                                colorScheme="red"
                                variant="outline"
                                aria-label="edit"
                                icon={<FiTrash />}
                              />
                            )}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Stack>
            </Box>
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'clinic_owner',
  operation: AccessOperationEnum.READ,
})(ClinicOwnerViewPage);
