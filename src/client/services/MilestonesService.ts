/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateableMilestone } from '../models/CreateableMilestone';
import type { Milestone } from '../models/Milestone';
import type { UpdateableMilestone } from '../models/UpdateableMilestone';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MilestonesService {
    /**
     * Create Milestone
     * @returns Milestone Successful Response
     * @throws ApiError
     */
    public static createMilestoneMilestonesPost({
        requestBody,
    }: {
        requestBody: CreateableMilestone,
    }): CancelablePromise<Milestone> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/milestones/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Milestone
     * @returns Milestone Successful Response
     * @throws ApiError
     */
    public static getMilestoneMilestonesIdGet({
        id,
    }: {
        id: string,
    }): CancelablePromise<Milestone> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/milestones/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Milestone
     * @returns Milestone Successful Response
     * @throws ApiError
     */
    public static updateMilestoneMilestonesIdPatch({
        id,
        requestBody,
    }: {
        id: string,
        requestBody: UpdateableMilestone,
    }): CancelablePromise<Milestone> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/milestones/{id}',
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
     * Delete Milestone
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteMilestoneMilestonesIdDelete({
        id,
    }: {
        id: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/milestones/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
