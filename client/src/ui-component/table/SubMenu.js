import { useState, useRef, useContext } from 'react'
// assets
import { IconDots, IconPencil, IconTrash } from '@tabler/icons'

import { 
  IconButton,
  Menu,
  ListItemIcon,
  MenuItem,
  ListItemText,
} from '@mui/material'

import { AuthContext } from 'context/AuthContext';
import { useHttp } from 'hooks/http.hook'
import config from 'config.js'
import Popup from 'ui-component/Popup';
import ProjectEdit from 'ui-component/edit/ProjectEdit';


const SubMenu = ({ parent, item, onChange }) => {
  const auth = useContext(AuthContext)
  const API_URL = config.API_URL
  const {loading, request, error, clearError} = useHttp()

  const [subMenuOpen, setSubMenuOpen] = useState(false)
  const [popupData, setPopupData] = useState({ open:false })
  const [editData, setEditData] = useState({ open:false })
  const ref = useRef(null)

  const handleDelete = () => {
    // console.log('Delete Project', item)
    setPopupData({
      open:       true,
      message:    `Confirm delete ${item.name}`,
    })
  }

  const _handleDelete = async (choise) => {
    if(choise){
      try{
        const res = await request(`${API_URL}/${parent}/${item._id}`, 'DELETE', null,
          {Authorization: `Bearer ${auth.token}`}
        )
      } catch (error) { console.log('Error:', error) }
      // console.log('res:', res)
    }
    onChange(true)      
    setSubMenuOpen(false)
    setPopupData({ open: false })
  }

  const handleEdit = () => {
    setEditData({
      open: true,
      parent: parent,
      item: item,
    })
  }

  const onEdit = () => {
    setEditData({ open: false })
    onChange(true)
    setSubMenuOpen(false)
  }

  return(
    <>
      <Popup popupData={popupData} onChoise={(onChoise) => { _handleDelete(onChoise) }} />
      { parent === 'project' && <ProjectEdit editData={editData} onEdit={onEdit} /> }

      <IconButton ref={ref} onClick={() => setSubMenuOpen(true)}>
        <IconDots stroke={1.5} size="1.3rem" />
      </IconButton>

      <Menu
        open={subMenuOpen}
        anchorEl={ref.current}
        onClose={() => setSubMenuOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem sx={{ color: 'text.secondary' }} onClick={ () => handleEdit() }>
          <ListItemIcon>
            <IconPencil stroke={1.5} size="1.3rem" />
          </ListItemIcon>
          <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem sx={{ color: 'text.secondary' }} onClick={ () => handleDelete() }>
          <ListItemIcon>
            <IconTrash stroke={1.5} size="1.3rem" />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  )
}

export default SubMenu