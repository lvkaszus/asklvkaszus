import React, { useState } from "react";
import { Card, CardContent, Typography, Divider, Box } from "@mui/material";
import ToggleAdminApi from "./ToggleAdminApi";
import CheckToggleAdminApiResult from "../results/CheckToggleAdminApiResult";
import ToggleUserApi from "./ToggleUserApi";
import CheckToggleUserApiResult from "../results/CheckToggleUserApiResult";
import RefreshAdminApiKey from "./RefreshAdminApiKey";
import CheckRefreshAdminApiKeyResult from "../results/CheckRefreshAdminApiKeyResult";
import ConfigureNotifications from "./ConfigureNotifications";
import CheckConfigureNotificationsResult from "../results/CheckConfigureNotificationsResult";
import ChangePassword from "./ChangePassword";
import CheckChangePasswordResult from "../results/CheckChangePasswordResult";
import ShowAdminApiKey from "./ShowAdminApiKey";
import { useTranslation } from "react-i18next";

const UserSettingsList = ({ userData, handleUserDataUpdate }) => {
    const { t } = useTranslation();

    const [username, setUsername] = useState('');

    const [toggleAdminApiStatus, setToggleAdminApiStatus] = useState('');
    const [toggleAdminApiResponse, setToggleAdminApiResponse] = useState('');
    const [isToggleAdminApiNotifyOpen, setToggleAdminApiNotifyOpen] = useState(false);

    const [toggleUserApiStatus, setToggleUserApiStatus] = useState('');
    const [toggleUserApiResponse, setToggleUserApiResponse] = useState('');
    const [isToggleUserApiNotifyOpen, setToggleUserApiNotifyOpen] = useState(false);

    const [refreshAdminApiKeyStatus, setRefreshAdminApiKeyStatus] = useState('');
    const [refreshAdminApiKeyResponse, setRefreshAdminApiKeyResponse] = useState('');
    const [isRefreshAdminApiKeyNotifyOpen, setRefreshAdminApiKeyNotifyOpen] = useState(false);

    const [configureNotificationsStatus, setConfigureNotificationsStatus] = useState('');
    const [configureNotificationsResponse, setConfigureNotificationsResponse] = useState('');
    const [isConfigureNotificationsNotifyOpen, setConfigureNotificationsNotifyOpen] = useState(false);

    const [changePasswordStatus, setChangePasswordStatus] = useState('');
    const [changePasswordResponse, setChangePasswordResponse] = useState('');
    const [isChangePasswordNotifyOpen, setChangePasswordNotifyOpen] = useState(false);

    const toggleAdminApiOutputData = (status, response, username) => {
        setToggleAdminApiStatus(status);
        setToggleAdminApiResponse(response);
        setUsername(username);
    };

    const handleToggleAdminApiNotifyClose = () => {
        setToggleAdminApiNotifyOpen(false);
    };

    const toggleUserApiOutputData = (status, response) => {
        setToggleUserApiStatus(status);
        setToggleUserApiResponse(response);
    };

    const handleToggleUserApiNotifyClose = () => {
        setToggleUserApiNotifyOpen(false);
    };

    const refreshAdminApiKeyOutputData = (status, response) => {
        setRefreshAdminApiKeyStatus(status);
        setRefreshAdminApiKeyResponse(response);
    };

    const handleRefreshAdminApiKeyNotifyClose = () => {
        setRefreshAdminApiKeyNotifyOpen(false);
    };

    const configureNotificationsOutputData = (status, response) => {
        setConfigureNotificationsStatus(status);
        setConfigureNotificationsResponse(response);
    };

    const handleConfigureNotificationsNotifyClose = () => {
        setConfigureNotificationsNotifyOpen(false);
    };

    const changePasswordOutputData = (status, response) => {
        setChangePasswordStatus(status);
        setChangePasswordResponse(response);
    };

    const handleChangePasswordNotifyClose = () => {
        setChangePasswordNotifyOpen(false);
    };

    return (
        <>
            <Card variant="outlined" sx={{ width: '100%', maxWidth: '600px' }} className="fade-in">
                <CardContent>
                    <Typography variant="h5" component='h5' sx={{ textAlign: 'center' }}>
                        {t('admin-us-title')}
                    </Typography>

                    <Divider sx={{ marginY: '16px' }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontWeight: 500 }}>
                            {t('admin-us-username')}
                        </Typography>
                        <Typography >
                            {userData.username || '-'}
                        </Typography>
                    </Box>

                    <Divider sx={{ marginY: '16px' }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <Typography sx={{ fontWeight: 500 }}>
                            {t('admin-us-lastpasswordchange')}
                        </Typography>
                        <Typography>
                            {userData.last_password_change || '-'}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontWeight: 500 }}>
                            {t('admin-us-passwordchangecount')}
                        </Typography>
                        <Typography>
                            {userData.password_change_count || 0}
                        </Typography>
                    </Box>

                    <Divider sx={{ marginY: '16px' }} />

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <Typography sx={{ fontWeight: 500 }}>
                            {t('admin-us-adminapienabled')}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography sx={{ marginRight: '8px' }}>
                                {userData.api_admin_enabled ? t('yes') : t('no')}
                            </Typography>

                            <ToggleAdminApi adminApiEnabled={userData.api_admin_enabled} toggleAdminApiOutputData={toggleAdminApiOutputData} setToggleAdminApiNotifyOpen={setToggleAdminApiNotifyOpen} username={userData.username} handleUserDataUpdate={handleUserDataUpdate} />
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <Typography sx={{ fontWeight: 500 }}>
                            {t('admin-us-userapienabled')}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography sx={{ marginRight: '8px' }}>
                                {userData.api_user_enabled ? t('yes') : t('no')}
                            </Typography>

                            <ToggleUserApi userApiEnabled={userData.api_user_enabled} toggleUserApiOutputData={toggleUserApiOutputData} setToggleUserApiNotifyOpen={setToggleUserApiNotifyOpen} handleUserDataUpdate={handleUserDataUpdate} />
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontWeight: 500 }}>
                            {t('admin-us-adminapikey')}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography sx={{ marginRight: '8px' }}>
                                {userData.api_key ? (
                                    userData.api_key.slice(0, 4) + "****" + userData.api_key.slice(-4)
                                ) : "-"}
                            </Typography>

                            {userData.api_key && (
                                <RefreshAdminApiKey refreshAdminApiKeyOutputData={refreshAdminApiKeyOutputData} setRefreshAdminApiKeyNotifyOpen={setRefreshAdminApiKeyNotifyOpen} handleUserDataUpdate={handleUserDataUpdate}/>
                            )}
                        </Box>
                    </Box>

                    <Divider sx={{ marginY: '16px' }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <Typography sx={{ fontWeight: 500 }}>
                            {t('admin-us-telegramnotifications-enabled')}
                        </Typography>
                        <Typography>
                            {userData.telegram_enabled ? t('yes') : t('no')}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <Typography sx={{ fontWeight: 500 }}>
                            {t('admin-us-telegramnotifications-bottoken')}
                        </Typography>
                        <Typography>
                            {userData.telegram_bot_token ? (
                                userData.telegram_bot_token.slice(0, 4) + "****" + userData.telegram_bot_token.slice(-4)
                            ) : "-"}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <Typography sx={{ fontWeight: 500 }}>
                            {t('admin-us-telegramnotifications-botchatid')}
                        </Typography>
                        <Typography>
                            {userData.telegram_bot_chat_id ? (
                                userData.telegram_bot_chat_id.slice(0, 4) + "****" + userData.telegram_bot_chat_id.slice(-4)
                            ) : "-"}
                        </Typography>
                    </Box>

                    <ConfigureNotifications userData={userData} configureNotificationsOutputData={configureNotificationsOutputData} setConfigureNotificationsNotifyOpen={setConfigureNotificationsNotifyOpen} handleUserDataUpdate={handleUserDataUpdate} />

                    <Divider sx={{ marginY: '16px' }} />

                    {userData.api_key && (
                        <ShowAdminApiKey adminApiKey={userData.api_key} />
                    )}

                    <ChangePassword changePasswordOutputData={changePasswordOutputData} setChangePasswordNotifyOpen={setChangePasswordNotifyOpen} handleUserDataUpdate={handleUserDataUpdate} />
                </CardContent>
            </Card>

            <CheckToggleAdminApiResult open={isToggleAdminApiNotifyOpen} error={toggleAdminApiStatus} response={toggleAdminApiResponse} username={username} onClose={handleToggleAdminApiNotifyClose} />

            <CheckToggleUserApiResult open={isToggleUserApiNotifyOpen} error={toggleUserApiStatus} response={toggleUserApiResponse} onClose={handleToggleUserApiNotifyClose} />

            <CheckRefreshAdminApiKeyResult open={isRefreshAdminApiKeyNotifyOpen} error={refreshAdminApiKeyStatus} response={refreshAdminApiKeyResponse} onClose={handleRefreshAdminApiKeyNotifyClose} />

            <CheckConfigureNotificationsResult open={isConfigureNotificationsNotifyOpen} error={configureNotificationsStatus} response={configureNotificationsResponse} onClose={handleConfigureNotificationsNotifyClose} />

            <CheckChangePasswordResult open={isChangePasswordNotifyOpen} error={changePasswordStatus} response={changePasswordResponse} onClose={handleChangePasswordNotifyClose} />
        </>
    );
};

export default UserSettingsList;
