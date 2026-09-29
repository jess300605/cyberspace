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
  { id: 'medusa', label: 'Medusa', icon: KeyRound, tag: '01' },
  { id: 'nmap', label: 'Nmap y Zenmap', icon: Radar, tag: '02' },
  { id: 'nse', label: 'Nmap Scripting Engine', icon: FileCode2, tag: '03' },
  { id: 'wifi', label: 'Wi‑Fi y Aircrack-ng', icon: Wifi, tag: '04' },
  { id: 'sqli', label: 'SQL Injection', icon: LockKeyhole, tag: '05' },
  { id: 'traffic', label: 'Wireshark / TShark', icon: Activity, tag: '06' },
  { id: 'directory', label: 'BloodHound y AD', icon: Network, tag: '07' },
  { id: 'shodan', label: 'Shodan', icon: Globe2, tag: '08' },
  { id: 'metasploit', label: 'Metasploit', icon: ShieldCheck, tag: '09' },
  { id: 'flow', label: 'Flujo de pentest', icon: CheckCircle2, tag: '10' },
  { id: 'cases', label: 'Casos de uso', icon: Play, tag: '11' },
]

const toolCards = [
  { title: 'Nmap + Zenmap', text: 'Descubre hosts, puertos y servicios dentro de un alcance autorizado.', icon: Radar, color: 'cyan', module: 'nmap' },
  { title: 'Aircrack-ng', text: 'Comprende la seguridad Wi‑Fi y el handshake en un entorno propio.', icon: Wifi, color: 'amber', module: 'wifi' },
  { title: 'SQL Injection', text: 'Analiza una vulnerabilidad de autenticación y cómo corregirla.', icon: LockKeyhole, color: 'violet', module: 'sqli' },
  { title: 'Wireshark', text: 'Filtra tráfico y encuentra señales que requieren investigación.', icon: Activity, color: 'green', module: 'traffic' },
]

const commands = {
  nmap: ['nmap -sn {objetivo}', 'nmap -Pn {objetivo}', 'nmap -PR {objetivo}', 'sudo nmap -sS {objetivo}', 'nmap -sT {objetivo}', 'sudo nmap -sU {objetivo}', 'nmap -sN {objetivo}', 'nmap -sF {objetivo}', 'nmap -sX {objetivo}', 'nmap -p {puertos} {objetivo}', 'nmap -p- {objetivo}', 'nmap --top-ports 100 {objetivo}', 'nmap -sV {objetivo}', 'sudo nmap -O {objetivo}', 'sudo nmap -A {objetivo}', 'nmap -sC {objetivo}', 'nmap --script vuln {objetivo}', 'nmap --script smb-vuln-ms17-010 -p445 {objetivo}', 'nmap --script ftp-anon -p21 {objetivo}', 'nmap -oA informe {objetivo}', 'nmap -T4 {objetivo}'],
  wifi: ['airmon-ng check kill', 'airmon-ng start {interfaz}', 'iw dev', 'iwconfig', 'airodump-ng {interfaz_monitor}', 'airodump-ng --bssid {BSSID} --channel {canal} --write {captura} {interfaz_monitor}', 'aireplay-ng --deauth 0 -a {BSSID} {interfaz_monitor}', 'aircrack-ng {captura}-01.cap', 'aircrack-ng -w wordlist.txt {captura}-01.cap', 'airmon-ng stop {interfaz_monitor}', 'systemctl restart NetworkManager', 'wireshark {captura}.cap'],
  traffic: ['tshark -D', 'tshark -r {captura}.pcapng -Y "{filtro}"', 'tshark -i3 -w captura.pcapng', 'tshark -i3 -f "tcp port 80" -w web.pcapng', 'tshark -i3 -a duration:60 -w sesion.pcapng', 'tshark -i3 -a files:6 -b duration:30 -w cap.pcapng', 'tshark -qz io,phs', 'tshark -qz hosts', 'tshark -qz conv,tcp', 'tshark -qz expert,warns', 'tshark -r {captura}.pcapng -T fields -e ip.src -e ip.dst -e tcp.dstport', 'tshark -r {captura}.pcapng -Y "dns" -T fields -e dns.qry.name', 'dumpcap -D', 'dumpcap -i3 -c {paquetes} -w captura.pcapng'],
}

const commandSections: Record<string, [string, string][]> = {
  medusa: [
    ['medusa', 'Muestra opciones disponibles'], ['medusa -d', 'Lista módulos soportados'], ['medusa -h {IP} -u {user} -P pass.txt -M ftp', 'Prueba contraseñas en un laboratorio'], ['medusa -h {IP} -U users.txt -p {pass} -M ftp', 'Prueba usuarios conocidos'], ['medusa -h {IP} -U users.txt -P pass.txt -M ftp', 'Auditoría completa de credenciales'], ['medusa -H hosts.txt -U users.txt -P pass.txt -M ftp', 'Trabaja con múltiples hosts'], ['medusa ... -T 2', 'Controla hosts en paralelo'], ['medusa ... -M ssh -n 2222', 'Usa un puerto no estándar'], ['medusa ... -e ns', 'Prueba credenciales vacías o iguales al usuario'], ['medusa ... -O log.txt', 'Guarda resultados'], ['medusa ... -f / -F', 'Detiene al encontrar un login válido'], ['medusa ... -v 6', 'Activa salida detallada'], ['medusa -M ftp -C userpass.txt', 'Usa un archivo combo'], ['medusa ... -t 4', 'Cuatro logins simultáneos por host'], ['medusa ... -q', 'Muestra información del módulo'],
  ],
  nse: [
    ['nmap --script http-title {target}', 'Ejecuta un script NSE'], ['nmap --script http-title,http-methods {target}', 'Ejecuta varios scripts'], ['nmap --script "http-* and not(exploit)" {target}', 'Selecciona scripts con expresiones'], ['nmap --script "not(intrusive or dos or exploit)" -sV {target}', 'Excluye categorías peligrosas'], ['nmap --script brute --script-args userdb=users.txt', 'Pasa argumentos'], ['nmap --script brute --script-args brute.firstOnly', 'Se detiene ante el primer resultado'], ['nmap --script vuln --script-args unsafe -p- -sV {target}', 'Pruebas inseguras, solo en laboratorio'], ['nmap -sC -F {target}', 'Scripts predeterminados'], ['nmap --script /ruta/a/script.nse {target}', 'Ejecuta un script propio'], ['nmap --script broadcast-ping --script-args newtargets', 'Descubrimiento por broadcast'], ['nmap -d3 --script mybuggyscript {target}', 'Depura un script'], ['nmap --script-trace --script exploit {target}', 'Traza comunicaciones'],
  ],
  shodan: [
    ['pip install shodan', 'Instala el cliente CLI'], ['shodan init {API_KEY}', 'Configura la API'], ['shodan info', 'Muestra créditos disponibles'], ['shodan count openssh', 'Cuenta resultados'], ['shodan host {IP}', 'Consulta una IP'], ['shodan myip', 'Muestra la IP pública'], ["shodan search 'product:MySQL'", 'Busca por producto'], ['shodan search --fields ip_str,port,org product:mongodb', 'Filtra campos'], ["shodan download resultados 'query'", 'Descarga resultados'], ['shodan parse --fields ip_str,port -f port:2222 archivo.json.gz', 'Filtra resultados descargados'], ['shodan stats --facets country,port nginx', 'Obtiene estadísticas'], ['shodan scan submit {IP}', 'Solicita un escaneo autorizado'], ['shodan scan status {scan_id}', 'Consulta estado'],
  ],
  bloodhound: [['apt install bloodhound', 'Instala la interfaz'], ['neo4j console', 'Levanta Neo4j'], ['bloodhound', 'Abre la GUI'], ['pip3 install bloodhound', 'Instala el ingestor Python'], ['bloodhound-python -u administrator -p {pass} -ns {IP_DC} -d dominio.local -c All', 'Extrae datos del dominio'], ['SharpHound.exe', 'Ingestor para Windows'], ['Invoke-BloodHound -CollectionMethod All', 'Recolecta datos con PowerShell']],
  metasploit: [['search ms08_067', 'Busca un módulo'], ['use windows/smb/ms08_067_netapi', 'Selecciona un módulo'], ['show options', 'Muestra parámetros'], ['set RHOST {IP}', 'Define objetivo'], ['set RHOSTS {rango}', 'Define un rango'], ['set LHOST {IP}', 'Define IP local'], ['set PAYLOAD windows/meterpreter/reverse_tcp', 'Selecciona payload'], ['show payloads', 'Lista payloads'], ['exploit', 'Ejecuta el módulo en una VM'], ['exploit -j', 'Ejecuta como job'], ['db_import escaneo.xml', 'Importa Nmap'], ['db_hosts / db_services', 'Consulta la base de datos'], ['run', 'Ejecuta auxiliares'], ['use auxiliary/scanner/ftp/ftp_version', 'Reconoce FTP'], ['use multi/handler', 'Configura listener'], ['resource autoexploit.rc', 'Automatiza con recursos'], ['getuid', 'Muestra usuario actual'], ['ps', 'Lista procesos'], ['shell', 'Abre shell nativa'], ['background', 'Envía sesión a segundo plano'], ['run checkvm', 'Detecta virtualización'], ['msfvenom --payload {payload} ...', 'Genera payloads para laboratorio'], ['pattern_create.rb {bytes}', 'Genera patrones'], ['pattern_offset.rb {patrón}', 'Calcula offsets']],
}

function CommandTable({ id }: { id: string }) {
  const rows = commandSections[id]
  if (!rows) return null
  return <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/60 p-5"><div className="mb-4 flex items-center gap-3"><Terminal className="size-5 text-cyan-300" /><div><h3 className="font-semibold text-white">Catálogo completo de comandos</h3><p className="text-xs text-slate-500">Referencia educativa para entornos autorizados</p></div></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500"><th className="px-3 py-3">Comando</th><th className="px-3 py-3">Uso</th></tr></thead><tbody>{rows.map(([command, use]) => <tr key={command} className="border-b border-white/5"><td className="px-3 py-3 font-mono text-cyan-100">{command}</td><td className="px-3 py-3 text-slate-400">{use}</td></tr>)}</tbody></table></div></div>
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
    <div className="grid gap-4 md:grid-cols-3"><div className="metric-card"><span>10</span><p>Módulos prácticos</p></div><div className="metric-card"><span>100+</span><p>Comandos documentados</p></div><div className="metric-card"><span>100%</span><p>Enfoque defensivo</p></div></div>
    <div className="mt-10 flex items-center justify-between"><div><p className="eyebrow">Explorar contenido</p><h2 className="mt-2 text-2xl font-semibold text-white">Herramientas esenciales</h2></div><span className="hidden text-sm text-slate-500 md:block">Selecciona un módulo para comenzar</span></div>
    <div className="mt-5 grid gap-4 md:grid-cols-2">{toolCards.map((card) => { const Icon = card.icon; return <button key={card.title} className="tool-card text-left" onClick={() => onOpen(card.module)}><div className={`tool-icon ${card.color}`}><Icon /></div><div className="flex-1"><div className="flex items-start justify-between gap-3"><h3 className="font-semibold text-white">{card.title}</h3><ArrowRight className="size-4 text-slate-600" /></div><p className="mt-2 text-sm leading-6 text-slate-400">{card.text}</p></div></button> })}</div>
    <div className="mt-8 rounded-2xl border border-cyan-400/20 bg-gradient-to-r from-cyan-400/10 to-transparent p-6"><div className="flex items-start gap-4"><ShieldCheck className="mt-1 size-6 text-cyan-300" /><div><h3 className="font-semibold text-white">Regla de oro del aula</h3><p className="mt-1 text-sm leading-6 text-slate-400">Toda práctica debe tener alcance definido, autorización y un objetivo documentado. La ciberseguridad profesional empieza antes del primer comando.</p></div></div></div>
  </>
}

function TryHackMeFlow() {
  const steps = [
    ['01', 'Define room and scope', 'Selecciona una sala oficial y trabaja solo con la IP privada entregada por la VPN.'],
    ['02', 'Connect and verify', 'Conecta la VPN, confirma tu interfaz y valida conectividad sin tocar objetivos externos.'],
    ['03', 'Enumerate gently', 'Empieza con ping, puertos comunes y detección de versiones; documenta cada comando.'],
    ['04', 'Validate the lesson', 'Usa únicamente las técnicas indicadas por la sala y detente cuando obtengas la evidencia solicitada.'],
    ['05', 'Report and reset', 'Guarda capturas, hallazgos y mitigaciones; desconecta la VPN y elimina credenciales temporales.'],
  ]
  return <div className="mt-8 space-y-5"><div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-5"><div className="flex items-start gap-4"><BookOpen className="mt-1 size-5 text-cyan-300" /><div><h3 className="font-semibold text-white">Flujo seguro para TryHackMe</h3><p className="mt-2 text-sm leading-6 text-slate-400">Este recorrido conecta cada comando con una práctica de aprendizaje. La plataforma proporciona el objetivo y la autorización; no reutilices estas técnicas fuera de la sala.</p></div></div></div><div className="grid gap-3 md:grid-cols-5">{steps.map(([number, title, text]) => <div key={number} className="rounded-xl border border-white/10 bg-slate-950/60 p-4"><span className="font-mono text-xs text-cyan-300">{number}</span><h4 className="mt-3 text-sm font-semibold text-white">{title}</h4><p className="mt-2 text-xs leading-5 text-slate-500">{text}</p></div>)}</div><div className="grid gap-4 md:grid-cols-2"><div className="info-block"><Terminal className="size-5 text-cyan-300" /><h3>Kit de verificación inicial</h3><pre className="mt-4 overflow-x-auto text-xs leading-6 text-cyan-100"><code>{`ip addr show\nip route\nping -c 3 {IP_TARGET}\nnmap -Pn -p 22,80,443 {IP_TARGET}\nnmap -sV --version-light {IP_TARGET}`}</code></pre></div><div className="info-block"><ShieldCheck className="size-5 text-cyan-300" /><h3>Casos de uso por sala</h3><ul className="mt-3 space-y-2 text-sm leading-6 text-slate-400"><li>Reconocimiento: identifica servicios y registra versiones.</li><li>Web: revisa rutas y respuestas sin automatización agresiva.</li><li>Blue team: captura tráfico, crea filtros y explica la evidencia.</li><li>Windows/AD: relaciona usuarios, grupos y privilegios en el dominio de práctica.</li></ul></div></div></div>
}

function UseCases() {
  const cases = [
    { title: 'Reconocimiento inicial en TryHackMe', level: 'Fundamental', goal: 'Identificar superficie expuesta sin lanzar acciones intrusivas.', commands: ['export TARGET={IP_TARGET}', 'ip addr show && ip route', 'ping -c 3 $TARGET', 'nmap -Pn --top-ports 100 -sV --version-light $TARGET', 'nmap -Pn -p- --min-rate 500 $TARGET -oA recon-full'], evidence: 'IP, latencia, puertos abiertos, versiones y archivo recon-full.nmap.' },
    { title: 'Enumeración web controlada', level: 'Intermedio', goal: 'Relacionar puertos web con tecnologías, rutas y controles observables.', commands: ['export WEB=http://{IP_TARGET}', 'curl -I $WEB', 'whatweb $WEB', 'nmap -p80,443 --script http-title,http-headers,http-methods $TARGET', 'ffuf -u $WEB/FUZZ -w /usr/share/wordlists/dirb/common.txt -t 10 -fc 404'], evidence: 'Cabeceras, título, métodos permitidos y rutas encontradas; no fuerces autenticación.' },
    { title: 'Análisis de una captura', level: 'Defensivo', goal: 'Detectar DNS, sesiones TCP y señales anómalas desde un PCAP entregado por la sala.', commands: ['tshark -r captura.pcapng -qz io,phs', 'tshark -r captura.pcapng -Y "dns" -T fields -e frame.time -e ip.src -e dns.qry.name', 'tshark -r captura.pcapng -qz conv,tcp', 'tshark -r captura.pcapng -Y "http.request" -T fields -e ip.src -e http.host -e http.request.uri'], evidence: 'Dominios consultados, conversaciones relevantes, timestamps y filtro usado.' },
    { title: 'Revisión de Active Directory', level: 'Avanzado', goal: 'Visualizar rutas de privilegio y proponer hardening, sin modificar el dominio.', commands: ['export DC={IP_DC}', 'ip route get $DC', 'nmap -Pn -p53,88,135,139,389,445,464,636,3268 $DC', 'bloodhound-python -u {USUARIO} -p {PASSWORD} -ns $DC -d {DOMINIO} -c Group,Session,ACL'], evidence: 'Relaciones de grupos, sesiones y ACL; redacta una mitigación por cada ruta crítica.' },
    { title: 'Validación de una vulnerabilidad web', level: 'Avanzado', goal: 'Reproducir una lección de SQLi en una aplicación intencionalmente vulnerable y explicar la corrección.', commands: ['curl -sS -D headers.txt $WEB/login', 'sqlmap -u "$WEB/login?id=1" --batch --risk=1 --level=1 --technique=B --current-db', 'grep -Ei "server|content-security|x-frame" headers.txt', 'docker compose logs --tail=100 web'], evidence: 'Solicitud autorizada, evidencia mínima, impacto y consulta parametrizada propuesta. Nunca uses --dump en cuentas reales.' },
    { title: 'Enumeración de servicios SMB', level: 'Intermedio', goal: 'Documentar recursos compartidos y configuración visible en una máquina Windows de la sala.', commands: ['export TARGET={IP_TARGET}', 'nmap -Pn -p139,445 --script smb-protocols,smb-security-mode $TARGET', 'smbclient -L //$TARGET -N', 'enum4linux-ng -A $TARGET', 'smbmap -H $TARGET -u {USUARIO} -p {PASSWORD}'], evidence: 'Versión SMB, recursos publicados, permisos observables y recomendación de segmentación.' },
    { title: 'Análisis de DNS y subdominios', level: 'Intermedio', goal: 'Construir un inventario pasivo de resolución DNS dentro del alcance definido por la sala.', commands: ['export DOMAIN={DOMINIO}', 'dig $DOMAIN A +short', 'dig $DOMAIN MX +short', 'dig @{DNS_SERVER} $DOMAIN ANY', 'dnsrecon -d $DOMAIN -t std', 'host -a $DOMAIN'], evidence: 'Registros consultados, servidor DNS, dominios encontrados y límites del alcance.' },
    { title: 'Checklist de hardening Linux', level: 'Defensivo', goal: 'Revisar una VM propia y convertir hallazgos técnicos en acciones de reducción de riesgo.', commands: ['uname -a && hostnamectl', 'ss -tulpn', 'sudo systemctl --type=service --state=running', 'sudo find / -xdev -perm -4000 -type f 2>/dev/null', 'sudo journalctl -p warning -n 50', 'sudo lynis audit system --quick'], evidence: 'Servicios expuestos, binarios SUID, advertencias y tres mitigaciones priorizadas.' },
    { title: 'Auditoría segura de SSH', level: 'Defensivo', goal: 'Revisar la postura de un servidor SSH propio sin probar credenciales ni alterar la configuración.', commands: ['export TARGET={IP_TARGET}', 'nmap -Pn -p22 --script ssh2-enum-algos,ssh-hostkey $TARGET', 'ssh-keyscan -T 5 $TARGET > ssh-hostkey.txt', 'sudo sshd -T | tee ssh-effective-config.txt', 'grep -Ei "permitrootlogin|passwordauthentication|pubkeyauthentication" ssh-effective-config.txt'], evidence: 'Algoritmos anunciados, huella de clave, configuración efectiva y controles recomendados.' },
    { title: 'Inventario de certificados TLS', level: 'Intermedio', goal: 'Identificar problemas de vigencia y configuración TLS en un servicio web del laboratorio.', commands: ['export WEB={URL_AUTORIZADA}', 'curl -sS -I $WEB', 'openssl s_client -connect {HOST}:443 -servername {HOST} </dev/null 2>/dev/null | openssl x509 -noout -subject -issuer -dates', 'nmap -Pn -p443 --script ssl-cert,ssl-enum-ciphers {HOST}', 'curl -sS -o /dev/null -w "%{http_code} %{remote_ip} %{time_total}\\n" $WEB'], evidence: 'Emisor, fechas, protocolos, suites observadas y acciones de renovación o endurecimiento.' },
    { title: 'Triaging de logs web', level: 'Defensivo', goal: 'Priorizar eventos anómalos en registros de una aplicación de práctica antes de redactar el informe.', commands: ['export LOG=access.log', 'wc -l $LOG && tail -n 20 $LOG', 'awk \'{print $1}\' $LOG | sort | uniq -c | sort -nr | head', 'grep -Ei "(401|403|404|500)" $LOG | tail -n 50', 'grep -Ei "(union|select|script|../|/etc/passwd)" $LOG | tee indicadores.txt', 'sha256sum $LOG > $LOG.sha256'], evidence: 'IPs o sesiones priorizadas, códigos de respuesta, indicadores y hash de integridad del archivo.' },
    { title: 'Revisión de reglas de firewall', level: 'Defensivo', goal: 'Comparar los puertos permitidos de una VM con su política esperada y detectar exposición innecesaria.', commands: ['sudo ufw status verbose', 'sudo nft list ruleset > firewall-rules.txt', 'sudo iptables -S > iptables-rules.txt', 'ss -lntup', 'nmap -Pn -p {PUERTOS_ESPERADOS} {IP_TARGET}', 'diff -u expected-services.txt firewall-rules.txt'], evidence: 'Reglas activas, servicios escuchando, diferencias con la política y propuesta de mínimo privilegio.' },
    { title: 'Forense básica de archivos', level: 'Avanzado', goal: 'Preservar y revisar artefactos de una VM entregada por el docente sin modificar la evidencia original.', commands: ['sha256sum evidencia.img > evidencia.img.sha256', 'file evidencia.img', 'sudo mmls evidencia.img', 'fls -r -m / evidencia.img > filesystem.body', 'grep -Ei "(ssh|bash_history|cron|tmp|suspicious)" filesystem.body | head -n 100', 'date -u && sha256sum evidencia.img'], evidence: 'Hash original, sistema de archivos identificado, artefactos relevantes y línea temporal preliminar.' },
    { title: 'Validación de controles de backup', level: 'Defensivo', goal: 'Comprobar que una copia de laboratorio puede verificarse y restaurarse sin exponer datos reales.', commands: ['sha256sum backup.tar.gz > backup.sha256', 'sha256sum -c backup.sha256', 'tar -tzf backup.tar.gz | head -n 50', 'tar -tzf backup.tar.gz | grep -Ei "(secret|password|\.env|key)"', 'tar -xzf backup.tar.gz -C restore-test --no-same-owner', 'find restore-test -type f -maxdepth 3 -print'], evidence: 'Integridad, contenido inesperado, resultado de restauración y recomendaciones de protección.' },
  ]
  const [selectedCase, setSelectedCase] = useState(0)
  const [step, setStep] = useState(0)
  const current = cases[selectedCase]
  const isLast = step === current.commands.length - 1
  const next = () => setStep((value) => isLast ? 0 : value + 1)
  return <><SectionTitle eyebrow="MÓDULO 11 · PLAYBOOKS" title="Casos de uso paso a paso" description="Trabaja un escenario a la vez. Selecciona un caso, completa cada paso y registra la evidencia antes de continuar. Sustituye únicamente los valores entre llaves por los datos de tu sala TryHackMe o laboratorio local." /><div className="case-selector" role="tablist" aria-label="Seleccionar caso de uso">{cases.map((item, index) => <button key={item.title} role="tab" aria-selected={selectedCase === index} className={`case-tab ${selectedCase === index ? 'active' : ''}`} onClick={() => { setSelectedCase(index); setStep(0) }}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.title}</strong><small>{item.level}</small></button>)}</div><article className="case-workbench"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="eyebrow">Caso {String(selectedCase + 1).padStart(2, '0')} · Paso {String(step + 1).padStart(2, '0')} de {current.commands.length}</p><h2 className="mt-2 text-2xl font-semibold text-white">{current.title}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{current.goal}</p></div><span className="case-level">{current.level}</span></div><div className="mt-7 flex items-center gap-2" aria-label="Progreso del caso">{current.commands.map((_, index) => <span key={index} className={`step-progress ${index <= step ? 'done' : ''}`} />)}</div><div className="mt-7 grid gap-6 lg:grid-cols-[1fr_280px]"><div><div className="step-panel"><div className="flex items-center justify-between gap-3"><span className="step-kicker">Paso {String(step + 1).padStart(2, '0')}</span><button className="copy-button" onClick={() => navigator.clipboard?.writeText(current.commands[step])}><Clipboard /> Copiar comando</button></div><p className="mt-4 text-sm text-slate-400">Ejecuta este comando únicamente dentro de la sala autorizada y observa la salida antes de avanzar.</p><code className="command-focus mt-5 block">{current.commands[step]}</code><div className="mt-5 flex flex-wrap gap-3"><button className="primary-button" onClick={next}>{isLast ? 'Reiniciar caso' : 'Marcar paso y continuar'} <ArrowRight data-icon="inline-end" /></button>{step > 0 && <button className="secondary-button" onClick={() => setStep((value) => value - 1)}>Paso anterior</button>}</div></div><div className="case-evidence mt-4"><strong>Evidencia esperada al finalizar</strong><p>{current.evidence}</p></div></div><aside className="step-sidebar"><p className="eyebrow">Checklist</p><ol>{current.commands.map((command, index) => <li key={command} className={index === step ? 'current' : index < step ? 'complete' : ''}><span>{index < step ? '✓' : String(index + 1).padStart(2, '0')}</span><p> Paso {index + 1}<small>{index === step ? 'En curso' : index < step ? 'Completado' : 'Pendiente'}</small></p></li>)}</ol></aside></div></article><div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5 text-sm leading-6 text-amber-100"><AlertTriangle className="mr-2 inline size-4 text-amber-300" /> Antes de ejecutar: confirma que la IP pertenece a la sala, limita la velocidad, registra hora y comando, y detente si la instrucción de TryHackMe no solicita el siguiente paso.</div></>
}

function ModulePage({ id }: { id: string }) {
  const data: Record<string, { eyebrow: string; title: string; description: string }> = {
    medusa: { eyebrow: 'MÓDULO 01 · AUDITORÍA DE CREDENCIALES', title: 'Medusa', description: 'Estudia auditorías de autenticación contra servicios remotos en máquinas de práctica. Usa listas pequeñas, límites claros y evidencia documentada.' },
    nmap: { eyebrow: 'MÓDULO 02 · RECONOCIMIENTO', title: 'Nmap y Zenmap', description: 'Aprende a identificar hosts, puertos y servicios en una red de laboratorio. Comienza por descubrimiento, continúa con versiones y termina documentando hallazgos.' },
    nse: { eyebrow: 'MÓDULO 03 · AUTOMATIZACIÓN', title: 'Nmap Scripting Engine', description: 'Explora scripts NSE, categorías, argumentos y depuración para ampliar el reconocimiento sin perder control sobre el alcance.' },
    wifi: { eyebrow: 'MÓDULO 04 · SEGURIDAD INALÁMBRICA', title: 'Wi‑Fi y Aircrack-ng', description: 'Comprende el modelo de seguridad 802.11, el handshake de cuatro vías y las diferencias entre WEP, WPA2 y WPA3. Trabaja únicamente con tu propio AP.' },
    sqli: { eyebrow: 'MÓDULO 05 · SEGURIDAD WEB', title: 'SQL Injection y autenticación', description: 'Analiza cómo una consulta construida con concatenación puede alterar la lógica de autenticación y cómo prevenirlo con consultas parametrizadas y controles de servidor.' },
    traffic: { eyebrow: 'MÓDULO 06 · ANÁLISIS FORENSE', title: 'Wireshark y TShark', description: 'Convierte una captura en evidencia: aprende filtros de visualización, jerarquía de protocolos y señales que merecen investigación.' },
    directory: { eyebrow: 'MÓDULO 07 · IDENTIDAD', title: 'BloodHound y Active Directory', description: 'Mapea relaciones de privilegio en un dominio de práctica para detectar rutas de escalada y oportunidades de hardening.' },
    shodan: { eyebrow: 'MÓDULO 08 · OSINT', title: 'Shodan', description: 'Practica reconocimiento pasivo sobre información indexada y aprende a interpretar banners sin escanear infraestructura ajena.' },
    metasploit: { eyebrow: 'MÓDULO 09 · VALIDACIÓN', title: 'Metasploit con responsabilidad', description: 'Conoce la estructura del framework, sus módulos y la documentación de evidencias. Las pruebas de explotación se reservan para máquinas intencionalmente vulnerables.' },
    flow: { eyebrow: 'MÓDULO 10 · METODOLOGÍA', title: 'Flujo general de un pentest', description: 'Conecta reconocimiento, análisis, validación y reporte en una metodología repetible para laboratorios escolares.' },
  }
  const item = data[id] ?? data.nmap
  return <><SectionTitle eyebrow={item.eyebrow} title={item.title} description={item.description} />
    {id === 'nmap' && <Lab type="nmap" />}{id === 'wifi' && <Lab type="wifi" />}{id === 'traffic' && <Lab type="traffic" />}
    {id === 'sqli' && <SqlLab />}
    {id === 'directory' && <CommandTable id="bloodhound" />}
    {['medusa', 'nse', 'shodan', 'metasploit'].includes(id) && <CommandTable id={id} />}
    {id === 'flow' && <TryHackMeFlow />}{id === 'cases' && <UseCases />}
    {['directory', 'metasploit', 'flow'].includes(id) && <div className="grid gap-4 md:grid-cols-2"><div className="info-block"><Globe2 className="size-5 text-cyan-300" /><h3>Objetivo de la lección</h3><p>Relaciona conceptos, evidencia y controles defensivos en un entorno preparado para clases.</p></div><div className="info-block"><FileCode2 className="size-5 text-cyan-300" /><h3>Entrega sugerida</h3><p>Un informe breve con alcance, método, hallazgos, impacto y recomendación de mitigación.</p></div></div>}
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
  return <main className="cyber-shell"><aside className={`sidebar ${mobileNav ? 'open' : ''}`}><div className="brand"><div className="brand-mark"><ShieldCheck /></div><div><p className="brand-name">CYBER<span>LAB</span></p><p className="brand-sub">Aula de ciberseguridad</p></div><button className="mobile-close" onClick={() => setMobileNav(false)}><X /></button></div><div className="sidebar-label">Contenido</div><nav className="module-nav">{filtered.map((module) => { const Icon = module.icon; return <button key={module.id} className={`module-link ${active === module.id ? 'active' : ''}`} onClick={() => { setActive(module.id); setMobileNav(false) }}><Icon /><span>{module.label}</span><b>{module.tag}</b></button> })}</nav><div className="sidebar-footer"><div className="avatar">ES</div><div><p className="text-sm font-medium text-white">Modo estudiante</p><p className="text-xs text-slate-500">Progreso local</p></div></div></aside><div className="content-area"><header className="topbar"><button className="menu-button" onClick={() => setMobileNav(true)}><Menu /></button><div className="breadcrumb"><span>Cyberlab</span><ChevronRight /><strong>{modules.find((m) => m.id === active)?.label}</strong></div><nav className="top-module-nav" aria-label="Navegación principal">{modules.map((module) => { const Icon = module.icon; return <button key={module.id} className={`top-module-link ${active === module.id ? 'active' : ''}`} onClick={() => setActive(module.id)} title={module.label}><Icon /><span>{module.label}</span></button> })}</nav><div className="top-actions"><div className="search-box"><Search /><input aria-label="Buscar módulo" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar módulo…" /></div><span className="secure-badge"><span /> Seguro</span></div></header><section className="main-content"><div className="content-width">{active === 'overview' ? <Overview onOpen={setActive} /> : <ModulePage id={active} />}<footer className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5 text-xs text-slate-600"><span>CYBERLAB · Material educativo para entornos autorizados</span><span className="flex items-center gap-2"><ShieldCheck className="size-3" /> Práctica responsable</span></footer></div></section></div></main>
}

