import { UserLayout } from '@/components/layouts'

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouters = [
  {
    path: '/webchat',
    component: () => import('@/views/my/webchat')
  },
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
    path: '/payment-order',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/my/modules/contact-task/payment-order')
  },
  {
    name: 'promotion-link',
    path: '/promotion-link',
    component: () => import(/* webpackChunkName: "static" */ '@/views/form/promotion')
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
