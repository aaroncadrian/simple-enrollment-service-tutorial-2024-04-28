import { Enrollment } from '../models/enrollment.model';

export type CreateEnrollmentCommandInput = {
  rosterId: string;
  personId: string;
};

export type CreateEnrollmentCommandOutput = {
  enrollment: Enrollment;
};
