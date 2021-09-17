/* eslint-disable no-undef */
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
  CircularProgress,
  RadioGroup,
  Radio,
  Typography,
  FormControlLabel,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormLabel,
  ListSubheader,
  Grid,
  makeStyles
} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Search as SearchIcon } from 'react-feather';

import { Formik } from 'formik';
import * as Yup from 'yup';

import { CreateNewLicenseType } from 'src/Helpers/API';
import { useSnackbar } from 'notistack';
import { mapValues } from 'lodash';
import ApplicationContext from 'src/Helpers/appContext';

import ElicenseType from './enums';

const useStyles = makeStyles((theme) => ({
  root: {},
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  },
  formControl: {
    margin: theme.spacing(3),
  },
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
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusState, setStatusState] = useState('active');
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [context, setContext] = useContext(ApplicationContext);
  const [paymentTermsStatus, setPaymentTerms] = useState('free');

  const initialValues = {
    Name: '',
    Description: '',
    Type: '',
    CycleInMonths: 0,
    PaymentTerms: 0,
    Status: statusState ? 1 : 0
  };
  console.log('init value', initialValues);
  const validationSchema = Yup.object().shape({
    Name: Yup.string()
      .max(100)
      .required('LicenseType Name is required.'),
    Type: Yup.string()
      .required('Type is required.'),
    Description: Yup.string()
      .max(255)
      .required('Description is required.'),
    PaymentTerms: Yup.string().required('Payment Terms is required.')
  });

  const handleSnackBar = (message, variant) => {
    enqueueSnackbar(`${message} `, { variant });
  };

  const handleStatus = (event) => {
    setStatusState(event.target.value);
  };

  const handlePaymentTermsStatus = (event) => {
    paymentTermsStatus(event.target.value);
  };

  const handleIsLoading = () => {
    setIsLoading((prev) => !prev);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const LicenseTypeResponse = (result) => {
    handleSnackBar(result.success, 'success');
    setContext(true);
  };

  const LicenseTypeReject = (result) => {
    handleSnackBar(result, 'error');
    console.log('reject', result);
  };

  const createLicenseTypeRecord = (values) => {
    console.log('init value at createLicenseTypeRecord', initialValues);
    console.log('form value at createLicenseTypeRecord', values);
    handleIsLoading();
    CreateNewLicenseType(values, LicenseTypeResponse, LicenseTypeReject)
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
                    placeholder="Search LicenseType"
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
                    Add New License Type
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Dialog
          open={open}
          onClose={handleClose}
          disableBackdropClick
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle>
            <Typography variant="h3" gutterBottom>
              New LicenseType
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
                createLicenseTypeRecord(values);
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
                    error={Boolean(touched.Name && errors.Name)}
                    helperText={touched.Name && errors.Name}
                    margin="dense"
                    id="Name"
                    name="Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="LicenseType Name"
                    value={values.Name}
                    type="text"
                    fullWidth
                  />
                  <FormControl fullWidth>
                    <InputLabel htmlFor="grouped-select">Grouping</InputLabel>
                    <Select defaultValue="" value={values.Type} id="grouped-select">
                      {Object.keys(ElicenseType).map(type => (
                        <MenuItem key={ElicenseType[type].id} value={ElicenseType[type].id}>
                          { ElicenseType[type].name }
                        </MenuItem>
                      ))}

                    </Select>
                  </FormControl>
                  <TextField
                    error={Boolean(touched.Description && errors.Description)}
                    helperText={touched.Description && errors.Description}
                    margin="dense"
                    id="Description"
                    name="Description"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Description"
                    value={values.Description}
                    type="text"
                    fullWidth
                    multiline
                  />

                  <FormControl component="fieldset" className={classes.formControl}>
                    <FormLabel component="legend">Payment Terms</FormLabel>
                    <RadioGroup aria-label="payment-terms" name="payment-terms" value={paymentTermsStatus} onChange={handleStatus}>
                      <FormControlLabel value="free" control={<Radio />} label="Free" />
                      <FormControlLabel value="paid" control={<Radio />} label="Paid" />
                    </RadioGroup>
                  </FormControl>

                  <FormControl component="fieldset" className={classes.formControl}>
                    <FormLabel component="legend">Status</FormLabel>
                    <RadioGroup aria-label="status" name="status" value={statusState} onChange={handleStatus}>
                      <FormControlLabel value="active" control={<Radio />} label="Active" />
                      <FormControlLabel value="inactive" control={<Radio />} label="InActive" />
                    </RadioGroup>
                  </FormControl>

                  <TextField
                    error={Boolean(touched.CycleInMonths && errors.CycleInMonths)}
                    helperText={touched.CycleInMonths && errors.CycleInMonths}
                    margin="dense"
                    id="CycleInMonths"
                    name="CycleInMonths"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Billing Cycle "
                    value={values.CycleInMonths}
                    type="number"
                    fullWidth
                    multiline
                  />

                  <DialogActions>

                    <Button onClick={handleClose} color="primary">
                      Cancel
                    </Button>
                    {
                      isLoading
                        ? (<CircularProgress />)
                        : (
                          <Button
                            disabled={isSubmitting}
                            type="submit"
                            variant="contained"
                            color="primary"
                          >
                            Create
                          </Button>
                        )
                    }
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
