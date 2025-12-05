import ApiClient from "./api-client";
import type { Bicycle } from "../entities/Bicycle";

const bicyclesClient = new ApiClient<Bicycle>("/bicycles");

export default bicyclesClient;
