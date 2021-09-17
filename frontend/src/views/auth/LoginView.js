/* eslint-disable no-alert */
/* eslint-disable quotes */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';

import {
  Box,
  Button,
  CircularProgress,
  Fade,
  Container,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Page from 'src/components/Page';
import { LoginUser, GetUserData } from 'src/Helpers/API';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  loader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  placeholder: {
    height: 40
  }
}));

const LoginView = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const loginResponse = (result) => {
    if (result.token) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('expiry', result.expiry);
    }
  };

  const loginReject = (result) => {
    if (result.status === 400 || result !== null) setShowAlert((prevState) => !prevState);
  };

  const handleClickLoading = () => {
    setLoading((prevLoading) => !prevLoading);
  };

  const login = (credentials) => {
    handleClickLoading();

    LoginUser(credentials, loginResponse, loginReject)
      .then(() => new Promise((resolve) => setTimeout(resolve, 1000)))
      .then(() => {
        navigate('/app/dashboard', { replace: true });
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <Page className={classes.root} title="Login">
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              username: '',
              password: ''
            }}
            validationSchema={Yup.object().shape({
              username: Yup.string()
                .max(255)
                .required('Username is required'),
              password: Yup.string()
                .max(255)
                .required('Password is required')
            })}
            onSubmit={async (values) => {
              login(values);
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values
            }) => (
              <form onSubmit={handleSubmit}>
                <Box mb={3}>
                  <Typography color="textPrimary" variant="h2">
                    Sign in
                  </Typography>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Sign in on the internal platform
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.username && errors.username)}
                  fullWidth
                  helperText={touched.username && errors.username}
                  label="Username"
                  margin="normal"
                  name="username"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.username}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Password"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.password}
                  variant="outlined"
                />
                <Box my={2}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Login
                  </Button>
                </Box>
                <Box className={classes.loader}>
                  <div className={classes.placeholder}>
                    <Fade
                      in={isLoading}
                      style={{
                        transitionDelay: isLoading ? '400ms' : '100ms'
                      }}
                      unmountOnExit
                    >
                      <CircularProgress />
                    </Fade>
                  </div>
                </Box>
                {showAlert ? (
                  <Box>
                    <Alert severity="error">
                      {' '}
                      Wrong Credentials, Try Again !
                    </Alert>
                  </Box>
                ) : null}
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

export default LoginView;
