import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Bell, Menu, LogOut, User, ChevronDown, Recycle } from 'lucide-react';
import { useDataStore } from '@/hooks/useDataStore';

export default function Navbar() {
  const { currentUser, getNotifications, store } = useDataStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const isPublic = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup';
  const unreadCount = currentUser ? getNotifications(currentUser.id).filter(n => !n.read).length : 0;

  const handleLogout = () => {
    store.logout();
    navigate('/');
  };

  const roleLinks = {
    supplier: { label: 'Supplier Portal', path: '/supplier' },
    admin: { label: 'Admin Dashboard', path: '/admin' },
    industry: { label: 'Industry Portal', path: '/industry' },
    driver: { label: 'Driver Portal', path: '/driver' },
    hub_manager: { label: 'Hub Dashboard', path: '/admin' },
  };

  const publicNav = [
    { label: 'Platform', href: '#platform' },
    { label: 'Materials', href: '#materials' },
    { label: 'Process', href: '#process' },
    { label: 'ESG', href: '#esg' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-wine flex items-center justify-center">
              <Recycle className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-bold text-lg tracking-tight">Waste-to-Value</span>
          </Link>

          {isPublic && (
            <div className="hidden md:flex items-center gap-8">
              {publicNav.map(item => (
                <a key={item.label} href={item.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  {item.label}
                </a>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3">
            {currentUser ? (
              <>
                <Link to={roleLinks[currentUser.role]?.path || '/'}>
                  <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-sm">
                    {roleLinks[currentUser.role]?.label}
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="w-4.5 h-4.5" />
                      {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-gradient-wine border-0">
                          {unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <div className="p-3 border-b">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">Notifications</span>
                        {unreadCount > 0 && (
                          <button onClick={() => store.markAllNotificationsRead(currentUser.id)} className="text-xs text-primary hover:underline">
                            Mark all read
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {getNotifications(currentUser.id).slice(0, 8).map(n => (
                        <DropdownMenuItem key={n.id} className={`p-3 ${!n.read ? 'bg-primary/5' : ''}`} onClick={() => store.markNotificationRead(n.id)}>
                          <div>
                            <p className="text-xs leading-relaxed">{n.message}</p>
                            <p className="text-[10px] text-muted-foreground mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                          </div>
                        </DropdownMenuItem>
                      ))}
                      {getNotifications(currentUser.id).length === 0 && (
                        <div className="p-4 text-center text-sm text-muted-foreground">No notifications</div>
                      )}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-wine flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{currentUser.name?.[0]}</span>
                      </div>
                      <span className="hidden sm:inline text-sm">{currentUser.name?.split(' ')[0]}</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="px-3 py-2 border-b">
                      <p className="text-sm font-medium">{currentUser.name}</p>
                      <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                      <Badge variant="secondary" className="mt-1 text-[10px] capitalize">{currentUser.role}</Badge>
                    </div>
                    <DropdownMenuItem onClick={() => navigate(roleLinks[currentUser.role]?.path || '/')}>
                      <User className="w-4 h-4 mr-2" /> Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                      <LogOut className="w-4 h-4 mr-2" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/login"><Button variant="ghost" size="sm" className="text-sm">Sign In</Button></Link>
                <Link to="/register"><Button size="sm" className="bg-gradient-wine hover:opacity-90 text-white text-sm">Get Started</Button></Link>
              </>
            )}

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex flex-col gap-4 mt-8">
                  {isPublic && publicNav.map(item => (
                    <a key={item.label} href={item.href} onClick={() => setOpen(false)} className="text-lg font-medium">{item.label}</a>
                  ))}
                  {!currentUser && (
                  <>
                    <Link to="/login" onClick={() => setOpen(false)} className="text-lg font-medium">Sign In</Link>
                    <Link to="/register" onClick={() => setOpen(false)}><Button className="w-full bg-gradient-wine text-white">Get Started</Button></Link>
                  </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}