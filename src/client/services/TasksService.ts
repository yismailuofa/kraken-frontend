/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateableTask } from '../models/CreateableTask';
import type { Task } from '../models/Task';
import type { UpdateableTask } from '../models/UpdateableTask';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TasksService {
    /**
     * Create Task
     * @returns Task Successful Response
     * @throws ApiError
     */
    public static createTaskTasksPost({
        requestBody,
    }: {
        requestBody: CreateableTask,
    }): CancelablePromise<Task> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tasks/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Task
     * @returns Task Successful Response
     * @throws ApiError
     */
    public static getTaskTasksIdGet({
        id,
    }: {
        id: string,
    }): CancelablePromise<Task> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tasks/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Task
     * @returns Task Successful Response
     * @throws ApiError
     */
    public static updateTaskTasksIdPatch({
        id,
        requestBody,
    }: {
        id: string,
        requestBody: UpdateableTask,
    }): CancelablePromise<Task> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/tasks/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Task
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteTaskTasksIdDelete({
        id,
    }: {
        id: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/tasks/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
