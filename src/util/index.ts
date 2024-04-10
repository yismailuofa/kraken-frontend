/**
 * Local storage for user data
 */

import { components } from "../client/api";
import { MaybeUser } from "../contexts/ApiContext";

type User = components["schemas"]["User"];

export function fetchUserFromLocalStorage(): MaybeUser {
    const user = localStorage.getItem("user");
    
    return user ? JSON.parse(user) : null;
}

export function saveUserToLocalStorage(user: User) {
    localStorage.setItem("user", JSON.stringify(user));
}

export function removeUserFromLocalStorage() {
    localStorage.removeItem("user");
}