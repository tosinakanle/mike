import { useEffect, useRef, useState } from "react";
import { MikeIcon } from "@/app/components/chat/mike-icon";

export type StatusState = "active" | "error" | null;

export function ResponseStatus({ status }: { status: StatusState }) {
    const [showDone, setShowDone] = useState(false);
    const [doneVisible, setDoneVisible] = useState(false);
    const wasActiveRef = useRef(false);

    const isActive = status === "active";
    const isError = status === "error";

    useEffect(() => {
        const wasActive = wasActiveRef.current;
        wasActiveRef.current = isActive;

        let raf = 0;
        let doneTimeout = 0;
        if (wasActive && !isActive) {
            raf = window.requestAnimationFrame(() => {
                setShowDone(true);
                setDoneVisible(true);
                doneTimeout = window.setTimeout(
                    () => setDoneVisible(false),
                    1500,
                );
            });
        } else if (!wasActive && isActive) {
            raf = window.requestAnimationFrame(() => {
                setShowDone(false);
                setDoneVisible(false);
            });
        }

        return () => {
            window.cancelAnimationFrame(raf);
            if (doneTimeout) window.clearTimeout(doneTimeout);
        };
    }, [isActive]);

    if (!isActive && !isError) {
        return null;
    }

    return (
        <div className="w-full h-8 flex items-center mb-1">
            {isActive && (
                <div className="flex items-center gap-2 text-xs text-neutral-500 font-sans select-none">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                    <span>Analyzing jurisprudence...</span>
                </div>
            )}
            {isError && (
                <div className="flex items-center gap-2 text-xs text-red-600 font-sans select-none">
                    <span className="w-2 h-2 rounded-full bg-red-600" />
                    <span>Error generating response</span>
                </div>
            )}
        </div>
    );
}
