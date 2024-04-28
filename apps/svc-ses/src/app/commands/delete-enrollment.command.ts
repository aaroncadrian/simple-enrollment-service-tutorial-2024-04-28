import { Enrollment } from '../models/enrollment.model';

export type DeleteEnrollmentCommandInput = {
  rosterId: string;
  personId: string;
};

export type DeleteEnrollmentCommandOutput = {
  enrollment: Enrollment;
};
