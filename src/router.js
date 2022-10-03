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
                component: () => import('./pages/CustomDashboard.vue')
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
                path: '/attendance-sheet',
                name: 'attendance-sheet',
                component: () => import('./pages/AttendanceSheet.vue')
            },
            {
                path: '/new-attendance-control/:id',
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
                path: '/list-machine-maintenance',
                name: 'list-machine-maintenance',
                component: () => import('./pages/ListMachineMaintenance.vue')
            },
            {
                path: '/new-maintenance-sheet/:id',
                name: 'new-maintenance-sheet',
                component: () => import('./pages/NewMaintenanceSheet.vue')
            },
            // {
            //     path: '/new-maintenance-sheet',
            //     name: 'new-maintenance-sheet',
            //     component: () => import('./pages/NewMaintenanceSheet.vue')
            // },
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
    let permissions = [];
    const permissions_list = JSON.parse(localStorage.getItem("userLogged")).permissions;
    permissions_list.map((permission) => permissions.push(permission.name))
    switch (name) {
        case 'dashboard':
            return true

        case 'users':
            return permissions.includes('users')

        case 'employees':
            return permissions.includes('employees')

        case 'attendance-sheet':
            return permissions.includes('attendance-sheets')

        case 'new-attendance-control':
            return permissions.includes('attendance-sheets')

        case 'suppliers':
            return permissions.includes('suppliers')

        case 'articles':
            return permissions.includes('articles')

        case 'machines':
            return permissions.includes('machines')

        case 'list-machine-maintenance':
            return permissions.includes('maintenance-sheets')

        case 'new-maintenance-sheet':
            return permissions.includes('maintenance-sheets')

        case 'new-work-start':
            return permissions.includes('working-sheets')

        case 'article-types':
            return permissions.includes('article-types')

        case 'roles':
            return permissions.includes('roles')

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
