'use client'

import { useMemo, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clipboard,
  FileCode2,
  FileUp,
  FlaskConical,
  Globe2,
  KeyRound,
  LockKeyhole,
  Menu,
  Network,
  Play,
  Radar,
  Search,
  ShieldCheck,
  Terminal,
  Wifi,
  X,
} from 'lucide-react'

const modules = [
  { id: 'overview', label: 'Ruta de aprendizaje', icon: BookOpen, tag: 'Inicio' },
  { id: 'nmap', label: 'Nmap y Zenmap', icon: Radar, tag: '01' },
  { id: 'wifi', label: 'Wi‑Fi y Aircrack-ng', icon: Wifi, tag: '02' },
  { id: 'sqli', label: 'SQL Injection', icon: KeyRound, tag: '03' },
  { id: 'traffic', label: 'Wireshark / TShark', icon: Activity, tag: '04' },
  { id: 'directory', label: 'BloodHound y AD', icon: Network, tag: '05' },
  { id: 'metasploit', label: 'Metasploit', icon: ShieldCheck, tag: '06' },
]

const toolCards = [
  { title: 'Nmap + Zenmap', text: 'Descubre hosts, puertos y servicios dentro de un alcance autorizado.', icon: Radar, color: 'cyan', module: 'nmap' },
  { title: 'Aircrack-ng', text: 'Comprende la seguridad Wi‑Fi y el handshake en un entorno propio.', icon: Wifi, color: 'amber', module: 'wifi' },
  { title: 'SQL Injection', text: 'Analiza una vulnerabilidad de autenticación y cómo corregirla.', icon: LockKeyhole, color: 'violet', module: 'sqli' },
  { title: 'Wireshark', text: 'Filtra tráfico y encuentra señales que requieren investigación.', icon: Activity, color: 'green', module: 'traffic' },
]

const commands = {
  nmap: ['nmap -sn {objetivo}', 'nmap -sV -p {puertos} {objetivo}', 'nmap -oA informe {objetivo}'],
  wifi: ['airmon-ng start {interfaz}', 'airodump-ng {interfaz_monitor}', 'wireshark {captura}.cap'],
  traffic: ['tshark -D', 'tshark -r {captura}.pcapng -Y "{filtro}"', 'dumpcap -c {paquetes} -w captura.pcapng'],
}

function SectionTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="mb-8 max-w-3xl">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-5xl">{title}</h1>
      <p className="mt-4 text-base leading-7 text-slate-400">{description}</p>
    </div>
  )
}

function Lab({ type }: { type: 'nmap' | 'wifi' | 'traffic' }) {
  const [target, setTarget] = useState('192.168.1.0/24')
  const [ports, setPorts] = useState('22,80,443')
  const [interfaceName, setInterfaceName] = useState('wlan0')
  const [filter, setFilter] = useState('dns')
  const [ran, setRan] = useState(false)
  const field = type === 'nmap' ? target : type === 'wifi' ? interfaceName : filter
  const setField = type === 'nmap' ? setTarget : type === 'wifi' ? setInterfaceName : setFilter
  const generated = commands[type].map((command) => command
    .replace('{objetivo}', target)
    .replace('{puertos}', ports)
    .replace('{interfaz}', interfaceName)
    .replace('{interfaz_monitor}', `${interfaceName}mon`)
    .replace('{captura}', 'laboratorio')
    .replace('{filtro}', filter)
    .replace('{paquetes}', '2000'))

  return (
    <div className="lab-panel mt-8 overflow-hidden rounded-2xl border border-cyan-400/20 bg-slate-950/70">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
        <div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-lg bg-cyan-400/10 text-cyan-300"><FlaskConical /></span><div><p className="font-medium text-white">Laboratorio guiado</p><p className="text-xs text-slate-500">Simulador local · no ejecuta comandos reales</p></div></div>
        <span className="status-dot"><span /> Entorno seguro</span>
      </div>
      <div className="grid gap-6 p-5 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="field-label">{type === 'nmap' ? 'Objetivo autorizado' : type === 'wifi' ? 'Interfaz Wi‑Fi' : 'Filtro de visualización'}
              <input className="lab-input" value={field} onChange={(e) => setField(e.target.value)} placeholder="Escribe aquí…" />
            </label>
            {type === 'nmap' && <label className="field-label">Puertos a observar<input className="lab-input" value={ports} onChange={(e) => setPorts(e.target.value)} /></label>}
          </div>
          <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm text-amber-100"><AlertTriangle className="mr-2 inline size-4 text-amber-300" /> Usa únicamente equipos, redes y capturas propias o con autorización explícita.</div>
          <button className="primary-button" onClick={() => setRan(true)}><Play data-icon="inline-start" /> Generar práctica segura</button>
          {ran && <div className="flex items-center gap-2 text-sm text-emerald-300"><CheckCircle2 className="size-4" /> Parámetros validados para el laboratorio local.</div>}
        </div>
        <div className="rounded-xl border border-white/10 bg-[#07101e] p-4">
          <div className="mb-3 flex items-center justify-between text-xs text-slate-500"><span className="flex items-center gap-2"><Terminal className="size-4" /> Consola de estudio</span><button className="copy-button" onClick={() => navigator.clipboard?.writeText(generated.join('\n'))}><Clipboard className="size-3" /> Copiar</button></div>
          <pre className="overflow-x-auto text-sm leading-8 text-cyan-100"><code>{generated.join('\n')}</code></pre>
          <p className="mt-3 text-xs leading-5 text-slate-500">La consola solo genera ejemplos parametrizados para documentar tu práctica.</p>
        </div>
      </div>
    </div>
  )
}

function Overview({ onOpen }: { onOpen: (id: string) => void }) {
  return <>
    <SectionTitle eyebrow="CYBERLAB · AULA VIRTUAL" title="Aprende a investigar. Practica con criterio." description="Un espacio de aprendizaje segmentado para comprender reconocimiento, redes, vulnerabilidades y defensa. Personaliza cada laboratorio con tus propios datos, sin salir del entorno seguro." />
    <div className="grid gap-4 md:grid-cols-3"><div className="metric-card"><span>06</span><p>Módulos prácticos</p></div><div className="metric-card"><span>04</span><p>Laboratorios guiados</p></div><div className="metric-card"><span>100%</span><p>Enfoque defensivo</p></div></div>
    <div className="mt-10 flex items-center justify-between"><div><p className="eyebrow">Explorar contenido</p><h2 className="mt-2 text-2xl font-semibold text-white">Herramientas esenciales</h2></div><span className="hidden text-sm text-slate-500 md:block">Selecciona un módulo para comenzar</span></div>
    <div className="mt-5 grid gap-4 md:grid-cols-2">{toolCards.map((card) => { const Icon = card.icon; return <button key={card.title} className="tool-card text-left" onClick={() => onOpen(card.module)}><div className={`tool-icon ${card.color}`}><Icon /></div><div className="flex-1"><div className="flex items-start justify-between gap-3"><h3 className="font-semibold text-white">{card.title}</h3><ArrowRight className="size-4 text-slate-600" /></div><p className="mt-2 text-sm leading-6 text-slate-400">{card.text}</p></div></button> })}</div>
    <div className="mt-8 rounded-2xl border border-cyan-400/20 bg-gradient-to-r from-cyan-400/10 to-transparent p-6"><div className="flex items-start gap-4"><ShieldCheck className="mt-1 size-6 text-cyan-300" /><div><h3 className="font-semibold text-white">Regla de oro del aula</h3><p className="mt-1 text-sm leading-6 text-slate-400">Toda práctica debe tener alcance definido, autorización y un objetivo documentado. La ciberseguridad profesional empieza antes del primer comando.</p></div></div></div>
  </>
}

function ModulePage({ id }: { id: string }) {
  const data: Record<string, { eyebrow: string; title: string; description: string }> = {
    nmap: { eyebrow: 'MÓDULO 01 · RECONOCIMIENTO', title: 'Nmap y Zenmap', description: 'Aprende a identificar hosts, puertos y servicios en una red de laboratorio. Comienza por descubrimiento, continúa con versiones y termina documentando hallazgos.' },
    wifi: { eyebrow: 'MÓDULO 02 · SEGURIDAD INALÁMBRICA', title: 'Wi‑Fi y Aircrack-ng', description: 'Comprende el modelo de seguridad 802.11, el handshake de cuatro vías y las diferencias entre WEP, WPA2 y WPA3. Trabaja únicamente con tu propio AP.' },
    sqli: { eyebrow: 'MÓDULO 03 · SEGURIDAD WEB', title: 'SQL Injection y autenticación', description: 'Analiza cómo una consulta construida con concatenación puede alterar la lógica de autenticación y cómo prevenirlo con consultas parametrizadas y controles de servidor.' },
    traffic: { eyebrow: 'MÓDULO 04 · ANÁLISIS FORENSE', title: 'Wireshark y TShark', description: 'Convierte una captura en evidencia: aprende filtros de visualización, jerarquía de protocolos y señales que merecen investigación.' },
    directory: { eyebrow: 'MÓDULO 05 · IDENTIDAD', title: 'BloodHound y Active Directory', description: 'Mapea relaciones de privilegio en un dominio de práctica para detectar rutas de escalada y oportunidades de hardening.' },
    metasploit: { eyebrow: 'MÓDULO 06 · VALIDACIÓN', title: 'Metasploit con responsabilidad', description: 'Conoce la estructura del framework, sus módulos y la documentación de evidencias. Las pruebas de explotación se reservan para máquinas intencionalmente vulnerables.' },
  }
  const item = data[id] ?? data.nmap
  return <><SectionTitle eyebrow={item.eyebrow} title={item.title} description={item.description} />
    {id === 'nmap' && <Lab type="nmap" />}{id === 'wifi' && <Lab type="wifi" />}{id === 'traffic' && <Lab type="traffic" />}
    {id === 'sqli' && <SqlLab />}
    {['directory', 'metasploit'].includes(id) && <div className="grid gap-4 md:grid-cols-2"><div className="info-block"><Globe2 className="size-5 text-cyan-300" /><h3>Objetivo de la lección</h3><p>Relaciona conceptos, evidencia y controles defensivos en un entorno preparado para clases.</p></div><div className="info-block"><FileCode2 className="size-5 text-cyan-300" /><h3>Entrega sugerida</h3><p>Un informe breve con alcance, método, hallazgos, impacto y recomendación de mitigación.</p></div></div>}
    <div className="mt-8 grid gap-4 md:grid-cols-3"><div className="lesson-step"><span>01</span><p>Fundamentos</p><small>Conceptos y vocabulario</small></div><div className="lesson-step"><span>02</span><p>Práctica</p><small>Datos propios del estudiante</small></div><div className="lesson-step"><span>03</span><p>Informe</p><small>Conclusiones y defensa</small></div></div>
  </>
}

function SqlLab() {
  const [user, setUser] = useState('administrator')
  const [result, setResult] = useState(false)
  return <div className="lab-panel mt-8 rounded-2xl border border-violet-400/20 bg-slate-950/70 p-5"><div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-lg bg-violet-400/10 text-violet-300"><LockKeyhole /></span><div><p className="font-medium text-white">Laboratorio de autenticación</p><p className="text-xs text-slate-500">Simulación controlada · datos ficticios</p></div></div><div className="mt-6 grid gap-5 md:grid-cols-2"><div className="space-y-4"><label className="field-label">Usuario de prueba<input className="lab-input" value={user} onChange={(e) => setUser(e.target.value)} /></label><label className="field-label">Contraseña<input className="lab-input" type="password" placeholder="••••••••" /></label><button className="primary-button" onClick={() => setResult(true)}><Play data-icon="inline-start" /> Ejecutar simulación</button></div><div className="rounded-xl border border-white/10 bg-[#07101e] p-4 text-sm leading-7 text-slate-300"><p className="font-mono text-xs text-slate-500">consulta segura</p><code className="mt-2 block text-cyan-100">SELECT id FROM users<br />WHERE username = ?<br />AND password_hash = ?;</code>{result && <p className="mt-4 text-emerald-300">✓ Entrada tratada como dato, no como código.</p>}</div></div><div className="mt-5 rounded-xl border border-violet-400/20 bg-violet-400/5 p-4 text-sm text-slate-300"><strong className="text-violet-200">Aprendizaje clave:</strong> usa consultas parametrizadas, hashing de contraseñas, mensajes de error genéricos y límites de intentos. No pruebes payloads contra sistemas reales.</div></div>
}

export default function Page() {
  const [active, setActive] = useState('overview')
  const [mobileNav, setMobileNav] = useState(false)
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => modules.filter((m) => m.label.toLowerCase().includes(query.toLowerCase())), [query])
  return <main className="cyber-shell"><aside className={`sidebar ${mobileNav ? 'open' : ''}`}><div className="brand"><div className="brand-mark"><ShieldCheck /></div><div><p className="brand-name">CYBER<span>LAB</span></p><p className="brand-sub">Aula de ciberseguridad</p></div><button className="mobile-close" onClick={() => setMobileNav(false)}><X /></button></div><div className="sidebar-label">Contenido</div><nav className="module-nav">{filtered.map((module) => { const Icon = module.icon; return <button key={module.id} className={`module-link ${active === module.id ? 'active' : ''}`} onClick={() => { setActive(module.id); setMobileNav(false) }}><Icon /><span>{module.label}</span><b>{module.tag}</b></button> })}</nav><div className="sidebar-footer"><div className="avatar">ES</div><div><p className="text-sm font-medium text-white">Modo estudiante</p><p className="text-xs text-slate-500">Progreso local</p></div></div></aside><div className="content-area"><header className="topbar"><button className="menu-button" onClick={() => setMobileNav(true)}><Menu /></button><div className="breadcrumb"><span>Cyberlab</span><ChevronRight /><strong>{modules.find((m) => m.id === active)?.label}</strong></div><div className="top-actions"><div className="search-box"><Search /><input aria-label="Buscar módulo" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar módulo…" /></div><span className="secure-badge"><span /> Seguro</span></div></header><section className="main-content"><div className="content-width">{active === 'overview' ? <Overview onOpen={setActive} /> : <ModulePage id={active} />}<footer className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5 text-xs text-slate-600"><span>CYBERLAB · Material educativo para entornos autorizados</span><span className="flex items-center gap-2"><ShieldCheck className="size-3" /> Práctica responsable</span></footer></div></section></div></main>
}

