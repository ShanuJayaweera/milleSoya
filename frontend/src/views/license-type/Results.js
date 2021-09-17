/* eslint-disable no-alert */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable max-len */
/* eslint-disable no-debugger */
import React, {
  useState, useEffect, useContext
} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Avatar,
  Box,
  Card,
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
  Button,
  makeStyles,
  withStyles,
  CardContent
} from '@material-ui/core';
import getInitials from 'src/utils/getInitials';
import { GetAllLicenseTypeData, UpdateLicenseType, DeleteLicenseType } from 'src/Helpers/API';
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
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const StyledTableCell = withStyles({
  root: {
    fontWeight: 'bold',
    fontSize: 18
  }
})(TableCell);

const Results = ({ className, ...rest }) => {
  const classes = useStyles();
  const [selectedLicenseTypeIds, setSelectedLicenseTypeIds] = useState([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [LicenseTypes, setLicenseTypesData] = useState([]);
  const [statusState, setStatusState] = useState('active');
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [LicenseTypeId, setLicenseTypeId] = useState();
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

  const initialValues = {
    Name: editApp.Name,
    Description: editApp.Description,
    Type: editApp.Type,
    Status: editApp.Status ? 'active' : 'inactive'
  };

  const validationSchema = Yup.object().shape({
    Name: Yup.string()
      .max(100),
    Type: Yup.string()
      .max(100),
    Description: Yup.string()
      .max(255),
  });

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, LicenseTypes.length - page * rowsPerPage);

  const handleSnackBar = (message, variant) => {
    enqueueSnackbar(`${message}`, { variant });
  };

  const LicenseTypeResultResponse = (result) => {
    console.log(result.data);
    setLicenseTypesData(result.data);
    console.log(LicenseTypes);
    console.log(isEmpty(result.data));
  };

  const LicenseTypeResultReject = (result) => {
    console.log(result);
    handleSnackBar(result, 'error');
  };

  const LicenseTypeResultResponse2 = (result) => {
    handleSnackBar(result.success, 'success');
    console.log(' result', result);
  };

  const LicenseTypeResultReject2 = (result) => {
    console.log(result);
    handleSnackBar(result, 'error');
  };

  const getLicenseTypeResponse = () => {
    return GetAllLicenseTypeData(LicenseTypeResultResponse, LicenseTypeResultReject);
  };

  const handleSelectAll = (event) => {
    let newSelectedLicenseTypeIds;

    if (event.target.checked) {
      newSelectedLicenseTypeIds = LicenseTypes.map((LicenseType) => LicenseType.Id);
    } else {
      newSelectedLicenseTypeIds = [];
    }

    setSelectedLicenseTypeIds(newSelectedLicenseTypeIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedLicenseTypeIds.indexOf(id);
    let newSelectedLicenseTypeIds = [];

    if (selectedIndex === -1) {
      newSelectedLicenseTypeIds = newSelectedLicenseTypeIds.concat(
        selectedLicenseTypeIds,
        id
      );
    } else if (selectedIndex === 0) {
      newSelectedLicenseTypeIds = newSelectedLicenseTypeIds.concat(
        selectedLicenseTypeIds.slice(1)
      );
    } else if (selectedIndex === selectedLicenseTypeIds.length - 1) {
      newSelectedLicenseTypeIds = newSelectedLicenseTypeIds.concat(
        selectedLicenseTypeIds.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelectedLicenseTypeIds = newSelectedLicenseTypeIds.concat(
        selectedLicenseTypeIds.slice(0, selectedIndex),
        selectedLicenseTypeIds.slice(selectedIndex + 1)
      );
    }
    setSelectedLicenseTypeIds(newSelectedLicenseTypeIds);
  };

  const handleEdit = (id) => {
    setLicenseTypeId(id);
    LicenseTypes.map((app) => {
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

  const LicenseTypeResultResponse3 = (result) => {
    handleSnackBar(result.success, 'success');
    console.log(' result', result);
  };

  const LicenseTypeResultReject3 = (result) => {
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
    DeleteLicenseType(deleteRecordId, LicenseTypeResultResponse3, LicenseTypeResultReject3)
      .finally(() => {
        LicenseTypes.map((app) => {
          if (app.Id === deleteRecordId) {
            LicenseTypes.splice(LicenseTypes.indexOf(app), 1);
          }
          return app;
        });
        setLicenseTypesData(LicenseTypes);
        handleIsLoading();
        handleCloseDeletionConfirm();
      });
    setLicenseTypeId(deleteRecordId);
  };

  const handleDelete = (id) => {
    setDeleteRecordId(id);
    setOpenDeleteConfirm(true);
    console.log('init data empty', LicenseTypes.length);
  };

  const updateLicenseTypeData = (values) => {
    handleIsLoading();
    UpdateLicenseType(values, LicenseTypeId, LicenseTypeResultResponse2, LicenseTypeResultReject2)
      .finally(() => {
        setLicenseTypesData(
          LicenseTypes.map((app) => {
            if (app.Id === LicenseTypeId) {
              app.Name = values.Name;
              app.Description = values.Description;
              app.Type = values.Type;
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
    getLicenseTypeResponse().then(() => {
      setContext(false);
    });
  }, [context]);

  return (
    <div>
      {isEmpty(LicenseTypes) ? (
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="center">
              <Typography variant="h4" gutterBottom>
                No license type found!
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Card className={clsx(classes.root, className)} {...rest}>
          <PerfectScrollbar>
            <Box minWidth={1050}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedLicenseTypeIds.length === LicenseTypes.length}
                        color="primary"
                        indeterminate={
                        selectedLicenseTypeIds.length > 0
                        && selectedLicenseTypeIds.length < LicenseTypes.length
                      }
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    <StyledTableCell>LICENSE TYPE NAME</StyledTableCell>
                    <StyledTableCell>DESCRIPTION</StyledTableCell>
                    <StyledTableCell>TYPE</StyledTableCell>
                    <StyledTableCell>STATUS</StyledTableCell>
                    <StyledTableCell>EDIT / DELETE</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>

                  {LicenseTypes
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((LicenseType) => (
                      <TableRow
                        hover
                        key={LicenseType.Id}
                        selected={selectedLicenseTypeIds.indexOf(LicenseType.Id) !== -1}
                      >
                        <TableCell padding="checkbox" style={{ width: '5%', maxWidth: '5%' }}>
                          <Checkbox
                            checked={selectedLicenseTypeIds.indexOf(LicenseType.Id) !== -1}
                            onChange={(event) => handleSelectOne(event, LicenseType.Id)}
                            value="true"
                          />
                        </TableCell>
                        <TableCell style={{ width: '25%', maxWidth: '15%' }}>
                          <Box alignItems="center" display="flex">
                            <Avatar
                              className={classes.avatar}
                            >
                              {getInitials(LicenseType.Name)}
                            </Avatar>
                            <Typography color="textPrimary" variant="body1">
                              {LicenseType.Name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell style={{ width: '40%', maxWidth: '50%' }}>{LicenseType.Description}</TableCell>
                        <TableCell style={{ width: '10%', maxWidth: '10%' }}>{LicenseType.Type}</TableCell>
                        <TableCell style={{ width: '10%', maxWidth: '10%' }}>{LicenseType.Status === 1 ? 'Active' : 'InActive'}</TableCell>
                        <TableCell style={{ width: '10%', maxWidth: '10%' }}>
                          <IconButton aria-label="edit" onClick={() => handleEdit(LicenseType.Id)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton aria-label="delete" onClick={() => handleDelete(LicenseType.Id)}>
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
            count={LicenseTypes.length}
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
        disableBackdropClick
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          <Typography variant="h3" gutterBottom>
            Edit License Type
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
              updateLicenseTypeData(values);
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
            }) => {
              return (
                <form onSubmit={handleSubmit}>
                  <TextField
                    error={Boolean(touched.Name && errors.Name)}
                    helperText={touched.Name && errors.Name}
                    margin="dense"
                    id="Name"
                    name="Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.Name}
                    label="LicenseType Name"
                    type="text"
                    fullWidth
                  />
                  <TextField
                    error={Boolean(touched.Type && errors.Type)}
                    helperText={touched.Type && errors.Type}
                    margin="dense"
                    id="Type"
                    name="Type"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="License Type"
                    type="number"
                    value={values.Type}
                    fullWidth
                  />
                  <TextField
                    error={Boolean(touched.Description && errors.Description)}
                    helperText={touched.Description && errors.Description}
                    margin="dense"
                    id="Description"
                    name="Description"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Description"
                    type="text"
                    value={values.Description}
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
              );
            }}
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
  className: PropTypes.string,
};

export default Results;
