/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable no-alert */
import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  RadioGroup,
  Radio,
  Typography,
  FormControlLabel,
  Grid,
  makeStyles
} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Search as SearchIcon } from 'react-feather';
import { useSnackbar } from 'notistack';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { CreateNewProvider } from 'src/Helpers/API';
import ApplicationContext from 'src/Helpers/appContext';

const useStyles = makeStyles((theme) => ({
  root: {},
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  }
}));

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

const Toolbar = ({ className, ...rest }) => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusState, setStatusState] = useState('active');
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [context, setContext] = useContext(ApplicationContext);

  const initialValues = {
    Name: '',
    Address: '',
    PhoneNo: '',
    Email: '',
    ExternalRef: '',
    Status: statusState ? 1 : 0
  };

  const validationSchema = Yup.object().shape({
    Name: Yup.string()
      .max(100)
      .required('Provider Name is required.'),
    Address: Yup.string()
      .max(100)
      .required('Address is required.'),
    PhoneNo: Yup.string()
      .max(15, 'Must be 15 numbers long')
      .required('Phone Number is required.'),
    Email: Yup.string()
      .max(100)
      .required('Email is required'),
    ExternalRef: Yup.string()
      .max(100)
      .required('Reference is required')
  });

  const handleSnackBar = (message, variant) => {
    enqueueSnackbar(`${message} `, { variant });
  };

  const handleIsLoading = () => {
    setIsLoading((prev) => !prev);
  };

  const handleStatus = (event) => {
    setStatusState(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const applicationResponse = (result) => {
    handleSnackBar(result.success, 'success');
    setContext(true);
  };

  const applicationReject = (result) => {
    handleSnackBar(result, 'error');
  };

  const createProviderRecord = (values) => {
    handleIsLoading();
    CreateNewProvider(values, applicationResponse, applicationReject)
      .finally(() => { handleIsLoading(); handleClose(); });
  };

  return (
    <div className={clsx(classes.root, className)} {...rest}>

      <Box mt={3}>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={3}>
                <Box maxWidth={500}>
                  <TextField
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SvgIcon fontSize="small" color="action">
                            <SearchIcon />
                          </SvgIcon>
                        </InputAdornment>
                      )
                    }}
                    placeholder="Search Provider"
                    variant="outlined"
                  />
                </Box>
              </Grid>
              <Grid item xs={6} />
              <Grid item xs={3}>
                <Box display="flex" justifyContent="flex-end">
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => {
                      setOpen(true);
                    }}
                  >
                    Add New Provider
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle>
            <Typography variant="h3" gutterBottom>
              New Provider Detail
            </Typography>
          </DialogTitle>

          <DialogContent>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={async (values) => {
                if (statusState === 'active') {
                  values.Status = 1;
                }
                if (statusState === 'inactive') {
                  values.Status = 0;
                }
                createProviderRecord(values);
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
                  <TextField
                    margin="dense"
                    error={Boolean(touched.Name && errors.Name)}
                    helperText={touched.Name && errors.Name}
                    id="Name"
                    name="Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Provider Name"
                    value={values.Name}
                    type="text"
                    fullWidth
                  />
                  <TextField
                    error={Boolean(touched.Address && errors.Address)}
                    helperText={touched.Address && errors.Address}
                    margin="dense"
                    id="Address"
                    name="Address"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Address"
                    value={values.Address}
                    type="text"
                    fullWidth
                  />
                  <TextField
                    error={Boolean(touched.PhoneNo && errors.PhoneNo)}
                    helperText={touched.PhoneNo && errors.PhoneNo}
                    margin="dense"
                    id="PhoneNo"
                    name="PhoneNo"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Phone number"
                    value={values.PhoneNo}
                    type="text"
                    fullWidth
                  />
                  <TextField
                    error={Boolean(touched.Email && errors.Email)}
                    helperText={touched.Email && errors.Email}
                    margin="dense"
                    id="Email"
                    name="Email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Email"
                    value={values.Email}
                    type="text"
                    fullWidth
                  />
                  <TextField
                    error={Boolean(touched.ExternalRef && errors.ExternalRef)}
                    helperText={touched.ExternalRef && errors.ExternalRef}
                    margin="dense"
                    id="ExternalRef"
                    name="ExternalRef"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="ExternalRef"
                    value={values.ExternalRef}
                    type="text"
                    fullWidth
                  />
                  <RadioGroup aria-label="status" name="status" value={statusState} onChange={handleStatus}>
                    <FormControlLabel value="active" control={<Radio />} label="Active" />
                    <FormControlLabel value="inactive" control={<Radio />} label="InActive" />
                  </RadioGroup>

                  <DialogActions>
                    <Button onClick={handleClose} color="primary">
                      Cancel
                    </Button>
                    <Button
                      disabled={isSubmitting}
                      type="submit"
                      variant="contained"
                      color="primary"
                    >
                      Create
                    </Button>
                  </DialogActions>
                </form>
              )}
            </Formik>
          </DialogContent>
        </Dialog>
      </Box>
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string
};

export default Toolbar;
