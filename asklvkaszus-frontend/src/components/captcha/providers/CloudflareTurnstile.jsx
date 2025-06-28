import { useRef, useEffect } from "react";
import { Box } from "@mui/material";

const CloudflareTurnstile = ({ captchaSiteKey, onVerify }) => {
    const widgetRef = useRef(null);
    const widgetIdRef = useRef(null);
    const scriptLoaded = useRef(false);

    useEffect(() => {
        const renderTurnstile = () => {
            if (window.turnstile && widgetRef.current) {
                if (widgetIdRef.current) {
                    window.turnstile.remove(widgetIdRef.current);
                }

                const id = window.turnstile.render(widgetRef.current, {
                    sitekey: captchaSiteKey,
                    callback: (token) => {
                        onVerify(token);
                    },
                    'expired-callback': () => {
                        widgetIdRef.current = null;
                    }
                });
                widgetIdRef.current = id;
            }
        };

        if (!window.turnstile) {
            if (!scriptLoaded.current) {
                scriptLoaded.current = true;
                const script = document.createElement("script");
                script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
                script.async = true;
                script.defer = true;
                script.onload = renderTurnstile;
                document.body.appendChild(script);
            }
        } else {
            renderTurnstile();
        }

        return () => {
            if (window.turnstile && widgetIdRef.current) {
                window.turnstile.remove(widgetIdRef.current);
            }
        };
    }, [captchaSiteKey]);

    return (
        <Box ref={widgetRef} sx={{ display: 'flex', justifyContent: 'center' }} />
    );
};

export default CloudflareTurnstile;
