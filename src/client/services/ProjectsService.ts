/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateableProject } from '../models/CreateableProject';
import type { Project } from '../models/Project';
import type { ProjectView } from '../models/ProjectView';
import type { UpdateableProject } from '../models/UpdateableProject';
import type { User } from '../models/User';
import type { UserView } from '../models/UserView';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProjectsService {
    /**
     * Get Owned & Joined Projects
     * @returns Project Successful Response
     * @throws ApiError
     */
    public static getOwnedJoinedProjectsProjectsGet(): CancelablePromise<Array<Project>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/projects/',
        });
    }
    /**
     * Create Project
     * @returns Project Successful Response
     * @throws ApiError
     */
    public static createProjectProjectsPost({
        requestBody,
    }: {
        requestBody: CreateableProject,
    }): CancelablePromise<Project> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/projects/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Project
     * @returns ProjectView Successful Response
     * @throws ApiError
     */
    public static getProjectProjectsIdGet({
        id,
    }: {
        id: string,
    }): CancelablePromise<ProjectView> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/projects/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Project
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteProjectProjectsIdDelete({
        id,
    }: {
        id: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/projects/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Project
     * @returns Project Successful Response
     * @throws ApiError
     */
    public static updateProjectProjectsIdPatch({
        id,
        requestBody,
    }: {
        id: string,
        requestBody: UpdateableProject,
    }): CancelablePromise<Project> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/projects/{id}',
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
     * Join Project
     * @returns User Successful Response
     * @throws ApiError
     */
    public static joinProjectProjectsIdJoinPost({
        id,
    }: {
        id: string,
    }): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/projects/{id}/join',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Leave Project
     * @returns User Successful Response
     * @throws ApiError
     */
    public static leaveProjectProjectsIdLeaveDelete({
        id,
    }: {
        id: string,
    }): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/projects/{id}/leave',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Add User To Project
     * @returns UserView Successful Response
     * @throws ApiError
     */
    public static addUserToProjectProjectsIdUsersPost({
        id,
        email,
    }: {
        id: string,
        email: string,
    }): CancelablePromise<UserView> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/projects/{id}/users',
            path: {
                'id': id,
            },
            query: {
                'email': email,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Remove User From Project
     * @returns UserView Successful Response
     * @throws ApiError
     */
    public static removeUserFromProjectProjectsIdUsersDelete({
        id,
        userId,
    }: {
        id: string,
        userId: string,
    }): CancelablePromise<UserView> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/projects/{id}/users',
            path: {
                'id': id,
            },
            query: {
                'userID': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Project Users
     * @returns UserView Successful Response
     * @throws ApiError
     */
    public static getProjectUsersProjectsIdUsersGet({
        id,
    }: {
        id: string,
    }): CancelablePromise<Array<UserView>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/projects/{id}/users',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
