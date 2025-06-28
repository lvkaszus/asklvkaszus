import { useState } from "react"
import { Card, CardContent, Divider, Tab, Tabs, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import GlobalSettingsControls from "./GlobalSettingsControls";
import CaptchaSettingsControls from "./CaptchaSettingsControls";

const GlobalSettingsTabView = ({ appSettings, forceDataFetch }) => {
    const { t } = useTranslation();

    const [currentTab, setCurrentTab] = useState(0);

    const handleTabChange = (_, newValue) => {
        setCurrentTab(newValue);
    };

    return (
        <Card variant="outlined" sx={{ width: '100%', maxWidth: '800px' }} className="fade-in">
            <CardContent>
                <Typography variant="h5" component='h5' sx={{ textAlign: 'center' }}>
                    {t('admin-globalsettings-pagetitle')}
                </Typography>

                <Divider sx={{ marginY: '16px' }} />

                <Tabs value={currentTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile>
                    <Tab label={t('admin-globalsettings-tabs-title-1')} />
                    <Tab label={t('admin-globalsettings-tabs-title-2')} />
                </Tabs>

                <Divider sx={{ marginY: '16px' }} />

                {currentTab === 0 && <GlobalSettingsControls appSettings={appSettings} forceDataFetch={forceDataFetch} />}
                {currentTab === 1 && <CaptchaSettingsControls />}
            </CardContent>
        </Card>
    )
}

export default GlobalSettingsTabView