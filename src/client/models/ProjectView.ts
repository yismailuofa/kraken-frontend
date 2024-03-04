/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Milestone } from './Milestone';
import type { Sprint } from './Sprint';
import type { Task } from './Task';
export type ProjectView = {
    name: string;
    description: string;
    id?: (string | null);
    createdAt?: string;
    milestones?: Array<Milestone>;
    tasks?: Array<Task>;
    sprints?: Array<Sprint>;
};

