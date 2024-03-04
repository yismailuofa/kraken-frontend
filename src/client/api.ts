/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */


export interface paths {
  "/users/register": {
    /** Register */
    post: operations["register_users_register_post"];
  };
  "/users/login": {
    /** Login */
    post: operations["login_users_login_post"];
  };
  "/users/me": {
    /** Me */
    get: operations["me_users_me_get"];
  };
  "/users/password/reset": {
    /** Reset Password */
    patch: operations["Reset_Password_users_password_reset_patch"];
  };
  "/projects/": {
    /** Get Owned & Joined Projects */
    get: operations["Get_Owned___Joined_Projects_projects__get"];
    /** Create Project */
    post: operations["Create_Project_projects__post"];
  };
  "/projects/{id}": {
    /** Get Project */
    get: operations["Get_Project_projects__id__get"];
    /** Delete Project */
    delete: operations["Delete_Project_projects__id__delete"];
    /** Update Project */
    patch: operations["Update_Project_projects__id__patch"];
  };
  "/projects/{id}/join": {
    /** Join Project */
    post: operations["Join_Project_projects__id__join_post"];
  };
  "/projects/{id}/leave": {
    /** Leave Project */
    delete: operations["Leave_Project_projects__id__leave_delete"];
  };
  "/projects/{id}/users": {
    /** Get Project Users */
    get: operations["Get_Project_Users_projects__id__users_get"];
    /** Add User To Project */
    post: operations["Add_User_to_Project_projects__id__users_post"];
    /** Remove User From Project */
    delete: operations["Remove_User_from_Project_projects__id__users_delete"];
  };
  "/milestones/": {
    /** Create Milestone */
    post: operations["Create_Milestone_milestones__post"];
  };
  "/milestones/{id}": {
    /** Get Milestone */
    get: operations["Get_Milestone_milestones__id__get"];
    /** Delete Milestone */
    delete: operations["Delete_Milestone_milestones__id__delete"];
    /** Update Milestone */
    patch: operations["Update_Milestone_milestones__id__patch"];
  };
  "/tasks/": {
    /** Create Task */
    post: operations["Create_Task_tasks__post"];
  };
  "/tasks/{id}": {
    /** Get Task */
    get: operations["Get_Task_tasks__id__get"];
    /** Delete Task */
    delete: operations["Delete_Task_tasks__id__delete"];
    /** Update Task */
    patch: operations["Update_Task_tasks__id__patch"];
  };
  "/sprints/": {
    /** Create Sprint */
    post: operations["Create_Sprint_sprints__post"];
  };
  "/sprints/{id}": {
    /** Get Sprint */
    get: operations["Get_Sprint_sprints__id__get"];
    /** Delete Sprint */
    delete: operations["Delete_Sprint_sprints__id__delete"];
    /** Update Sprint */
    patch: operations["Update_Sprint_sprints__id__patch"];
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
    /** BaseCreateableTask */
    BaseCreateableTask: {
      /** Name */
      name: string;
      /** Description */
      description: string;
      /**
       * Duedate
       * Format: date-time
       */
      dueDate: string;
      /** @default Medium */
      priority?: components["schemas"]["Priority"];
      /** @default Todo */
      status?: components["schemas"]["Status"];
      /**
       * Assignedto
       * @default Unassigned
       */
      assignedTo?: string;
    };
    /** BaseUpdateableTask */
    BaseUpdateableTask: {
      /** Name */
      name?: string | null;
      /** Description */
      description?: string | null;
      /** Duedate */
      dueDate?: string | null;
      priority?: components["schemas"]["Priority"] | null;
      status?: components["schemas"]["Status"] | null;
      /** Assignedto */
      assignedTo?: string | null;
    };
    /** CreatableUser */
    CreatableUser: {
      /** Username */
      username: string;
      /** Password */
      password: string;
      /** Email */
      email: string;
    };
    /** CreateableMilestone */
    CreateableMilestone: {
      /** Name */
      name: string;
      /** Description */
      description: string;
      /**
       * Duedate
       * Format: date-time
       */
      dueDate: string;
      /** Projectid */
      projectId: string;
      /**
       * Dependentmilestones
       * @default []
       */
      dependentMilestones?: string[];
      /**
       * Dependenttasks
       * @default []
       */
      dependentTasks?: string[];
    };
    /** CreateableProject */
    CreateableProject: {
      /** Name */
      name: string;
      /** Description */
      description: string;
    };
    /** CreateableSprint */
    CreateableSprint: {
      /** Name */
      name: string;
      /** Description */
      description: string;
      /**
       * Startdate
       * Format: date-time
       */
      startDate: string;
      /**
       * Enddate
       * Format: date-time
       */
      endDate: string;
      /** Projectid */
      projectId: string;
    };
    /** CreateableTask */
    CreateableTask: {
      /** Name */
      name: string;
      /** Description */
      description: string;
      /**
       * Duedate
       * Format: date-time
       */
      dueDate: string;
      /** @default Medium */
      priority?: components["schemas"]["Priority"];
      /** @default Todo */
      status?: components["schemas"]["Status"];
      /**
       * Assignedto
       * @default Unassigned
       */
      assignedTo?: string;
      /** Projectid */
      projectId: string;
      /** Milestoneid */
      milestoneId: string;
      /**
       * Dependentmilestones
       * @default []
       */
      dependentMilestones?: string[];
      /**
       * Dependenttasks
       * @default []
       */
      dependentTasks?: string[];
      qaTask: components["schemas"]["BaseCreateableTask"];
    };
    /** HTTPValidationError */
    HTTPValidationError: {
      /** Detail */
      detail?: components["schemas"]["ValidationError"][];
    };
    /** Milestone */
    Milestone: {
      /** Name */
      name: string;
      /** Description */
      description: string;
      /**
       * Duedate
       * Format: date-time
       */
      dueDate: string;
      /** Projectid */
      projectId: string;
      /**
       * Dependentmilestones
       * @default []
       */
      dependentMilestones?: string[];
      /**
       * Dependenttasks
       * @default []
       */
      dependentTasks?: string[];
      /** Id */
      id?: string | null;
      /** @default Todo */
      status?: components["schemas"]["Status"];
      /**
       * Tasks
       * @default []
       */
      tasks?: string[];
    };
    /**
     * Priority
     * @enum {string}
     */
    Priority: "Low" | "Medium" | "High";
    /** Project */
    Project: {
      /** Name */
      name: string;
      /** Description */
      description: string;
      /** Id */
      id?: string | null;
      /**
       * Createdat
       * Format: date-time
       * @default 2024-03-04T15:45:15
       */
      createdAt?: string;
    };
    /** ProjectView */
    ProjectView: {
      /** Name */
      name: string;
      /** Description */
      description: string;
      /** Id */
      id?: string | null;
      /**
       * Createdat
       * Format: date-time
       * @default 2024-03-04T15:45:15
       */
      createdAt?: string;
      /**
       * Milestones
       * @default []
       */
      milestones?: components["schemas"]["Milestone"][];
      /**
       * Tasks
       * @default []
       */
      tasks?: components["schemas"]["Task"][];
      /**
       * Sprints
       * @default []
       */
      sprints?: components["schemas"]["Sprint"][];
    };
    /** Sprint */
    Sprint: {
      /** Name */
      name: string;
      /** Description */
      description: string;
      /**
       * Startdate
       * Format: date-time
       */
      startDate: string;
      /**
       * Enddate
       * Format: date-time
       */
      endDate: string;
      /** Projectid */
      projectId: string;
      /** Id */
      id?: string | null;
      /**
       * Tasks
       * @default []
       */
      tasks?: string[];
      /**
       * Milestones
       * @default []
       */
      milestones?: string[];
    };
    /**
     * Status
     * @enum {string}
     */
    Status: "Todo" | "In Progress" | "Completed";
    /** Task */
    Task: {
      /** Name */
      name: string;
      /** Description */
      description: string;
      /**
       * Duedate
       * Format: date-time
       */
      dueDate: string;
      /** @default Medium */
      priority?: components["schemas"]["Priority"];
      /** @default Todo */
      status?: components["schemas"]["Status"];
      /**
       * Assignedto
       * @default Unassigned
       */
      assignedTo?: string;
      /** Projectid */
      projectId: string;
      /** Milestoneid */
      milestoneId: string;
      /**
       * Dependentmilestones
       * @default []
       */
      dependentMilestones?: string[];
      /**
       * Dependenttasks
       * @default []
       */
      dependentTasks?: string[];
      qaTask: components["schemas"]["BaseCreateableTask"];
      /** Id */
      id?: string | null;
      /**
       * Createdat
       * Format: date-time
       * @default 2024-03-04T15:45:15
       */
      createdAt?: string;
    };
    /** UpdateableMilestone */
    UpdateableMilestone: {
      /** Name */
      name?: string | null;
      /** Description */
      description?: string | null;
      /** Duedate */
      dueDate?: string | null;
      status?: components["schemas"]["Status"] | null;
      /** Dependentmilestones */
      dependentMilestones?: string[] | null;
      /** Dependenttasks */
      dependentTasks?: string[] | null;
    };
    /** UpdateableProject */
    UpdateableProject: {
      /** Name */
      name?: string | null;
      /** Description */
      description?: string | null;
    };
    /** UpdateableSprint */
    UpdateableSprint: {
      /** Name */
      name?: string | null;
      /** Description */
      description?: string | null;
      /** Startdate */
      startDate?: string | null;
      /** Enddate */
      endDate?: string | null;
      /** Tasks */
      tasks?: string[] | null;
      /** Milestones */
      milestones?: string[] | null;
    };
    /** UpdateableTask */
    UpdateableTask: {
      /** Name */
      name?: string | null;
      /** Description */
      description?: string | null;
      /** Duedate */
      dueDate?: string | null;
      priority?: components["schemas"]["Priority"] | null;
      status?: components["schemas"]["Status"] | null;
      /** Assignedto */
      assignedTo?: string | null;
      /** Projectid */
      projectId?: string | null;
      /** Milestoneid */
      milestoneId?: string | null;
      qaTask?: components["schemas"]["BaseUpdateableTask"] | null;
      /** Dependentmilestones */
      dependentMilestones?: string[] | null;
      /** Dependenttasks */
      dependentTasks?: string[] | null;
    };
    /** User */
    User: {
      /** Username */
      username: string;
      /** Password */
      password: string;
      /** Email */
      email: string;
      /** Id */
      id?: string | null;
      /**
       * Ownedprojects
       * @default []
       */
      ownedProjects?: string[];
      /**
       * Joinedprojects
       * @default []
       */
      joinedProjects?: string[];
      /** Token */
      token?: string | null;
    };
    /** UserView */
    UserView: {
      /** Id */
      id: string | null;
      /** Username */
      username: string;
      /** Email */
      email: string;
    };
    /** ValidationError */
    ValidationError: {
      /** Location */
      loc: (string | number)[];
      /** Message */
      msg: string;
      /** Error Type */
      type: string;
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}

export type $defs = Record<string, never>;

export type external = Record<string, never>;

export interface operations {

  /** Register */
  register_users_register_post: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["CreatableUser"];
      };
    };
    responses: {
      /** @description Successful Response */
      201: {
        content: {
          "application/json": components["schemas"]["User"];
        };
      };
      /** @description Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /** Login */
  login_users_login_post: {
    parameters: {
      query: {
        username: string;
        password: string;
      };
    };
    responses: {
      /** @description Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["User"];
        };
      };
      /** @description Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /** Me */
  me_users_me_get: {
    responses: {
      /** @description Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["User"];
        };
      };
    };
  };
  /** Reset Password */
  Reset_Password_users_password_reset_patch: {
    parameters: {
      query: {
        newPassword: string;
      };
    };
    responses: {
      /** @description Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["User"];
        };
      };
      /** @description Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /** Get Owned & Joined Projects */
  Get_Owned___Joined_Projects_projects__get: {
    responses: {
      /** @description Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["Project"][];
        };
      };
    };
  };
  /** Create Project */
  Create_Project_projects__post: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["CreateableProject"];
      };
    };
    responses: {
      /** @description Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["Project"];
        };
      };
      /** @description Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /** Get Project */
  Get_Project_projects__id__get: {
    parameters: {
      path: {
        id: string;
      };
    };
    responses: {
      /** @description Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["ProjectView"];
        };
      };
      /** @description Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /** Delete Project */
  Delete_Project_projects__id__delete: {
    parameters: {
      path: {
        id: string;
      };
    };
    responses: {
      /** @description Successful Response */
      200: {
        content: {
          "application/json": unknown;
        };
      };
      /** @description Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /** Update Project */
  Update_Project_projects__id__patch: {
    parameters: {
      path: {
        id: string;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["UpdateableProject"];
      };
    };
    responses: {
      /** @description Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["Project"];
        };
      };
      /** @description Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /** Join Project */
  Join_Project_projects__id__join_post: {
    parameters: {
      path: {
        id: string;
      };
    };
    responses: {
      /** @description Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["User"];
        };
      };
      /** @description Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /** Leave Project */
  Leave_Project_projects__id__leave_delete: {
    parameters: {
      path: {
        id: string;
      };
    };
    responses: {
      /** @description Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["User"];
        };
      };
      /** @description Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /** Get Project Users */
  Get_Project_Users_projects__id__users_get: {
    parameters: {
      path: {
        id: string;
      };
    };
    responses: {
      /** @description Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["UserView"][];
        };
      };
      /** @description Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /** Add User To Project */
  Add_User_to_Project_projects__id__users_post: {
    parameters: {
      query: {
        email: string;
      };
      path: {
        id: string;
      };
    };
    responses: {
      /** @description Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["UserView"];
        };
      };
      /** @description Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /** Remove User From Project */
  Remove_User_from_Project_projects__id__users_delete: {
    parameters: {
      query: {
        userID: string;
      };
      path: {
        id: string;
      };
    };
    responses: {
      /** @description Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["UserView"];
        };
      };
      /** @description Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /** Create Milestone */
  Create_Milestone_milestones__post: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["CreateableMilestone"];
      };
    };
    responses: {
      /** @description Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["Milestone"];
        };
      };
      /** @description Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /** Get Milestone */
  Get_Milestone_milestones__id__get: {
    parameters: {
      path: {
        id: string;
      };
    };
    responses: {
      /** @description Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["Milestone"];
        };
      };
      /** @description Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /** Delete Milestone */
  Delete_Milestone_milestones__id__delete: {
    parameters: {
      path: {
        id: string;
      };
    };
    responses: {
      /** @description Successful Response */
      200: {
        content: {
          "application/json": unknown;
        };
      };
      /** @description Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /** Update Milestone */
  Update_Milestone_milestones__id__patch: {
    parameters: {
      path: {
        id: string;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["UpdateableMilestone"];
      };
    };
    responses: {
      /** @description Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["Milestone"];
        };
      };
      /** @description Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /** Create Task */
  Create_Task_tasks__post: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["CreateableTask"];
      };
    };
    responses: {
      /** @description Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["Task"];
        };
      };
      /** @description Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /** Get Task */
  Get_Task_tasks__id__get: {
    parameters: {
      path: {
        id: string;
      };
    };
    responses: {
      /** @description Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["Task"];
        };
      };
      /** @description Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /** Delete Task */
  Delete_Task_tasks__id__delete: {
    parameters: {
      path: {
        id: string;
      };
    };
    responses: {
      /** @description Successful Response */
      200: {
        content: {
          "application/json": unknown;
        };
      };
      /** @description Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /** Update Task */
  Update_Task_tasks__id__patch: {
    parameters: {
      path: {
        id: string;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["UpdateableTask"];
      };
    };
    responses: {
      /** @description Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["Task"];
        };
      };
      /** @description Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /** Create Sprint */
  Create_Sprint_sprints__post: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["CreateableSprint"];
      };
    };
    responses: {
      /** @description Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["Sprint"];
        };
      };
      /** @description Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /** Get Sprint */
  Get_Sprint_sprints__id__get: {
    parameters: {
      path: {
        id: string;
      };
    };
    responses: {
      /** @description Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["Sprint"];
        };
      };
      /** @description Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /** Delete Sprint */
  Delete_Sprint_sprints__id__delete: {
    parameters: {
      path: {
        id: string;
      };
    };
    responses: {
      /** @description Successful Response */
      200: {
        content: {
          "application/json": unknown;
        };
      };
      /** @description Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /** Update Sprint */
  Update_Sprint_sprints__id__patch: {
    parameters: {
      path: {
        id: string;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["UpdateableSprint"];
      };
    };
    responses: {
      /** @description Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["Sprint"];
        };
      };
      /** @description Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
}
