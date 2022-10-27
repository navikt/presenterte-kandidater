import { configureMockServer } from "./server";
import { configureMockWorker } from "./worker";

export const configureMock = () => {
    if (typeof document === "undefined") {
        configureMockServer().listen();
    } else {
        configureMockWorker().start();
    }
};
