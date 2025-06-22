import { Component } from 'react';
import { withTranslation } from 'react-i18next';
import styles from './MinimalErrorBoundary.module.css';

const yourNickname = import.meta.env.VITE_YOUR_NICKNAME || '@me';

class MinimalErrorBoundary extends Component {
  state = {
    hasError: false,
    errorTitle: '',
    errorDescription: '',
    userLanguage: 'en'
  };

  static getDerivedStateFromError(error) {
    if (error.title || error.description) {
      return {
        hasError: true,
        errorTitle: 'An error occurred',
        errorDescription: error.description || error.message || 'Unexpected error! Try again later.'
      };
    }
    return {
      hasError: true,
      errorTitle: 'An error occurred',
      errorDescription: error.message || 'Unexpected error! Try again later.'
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
    this.setState({ hasError: false, errorTitle: '', errorDescription: '', languageSet: false });
    window.location.reload();
  };

  render() {
    const { t } = this.props;

    if (this.state.hasError) {
      return (
        <div className={styles.errorBoundaryRoot}>
          <div className={styles.errorBoundaryCard}>
            <h1 className={styles.errorBoundaryTitle}>
              {t('error-title')}
            </h1>

            <hr className={styles.errorBoundaryHr} />

            <h2 className={styles.errorBoundarySubtitle}>
              {t('error-whathappened-title')}
            </h2>
            <p className={styles.errorBoundaryParagraph}>
              {t('error-whathappened-description')}
            </p>

            <h2 className={styles.errorBoundarySubtitle}>
              {t('error-whattodo-title')}
            </h2>
            <p className={styles.errorBoundaryParagraphLast}>
              {t('error-whattodo-description', { username: yourNickname })}
            </p>

            <hr className={styles.errorBoundaryHr} />
            
            <button 
              onClick={this.resetError}
              className={styles.reloadButton}
            >
              {t('error-tryagain')}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default withTranslation()(MinimalErrorBoundary);
