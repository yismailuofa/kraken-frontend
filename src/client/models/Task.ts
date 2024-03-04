/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseCreateableTask } from './BaseCreateableTask';
import type { Priority } from './Priority';
import type { Status } from './Status';
export type Task = {
    name: string;
    description: string;
    dueDate: string;
    priority?: Priority;
    status?: Status;
    assignedTo?: string;
    projectId: string;
    milestoneId: string;
    dependentMilestones?: Array<string>;
    dependentTasks?: Array<string>;
    qaTask: BaseCreateableTask;
    id?: (string | null);
    createdAt?: string;
};

