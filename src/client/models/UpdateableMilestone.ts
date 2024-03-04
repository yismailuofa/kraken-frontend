/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Status } from './Status';
export type UpdateableMilestone = {
    name?: (string | null);
    description?: (string | null);
    dueDate?: (string | null);
    status?: (Status | null);
    dependentMilestones?: (Array<string> | null);
    dependentTasks?: (Array<string> | null);
};

