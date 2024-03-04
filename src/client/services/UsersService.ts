/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreatableUser } from '../models/CreatableUser';
import type { User } from '../models/User';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
    /**
     * Register
     * @returns User Successful Response
     * @throws ApiError
     */
    public static registerUsersRegisterPost({
        requestBody,
    }: {
        requestBody: CreatableUser,
    }): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Login
     * @returns User Successful Response
     * @throws ApiError
     */
    public static loginUsersLoginPost({
        username,
        password,
    }: {
        username: string,
        password: string,
    }): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/login',
            query: {
                'username': username,
                'password': password,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Me
     * @returns User Successful Response
     * @throws ApiError
     */
    public static meUsersMeGet(): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/me',
        });
    }
    /**
     * Reset Password
     * @returns User Successful Response
     * @throws ApiError
     */
    public static resetPasswordUsersPasswordResetPatch({
        newPassword,
    }: {
        newPassword: string,
    }): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/users/password/reset',
            query: {
                'newPassword': newPassword,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
