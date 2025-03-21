import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE, DrizzleDB, studentsTable } from '@school-console/drizzle';
import { count, eq } from 'drizzle-orm';

@Injectable()
export class DashboardService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async stats() {
    const enrolledStudentsQuery = this.db
      .select({ count: count() })
      .from(studentsTable)
      .where(eq(studentsTable.isEnrolled, true))
      .then((res) => res[0].count);

    const newRegistrationsQuery = this.db
      .select({ count: count() })
      .from(studentsTable)
      .where(eq(studentsTable.isEnrolled, false))
      .then((res) => res[0].count);

    const [enrolledStudents, newRegistrations] = await Promise.all([
      enrolledStudentsQuery,
      newRegistrationsQuery,
    ]);

    return {
      enrolledStudents,
      newRegistrations,
    };
  }
}
