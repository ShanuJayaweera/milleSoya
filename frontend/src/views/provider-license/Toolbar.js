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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormLabel,
  Radio,
  Typography,
  FormControlLabel,
  Grid,
  makeStyles
} from '@material-ui/core';
import { KeyboardDatePicker } from '@material-ui/pickers';

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
  },
  formControl: {
    margin: theme.spacing(2),
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

  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusState, setStatusState] = useState('active');
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [context, setContext] = useContext(ApplicationContext);
  const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));
  const [isUnitsApplicableState, setIsUnitsApplicableState] = useState('applicable');

  const initialValues = {
    ProviderRef: '',
    ApplicationRef: '',
    LicenseTypeRef: '',
    StartDate: '',
    IsUnitsApplicable: '',
    NoOfUnits: '',
    Status: statusState ? 1 : 0
  };

  const validationSchema = Yup.object().shape({
    ProviderRef: Yup.number()
      .required('ProviderRef is required.'),
    ApplicationRef: Yup.number()
      .required('ApplicationRef is required.'),
    LicenseTypeRef: Yup.number()
      .required('LicenseTypeRef is required'),
    StartDate: Yup.date()
      .required('StartDate is required'),
    IsUnitsApplicable: Yup.number()
      .required('IsUnitsApplicable is required'),
    NoOfUnits: Yup.number()
      .required('NoOfUnits is required')
  });

  const handleSnackBar = (message, variant) => {
    enqueueSnackbar(`${message} `, { variant });
  };

  const handleDateChange = date => {
    setSelectedDate(date);
  };

  const handleIsUnitsApplicableState = (event) => {
    setIsUnitsApplicableState(event.target.value);
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
                    placeholder="Search Provider License"
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
                    Add New Provider License
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
              New Provider License Detail
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

                  <FormControl fullWidth>
                    <InputLabel htmlFor="grouped-select">Provider</InputLabel>
                    <Select defaultValue="" value={values.ProviderRef} id="grouped-select">
                      {/* {Object.keys(ElicenseType).map(type => (

                      ))} */}
                      <MenuItem>
                        providers list
                      </MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel htmlFor="grouped-select">Application</InputLabel>
                    <Select defaultValue="" value={values.Type} id="grouped-select">
                      <MenuItem>
                        Applications list
                      </MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel htmlFor="grouped-select">License Type</InputLabel>
                    <Select defaultValue="" value={values.Type} id="grouped-select">
                      <MenuItem>
                        License Types
                      </MenuItem>
                    </Select>
                  </FormControl>

                  <KeyboardDatePicker
                    disableToolbar
                    fullWidth
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label="Start Date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                  <FormControl component="fieldset" className={classes.formControl}>
                    <FormLabel component="legend">Status</FormLabel>
                    <RadioGroup id="status" aria-label="status" name="status" value={statusState} onChange={handleStatus}>
                      <FormControlLabel value="active" control={<Radio />} label="Active" />
                      <FormControlLabel value="inactive" control={<Radio />} label="InActive" />
                    </RadioGroup>
                  </FormControl>

                  <FormControl component="fieldset" className={classes.formControl}>
                    <FormLabel component="legend">IsUnitsApplicable</FormLabel>
                    <RadioGroup id="status" aria-label="status" name="status" value={isUnitsApplicableState} onChange={handleIsUnitsApplicableState}>
                      <FormControlLabel value="applicable" control={<Radio />} label="Applicable" />
                      <FormControlLabel value="notapplicable" control={<Radio />} label="Not Applicable" />
                    </RadioGroup>
                  </FormControl>

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
