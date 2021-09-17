/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable max-len */
/* eslint-disable no-debugger */
import React, { useState, useEffect, useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  FormControlLabel,
  RadioGroup,
  Radio,
  CircularProgress,
  TableFooter,
  Button,
  makeStyles,
  withStyles
} from '@material-ui/core';
import getInitials from 'src/utils/getInitials';
import { GetAllProvidersData, UpdateProvider, DeleteProvider } from 'src/Helpers/API';
import { useSnackbar } from 'notistack';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { isEmpty } from 'lodash';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import ApplicationContext from 'src/Helpers/appContext';

const useStyles = makeStyles((theme) => ({
  root: { },
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const StyledTableCell = withStyles({
  root: {
    fontWeight: 'bolder',
    fontSize: 18,
    textTransform: 'capitalize'
  }
})(TableCell);

const Results = ({ className, ...rest }) => {
  const classes = useStyles();
  const [selectedProviderIds, setSelectedProviderIds] = useState([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [Providers, setProvidersData] = useState([]);
  const [statusState, setStatusState] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ProviderId, setProviderId] = useState();
  const [isEdit, setIsEdit] = useState(true);
  const [editApp, setEditApp] = useState([]);
  // const [tableUpdated, settableUpdated] = useState(false);

  const theme = useTheme();
  const [openDeleteConfirm, setOpenDeleteConfirm] = React.useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [deleteRecordId, setDeleteRecordId] = useState();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [context, setContext] = useContext(ApplicationContext);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, Providers.length - page * rowsPerPage);

  const initialValues = {
    Name: editApp.Name,
    Address: editApp.Address,
    PhoneNo: editApp.PhoneNo,
    Email: editApp.Email,
    ExternalRef: editApp.ExternalRef,
    Status: editApp.Status ? 'active' : 'inactive'
  };

  const validationSchema = Yup.object().shape({
    Name: Yup.string()
      .max(100),
    Description: Yup.string()
      .max(255),
  });

  const handleSnackBar = (message, variant) => {
    enqueueSnackbar(`${message}`, { variant });
  };

  const ProviderResultResponse = (result) => {
    setProvidersData(result.data);
  };

  const ProviderResultReject = (result) => {
    console.log(result);
    handleSnackBar(result, 'error');
  };

  const ProviderResultResponse2 = (result) => {
    handleSnackBar(result.success, 'success');
    console.log(' result', result);
  };

  const ProviderResultReject2 = (result) => {
    console.log(result);
    handleSnackBar(result, 'error');
  };

  const getProviderResponse = () => {
    return GetAllProvidersData(ProviderResultResponse, ProviderResultReject);
  };

  const handleSelectAll = (event) => {
    let newSelectedProviderIds;

    if (event.target.checked) {
      newSelectedProviderIds = Providers.map((Provider) => Provider.Id);
    } else {
      newSelectedProviderIds = [];
    }

    setSelectedProviderIds(newSelectedProviderIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedProviderIds.indexOf(id);
    let newSelectedProviderIds = [];

    if (selectedIndex === -1) {
      newSelectedProviderIds = newSelectedProviderIds.concat(
        selectedProviderIds,
        id
      );
    } else if (selectedIndex === 0) {
      newSelectedProviderIds = newSelectedProviderIds.concat(
        selectedProviderIds.slice(1)
      );
    } else if (selectedIndex === selectedProviderIds.length - 1) {
      newSelectedProviderIds = newSelectedProviderIds.concat(
        selectedProviderIds.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelectedProviderIds = newSelectedProviderIds.concat(
        selectedProviderIds.slice(0, selectedIndex),
        selectedProviderIds.slice(selectedIndex + 1)
      );
    }
    setSelectedProviderIds(newSelectedProviderIds);
  };

  const handleEdit = (id) => {
    setProviderId(id);
    Providers.map((app) => {
      if (app.Id === id) {
        setEditApp(app);
        if (app.Status) {
          setStatusState('active');
        } else {
          setStatusState('inactive');
        }
      }
    });
    setIsEdit((prev) => !prev);
    setOpen((prev) => !prev);
  };

  const ProviderResultResponse3 = (result) => {
    handleSnackBar(result.success, 'success');
    console.log(' result', result);
  };

  const ProviderResultReject3 = (result) => {
    console.log(result);
    handleSnackBar(result, 'error');
  };

  const handleStatus = (event) => {
    setStatusState(event.target.value);
  };

  const handleIsLoading = () => {
    setIsLoading((prev) => !prev);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseDeletionConfirm = () => {
    setOpenDeleteConfirm(false);
  };

  const handleClickOpenDeletionConfirm = () => {
    setOpenDeleteConfirm(true);
    handleIsLoading();
    DeleteProvider(deleteRecordId, ProviderResultResponse3, ProviderResultReject3)
      .finally(() => {
        Providers.map((app) => {
          if (app.Id === deleteRecordId) {
            Providers.splice(Providers.indexOf(app), 1);
          }
          return app;
        });
        setProvidersData(Providers);
        handleIsLoading();
        handleCloseDeletionConfirm();
      });
    setProviderId(deleteRecordId);
  };

  const handleDelete = (id) => {
    setDeleteRecordId(id);
    setOpenDeleteConfirm(true);
  };

  const updateProviderData = (values) => {
    handleIsLoading();
    UpdateProvider(values, ProviderId, ProviderResultResponse2, ProviderResultReject2)
      .finally(() => {
        setProvidersData(
          Providers.map((app) => {
            if (app.Id === ProviderId) {
              app.Name = values.Name;
              app.Address = values.Address;
              app.PhoneNo = values.PhoneNo;
              app.Email = values.Email;
              app.ExternalRef = values.ExternalRef;
              app.Status = values.Status;
            }
            return app;
          })
        );
        handleIsLoading();
        handleClose();
      });
  };

  useEffect(() => {
    getProviderResponse().then(() => { setContext(false); });
  }, [context]);

  return (
    <div>
      {isEmpty(Providers) ? (
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="center">
              <Typography variant="h4" gutterBottom>
                No providers found!
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Card className={clsx(classes.root, className)} {...rest}>
          <PerfectScrollbar>
            <Box minWidth={1050}>
              <Table>
                <TableHead className={classes.header}>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedProviderIds.length === Providers.length}
                        color="primary"
                        indeterminate={
                      selectedProviderIds.length > 0
                      && selectedProviderIds.length < Providers.length
                    }
                        onChange={handleSelectAll}
                      />
                    </TableCell>

                    <StyledTableCell>PROVIDER</StyledTableCell>
                    <StyledTableCell>APPLICATION</StyledTableCell>
                    <StyledTableCell>LICENSE TYPE</StyledTableCell>
                    <StyledTableCell>UNIQUE-CODE</StyledTableCell>
                    <StyledTableCell>IS APPLICABLE</StyledTableCell>
                    <StyledTableCell>NO OF UNITS</StyledTableCell>
                    <StyledTableCell>STATUS</StyledTableCell>
                    <StyledTableCell>EDIT / DELETE</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Providers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((provider) => (
                      <TableRow
                        hover
                        key={provider.Id}
                        selected={selectedProviderIds.indexOf(provider.Id) !== -1}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedProviderIds.indexOf(provider.Id) !== -1}
                            onChange={(event) => handleSelectOne(event, provider.Id)}
                            value="true"
                          />
                        </TableCell>
                        <TableCell>
                          <Box alignItems="center" display="flex">
                            <Avatar
                              className={classes.avatar}
                            >
                              {getInitials(provider.Name)}
                            </Avatar>
                            <Typography color="textPrimary" variant="body1">
                              {provider.Name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{provider.ExternalRef}</TableCell>
                        <TableCell>{provider.Address}</TableCell>
                        <TableCell>{provider.PhoneNo}</TableCell>
                        <TableCell>{provider.Email}</TableCell>

                        <TableCell>{provider.Status === 1 ? 'Active' : 'InActive'}</TableCell>
                        <TableCell>
                          <IconButton aria-label="edit" onClick={() => handleEdit(provider.Id)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton aria-label="delete" onClick={() => handleDelete(provider.Id)}>
                            <DeleteIcon />
                          </IconButton>

                        </TableCell>
                      </TableRow>
                    ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </PerfectScrollbar>
          <TablePagination
            component="div"
            count={Providers.length}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Card>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          <Typography variant="h3" gutterBottom>
            Edit Provider Detail
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
              updateProviderData(values);
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
      <Dialog
        fullScreen={fullScreen}
        open={openDeleteConfirm}
        onClose={handleCloseDeletionConfirm}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">Confirm Record deletion?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are You sure you want to delete this record ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCloseDeletionConfirm} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClickOpenDeletionConfirm} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

Results.propTypes = {
  className: PropTypes.string
};

export default Results;
