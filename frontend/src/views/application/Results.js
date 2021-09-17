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
  CardContent,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  TextField,
  Typography,
  FormControlLabel,
  RadioGroup,
  Radio,
  CircularProgress,
  Button,
  withStyles,
  makeStyles,
} from '@material-ui/core';
import getInitials from 'src/utils/getInitials';
import { GetAllApplicationsData, UpdateApplication, DeleteApplication } from 'src/Helpers/API';
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
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { isEmpty } from 'lodash';
import ApplicationContext from 'src/Helpers/appContext';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  },
  container: {
    maxHeight: 'inherit',
  },
}));

const StyledTableCell = withStyles({
  root: {
    fontWeight: 'bold',
    fontSize: 18
  }
})(TableCell);

const Results = ({ className, application, ...rest }) => {
  const classes = useStyles();

  const [selectedApplicationIds, setSelectedApplicationIds] = useState([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [applications, setApplicationsData] = useState([]);
  const [statusState, setStatusState] = useState('active');
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [applicationId, setApplicationId] = useState();
  const [isEdit, setIsEdit] = useState(true);
  const [editApp, setEditApp] = useState([]);
  const [openDeleteConfirm, setOpenDeleteConfirm] = React.useState(false);
  const [deleteRecordId, setDeleteRecordId] = useState();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [context, setContext] = useContext(ApplicationContext);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, applications.length - page * rowsPerPage);

  const initialValues = {
    Name: editApp.Name,
    Description: editApp.Description,
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

  const applicationResultResponse = (result) => {
    setApplicationsData(result.data);
  };

  const applicationResultReject = (result) => {
    handleSnackBar(result, 'error');
  };

  const applicationResultResponse2 = (result) => {
    handleSnackBar(result.success, 'success');
  };

  const applicationResultReject2 = (result) => {
    handleSnackBar(result, 'error');
  };

  const getApplicationResponse = () => {
    return GetAllApplicationsData(applicationResultResponse, applicationResultReject);
  };

  const handleSelectAll = (event) => {
    let newSelectedApplicationIds;

    if (event.target.checked) {
      newSelectedApplicationIds = applications.map((application) => application.Id);
    } else {
      newSelectedApplicationIds = [];
    }

    setSelectedApplicationIds(newSelectedApplicationIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedApplicationIds.indexOf(id);
    let newSelectedApplicationIds = [];

    if (selectedIndex === -1) {
      newSelectedApplicationIds = newSelectedApplicationIds.concat(
        selectedApplicationIds,
        id
      );
    } else if (selectedIndex === 0) {
      newSelectedApplicationIds = newSelectedApplicationIds.concat(
        selectedApplicationIds.slice(1)
      );
    } else if (selectedIndex === selectedApplicationIds.length - 1) {
      newSelectedApplicationIds = newSelectedApplicationIds.concat(
        selectedApplicationIds.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelectedApplicationIds = newSelectedApplicationIds.concat(
        selectedApplicationIds.slice(0, selectedIndex),
        selectedApplicationIds.slice(selectedIndex + 1)
      );
    }
    setSelectedApplicationIds(newSelectedApplicationIds);
  };

  const handleEdit = (id) => {
    setApplicationId(id);
    applications.map((app) => {
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

  const applicationResultResponse3 = (result) => {
    handleSnackBar(result.success, 'success');
    console.log(' result', result);
  };

  const applicationResultReject3 = (result) => {
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
    DeleteApplication(deleteRecordId, applicationResultResponse3, applicationResultReject3)
      .finally(() => {
        applications.map((app) => {
          if (app.Id === deleteRecordId) {
            applications.splice(applications.indexOf(app), 1);
          }
          return app;
        });
        setApplicationsData(applications);
        handleIsLoading();
        handleCloseDeletionConfirm();
      });
    setApplicationId(deleteRecordId);
  };

  const handleDelete = (id) => {
    setDeleteRecordId(id);
    setOpenDeleteConfirm(true);
  };

  const updateApplicationData = (values) => {
    handleIsLoading();
    UpdateApplication(values, applicationId, applicationResultResponse2, applicationResultReject2)
      .finally(() => {
        setApplicationsData(
          applications.map((app) => {
            if (app.Id === applicationId) {
              app.Name = values.Name;
              app.Description = values.Description;
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
    getApplicationResponse().then(() => {
      setContext(false);
      console.log(applications);
    });
  }, [context]);

  return (
    <div>
      {isEmpty(applications) ? (
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="center">
              <Typography variant="h4" gutterBottom>
                No applications found!
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Card className={clsx(classes.root, className)} {...rest}>
          <Box minWidth={1050}>
            <TableContainer className={classes.container}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedApplicationIds.length === applications.length}
                        color="primary"
                        indeterminate={
                      selectedApplicationIds.length > 0
                      && selectedApplicationIds.length < applications.length
                    }
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    <StyledTableCell>APPLICATION NAME</StyledTableCell>
                    <StyledTableCell>DESCRIPTION</StyledTableCell>
                    <StyledTableCell>STATUS</StyledTableCell>
                    <StyledTableCell>EDIT/DELETE</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>

                  {applications
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((application) => (
                      <TableRow
                        hover
                        key={application.Id}
                        selected={selectedApplicationIds.indexOf(application.Id) !== -1}
                      >
                        <TableCell padding="checkbox" style={{ width: '5%', maxWidth: '5%' }}>
                          <Checkbox
                            checked={selectedApplicationIds.indexOf(application.Id) !== -1}
                            onChange={(event) => handleSelectOne(event, application.Id)}
                            value="true"
                          />
                        </TableCell>
                        <TableCell style={{ width: '25%', maxWidth: '25%' }}>
                          <Box alignItems="center" display="flex">
                            <Avatar
                              className={classes.avatar}
                            >
                              {getInitials(application.Name)}
                            </Avatar>
                            <Typography color="textPrimary" variant="body1">
                              {application.Name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell style={{ width: '50%', maxWidth: '55%' }}>{application.Description}</TableCell>
                        <TableCell style={{ width: '10%', maxWidth: '10%' }}>{application.Status === 1 ? 'Active' : 'InActive'}</TableCell>
                        <TableCell style={{ width: '10%', maxWidth: '10%' }}>
                          <IconButton aria-label="edit" onClick={() => handleEdit(application.Id)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton aria-label="delete" onClick={() => handleDelete(application.Id)}>
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
            </TableContainer>
          </Box>
          <TablePagination
            component="div"
            count={applications.length}
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
            Edit Application
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
              updateApplicationData(values);
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
                    label="Application Name"
                    type="text"
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
                    multiline

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
  application: PropTypes.any
};

export default Results;
