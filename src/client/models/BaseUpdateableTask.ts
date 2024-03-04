/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Priority } from './Priority';
import type { Status } from './Status';
export type BaseUpdateableTask = {
    name?: (string | null);
    description?: (string | null);
    dueDate?: (string | null);
    priority?: (Priority | null);
    status?: (Status | null);
    assignedTo?: (string | null);
};

