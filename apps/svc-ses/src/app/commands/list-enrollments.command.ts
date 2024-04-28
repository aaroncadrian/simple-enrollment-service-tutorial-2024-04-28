import { Enrollment } from '../models/enrollment.model';

export type ListEnrollmentsCommandInput = {
  rosterId: string;
};

export type ListEnrollmentsCommandOutput = {
  enrollments: Enrollment[];
};
