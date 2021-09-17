import React, { useContext, useState } from 'react';
import { Container, Box, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';

import Results from './Results';
import Toolbar from './Toolbar';
import ApplicationContext from '../../Helpers/appContext';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const ApplicationView = () => {
  const classes = useStyles();
  const [context] = useContext(ApplicationContext);
  return (
    <Page className={classes.root} title="Application">
      <Container maxWidth={false}>
        <Toolbar />
        <Box mt={3}>
          <Results application={context} />
        </Box>
      </Container>
    </Page>
  );
};

export default ApplicationView;
