import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2, ShieldAlert } from 'lucide-react';
import { AdminProvider, AdminShell, useAdmin } from '../../components/admin/AdminShell';
import { getAdminOverview } from '../../lib/adminApi';
import { syncBackendUser } from '../../lib/api';
import { useUser } from '@clerk/clerk-react';

/**
 * Guard for the internal console.
 *
 * The API is the real boundary — every `/admin` route is role-gated server
 * side. This guard exists so a non-staff member sees a clear refusal instead of
 * a screen full of failed requests, and so a staff member without a session is
 * sent to sign in rather than shown a broken shell.
 */
function StaffGate({ children }: { children: (staff: { name: string; role: string }) => React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const { t } = useAdmin();
  const [state, setState] = useState<'loading' | 'denied' | 'ok'>('loading');
  const [staff, setStaff] = useState({ name: '', role: '' });

  useEffect(() => {
    let active = true;
    void (async () => {
      if (!isLoaded) return;
      if (!user?.primaryEmailAddress?.emailAddress) {
        setState('denied');
        return;
      }
      try {
        const u = await syncBackendUser({
          clerkId: user.id,
          email: user.primaryEmailAddress.emailAddress,
          name: user.fullName ?? undefined,
          role: 'client',
        });
        // A cheap authenticated call doubles as the staff check: it 403s for a
        // non-staff member, which is exactly the answer we need.
        await getAdminOverview(3);
        if (!active) return;
        setStaff({ name: user.fullName ?? u, role: 'staff' });
        setState('ok');
      } catch {
        if (active) setState('denied');
      }
    })();
    return () => {
      active = false;
    };
  }, [user, isLoaded]);

  if (state === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <p className="flex items-center gap-2 text-sm text-body">
          <Loader2 className="h-4 w-4 animate-spin" /> {t('common.loading')}
        </p>
      </div>
    );
  }
  if (state === 'denied') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface p-6">
        <div className="max-w-sm rounded-2xl bg-surface p-8 text-center shadow-[0_1px_3px_rgba(15,23,42,0.06)] ring-1 ring-[var(--rr-border)]/70">
          <ShieldAlert className="mx-auto h-8 w-8 text-warning" />
          <h1 className="mt-3 text-lg font-extrabold text-[var(--rr-brand)]">{t('common.noAccess')}</h1>
          <p className="mt-1.5 text-xs leading-relaxed text-body">
            {t('common.back')}
          </p>
          <a
            href="/"
            className="mt-5 inline-flex rounded-full bg-[var(--rr-brand)] px-5 py-2.5 text-xs font-bold text-white"
          >
            Realreach
          </a>
        </div>
      </div>
    );
  }
  return <>{children(staff)}</>;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <StaffGate>
        {(staff) => (
          <AdminShell staffName={staff.name} staffRole={staff.role}>
            {children}
          </AdminShell>
        )}
      </StaffGate>
    </AdminProvider>
  );
}
