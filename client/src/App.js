import { useSelector } from 'react-redux';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';

import { AuthContext }  from './context/AuthContext'
import { useAuth }      from './hooks/auth.hook'

// routing
import Routes from 'routes';

// defaultTheme
import themes from 'themes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';

// ==============================|| APP ||============================== //

const App = () => {
  const customization = useSelector((state) => state.customization);

  const {token, login, logout, user, userId} = useAuth();
  const isAuthenticated = !!token;
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <AuthContext.Provider value={{
          token, login, logout, user, userId, isAuthenticated
        }}>
          <CssBaseline />
          <NavigationScroll>
            <Routes isAuthenticated = {isAuthenticated} />
          </NavigationScroll>
        </AuthContext.Provider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
