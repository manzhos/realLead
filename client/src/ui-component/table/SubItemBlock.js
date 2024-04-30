import React, { useState, useContext, useEffect, useCallback, Fragment } from 'react'
import TableBlock from "./TableBlock"
import { BrowserView, MobileView } from 'react-device-detect'
// for toast messages
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { IconRefresh } from '@tabler/icons'

// material-ui
import { 
  Container,
  Box,
  Grid,
  TextField,
  Card,
  Typography,
  Button,
  Modal,
  Table,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material'

import { IconCircleCheck } from '@tabler/icons'

import { AuthContext } from 'context/AuthContext'
import { useHttp } from 'hooks/http.hook'
import humanDate from 'utils/human-date'
import SubMenu from './SubMenu'
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
      // console.log('channels:', res.channels)
      setChannelList(res.channels)
    } catch(error) { console.log('Error:', error)}
  })
  useEffect(()=>{ getChannels() }, [])  

  const createChannel = async(event) => {
    event.preventDefault()
    console.log('newChannelData:', newChannelData)
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
      newChannelData.linkTo   && newChannelData.linkTo    !== ''
      // newChannelData.linkFrom && newChannelData.linkFrom  !== ''
    ) setIsDisable(false)
  }, [{...newChannelData}])

  // const generateLinkFrom = () => {
  //   if(!newChannelData.linkTo || newChannelData.linkTo === '') return
  //   const channelId = Date.now();
  //   // check redirect for 'http://' || 'https://'. Without it redirect like additional to local path
  //   const linkRegex = /^https?:\/\//
  //   if(!linkRegex.test(newChannelData.linkTo)) newChannelData.linkTo = 'https://' + newChannelData.linkTo
  //   const linkFrom = `${API_URL}/getfrom?user_id=${auth.userId._id}&project_id=${parentId}&channel_id=${channelId}`
  //   setNewChannelData({
  //     ...newChannelData,
  //     linkFrom: linkFrom,
  //     channelId: channelId
  //   })
  // }
  const handleRowClick = (data) => {
    console.log('link copied:', data)
    navigator.clipboard.writeText(data)
    toast("Link copied to clipboard", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    })
  } 

  return (
    <Fragment>
      <ToastContainer />
      <BrowserView>
        <TableBlock parent={parent} tableHead={tableHead} itemList={channelList} handleUpdate={handleUpdate} />
      </BrowserView>
      <MobileView>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Box><Typography variant="caption" display="block" gutterBottom><i>Tap on the post link to copy it</i></Typography></Box>
                { channelList.map((channel, index) => {
                  return(
                    <Card key={channel.name + '_' + index} sx={{ pt:1, pb:1, pl:0, pr:0, borderBottom: "1px solid", borderRadius:0, display:"flex", alignItems:"center" }} >
                      <Box sx={{ width:"75%", overflow:"hidden", display:"flex", flexDirection:"column" }}>
                        <Box>
                          <Typography variant="h4" gutterBottom sx={{ color:"#5F36B2" }}>
                            {channel.name}
                          </Typography>
                        </Box>
                        <Box sx={{ position:"relative" }} onClick={() => { handleRowClick(channel.linkFrom) }}>
                          <Box sx={{ whiteSpace: "nowrap" }} className='link-for-post'>
                            {'Post Link:'} <b>{channel.linkFrom}</b>
                          </Box>
                        </Box>
                        <Box>
                          {'Target Link:'} <b>{channel.linkTo}</b>
                        </Box>
                        <Box sx={{ mt:1 }}>
                          {'From: ' + humanDate(channel.created)}
                        </Box>
                      </Box>
                      <Box sx={{ width:"20%", display:"flex", justifyContent:"center" }}>
                        <Box sx={{ padding:"6px 12px", border:"0px solid #5F36B2", borderRadius:"16px", background:'#EDE7F6', fontSize:"1.2em", fontWeight:"600" }}>
                          {channel.click}
                        </Box>
                      </Box>
                      <Box sx={{ width:"5%", display:"flex", justifyContent:"center" }}>
                        <SubMenu id={'menu' + index} parent={parent} item={channel} onChange={handleUpdate} />
                      </Box>
                    </Card> 
                  )
                })}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </MobileView>

      <Box sx={{ width:"100%", position:"relative", pl:2, pr:2 }}>
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
          sx={{ mt: 3, position:"absolute", right: 20 }}
          onClick={() => getChannels()}
        >
          <IconRefresh stroke={1.5} size="1.3rem" />{'Update'}
        </Button>
      </Box> 

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Container component="main" maxWidth="md" disableGutters>
          <Card sx={{ margin: '10vh 5vw', padding:'30px 50px' }}>
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
                  {/* <Button
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
                  </Button> */}
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
    </Fragment>
  )
}
export default SubItemBlock;