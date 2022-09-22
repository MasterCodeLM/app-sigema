import {createRouter, createWebHashHistory} from 'vue-router';
import App from './App.vue';

const routes = [
    {
        path: '/',
        name: 'app',
        meta: {
            requiresAuth: true,
        },
        component: App,
        children: [
            {
                path: '',
                name: 'dashboard',
                component: () => import('./components/Dashboard.vue')
            },
            {
                path: '/formlayout',
                name: 'formlayout',
                component: () => import('./components/FormLayoutDemo.vue')
            },
            {
                path: '/input',
                name: 'input',
                component: () => import('./components/InputDemo.vue')
            },
            {
                path: '/floatlabel',
                name: 'floatlabel',
                component: () => import('./components/FloatLabelDemo.vue')
            },
            {
                path: '/invalidstate',
                name: 'invalidstate',
                component: () => import('./components/InvalidStateDemo.vue')
            },
            {
                path: '/button',
                name: 'button',
                component: () => import('./components/ButtonDemo.vue')
            },
            {
                path: '/table',
                name: 'table',
                component: () => import('./components/TableDemo.vue')
            },
            {
                path: '/list',
                name: 'list',
                component: () => import('./components/ListDemo.vue')
            },
            {
                path: '/tree',
                name: 'tree',
                component: () => import('./components/TreeDemo.vue')
            },
            {
                path: '/panel',
                name: 'panel',
                component: () => import('./components/PanelsDemo.vue')
            },
            {
                path: '/overlay',
                name: 'overlay',
                component: () => import('./components/OverlayDemo.vue')
            },
            {
                path: '/media',
                name: 'media',
                component: () => import('./components/MediaDemo.vue')
            },
            {
                path: '/menu',
                component: () => import('./components/MenuDemo.vue'),
                children: [
                    {
                        path: '',
                        component: () => import('./components/menu/PersonalDemo.vue')
                    },
                    {
                        path: '/menu/seat',
                        component: () => import('./components/menu/SeatDemo.vue')
                    },
                    {
                        path: '/menu/payment',
                        component: () => import('./components/menu/PaymentDemo.vue')
                    },
                    {
                        path: '/menu/confirmation',
                        component: () => import('./components/menu/ConfirmationDemo.vue')
                    },
                ],
            },
            {
                path: '/messages',
                name: 'messages',
                component: () => import('./components/MessagesDemo.vue')
            },
            {
                path: '/file',
                name: 'file',
                component: () => import('./components/FileDemo.vue')
            },
            {
                path: '/chart',
                name: 'chart',
                component: () => import('./components/ChartDemo.vue')
            },
            {
                path: '/misc',
                name: 'misc',
                component: () => import('./components/MiscDemo.vue')
            },
            {
                path: '/crud',
                name: 'crud',
                component: () => import('./pages/CrudDemo.vue')
            },
            {
                path: '/timeline',
                name: 'timeline',
                component: () => import('./pages/TimelineDemo.vue')
            },
            {
                path: '/empty',
                name: 'empty',
                component: () => import('./components/EmptyPage.vue')
            },
            {
                path: '/documentation',
                name: 'documentation',
                component: () => import('./components/Documentation.vue')
            },
            {
                path: '/blocks',
                name: 'blocks',
                component: () => import('./components/BlocksDemo.vue')
            },
            {
                path: '/icons',
                name: 'icons',
                component: () => import('./components/IconsDemo.vue')
            },
            {
                path: '/machines',
                name: 'machines',
                component: () => import('./pages/Machines.vue')
            },
            {
                path: '/employees',
                name: 'employees',
                component: () => import('./pages/Employees.vue')
            },
            {
                path: '/new-attendance-control',
                name: 'new-attendance-control',
                component: () => import('./pages/NewAttendanceControl.vue')
            },
            {
                path: '/article-types',
                name: 'article-types',
                component: () => import('./pages/ArticleTypes.vue')
            },
            {
                path: '/articles',
                name: 'articles',
                component: () => import('./pages/Articles.vue')
            },
            {
                path: '/suppliers',
                name: 'suppliers',
                component: () => import('./pages/Suppliers.vue')
            },
            {

                path: '/users',
                name: 'users',
                component: () => import('./pages/Users.vue')
            },
            {

                path: '/roles',
                name: 'roles',
                component: () => import('./pages/Roles.vue')
            },
            {
                path: '/profile',
                name: 'profile',
                component: () => import('./pages/Profile.vue')
            },
            {
                path: '/new-maintenance-sheet',
                name: 'new-maintenance-sheet',
                component: () => import('./pages/NewMaintenanceSheet.vue')
            },
            {
                path: '/new-work-start',
                name: 'new-work-start',
                component: () => import('./pages/NewWorkStart.vue')
            }

        ]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('./pages/LoginCustom.vue')
    },
    {
        path: '/:catchAll(.*)',
        name: 'notfound',
        component: () => import('./pages/NotFound.vue')
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

function hasAccess(name) {
    const permissions = localStorage.getItem('permissions')

    switch (name) {
        case 'dashboard':
            return true

        case 'materiales':
            return permissions.includes('view materials')

        case 'categorias':
            return permissions.includes('view categories')

        case 'marcas':
            return permissions.includes('view marks')

        case 'unidades-medida':
            return permissions.includes('view measure units')

        case 'almacenes':
            return permissions.includes('view warehouses')

        case 'proveedores':
            return permissions.includes('view suppliers')

        case 'requerimientos':
            return permissions.includes('view requests')

        case 'cotizaciones':
            return permissions.includes('view quotes')

        case 'ordenes-compra':
            return permissions.includes('view orders purchase')

        case 'compras':
            return permissions.includes('view purchases')

        case 'notas-ingreso':
            return permissions.includes('view entry notes')

        case 'notas-salida':
            return permissions.includes('view exit notes')

        case 'reportes-requerimiento':
            return permissions.includes('view reports')
        case 'reportes-compra':
            return permissions.includes('view reports')

        default:
            return false
    }
}

router.beforeEach((to, from, next) => {
    // A Logged-in user can't go to login page again
    if (to.name === 'login' && localStorage.getItem('token')) {
        next({name: 'dashboard'})
        return
        // the route requires authentication
    } else if (to.meta.requiresAuth) {
        // console.log(localStorage.getItem('token'))
        if (!localStorage.getItem('token')) {
            // user not logged in, send them to login page
            next({name: 'login'})
            return
        } else if (!hasAccess(to.name)) {
            next('notfound')
            return
        }
    }
    next()
})

export default router;
