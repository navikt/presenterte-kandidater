import { setupWorker } from "msw";
import { handlers } from "./handlers";

export const configureMockWorker = () => setupWorker(...handlers);
