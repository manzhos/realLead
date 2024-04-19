import React, {useState, useCallback} from 'react'
// import config from 'config.js'

export const useHttp = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  // const API_URL = config.API_URL

  const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
    setLoading(true)
    try {
      if (body) {
        body = JSON.stringify(body)
        headers['Content-Type'] = 'application/json'
        // headers['Accept'] = 'application/json'
        // headers['Access-Control-Allow-Origin'] = API_URL
        // headers['Access-Control-Allow-Credentials'] = 'true'
        // headers.append('GET', 'POST', 'OPTIONS');
        // headers.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
      }

      // console.log('method:', method, '\nbody:', body, '\nheaders:', headers)
      const response = await fetch(url, {method, body, headers})
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Something wrong')
      }

      setLoading(false)

      return data
    } catch (e) {
      setLoading(false)
      setError(e.message)
      throw e
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return { loading, request, error, clearError }
}
