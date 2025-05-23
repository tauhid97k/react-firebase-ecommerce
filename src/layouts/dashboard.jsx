import { NavLink, Outlet, useNavigate, useRevalidator } from "react-router";
import Collapsible from "@/components/shared/Collapsible";
import TopLoader from "@/components/shared/top-loader";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  HomeIcon,
  XMarkIcon,
  TagIcon,
  ShoppingBagIcon,
  UserIcon,
  GlobeAltIcon,
  CogIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { cn } from "@/lib/utils";
import { auth, db } from "@/lib/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore/lite";
import { ProfileModal } from "@/components/shared/profile-modal";

const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  {
    name: "Products",
    href: "/dashboard/products",
    icon: ShoppingBagIcon,
  },
  {
    name: "Categories",
    href: "/dashboard/categories",
    icon: TagIcon,
  },
  {
    name: "Website",
    icon: GlobeAltIcon,
    collapsible: true,
    children: [
      { name: "Homepage", href: "/dashboard/website/home" },
      // { name: "About Page", href: "/dashboard/website/about" },
    ],
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: CogIcon,
  },
];

const userNavigation = [
  { name: "Your profile", type: "profile" },
  { name: "Sign out", type: "button" },
];

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [settings, setSettings] = useState(null);
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  
  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    
    return () => unsubscribe();
  }, []);
  
  // Fetch settings on component mount and when revalidation occurs
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsRef = doc(db, "settings", "global");
        const settingsSnapshot = await getDoc(settingsRef);
        
        if (settingsSnapshot.exists()) {
          setSettings(settingsSnapshot.data());
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    
    fetchSettings();
  }, [revalidator.state]); // Re-fetch when revalidator state changes
  
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  const handleOpenProfileModal = () => {
    setProfileModalOpen(true);
  };

  return (
    <div>
      <TopLoader />
      {/* Mobile Sidebar */}
      <Dialog
        open={sidebarOpen}
        onClose={setSidebarOpen}
        className="relative z-50 lg:hidden"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
        />

        <div className="fixed inset-0 flex">
          <DialogPanel
            transition
            className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
          >
            <TransitionChild>
              <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="-m-2.5 p-2.5"
                >
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon aria-hidden="true" className="size-6 text-white" />
                </button>
              </div>
            </TransitionChild>
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
              <div className="flex h-16 shrink-0 items-center">
                <img
                  alt={settings?.logo_img_alt || "Brand logo"}
                  src={settings?.logo_img || "/logoall.png"}
                  className="h-10 w-auto"
                />
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-1">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {navigationItems.map((item) => (
                        <li key={item.name}>
                          {item.collapsible ? (
                            <Collapsible 
                              label={item.name} 
                              icon={<item.icon className="size-6 shrink-0 text-gray-400 group-hover:text-indigo-600" />}
                            >
                              <ul className="pl-8 mt-0.5">
                                {item.children.map((child) => (
                                  <li key={child.name}>
                                    <NavLink
                                      to={child.href}
                                      className={({ isActive }) =>
                                        cn(
                                          isActive
                                            ? "bg-indigo-50 text-indigo-600"
                                            : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                                          "rounded-md p-2 text-sm/6 font-semibold block w-full"
                                        )
                                      }
                                    >
                                      {child.name}
                                    </NavLink>
                                  </li>
                                ))}
                              </ul>
                            </Collapsible>
                          ) : (
                            <NavLink
                              to={item.href}
                              end={item.href === "/dashboard"}
                              className={({ isActive }) =>
                                cn(
                                  isActive
                                    ? "bg-indigo-50 text-indigo-600"
                                    : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                                  "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                                )
                              }
                            >
                              {({ isActive }) => (
                                <>
                                  <item.icon
                                    aria-hidden="true"
                                    className={cn(
                                      isActive
                                        ? "text-indigo-600"
                                        : "text-gray-400 group-hover:text-indigo-600",
                                      "size-6 shrink-0"
                                    )}
                                  />
                                  {item.name}
                                </>
                              )}
                            </NavLink>
                          )}
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <img
              alt={settings?.logo_img_alt || "Brand logo"}
              src={settings?.logo_img || "/logoall.png"}
              className="h-10 w-auto"
            />
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigationItems.map((item) => (
                    <li key={item.name}>
                      {item.collapsible ? (
                        <Collapsible 
                          label={item.name} 
                          icon={<item.icon className="size-6 shrink-0 text-gray-400 group-hover:text-indigo-600" />}
                        >
                          <ul className="pl-8 mt-0.5">
                            {item.children.map((child) => (
                              <li key={child.name}>
                                <NavLink
                                  to={child.href}
                                  className={({ isActive }) =>
                                    cn(
                                      isActive
                                        ? "bg-indigo-50 text-indigo-600"
                                        : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                                      "rounded-md p-2 text-sm/6 font-semibold block w-full"
                                    )
                                  }
                                >
                                  {child.name}
                                </NavLink>
                              </li>
                            ))}
                          </ul>
                        </Collapsible>
                      ) : (
                        <NavLink
                          to={item.href}
                          end={item.href === "/dashboard"}
                          className={({ isActive }) =>
                            cn(
                              isActive
                                ? "bg-indigo-50 text-indigo-600"
                                : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                              "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                            )
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <item.icon
                                aria-hidden="true"
                                className={cn(
                                  isActive
                                    ? "text-indigo-600"
                                    : "text-gray-400 group-hover:text-indigo-600",
                                  "size-6 shrink-0"
                                )}
                              />
                              {item.name}
                            </>
                          )}
                        </NavLink>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="lg:pl-72">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-xs sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>

          {/* Separator */}
          <div aria-hidden="true" className="h-6 w-px bg-gray-200 lg:hidden" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <form action="#" method="GET" className="grid flex-1 grid-cols-1">
              <input
                name="search"
                type="search"
                placeholder="Search"
                aria-label="Search"
                className="col-start-1 row-start-1 block size-full bg-white pl-8 text-base text-gray-900 outline-hidden placeholder:text-gray-400 sm:text-sm/6"
              />
              <MagnifyingGlassIcon
                aria-hidden="true"
                className="pointer-events-none col-start-1 row-start-1 size-5 self-center text-gray-400"
              />
            </form>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon aria-hidden="true" className="size-6" />
              </button>

              {/* Separator */}
              <div
                aria-hidden="true"
                className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
              />

              {/* Profile dropdown */}
              <Menu as="div" className="relative">
                <MenuButton className="-m-1.5 flex items-center p-1.5">
                  <span className="sr-only">Open user menu</span>
                  {currentUser && currentUser.photoURL ? (
                    <img
                      alt="User profile"
                      src={currentUser.photoURL}
                      className="size-8 rounded-full bg-gray-50 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://ui-avatars.com/api/?name=" + (currentUser.displayName || "User") + "&background=0D8ABC&color=fff";
                      }}
                    />
                  ) : (
                    <div className="size-8 rounded-full bg-indigo-100 flex items-center justify-center">
                      <UserIcon className="size-5 text-indigo-600" />
                    </div>
                  )}
                  <span className="hidden lg:flex lg:items-center">
                    <span
                      aria-hidden="true"
                      className="ml-4 text-sm/6 font-semibold text-gray-900"
                    >
                      {currentUser?.displayName || "User"}
                    </span>
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="ml-2 size-5 text-gray-400"
                    />
                  </span>
                </MenuButton>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 ring-1 shadow-lg ring-gray-900/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                >
                  {userNavigation.map((item) => (
                    <MenuItem key={item.name}>
                      {item.type === "profile" ? (
                        <button
                          onClick={handleOpenProfileModal}
                          className="block w-full text-left px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden"
                        >
                          {item.name}
                        </button>
                      ) : (
                        <button
                          onClick={handleSignOut}
                          className="block w-full text-left px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden"
                        >
                          {item.name}
                        </button>
                      )}
                    </MenuItem>
                  ))}
                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
              <Outlet />
          </div>
        </main>
      </div>
      
      {/* Profile Modal */}
      <ProfileModal 
        isOpen={profileModalOpen} 
        onClose={() => setProfileModalOpen(false)} 
        user={currentUser} 
      />
    </div>
  );
};

export default DashboardLayout;
