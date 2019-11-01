import enquireJs from 'enquire.js'

const enquireScreen = function(call) {
  const desktopHandler = {
    match: () => { // tablet
      call && call(0)
    },
    unmatch: () => { // desktop
      call && call(-1)
    }
  }
  const tabletHandler = {
    match: () => { // tablet
      call && call(0)
    }
  }
  // mobile
  const mobileHandler = {
    match: () => {
      call && call(1)
    }
  }
  enquireJs.register('screen and (max-width: 1087.99px)', desktopHandler)
  enquireJs.register('screen and (max-width: 767.99px)', mobileHandler)
  enquireJs.register('screen and (min-width: 768px) and (max-width: 1087.99px)', tabletHandler)
}

export default enquireScreen