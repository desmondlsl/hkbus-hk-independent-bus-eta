import React, { useEffect, useState } from 'react'
import { KmbApi, fetchRouteList } from './data-api'

const AppContext = React.createContext()

export const AppContextProvider = ( props ) => {
  const [schemaVersion, setSchemaVersion] = useState(localStorage.getItem('schemaVersion'))
  // route list & stop list & route-stop list
  const [routeList, setRouteList] = useState(JSON.parse(localStorage.getItem('routeList')))
  const [stopList, setStopList] = useState(JSON.parse(localStorage.getItem('stopList')))
  const [updateTime, setUpdateTime] = useState(parseInt(localStorage.getItem('updateTime')))
  // search route
  const [searchRoute, setSearchRoute] = useState("")
  // selected route for bottom navigation shortcut
  const [selectedRoute, setSelectedRoute] = useState('1+1+CHUK YUEN ESTATE+STAR FERRY')
  // Geo Permission for UX
  const [ geoPermission, setGeoPermission ] = useState( localStorage.getItem('geoPermission') ) 
  const [ geolocation, setGeolocation ] = useState (JSON.parse(localStorage.getItem('geolocation')) || {lat: 22.302711, lng: 114.177216})
  const [ geoWatcherId, setGeoWatcherId ] = useState ( null )

  // hot query count
  const [ hotRoute, setHotRoute ] = useState( JSON.parse(localStorage.getItem('hotRoute')) || {} )
  const [ savedEtas, setSavedEtas ] = useState ( JSON.parse(localStorage.getItem('savedEtas')) || [] )

  // possible Char for RouteInputPad
  const [possibleChar, setPossibleChar] = useState([])
  
  const renewDb = () => {
    fetchRouteList().then( _routeList => setRouteList(_routeList) ).then(() =>
      // fetch only KMB stop list as the api return is succinct enough
      // on-the-fly fetching for other service providers' stops
      KmbApi.fetchStopList().then( _stopList => {
        setStopList(_stopList)
        const _updateTime = Date.now()
        setUpdateTime ( _updateTime )
        localStorage.setItem('updateTime', _updateTime)
      } )
    )
  }

  useEffect(() => {
    // check app version and flush localstorage if outdated
    fetch( process.env.PUBLIC_URL + '/schema-version.txt').then(
      response => response.text()
    ).then( _schemaVersion => {
      let needRenew = false
      if ( schemaVersion !== _schemaVersion ) {
        setSchemaVersion(_schemaVersion)
        localStorage.setItem('schemaVersion', _schemaVersion)
        needRenew = true
      }
      needRenew = needRenew || routeList == null || stopList == null || updateTime == null || updateTime < Date.now() - 7 * 24 * 60 * 60 * 1000
      if (needRenew) {
        renewDb()
      }
    })

    if ( geoPermission === 'granted' ) {
      const _geoWatcherId = navigator.geolocation.watchPosition(({coords: {latitude, longitude}}) => {
        setGeolocation({lat: latitude, lng: longitude})
      })
      setGeoWatcherId ( _geoWatcherId )
    }
    return () => {
      if ( geoWatcherId ) navigator.geolocation.clearWatch(geoWatcherId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if ( geoPermission === 'granted' ) {
      const _geoWatcherId = navigator.geolocation.watchPosition(({coords: {latitude, longitude}}) => {
        setGeolocation({lat: latitude, lng: longitude})
      })
      setGeoWatcherId ( _geoWatcherId )
    } else if ( geoWatcherId ) {
      navigator.geolocation.clearWatch(geoWatcherId)
      setGeoWatcherId(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geoPermission])

  useEffect(() => {
    setPossibleChar(getPossibleChar(searchRoute, routeList))
  }, [searchRoute, routeList])

  useEffect(() => {
    localStorage.setItem('savedEtas', JSON.stringify(savedEtas))
  }, [savedEtas])

  useEffect(() => {
    localStorage.setItem('stopList', JSON.stringify(stopList))
  }, [stopList])

  useEffect(() => {
    localStorage.setItem('routeList', JSON.stringify(routeList))
  }, [routeList])

  useEffect(() => {
    localStorage.setItem('geolocation', JSON.stringify(geolocation))
  }, [geolocation])

  useEffect(() => {
    localStorage.setItem('geoPermission', geoPermission)
  }, [geoPermission])

  const updateNewlyFetchedRouteStops = ( routeId, objs ) => {
    if ( objs.length === 0 ) return
    // set stop list
    let _stopList = {}
    objs.forEach( obj => {
      _stopList = {..._stopList, ...obj.stopList}
    } )
    setStopList({...stopList, ..._stopList})

    // set route list
    setRouteList(prevRouteList => {
      let _routeList = JSON.parse(JSON.stringify(prevRouteList))
      objs.forEach(obj => _routeList[routeId].stops[obj.co] = obj.routeStops)
      return _routeList
    })
  }

  const updateSearchRouteByButton = (buttonValue) => {
    switch (buttonValue) {
      case 'b': 
        setSearchRoute(searchRoute.slice(0,-1))
        break
      case '-':
        setSearchRoute('')
        break
      default: 
        setSearchRoute(searchRoute+buttonValue)
    }
  }

  const updateSelectedRoute = ( route, seq = '' ) => {
    setSelectedRoute ( `${route}/${seq}` )
    if ( seq ) {
      setHotRoute( prevHotRoute => {
        prevHotRoute[route+'/'+seq] = hotRoute[route+'/'+seq] ? hotRoute[route+'/'+seq] + 1 : 1
        localStorage.setItem('hotRoute', JSON.stringify(prevHotRoute))
        return prevHotRoute
      })
    }
  }

  const updateSavedEtas = ( key ) => {
    setSavedEtas ( prevSavedEtas => {
      if ( prevSavedEtas.includes(key) ) return prevSavedEtas.filter(k => k !== key)
      else return prevSavedEtas.concat(key)
    })
  }

  const resetUsageRecord = () => {
    setHotRoute({})
    setGeolocation({lat: 22.302711, lng: 114.177216})
    setSavedEtas([])
  }

  return (
    <AppContext.Provider value={{
        routeList, stopList, 
        setRouteList, setStopList,
        updateNewlyFetchedRouteStops,
        searchRoute, setSearchRoute, updateSearchRouteByButton,
        selectedRoute, updateSelectedRoute,
        possibleChar,
        // UX
        hotRoute, geolocation,
        savedEtas, updateSavedEtas,
        resetUsageRecord,
        // settings
        renewDb, schemaVersion, updateTime,
        geoPermission, setGeoPermission 
      }}
    >
      {props.children}
    </AppContext.Provider>
  )
}

export default AppContext

const getPossibleChar = ( searchRoute, routeList ) => {
  if ( routeList == null ) return []
  let possibleChar = {}
  Object.entries(routeList).forEach(route => {
    if ( route[0].startsWith(searchRoute.toUpperCase()) ) {
      let c = route[0].slice(searchRoute.length, searchRoute.length+1)
      possibleChar[c] = isNaN(possibleChar[c]) ? 1 : ( possibleChar[c] + 1)
    }
  })
  return Object.entries(possibleChar).map(k => k[0]).filter(k => k !== '+')
}