import {
  Card,
  Grid,
  Modal,
  Container,
  Typography,
  Button
} from '@mui/material';

const Popup = ({ popupData = { open:false } , onChoise }) => {

  return (
    <Modal
      open={popupData.open}
      // onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Container 
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Card sx={{ marginTop:'10vh', padding:'30px 50px' }}>
          <Grid container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="h5">
              {popupData.message}
            </Typography>
          </Grid>
          <Grid container sx={{ mt: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button variant="outlined" onClick={()=>{onChoise(true)}}>Yes</Button>
            <Button variant="outlined" onClick={()=>{onChoise(false)}} sx={{ ml:3 }}>No</Button>
          </Grid>
        </Card>
      </Container>
    </Modal>
  )
}

export default Popup