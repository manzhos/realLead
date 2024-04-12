import logo from 'assets/images/logo_rl.svg';

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
  // const theme = useTheme();

  return (
    <img src={logo} alt="Real Lead" style={{ width:"48%", margin:"15px auto 0" }} />
    /** ^^^ or put svg here ^^^ **/
  );
};

export default Logo;
