import { Enrollment } from '../models/enrollment.model';

export type GetEnrollmentCommandInput = {
  rosterId: string;
  personId: string;
};

export type GetEnrollmentCommandOutput = {
  enrollment: Enrollment;
};
