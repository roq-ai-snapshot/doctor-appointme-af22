import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import {
  authorizationValidationMiddleware,
  errorHandlerMiddleware,
  notificationHandlerMiddleware,
} from 'server/middlewares';
import { clinicOwnerValidationSchema } from 'validationSchema/clinic-owners';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getClinicOwners();
    case 'POST':
      return createClinicOwner();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getClinicOwners() {
    const data = await prisma.clinic_owner
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'clinic_owner'));
    return res.status(200).json(data);
  }

  async function createClinicOwner() {
    await clinicOwnerValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.admin?.length > 0) {
      const create_admin = body.admin;
      body.admin = {
        create: create_admin,
      };
    } else {
      delete body.admin;
    }
    if (body?.doctor?.length > 0) {
      const create_doctor = body.doctor;
      body.doctor = {
        create: create_doctor,
      };
    } else {
      delete body.doctor;
    }
    const data = await prisma.clinic_owner.create({
      data: body,
    });
    await notificationHandlerMiddleware(req, data.id);
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
