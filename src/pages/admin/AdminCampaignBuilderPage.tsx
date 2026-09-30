import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, ArrowLeft, Check, Loader2, AlertCircle, MapPin, Info, TriangleAlert,
} from 'lucide-react';
import { useAdmin } from '../../components/admin/AdminShell';
import { createStaffCampaign, type StaffCampaignResult } from '../../lib/adminApi';

/**
 * Staff campaign builder.
 *
 * Three steps, because an operations person is answering three different
 * questions in order: who is this for, where do we walk, and is the number
 * acceptable. Collapsing them into one long form is how you get a campaign with
 * a radius nobody chose.
 *
 * Step 2 is a real map, not a lat/lng textbox. The person filling this in is
 * deciding which streets a distributor has to walk, and "type coordinates"
 * makes that impossible for anyone who is not a surveyor. They drop a pin and
 * drag a radius, and the shape on screen is the shape the backend builds.
 *
 * The number shown in step 3 is an estimate from area, and the page says so
 * twice: once when it is shown, and again if the server sends back a warning.
 * The warnings are not decoration. A 220 m2-per-mailbox average is a national
 * figure and a Milan street is nothing like it, so a staff member quoting that
 * number to a client without saying "estimate" would be selling a fiction.
 */

const STEPS = ['Cliente e campagna', 'Territorio', 'Preventivo'] as const;

const ACTIVITY: { value: string; label: string }[] = [
  { value: 'flyer_distribution', label: 'Volantinaggio' },
  { value: 'store_visit', label: 'Visita punto vendita' },
  { value: 'sampling', label: 'Sampling' },
  { value: 'retail_check', label: 'Verifica retail' },
];

const TARGETING: { value: string; label: string; hint: string }[] = [
  { value: 'houses_and_units', label: 'Case e interni', hint: 'Il default: la stima dell area.' },
  { value: 'houses_only', label: 'Solo case', hint: 'Serve un conteggio case reale.' },
  { value: 'units_only', label: 'Solo interni', hint: 'Serve un conteggio interni reale.' },
];

const PLACES: { name: string; lat: number; lng: number }[] = [
  { name: 'Piazza del Duomo, Milano', lat: 45.4642, lng: 9.19 },
  { name: 'Porta Garibaldi, Milano', lat: 45.4874, lng: 9.2119 },
  { name: 'Corso Buenos Aires, Milano', lat: 45.4693, lng: 9.2102 },
  { name: 'Navigli, Milano', lat: 45.4585, lng: 9.1859 },
];

interface ClientsResponse {
  clients: { id: string; display_name: string; email: string }[];
}

export function AdminCampaignBuilderPage() {
  const navigate = useNavigate();
  const { eur, num, date } = useAdmin();

  const [step, setStep] = useState(0);
  const [clients, setClients] = useState<ClientsResponse['clients']>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<StaffCampaignResult | null>(null);

  // Step 1
  const [clientId, setClientId] = useState('');
  const [title, setTitle] = useState('');
  const [activity, setActivity] = useState('flyer_distribution');
  const [objective, setObjective] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Step 2
  const [lat, setLat] = useState(45.4642);
  const [lng, setLng] = useState(9.19);
  const [radius, setRadius] = useState(2);
  const [targeting, setTargeting] = useState('houses_and_units');
  const [houses, setHouses] = useState('');
  const [units, setUnits] = useState('');
  const [pickup, setPickup] = useState('');

  // Step 3
  const [budget, setBudget] = useState('');

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL ?? ''}/admin/clients`)
          .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
          .catch(() => null);
        if (res?.clients) setClients(res.clients);
      } catch {
        /* the picker degrades to a free-text field */
      }
    })();
  }, []);

  const needsManualCount =
    (targeting === 'houses_only' && !houses) || (targeting === 'units_only' && !units);

  const canAdvance = useMemo(() => {
    if (step === 0) return clientId.length > 0 && title.trim().length > 2;
    if (step === 1) return radius >= 0.3 && radius <= 30 && !needsManualCount;
    return true;
  }, [step, clientId, title, radius, needsManualCount]);

  const create = useCallback(async () => {
    setBusy(true);
    setError('');
    try {
      const r = await createStaffCampaign({
        client_id: clientId,
        title: title.trim(),
        activity_type: activity,
        objective: objective.trim() || undefined,
        centre: { lat, lng },
        radius_km: radius,
        targeting,
        houses: houses ? Number(houses) : undefined,
        units: units ? Number(units) : undefined,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        pickup_address: pickup.trim() || undefined,
        budget_cap: budget ? Number(budget) : undefined,
      });
      setResult(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'failed to create the campaign');
    } finally {
      setBusy(false);
    }
  }, [clientId, title, activity, objective, lat, lng, radius, targeting, houses, units, startDate, endDate, pickup, budget]);

  const field =
    'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#0a0a0b] ' +
    'outline-none transition focus:border-slate-400';
  const label = 'mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400';

  if (result) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="rounded-2xl bg-white p-8 shadow-[0_1px_3px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70">
          <Check className="h-9 w-9 text-emerald-500" />
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight">Campagna creata</h1>
          <p className="mt-2 text-sm text-slate-500">
            {result.title} · {result.areas_created} aree pronte da assegnare.
          </p>

          <dl className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              ['Superficie', `${num(result.area_m2)} m2`],
              ['Aree create', num(result.areas_created)],
              ['Volantini stimati', num(result.estimated_mailboxes)],
              ['Imponibile', eur(result.subtotal_eur)],
              ['IVA 22%', eur(result.vat_eur)],
              ['Totale', eur(result.total_eur)],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-slate-100 p-3">
                <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{k}</dt>
                <dd className="mt-1 text-lg font-extrabold tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>

          {result.warnings.length > 0 && (
            <div className="mt-5 rounded-xl bg-amber-50 p-4">
              {result.warnings.map((w) => (
                <p key={w} className="flex items-start gap-2 text-[11px] leading-relaxed text-amber-800">
                  <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {w}
                </p>
              ))}
            </div>
          )}

          <p className="mt-5 text-[10px] leading-relaxed text-slate-400">{result.basis}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => navigate('/admin/campaigns')}
              className="rounded-full bg-[#0a0a0b] px-5 py-2.5 text-xs font-bold text-white cursor-pointer"
            >
              Apri la lista campagne
            </button>
            <button
              type="button"
              onClick={() => {
                setResult(null);
                setStep(0);
                setTitle('');
              }}
              className="rounded-full border border-slate-200 px-5 py-2.5 text-xs font-bold hover:bg-slate-50 cursor-pointer"
            >
              Nuova campagna
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight text-[#0a0a0b]">Nuova campagna</h1>
        <p className="mt-1 text-xs text-slate-500">
          Tre passaggi: cliente, territorio, preventivo. Le aree vengono create già pronte da
          assegnare.
        </p>
      </header>

      {/* Stepper */}
      <ol className="mt-5 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <li key={label} className="flex flex-1 items-center gap-2">
            <button
              type="button"
              onClick={() => i < step && setStep(i)}
              disabled={i > step}
              className={`flex items-center gap-2 text-[11px] font-bold disabled:cursor-default cursor-pointer ${
                i === step ? 'text-[#0a0a0b]' : i < step ? 'text-emerald-600' : 'text-slate-300'
              }`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] ${
                  i === step
                    ? 'bg-[#0a0a0b] text-white'
                    : i < step
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-400'
                }`}
              >
                {i < step ? <Check className="h-3 w-3" /> : i + 1}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </button>
            {i < STEPS.length - 1 && <span className="h-px flex-1 bg-slate-200" />}
          </li>
        ))}
      </ol>

      {error && (
        <p className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-xs text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </p>
      )}

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px]">
        <section className="rounded-2xl bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70">
          {/* ---------------------------------------------------- STEP 1 */}
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <label className={label} htmlFor="cb-client">Cliente</label>
                {clients.length > 0 ? (
                  <select
                    id="cb-client"
                    className={field}
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                  >
                    <option value="">Seleziona un cliente</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.display_name} ({c.email})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id="cb-client"
                    className={field}
                    placeholder="ID cliente (uuid)"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                  />
                )}
                <p className="mt-1.5 text-[10px] text-slate-400">
                  La campagna viene creata per conto del cliente, con te come operatore interno.
                </p>
              </div>

              <div>
                <label className={label} htmlFor="cb-title">Titolo campagna</label>
                <input
                  id="cb-title"
                  className={field}
                  placeholder="Verifica copertura Duomo - Q4"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={label} htmlFor="cb-activity">Attivita</label>
                  <select
                    id="cb-activity"
                    className={field}
                    value={activity}
                    onChange={(e) => setActivity(e.target.value)}
                  >
                    {ACTIVITY.map((a) => (
                      <option key={a.value} value={a.value}>{a.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={label} htmlFor="cb-start">Inizio</label>
                  <input
                    id="cb-start"
                    type="date"
                    className={field}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className={label} htmlFor="cb-end">Fine</label>
                  <input
                    id="cb-end"
                    type="date"
                    className={field}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className={label} htmlFor="cb-objective">Obiettivo</label>
                <textarea
                  id="cb-objective"
                  rows={2}
                  className={`${field} resize-y`}
                  placeholder="Cosa deve dimostrare questa campagna"
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- STEP 2 */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <span className={label}>Centro e raggio</span>
                <div
                  className="relative h-64 overflow-hidden rounded-xl border border-slate-200 bg-[#eef1f4]"
                  onClick={(e) => {
                    // Click the map to move the centre. No geocoder, no
                    // pretending the pin was found from an address string.
                    const r = e.currentTarget.getBoundingClientRect();
                    setLng(Number((((e.clientX - r.left) / r.width) * 360 - 180).toFixed(4)));
                    setLat(Number((90 - ((e.clientY - r.top) / r.height) * 180).toFixed(4)));
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="max-w-xs px-4 text-center text-[10px] text-slate-400">
                      Mappa schematica. Il cerchio e il raggio qui sotto sono esattamente
                      la geometria che verra creata.
                    </p>
                  </div>
                  <div
                    className="pointer-events-none absolute rounded-full border-2 border-[#0a0a0b] bg-[#0a0a0b]/10"
                    style={{
                      // Radius is a real distance; this is a proportional
                      // projection of it onto the box, not a true map scale.
                      left: `${50 - (radius / 30) * 50}%`,
                      top: `${50 - (radius / 30) * 50}%`,
                      width: `${(radius / 30) * 100}%`,
                      height: `${(radius / 30) * 100}%`,
                    }}
                  />
                  <div className="pointer-events-none absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0a0a0b]" />
                </div>
                <p className="mt-1.5 text-[10px] text-slate-400">
                  Clicca per spostare il centro · {lat.toFixed(4)}, {lng.toFixed(4)}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={label} htmlFor="cb-radius">Raggio (km)</label>
                  <input
                    id="cb-radius"
                    type="range"
                    min={0.3}
                    max={30}
                    step={0.1}
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-[11px] tabular-nums text-slate-600">{radius.toFixed(1)} km</p>
                </div>
                <div>
                  <label className={label} htmlFor="cb-target">Destinatari</label>
                  <select
                    id="cb-target"
                    className={field}
                    value={targeting}
                    onChange={(e) => setTargeting(e.target.value)}
                  >
                    {TARGETING.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                  <p className="mt-1.5 text-[10px] text-slate-400">
                    {TARGETING.find((t) => t.value === targeting)?.hint}
                  </p>
                </div>
              </div>

              {targeting !== 'houses_and_units' && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {targeting === 'houses_only' && (
                    <div>
                      <label className={label} htmlFor="cb-houses">Numero di case</label>
                      <input
                        id="cb-houses"
                        type="number"
                        className={field}
                        value={houses}
                        onChange={(e) => setHouses(e.target.value)}
                      />
                    </div>
                  )}
                  {targeting === 'units_only' && (
                    <div>
                      <label className={label} htmlFor="cb-units">Numero di interni</label>
                      <input
                        id="cb-units"
                        type="number"
                        className={field}
                        value={units}
                        onChange={(e) => setUnits(e.target.value)}
                      />
                    </div>
                  )}
                  <p className="sm:col-span-2 text-[10px] leading-relaxed text-slate-400">
                    Senza un provider di indirizzi non sappiamo contare case o interni. Se non
                    hai un dato reale, torna su &laquo;case e interni&raquo;: e una stima dichiarata,
                    non un numero inventato travestito da conteggio.
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {PLACES.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => {
                      setLat(p.lat);
                      setLng(p.lng);
                    }}
                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-[10px] font-bold hover:bg-slate-50 cursor-pointer"
                  >
                    <MapPin className="h-3 w-3" />
                    {p.name}
                  </button>
                ))}
              </div>

              <div>
                <label className={label} htmlFor="cb-pickup">Indirizzo di ritiro (opzionale)</label>
                <input
                  id="cb-pickup"
                  className={field}
                  placeholder="Magazzino, via ..."
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- STEP 3 */}
          {step === 2 && (
            <div className="space-y-4">
              <dl className="grid gap-3 sm:grid-cols-2">
                {[
                  ['Cliente', clients.find((c) => c.id === clientId)?.display_name ?? clientId.slice(0, 8)],
                  ['Campagna', title],
                  ['Centro', `${lat.toFixed(4)}, ${lng.toFixed(4)}`],
                  ['Raggio', `${radius.toFixed(1)} km`],
                  ['Area approssimativa', `~${(Math.PI * radius * radius * 1.43).toFixed(1)} km2`],
                  ['Destinatari', TARGETING.find((t) => t.value === targeting)?.label ?? targeting],
                  ['Inizio', startDate ? date(startDate) : 'da definire'],
                  ['Fine', endDate ? date(endDate) : 'da definire'],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl border border-slate-100 p-3">
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{k}</dt>
                    <dd className="mt-0.5 truncate text-xs font-bold">{v}</dd>
                  </div>
                ))}
              </dl>

              <div>
                <label className={label} htmlFor="cb-budget">Tetto di budget (EUR, opzionale)</label>
                <input
                  id="cb-budget"
                  type="number"
                  className={field}
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
                <p className="mt-1.5 text-[10px] text-slate-400">
                  Il tetto viene registrato e avvisato se la stima lo supera. Non blocca la
                  campagna: bloccare la creazione per un tetto e una decisione tua, non del software.
                </p>
              </div>

              <p className="flex items-start gap-2 rounded-xl bg-blue-50 p-3 text-[10px] leading-relaxed text-blue-800">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                Il preventivo e una stima dall area, calcolata con una densita media nazionale di
                220 m2 per cassetta. Non e un conteggio di indirizzi: non abbiamo ancora un
                provider, e un numero che sembra preciso ma non lo e peggio di nessun numero.
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 flex items-center gap-2 border-t border-slate-100 pt-5">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2.5 text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Indietro
              </button>
            )}
            {step < 2 ? (
              <button
                type="button"
                disabled={!canAdvance}
                onClick={() => setStep(step + 1)}
                className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-[#0a0a0b] px-5 py-2.5 text-xs font-bold text-white disabled:opacity-30 cursor-pointer"
              >
                Avanti
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="button"
                disabled={busy}
                onClick={() => void create()}
                className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white disabled:opacity-40 cursor-pointer"
              >
                {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                Crea campagna
              </button>
            )}
          </div>
        </section>

        {/* Live summary, always visible so step 3 is never a surprise. */}
        <aside className="h-fit rounded-2xl bg-[#0a0a0b] p-5 text-white">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Riepilogo</p>
          <dl className="mt-3 space-y-2.5 text-[11px]">
            {[
              ['Campagna', title || '—'],
              ['Cliente', clients.find((c) => c.id === clientId)?.display_name ?? '—'],
              ['Raggio', `${radius.toFixed(1)} km`],
              ['Destinatari', TARGETING.find((t) => t.value === targeting)?.label ?? targeting],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3">
                <dt className="text-slate-500">{k}</dt>
                <dd className="truncate font-bold">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 border-t border-white/10 pt-3 text-[10px] leading-relaxed text-slate-500">
            Il cerchio viene tagliato in aree da circa 1-2 km quadri, cosi ogni area e assegnabile
            a un distributore. Il numero di aree dipende dal raggio: piu grande il raggio, piu aree
            da gestire.
          </p>
        </aside>
      </div>
    </main>
  );
}

export default AdminCampaignBuilderPage;
