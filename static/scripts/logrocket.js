if (window.location.hostname !== 'localhost') {
  if (window.LogRocket) {
    window.LogRocket.init('hipipp/bergerac-roads')
    if (window.Rollbar) {
      window.Rollbar.configure({
        transform: function(obj) {
          obj.sessionURL = window.LogRocket.sessionURL
          return obj
        },
      })
    } else {
      console.error('Rollbar not found, fail at connection with LogRocket')
    }
  } else {
    console.error('LogRocket not found, cannot init')
  }
}
