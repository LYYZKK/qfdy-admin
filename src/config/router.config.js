import { UserLayout, ViewRouter } from '@/components/layouts'

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouters = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      }
    ]
  },
  {
    path: '/report',
    component: ViewRouter,
    children: [
      {
        path: '/view-report',
        name: 'ViewReport',
        component: () => import(/* webpackChunkName: "user" */ '@/views/report/ViewReport')
      },
      {
        path: '/order-report',
        name: 'OrderReport',
        component: () => import(/* webpackChunkName: "user" */ '@/views/report/OrderReport')
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
