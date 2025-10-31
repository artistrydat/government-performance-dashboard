/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as automatedCompliance from "../automatedCompliance.js";
import type * as complianceDashboard from "../complianceDashboard.js";
import type * as complianceEvaluations from "../complianceEvaluations.js";
import type * as evaluationEngine from "../evaluationEngine.js";
import type * as evidenceManagement from "../evidenceManagement.js";
import type * as pmiStandardCriteria from "../pmiStandardCriteria.js";
import type * as pmiStandards from "../pmiStandards.js";
import type * as portfolios from "../portfolios.js";
import type * as projectCompliance from "../projectCompliance.js";
import type * as projects from "../projects.js";
import type * as risks from "../risks.js";
import type * as seed from "../seed.js";
import type * as userPreferences from "../userPreferences.js";
import type * as users from "../users.js";
import type * as validation from "../validation.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  automatedCompliance: typeof automatedCompliance;
  complianceDashboard: typeof complianceDashboard;
  complianceEvaluations: typeof complianceEvaluations;
  evaluationEngine: typeof evaluationEngine;
  evidenceManagement: typeof evidenceManagement;
  pmiStandardCriteria: typeof pmiStandardCriteria;
  pmiStandards: typeof pmiStandards;
  portfolios: typeof portfolios;
  projectCompliance: typeof projectCompliance;
  projects: typeof projects;
  risks: typeof risks;
  seed: typeof seed;
  userPreferences: typeof userPreferences;
  users: typeof users;
  validation: typeof validation;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};
