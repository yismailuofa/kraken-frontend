/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Priority } from './Priority';
import type { Status } from './Status';
export type BaseCreateableTask = {
    name: string;
    description: string;
    dueDate: string;
    priority?: Priority;
    status?: Status;
    assignedTo?: string;
};

