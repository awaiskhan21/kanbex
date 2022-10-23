import React from 'react'
import { Grid } from '@mui/material'

const img = 'https://jugaad.ecellvnit.org/img/jugaadnew.png'
const Loading = () => {
  return (
    <Grid container>
      <Grid item lg={12} md={12} sm={12} style={{ display: 'flex' }} xs={12}>
        <Grid container alignItems="center" justifyContent="center">
          <div className="app">
            <header className="app-header">
              <img alt="logo" className="app-logo" src={img} />
            </header>
          </div>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Loading
