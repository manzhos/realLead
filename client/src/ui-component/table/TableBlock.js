import { useState, Fragment } from 'react'
import { filter } from 'lodash'

import humanDate from 'utils/human-date'
import SubMenu from './SubMenu'
import SubItemBlock from 'ui-component/table/SubItemBlock'

// for toast messages
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { 
  Container,
  Box,
  Card,
  Divider,
  Stack,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  TableSortLabel,
  Checkbox,
  Typography,
  Collapse
} from '@mui/material';


// ----------------------------------------------------------------------

const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
};

// ----------------------------------------------------------------------

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if(query) {
    return filter(array, (_project) => (_project.name.toLowerCase().indexOf(query.toLowerCase()) !== -1));
  }
  return stabilizedThis.map((el) => el[0]);
}


const TableBlock = ({ parent, tableHead, itemList, subItem, handleUpdate }) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [selected, setSelected] = useState([])
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('name')
  const [filterName, setFilterName] = useState('')

  const filteredItems = applySortFilter(itemList, getComparator(order, orderBy), filterName)

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - itemList.length) : 0
  const numSelected = selected.length
  const rowCount = itemList.length

  // const createSortHandler = (event) => {
  //   // console.log('event:', event);
  //   onRequestSort(event);
  // };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }

  const handleRequestSort = (event) => {
    const isAsc = orderBy === event && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(event)
  }

  const handleCheckClick = (event, id) => {
    // console.log('handleCheckClick >>> event:', event)
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = itemList.map((item) => item.id)
      setSelected(newSelecteds)
      return
    }
    setSelected([]);
  }

  const Row = ({row, index}) => {
    console.log('row:', row)
    const [openSub, setOpenSub] = useState(false)
    // const isItemSelected = selected.indexOf(index) !== -1;
    const [filterName, setFilterName] = useState('')
    let filteredSubItems = []
    if(subItem?.itemList?.length) filteredSubItems = applySortFilter(subItem.itemList, getComparator(order, orderBy), filterName)

    const handleRowClick = (data) => {
      console.log('copied:', data)
      if(parent !== 'project') {
        navigator.clipboard.writeText(`'${data}'`)
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
        return
      }
      setOpenSub(!openSub)
    }

    return(
      <Fragment>
        <TableRow
          hover
          key={index}
          tabIndex={-1}
          role="checkbox"
          // selected={isItemSelected}
          // aria-checked={isItemSelected}
          style={{ cursor:"pointer" }}
        >
          {/* <TableCell padding="checkbox">
            <Checkbox checked={isItemSelected} onChange={(event) => handleCheckClick(event)} />
          </TableCell> */}
          {tableHead.map((headCell)=>{
            return(
              <TableCell 
                key={'row-' + headCell.id} 
                scope="row" 
                onClick={() => {
                  handleRowClick(row.linkFrom)
                }}
              >
                <div style={{ width: headCell.width, overflow: 'hidden' }}>
                  { headCell.id === 'created' 
                    ? humanDate(row[headCell.id])
                    : row[headCell.id]
                  }
                </div>
              </TableCell>
            )
          })}
          <TableCell align="right">
            <SubMenu id={'menu' + index} parent={parent} item={row} onChange={handleUpdate} />
          </TableCell>
        </TableRow>
        {/* collapsed channel */}
        { subItem?.parent &&
          <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
              <Collapse in={ openSub } timeout="auto" unmountOnExit sx={{ mt: 2, mb: 2, background: '#FAF8FE', borderRadius:'12px' }}>
                <Box sx={{ mt:3, ml:4, mr:4, mb:4 }}>
                  <Typography variant="h4" gutterBottom component="div" sx={{ textTransform: 'capitalize', color: '#6237B1', mb:3 }}>
                    {subItem.parent}
                  </Typography>
                  { subItem.parent && <SubItemBlock parent={subItem.parent} parentId={row._id} tableHead={subItem.tableHead} handleUpdate={handleUpdate} />}
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        }   
      </Fragment>
    )
  }

  return (
    <Card>
      <ToastContainer />
      {/* <TableListToolbar numSelected={selected.length} onFilterName={handleFilterByName} onUserRole={handleFilterByUserRole} /> */}
      <TableContainer sx={{ minWidth: 800 }}>
        <Table>
          <TableHead>
            <TableRow>
              {/* <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={numSelected > 0 && numSelected < rowCount}
                  checked={rowCount > 0 && numSelected === rowCount}
                  onChange={handleSelectAllClick}
                />
              </TableCell> */}
              {tableHead.map((headCell) => (
                <TableCell
                  key={'head-' + headCell.id}
                  align={headCell.alignRight ? 'right' : 'left'}
                  sortDirection={orderBy === headCell.id ? order : false}
                  style={{ width: headCell.width }}
                >
                  <TableSortLabel
                    hideSortIcon
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={()=>{handleRequestSort(headCell.id)}}
                  >
                    {headCell.label}
                    {orderBy === headCell.id ? (
                      <Box sx={{ ...visuallyHidden }}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</Box>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell>&nbsp;</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
              return (
                <Row key={'row' + index} row={row} index={index}/>
              )
            })}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>

          {/* {isProjectNotFound && (
            <TableBody>
              <TableRow>
                <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                  <SearchNotFound searchQuery={filterName} />
                </TableCell>
              </TableRow>
            </TableBody>
          )} */}
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={itemList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Card>
  )
}
export default TableBlock;