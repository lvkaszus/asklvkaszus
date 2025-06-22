import { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Typography, Button, Container, Card, CardContent, Divider, Collapse, Paper, Stack } from '@mui/material';
import { ErrorRounded, ExpandMoreOutlined, Refresh } from '@mui/icons-material';

const yourNickname = import.meta.env.VITE_YOUR_NICKNAME || '@me';

class GlobalErrorBoundary extends Component {
  state = {
    hasError: false,
    errorTitle: '',
    errorDescription: '',
    expanded: false,
    userLanguage: 'en'
  };

  static getDerivedStateFromError(error) {
    if (error.title || error.description) {
      return {
        hasError: true,
        errorTitle: 'An error occurred',
        errorDescription: error.description || error.message || 'Unexpected error! Try again later.',
        expanded: false
      };
    }
    return {
      hasError: true,
      errorTitle: 'An error occurred',
      errorDescription: error.message || 'Unexpected error! Try again later.',
      expanded: false
    };
  }

  componentDidCatch(error, errorInfo) {
    if (!this.state.languageSet) {
      const userLanguage = navigator.language || navigator.userLanguage;
      this.setState({ 
        userLanguage,
        languageSet: true
      }, () => {
        this.props.i18n.changeLanguage(userLanguage);
      });
    }
    
    console.error("Uncaught Error:", error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, errorTitle: '', errorDescription: '', expanded: false, languageSet: false });
    window.location.reload();
  };

  toggleExpanded = () => {
    this.setState(prevState => ({ 
      expanded: !prevState.expanded 
    }));
  };

  render() {
    const { t } = this.props;

    if (this.state.hasError) {
      return (
        <Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <Card variant="outlined" sx={{ my: 4, wordBreak: 'break-word', textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 3, boxShadow: 4 }}>
            <CardContent>
              <ErrorRounded color="error" sx={{ fontSize: 70, mb: 2 }} />
              <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
                {t('error-title')}
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                {t('error-whathappened-title')}
              </Typography>
              <Typography variant="body2" sx={{ mb: 3 }}>
                {t('error-whathappened-description')}
              </Typography>

              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                {t('error-whattodo-title')}
              </Typography>
              <Typography variant="body2" sx={{ mb: 3 }}>
                {t('error-whattodo-description', { username: yourNickname })}
              </Typography>

              <Stack spacing={2} justifyContent="center" sx={{ mb: 2 }}>
                <Button variant="outlined" color="primary" startIcon={<Refresh />} onClick={this.resetError}>
                  {t('error-tryagain')}
                </Button>

                <Button
                  variant="contained"
                  onClick={this.toggleExpanded}
                  endIcon={
                    <ExpandMoreOutlined
                      sx={{
                        transform: this.state.expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s'
                      }}
                    />
                  }
                >
                  {this.state.expanded ? t('error-errordetails-hide') : t('error-errordetails-show')}
                </Button>
              </Stack>

              <Collapse in={this.state.expanded} sx={{ mt: 2 }}>
                <Paper variant="outlined" sx={{ p: 2, textAlign: 'left', bgcolor: 'background.default' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                    {t('error-technicaldetails-title')}
                  </Typography>

                  <Typography
                    variant="body2"
                    component="pre"
                    sx={{
                      color: 'error.main',
                      fontFamily: 'monospace',
                      whiteSpace: 'pre-wrap',
                      overflowX: 'auto'
                    }}
                  >
                    {this.state.errorTitle}: {this.state.errorDescription}
                  </Typography>

                  <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                    {t('error-technicaldetails-description', { username: yourNickname })}
                  </Typography>
                </Paper>
              </Collapse>
            </CardContent>
          </Card>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default withTranslation()(GlobalErrorBoundary);
