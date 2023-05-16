import { useRef, useEffect } from "react";

/*
 * Injiser script-elementet til dekoratøren og en tilhørende div.
 * useEffect()-hooken sørger for at dette gjøres utelukkende client-side,
 * for ellers vil dekoratøren manipulere DOM-en og forstyrre hydreringen.
 */
const useInjectDecoratorScript = (script?: string) => {
    const isInjected = useRef(false);

    useEffect(() => {
        if (script && !isInjected.current) {
            const parser = new DOMParser();
            const parsedDocument = parser.parseFromString(script, "text/html");

            const parsedElements = Array.from(parsedDocument.body.childNodes);
            const parsedDivElement = parsedElements[0] as HTMLDivElement;
            const parsedScriptElement = parsedElements[2] as HTMLScriptElement;

            const divDataSource = (parsedDivElement as HTMLDivElement).getAttribute("data-src")!;
            const divId = (parsedDivElement as HTMLDivElement).getAttribute("id")!;
            const divElement = document.createElement("div");
            divElement.setAttribute("data-src", divDataSource);
            divElement.setAttribute("id", divId);

            const scriptSource = (parsedScriptElement as HTMLScriptElement).src;
            const scriptElement = document.createElement("script");
            scriptElement.src = scriptSource;

            document.body.appendChild(divElement);
            document.body.appendChild(scriptElement);

            isInjected.current = true;
        }
    }, [script]);
};

export default useInjectDecoratorScript;
