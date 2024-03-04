/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseUpdateableTask } from './BaseUpdateableTask';
import type { Priority } from './Priority';
import type { Status } from './Status';
export type UpdateableTask = {
    name?: (string | null);
    description?: (string | null);
    dueDate?: (string | null);
    priority?: (Priority | null);
    status?: (Status | null);
    assignedTo?: (string | null);
    projectId?: (string | null);
    milestoneId?: (string | null);
    qaTask?: (BaseUpdateableTask | null);
    dependentMilestones?: (Array<string> | null);
    dependentTasks?: (Array<string> | null);
};

