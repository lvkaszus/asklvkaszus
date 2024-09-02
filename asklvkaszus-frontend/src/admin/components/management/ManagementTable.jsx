import React, { useState } from "react";
import { Box, Typography, Divider, Card, CardContent, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, LinearProgress } from "@mui/material";
import { useTranslation } from "react-i18next";
import UnblockAllSendersButton from "./UnblockAllSendersButton";
import UnblockSenderButton from "./UnblockSenderButton";

const ManagementTable = ({ isBlockedSendersLoading, blockedSendersError, blockedSendersResponse, unblockAllSendersOutputData, setUnblockAllSendersNotifyOpen, unblockSenderOutputData, setUnblockSenderNotifyOpen, forceDataFetch }) => {
    const { t } = useTranslation();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedData = Array.isArray(blockedSendersResponse) ? blockedSendersResponse.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : [];

    return (
        <>
            <Card variant="outlined" sx={{ width: '100%', maxWidth: 600 }} className="fade-in">
                <CardContent>
                    <Typography variant="h5" component='h5' sx={{ textAlign: 'center' }}>
                        {t('admin-mt-title')}
                    </Typography>

                    <Divider sx={{ marginY: '16px' }} />

                    {isBlockedSendersLoading ? (
                        <Box sx={{ minWidth: '300px' }}>
                            <Typography component='p'>{t('loading')}</Typography>
                            <LinearProgress sx={{ marginTop: '12px', width: '100%' }} />
                        </Box>
                    ) : (
                        blockedSendersError ? (
                            blockedSendersResponse === 'Please login again!' ? (
                                <Alert severity='warning' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '16px' }}>{t('admin-error-pleaseloginagain')}</Alert>
                            ) : (
                                <Alert severity='error' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '16px' }}>{t('error-fetchblockedsenders')}</Alert>
                            )
                        ) : (
                            blockedSendersResponse.message === "No blocked senders yet!" ? (
                                <Alert severity='info' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{t('admin-mt-noblockedsenders')}</Alert>
                            ) : (
                                <Box>
                                    <UnblockAllSendersButton unblockAllSendersOutputData={unblockAllSendersOutputData} setUnblockAllSendersNotifyOpen={setUnblockAllSendersNotifyOpen} handleBlockedSendersDataUpdate={forceDataFetch}/>

                                    <TablePagination
                                        rowsPerPageOptions={[10, 25, 50]}
                                        component="div"
                                        count={blockedSendersResponse.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />

                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>{t('admin-mt-ipaddress')}</TableCell>
                                                    <TableCell>{t('admin-mt-lastquestionsent')}</TableCell>
                                                    <TableCell>{t('admin-mt-blockeddate')}</TableCell>
                                                    <TableCell align="right">{t('admin-mt-action')}</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {paginatedData.map((row) => (
                                                    <TableRow key={row.id}>
                                                        <TableCell component="th" scope="row">
                                                            {row.ip_address}
                                                        </TableCell>
                                                        <TableCell sx={{ 
                                                            wordWrap: 'break-word', 
                                                            maxWidth: '220px'
                                                        }}>
                                                            {row.last_question || "None"}
                                                        </TableCell>
                                                        <TableCell>
                                                            {row.date}
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <UnblockSenderButton sender_ip={row.ip_address} unblockSenderOutputData={unblockSenderOutputData} setUnblockSenderNotifyOpen={setUnblockSenderNotifyOpen} handleBlockedSendersDataUpdate={forceDataFetch} />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                    <TablePagination
                                        rowsPerPageOptions={[10, 25, 50]}
                                        component="div"
                                        count={blockedSendersResponse.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </Box>
                            )
                        )
                    )}
                </CardContent>
            </Card>
        </>
    );
};

export default ManagementTable;
