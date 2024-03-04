/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Status } from './Status';
export type Milestone = {
    name: string;
    description: string;
    dueDate: string;
    projectId: string;
    dependentMilestones?: Array<string>;
    dependentTasks?: Array<string>;
    id?: (string | null);
    status?: Status;
    tasks?: Array<string>;
};

