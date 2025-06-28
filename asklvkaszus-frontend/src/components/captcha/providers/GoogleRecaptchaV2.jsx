import { useRef, useEffect } from "react";
import { Box } from "@mui/material";

const GoogleRecaptchaV2 = ({ captchaSiteKey, onVerify }) => {
    const widgetRef = useRef(null);
    const widgetIdRef = useRef(null);
    const scriptLoaded = useRef(false);

    useEffect(() => {
        const renderRecaptcha = () => {
            if (window.grecaptcha && widgetRef.current) {
                if (widgetIdRef.current !== null) {
                    window.grecaptcha.reset(widgetIdRef.current);
                }

                widgetIdRef.current = window.grecaptcha.render(widgetRef.current, {
                    sitekey: captchaSiteKey,
                    callback: onVerify,
                    "expired-callback": () => {
                        widgetIdRef.current = null;
                    }
                });
            }
        };

        if (window.grecaptcha) {
            window.grecaptcha.ready(renderRecaptcha);

        } else if (!scriptLoaded.current) {
            scriptLoaded.current = true;
            const script = document.createElement("script");
            script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
            script.async = true;
            script.defer = true;
            script.onload = () => {
                window.grecaptcha.ready(renderRecaptcha);
            };
            document.body.appendChild(script);

        }

        return () => {
            if (window.grecaptcha && widgetIdRef.current !== null) {
                window.grecaptcha.reset(widgetIdRef.current);
            }
            
        };
    }, [captchaSiteKey, onVerify]);

    return (
        <Box ref={widgetRef} sx={{ display: 'flex', justifyContent: 'center' }} />
    );
};

export default GoogleRecaptchaV2;
