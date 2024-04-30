import React, { useEffect } from "react"

import config from 'config'

const RedirectToApi = () => {
  const uuidPath = window.location.pathname

  useEffect(() => {
    // console.log('Redirect url:', `${config.API_URL}${uuidPath}`)
    window.location.href = `${config.API_URL}${uuidPath}`
  });

  return(
    <h3 style={{ width:"100%", textAlign:"center" }}>...just a moment...</h3>
  )
}
export default RedirectToApi