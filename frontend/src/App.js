import 'react-perfect-scrollbar/dist/css/styles.css';
import React, { useState } from 'react';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import './mixins/chartjs';
import theme from 'src/theme';
import routes from 'src/routes';
import { SnackbarProvider } from 'notistack';
import ApplicationContext from 'src/Helpers/appContext';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

import DateFnsUtils from '@date-io/date-fns';

const App = () => {
  let authenticated = false;
  if (localStorage.getItem('token')) {
    authenticated = true;
  }
  const isAuth = authenticated;
  const routing = useRoutes(routes(isAuth));
  const [context, setContext] = useState(false);

  return (

    <ApplicationContext.Provider value={[context, setContext]}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          <SnackbarProvider maxSnack={3}>
            {routing}
          </SnackbarProvider>
        </ThemeProvider>
      </MuiPickersUtilsProvider>
    </ApplicationContext.Provider>
  );
};

export default App;
