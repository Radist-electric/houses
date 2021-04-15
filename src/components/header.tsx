import { useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { NavLink, useHistory } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
      fontSize: '24px',
      textTransform: 'uppercase',
      textDecoration: 'none',
      color: '#FFFFFF'
    },
    link: {
      color: '#000',
      textDecoration: 'none'
    }
  }),
)

export default function ButtonAppBar() {
  const classes = useStyles()
  const history = useHistory()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const authHandler = () => {
    history.push({
      pathname: '/auth'
    })
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
            <MenuIcon />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <NavLink to="/" className={classes.link}><MenuItem onClick={handleClose}>Список домов</MenuItem></NavLink>
            <NavLink to="/about" className={classes.link}><MenuItem onClick={handleClose}>О программе</MenuItem></NavLink>
          </Menu>
          <NavLink to="/" className={classes.title}>reestrdoma</NavLink>
          <Button color="inherit" onClick={authHandler}>Вход</Button>
        </Toolbar>
      </AppBar>
    </div>
  )
}
