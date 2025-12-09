import ApiClient from "./api-client";
import type { Route } from "../entities/Route";

export const routeService = new ApiClient<Route>("/routes");
export type { Route };
