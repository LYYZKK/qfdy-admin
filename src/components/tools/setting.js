import {
  message
} from 'ant-design-vue/es'
// import defaultSettings from '../defaultSettings';

let lessNodesAppended

const colorList = [{
    key: '薄暮',
    color: '#F5222D'
  },
  {
    key: '火山',
    color: '#FA541C'
  },
  {
    key: '日暮',
    color: '#FAAD14'
  },
  {
    key: '明青',
    color: '#13C2C2'
  },
  {
    key: '极光绿',
    color: '#52C41A'
  },
  {
    key: '拂晓蓝（默认）',
    color: '#1890FF'
  },
  {
    key: '极客蓝',
    color: '#2F54EB'
  },
  {
    key: '酱紫',
    color: '#722ED1'
  }
]

const updateTheme = primaryColor => {
  // Don't compile less in production!
  /* if (process.env.NODE_ENV === 'production') {
    return;
  } */
  // Determine if the component is remounted
  if (!primaryColor) {
    return
  }
  const hideMessage = message.loading('正在编译主题！', 0)

  function buildIt() {
    if (!window.less) {
      return
    }
    setTimeout(() => {
      window.less
        .modifyVars({
          '@primary-color': primaryColor
        })
        .then(() => {
          hideMessage()
        })
        .catch(() => {
          message.error('Failed to update theme')
          hideMessage()
        })
    }, 200)
  }
  if (!lessNodesAppended) {
    // insert less.js and color.less
    const colorLessStyleNode = document.createElement('link')
    colorLessStyleNode.setAttribute('rel', 'stylesheet/less')
    colorLessStyleNode.setAttribute('href', '/theme-color.less')
    document.body.appendChild(colorLessStyleNode)

    const addressLessStyleNode = document.createElement('link')
    addressLessStyleNode.setAttribute('rel', 'stylesheet/less')
    addressLessStyleNode.setAttribute('href', '/area-linkage.less')
    document.body.appendChild(addressLessStyleNode)

    const lessConfigNode = document.createElement('script')
    lessConfigNode.innerHTML = `
      window.less = {
        async: true,
        env: 'production',
        javascriptEnabled: true
      };
    `
    document.body.appendChild(lessConfigNode)

    const lessScriptNode = document.createElement('script')
    lessScriptNode.src = 'https://gw.alipayobjects.com/os/lib/less.js/3.8.1/less.min.js'
    lessScriptNode.async = true
    lessScriptNode.onload = () => {
      buildIt()
      lessScriptNode.onload = null
    }
    document.body.appendChild(lessScriptNode)

    lessNodesAppended = true
  } else {
    buildIt()
  }
}

const updateColorWeak = colorWeak => {
  colorWeak ? document.body.classList.add('colorWeak') : document.body.classList.remove('colorWeak')
}

export {
  updateTheme,
  colorList,
  updateColorWeak
}
