// src/services/routeService.ts
import ApiClient from "./api-client";

// Matches RouteDto from backend: { id, routeNumber }
export interface Route {
  id: number;
  routeNumber: number;
}

// Payload for create/update
export interface RoutePayload {
  routeNumber: number;
}

class RouteService extends ApiClient<Route> {
  constructor() {
    super("Routes"); // -> /api/Routes
  }

  getAllRoutes() {
    return this.getAll();
  }

  createRoute(payload: RoutePayload) {
    // backend expects { routeNumber }
    return this.create(payload);
  }

  updateRoute(id: number, payload: RoutePayload) {
    return this.update(id, payload);
  }

  deleteRoute(id: number) {
    return this.delete(id);
  }
}

export const routeService = new RouteService();
