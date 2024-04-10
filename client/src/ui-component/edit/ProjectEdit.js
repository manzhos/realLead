import { useState, useEffect, useContext } from 'react'

import {
  Card,
  Box,
  Grid,
  Modal,
  Container,
  Typography,
  TextField,
  Button
} from '@mui/material';

import { AuthContext } from 'context/AuthContext';
import { useHttp } from 'hooks/http.hook'
import config from 'config.js'

// ----------------------------------------------------------------------------------

const ProjectEdit = ({ editData = { open:false }, onEdit }) => {
  // console.log('editData:', editData)
  const auth = useContext(AuthContext)
  const API_URL = config.API_URL
  const {loading, request, error, clearError} = useHttp()

  const [projectName, setProjectName] = useState(editData.item?.name)
  const [open, setOpen] = useState(editData.open)

  useEffect(()=>{
    setOpen(editData.open)
    setProjectName(editData.item?.name)
  }, [editData])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if(!editData.item._id) return
    try {
      const res = await request(`${API_URL}/project/${editData.item._id}`, 'PATCH', 
        {name: projectName},
        {Authorization: `Bearer ${auth.token}`}
      )
      // console.log('res:', res)
    } catch(error){ console.log('Error:', error) }
    onEdit(true)
  }

  const handleClose = () => {setOpen(false)}

  return (
    <Modal
      open={open}
      onClose={() => handleClose()}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Container component="main" maxWidth="md" disableGutters>
        <Card sx={{ marginTop:'10vh', padding:'30px 50px' }}>
          {/* <Typography component="h1" variant="h5">
            Edit Project
          </Typography> */}
          <Box component="form" noValidate onSubmit={(event) => {handleSubmit(event)}} sx={{ mt: 3, textAlign:'center' }}>
            <Grid container spacing={2} >
              <Grid item xs={12} sm={12}>
                <TextField
                  name="name"
                  required
                  fullWidth
                  id="name"
                  value={projectName}
                  label="Project Name"
                  autoFocus
                  onChange={(event) => {setProjectName(event.target.value)}}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              // fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Save changes
            </Button>
          </Box>
        </Card>
      </Container>
    </Modal>
  )
}

export default ProjectEdit