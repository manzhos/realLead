const config = {
  // basename: only at build time to set, and Don't add '/' at end off BASENAME for breadcrumbs, also Don't put only '/' use blank('') instead,
  // like '/berry-material-react/react/default'
  basename: '',
  defaultPath: '/dashboard/default',
  fontFamily: `'Roboto', sans-serif`,
  borderRadius: 12,

  // dev
  API_URL: 'http://localhost:3300/api',
  URL: 'http://localhost:3000',
  
  //production
  // API_URL: 'http://',
  // URL:     'http://',
};

export default config;
