// material-ui
import { Link, Typography, Stack } from '@mui/material';

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => (
  <Stack direction="row" justifyContent="space-between">
    <Typography variant="subtitle2" component={Link} href="https://real-lead.manzhos.cz" target="_blank" underline="hover">
      real-lead.manzhos.cz
    </Typography>
    <Typography variant="subtitle2" component={Link} href="https://manzhos.cz" target="_blank" underline="hover">
      &copy; manzhos.cz
    </Typography>
  </Stack>
);

export default AuthFooter;
