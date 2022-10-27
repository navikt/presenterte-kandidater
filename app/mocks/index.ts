export const initializeMock = () => {
    if (typeof document === "undefined") {
        const { server } = require("./server");
        server.listen();
    } else {
        const { worker } = require("./browser");
        worker.start();
    }
};
