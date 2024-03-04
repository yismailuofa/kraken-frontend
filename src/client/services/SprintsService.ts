/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateableSprint } from '../models/CreateableSprint';
import type { Sprint } from '../models/Sprint';
import type { UpdateableSprint } from '../models/UpdateableSprint';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SprintsService {
    /**
     * Create Sprint
     * @returns Sprint Successful Response
     * @throws ApiError
     */
    public static createSprintSprintsPost({
        requestBody,
    }: {
        requestBody: CreateableSprint,
    }): CancelablePromise<Sprint> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/sprints/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Sprint
     * @returns Sprint Successful Response
     * @throws ApiError
     */
    public static getSprintSprintsIdGet({
        id,
    }: {
        id: string,
    }): CancelablePromise<Sprint> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/sprints/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Sprint
     * @returns Sprint Successful Response
     * @throws ApiError
     */
    public static updateSprintSprintsIdPatch({
        id,
        requestBody,
    }: {
        id: string,
        requestBody: UpdateableSprint,
    }): CancelablePromise<Sprint> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/sprints/{id}',
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
     * Delete Sprint
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteSprintSprintsIdDelete({
        id,
    }: {
        id: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/sprints/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
