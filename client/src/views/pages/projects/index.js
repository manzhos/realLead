import { useContext, useState, useEffect, useCallback } from 'react'

// material-ui
import { 
  Container,
  Box,
  Grid,
  TextField,
  Card,
  Stack,
  Button,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Checkbox,
  Typography,
  Modal
} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import TableBlock from 'ui-component/table/TableBlock';
import { AuthContext } from 'context/AuthContext';
import { useHttp } from 'hooks/http.hook'
import config from 'config.js'

// ==============================|| PROJECT PAGE ||============================== //

const TABLE_HEAD = [
  { id: 'name',     label: 'Name',      alignRight: false },
  { id: 'created',  label: 'Created',   alignRight: false },
  { id: 'click',    label: 'CLICK\'s',  alignRight: false },
];

const TABLE_SUB_HEAD = [
  { id: 'name',      label: 'Name',             alignRight: false },
  { id: 'linkFrom',  label: 'Link for posting', alignRight: false, width: '320px', },
  { id: 'linkTo',    label: 'Target link',      alignRight: false },
  { id: 'click',     label: 'CLICK\'s',         alignRight: false },
];


const Projects = () => {
  const [projectName, setProjectName] = useState('')
  const [projectList, setProjectList] = useState([])
  const [newProjectOpen, setNewProjectOpen] = useState(false)
  
  const auth = useContext(AuthContext)
  const API_URL = config.API_URL
  const {loading, request, error, clearError} = useHttp()
  
  const getProjects = useCallback( async () => {
    try {
      const res = await request(`${API_URL}/project`, 'GET', null,
        {Authorization: `Bearer ${auth.token}`}
      )
      // console.log('projects:', res.projects)
      setProjectList(res.projects)
    } catch(error) { console.log('Error:', error)}
  })
  useEffect(()=>{ getProjects() }, [])

  // fill test data
  // useEffect(()=>{
  //   setProjectList([
  //       { id: 0, name: 'October 2023',  date:'23/11', email:'m@mail.io' },
  //       { id: 1, name: 'November 2023', date:'23/11', email:'m@mail.io' },
  //   ])
  // }, [])
  // useEffect(()=>{
  //   setChannelList([
  //       { id: 0, name: 'facebook',  linkFrom:'fb',  linkTo:'man' },
  //       { id: 1, name: 'instagram', linkFrom:'ins', linkTo:'man' },
  //   ])
  // }, [])
  
  const handleNewProjectOpen =  () => setNewProjectOpen(true)
  const handleNewProjectClose = () => setNewProjectOpen(false)

  const handleChange = (data) => { setProjectName(data) }

  const createProject = async(event) => {
    event.preventDefault()
    try {
      const response = await request(`${API_URL}/project`, 'POST', 
        { name: projectName },
        { Authorization: `Bearer ${auth.token}` }
      )
      getProjects()
    } catch(error) { console.log('Error:', error)}
    setNewProjectOpen(false)
  }

  const onTableChange = () => { getProjects() }

  return(
    <MainCard title="Projects" sx={{ height:"99%", mt:2, }}>
      <TableBlock parent='project' tableHead={TABLE_HEAD} itemList={projectList} subItem={{ parent:'channel', tableHead:TABLE_SUB_HEAD }} handleUpdate={onTableChange} />
      <Button color="secondary" variant="contained" sx={{ mt:2 }} onClick={handleNewProjectOpen}>
        Add Project
      </Button>
      {/* add new project */}
      <Modal
        open={newProjectOpen}
        onClose={handleNewProjectClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Container component="main" maxWidth="md" disableGutters>
          <Card sx={{ margin: '10vh 5vw', padding:'30px 50px' }}>
            <Box
              component="form" 
              noValidate 
              onSubmit={createProject}
              sx={{
                mt: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <TextField
                    name="projectName"
                    fullWidth
                    required
                    id="projectName"
                    value={projectName}
                    label="Project Name"
                    autoFocus
                    onChange = {(event) => {handleChange(event.target.value)}}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Create project
              </Button>
            </Box>
          </Card>
        </Container>
      </Modal>
    </MainCard>
  )
}

export default Projects
