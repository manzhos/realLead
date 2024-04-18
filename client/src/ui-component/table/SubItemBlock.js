import { useState, useContext, useEffect, useCallback } from 'react'
import TableBlock from "./TableBlock"

import { IconRefresh } from '@tabler/icons'

// material-ui
import { 
  Container,
  Box,
  Grid,
  TextField,
  Card,
  Stack,
  Button,
  IconButton,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Checkbox,
  Typography,
  Modal
} from '@mui/material'

import { IconCircleCheck } from '@tabler/icons'

import { AuthContext } from 'context/AuthContext'
import { useHttp } from 'hooks/http.hook'
import config from 'config.js'


const SubItemBlock = ({ parent, parentId, tableHead, handleUpdate }) => {
  const auth = useContext(AuthContext)
  const API_URL = config.API_URL
  const {loading, request, error, clearError} = useHttp()

  const [open, setOpen] = useState(false)
  const [isDisable, setIsDisable] = useState(true)
  const [isGenerate, setIsGenerate] = useState(false)
  const [channelList, setChannelList] = useState([])
  const [newChannelData, setNewChannelData] = useState({ projectId: parentId })

  const getChannels = useCallback( async () => {
    try {
      const res = await request(`${API_URL}/channels/${parentId}`, 'GET', null,
        {Authorization: `Bearer ${auth.token}`}
      )
      // console.log('channels:', res)
      setChannelList(res.channels)
    } catch(error) { console.log('Error:', error)}
  })
  useEffect(()=>{ getChannels() }, [])  

  const createChannel = async(event) => {
    event.preventDefault()
    // console.log('newChannelData:', newChannelData)
    try {
      const response = await request(`${API_URL}/channel`, 'POST', newChannelData,
        { Authorization: `Bearer ${auth.token}` }
      )
      getChannels()
    } catch(error) { console.log('Error:', error)}
    setOpen(false)
  }

  const handleChange = (event) => { 
    event.preventDefault()
    // console.log('data:', event.target.name, ':::', event.target.value)
    setNewChannelData({
      ...newChannelData,
      [event.target.name]: event.target.value
    })
  }

  useEffect(()=>{
    if(
      newChannelData.name     && newChannelData.name      !== '' &&
      newChannelData.linkTo   && newChannelData.linkTo    !== '' &&
      newChannelData.linkFrom && newChannelData.linkFrom  !== ''
    ) setIsDisable(false)
  }, [{...newChannelData}])

  const generateLinkFrom = () => {
    if(!newChannelData.linkTo || newChannelData.linkTo === '') return
    const channelId = Date.now();
    // check redirect for 'http://' || 'https://'. Without it redirect like additional to local path
    const linkRegex = /^htt([p,ps]):\/\//;
    if(!linkRegex.test(newChannelData.linkTo)) newChannelData.linkTo = 'https://' + newChannelData.linkTo
    // console.log('newChannelData.linkTo', newChannelData.linkTo)
    const linkFrom = `${API_URL}/getfrom?user_id=${auth.userId._id}&project_id=${parentId}&channel_id=${channelId}`
    setNewChannelData({
      ...newChannelData,
      linkFrom: linkFrom,
      channelId: channelId
    })
  }


  return (
    <>
      <TableBlock parent={parent} tableHead={tableHead} itemList={channelList} handleUpdate={handleUpdate} />
      <div style={{ width:"100%", position:"relative" }}>
        <Button
          variant="contained"
          size="small"
          sx={{ mt: 3 }}
          onClick={() => setOpen(true)}
        >
          Add {parent}
        </Button>
        <Button
          variant="outlined"
          size="small"
          sx={{ mt: 3, position:"absolute", right: 0 }}
          onClick={() => getChannels()}
        >
          <IconRefresh stroke={1.5} size="1.3rem" />{'Update'}
        </Button>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Container component="main" maxWidth="md" disableGutters>
          <Card sx={{ marginTop:'10vh', padding:'30px 50px' }}>
            <Box
              component="form" 
              noValidate 
              onSubmit={createChannel}
              sx={{
                mt: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                  <TextField
                    name="name"
                    fullWidth
                    required
                    id="name"
                    value={newChannelData.name || ''}
                    label="Channel Name"
                    autoFocus
                    onChange = {(event) => {handleChange(event)}}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    name="linkTo"
                    fullWidth
                    required
                    id="linkTo"
                    value={newChannelData.linkTo || ''}
                    label="Input your target link"
                    autoFocus
                    onChange = {(event) => {handleChange(event)}}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  {/* <TextField
                    name="linkFrom"
                    fullWidth
                    required
                    id="linkFrom"
                    value={newChannelData.linkFrom || ''}
                    label="Link From"
                    autoFocus
                    onChange = {(event) => {handleChange(event)}}
                  /> */}
                  <Button
                    variant="outlined"
                    sx={{ mb: 2 }}
                    onClick={() => { generateLinkFrom() }}
                  >
                    { newChannelData.linkFrom 
                      ? <IconCircleCheck stroke={1.5} size="1.3rem"  />
                      : <IconCircleCheck stroke={1.5} size="1.3rem" color='lightgray' />
                    }
                    &nbsp;&nbsp;
                    {'Generate Link for posting'}
                  </Button>
                </Grid>
              </Grid>
              <Button
                disabled = {isDisable}
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Create channel
              </Button>
            </Box>
          </Card>
        </Container>
      </Modal>
    </>
  )
}
export default SubItemBlock;