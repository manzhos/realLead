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

const ChannelEdit = ({ editData = { open:false }, onEdit }) => {
  // console.log('editData:', editData)
  const auth = useContext(AuthContext)
  const API_URL = config.API_URL
  const {loading, request, error, clearError} = useHttp()

  const [channelName, setChannelName] = useState(editData.item?.name)
  const [channelLinkTo, setChannelLinkTo] = useState(editData.item?.linkTo)
  const [open, setOpen] = useState(editData.open)

  useEffect(()=>{
    setOpen(editData.open)
    setChannelName(editData.item?.name)
    setChannelLinkTo(editData.item?.linkTo)
  }, [editData])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if(!editData.item._id) return
    try {
      const res = await request(`${API_URL}/channel/${editData.item._id}`, 'PATCH', 
        {
          name: channelName,
          linkTo: channelLinkTo
        },
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
        <Card sx={{ margin: '10vh 5vw', padding:'30px 50px' }}>
          {/* <Typography component="h1" variant="h5">
            Edit Channel
          </Typography> */}
          <Box component="form" noValidate onSubmit={(event) => {handleSubmit(event)}} sx={{ mt: 3, textAlign:'center' }}>
            <Grid container spacing={2} >
              <Grid item xs={12} sm={12}>
                <TextField
                  name="name"
                  required
                  fullWidth
                  id="name"
                  value={channelName}
                  label="Channel Name"
                  autoFocus
                  onChange = {(event) => {setChannelName(event.target.value)}}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  name="linkTo"
                  fullWidth
                  required
                  id="linkTo"
                  value={channelLinkTo}
                  label="Target Link"
                  autoFocus
                  onChange = {(event) => {setChannelLinkTo(event.target.value)}}
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

export default ChannelEdit
