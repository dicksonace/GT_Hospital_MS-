import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import {
    Activity,
    Banknote,
    BedDouble,
    Building2,
    CalendarDays,
    FlaskConical,
    LayoutDashboard,
    Menu,
    Pill,
    Stethoscope,
    TestTubes,
    UserCog,
    Users,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const NAV = [
    { name: 'Dashboard', route: 'dashboard', icon: LayoutDashboard, roles: '*' },
    { name: 'Patients', route: 'patients.index', icon: Users, roles: '*' },
    { name: 'Appointments', route: 'appointments.index', icon: CalendarDays, roles: '*' },
    { name: 'Medical Records', route: 'medical-records.index', icon: Activity, roles: '*' },
    { name: 'Lab Orders', route: 'lab-orders.index', icon: FlaskConical, roles: '*' },
    { name: 'Billing', route: 'bills.index', icon: Banknote, roles: '*' },
    { name: 'Admissions', route: 'admissions.index', icon: BedDouble, roles: '*' },
    { name: 'Pharmacy', route: 'medicines.index', icon: Pill, roles: ['admin', 'pharmacist'] },
    { name: 'Lab Catalog', route: 'lab-tests.index', icon: TestTubes, roles: ['admin', 'lab_technician'] },
    { name: 'Doctors', route: 'doctors.index', icon: Stethoscope, roles: ['admin'] },
    { name: 'Departments', route: 'departments.index', icon: Building2, roles: ['admin'] },
    { name: 'Wards', route: 'wards.index', icon: BedDouble, roles: ['admin'] },
    { name: 'Staff', route: 'staff.index', icon: UserCog, roles: ['admin'] },
    { name: 'Reports', route: 'reports.index', icon: Activity, roles: ['admin'] },
];

function canSee(item, role) {
    if (item.roles === '*') return true;
    if (role === 'admin') return true;
    return item.roles.includes(role);
}

function routeExists(name) {
    try {
        return route().has(name);
    } catch (e) {
        return true;
    }
}

export default function AuthenticatedLayout({ header, children }) {
    const { auth, flash } = usePage().props;
    const user = auth.user;
    const role = user?.role;

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showFlash, setShowFlash] = useState(true);

    useEffect(() => {
        setShowFlash(true);
        if (flash?.success || flash?.error) {
            const timer = setTimeout(() => setShowFlash(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const items = NAV.filter(
        (item) => canSee(item, role) && routeExists(item.route),
    );

    const isActive = (name) => {
        try {
            const base = name.replace('.index', '');
            return route().current(name) || route().current(base + '.*');
        } catch (e) {
            return false;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-gray-900/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={
                    'fixed inset-y-0 left-0 z-40 w-64 transform bg-slate-900 text-slate-200 transition-transform duration-200 lg:translate-x-0 ' +
                    (sidebarOpen ? 'translate-x-0' : '-translate-x-full')
                }
            >
                <div className="flex h-16 items-center gap-2 border-b border-slate-800 px-6">
                    <Stethoscope className="h-7 w-7 text-indigo-400" />
                    <span className="text-lg font-bold text-white">MediCare HMS</span>
                    <button
                        className="ml-auto lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <nav className="flex flex-col gap-1 overflow-y-auto px-3 py-4">
                    {items.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.route);
                        return (
                            <Link
                                key={item.route}
                                href={route(item.route)}
                                className={
                                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ' +
                                    (active
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white')
                                }
                            >
                                <Icon className="h-5 w-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main column */}
            <div className="lg:pl-64">
                <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-4 sm:px-6">
                    <button
                        className="lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-6 w-6 text-gray-600" />
                    </button>

                    <div className="flex-1">
                        {header && (
                            <div className="text-sm font-medium text-gray-500">
                                {header}
                            </div>
                        )}
                    </div>

                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200">
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </span>
                                <span className="hidden sm:block">{user?.name}</span>
                            </button>
                        </Dropdown.Trigger>
                        <Dropdown.Content>
                            <div className="border-b border-gray-100 px-4 py-2">
                                <p className="text-sm font-medium text-gray-800">
                                    {user?.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {user?.role_label}
                                </p>
                            </div>
                            <Dropdown.Link href={route('profile.edit')}>
                                Profile
                            </Dropdown.Link>
                            <Dropdown.Link
                                href={route('logout')}
                                method="post"
                                as="button"
                            >
                                Log Out
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </header>

                {/* Flash messages */}
                {showFlash && (flash?.success || flash?.error) && (
                    <div className="px-4 pt-4 sm:px-6">
                        <div
                            className={
                                'rounded-lg border px-4 py-3 text-sm ' +
                                (flash.success
                                    ? 'border-green-200 bg-green-50 text-green-800'
                                    : 'border-red-200 bg-red-50 text-red-800')
                            }
                        >
                            {flash.success || flash.error}
                        </div>
                    </div>
                )}

                <main className="p-4 sm:p-6">{children}</main>
            </div>
        </div>
    );
}
