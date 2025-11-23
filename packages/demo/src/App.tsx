import { useEffect, useMemo, useState } from "react";
import {
  ActionBar,
  type Action,
  AdminTable,
  type AdminTableColumn,
  AnimatedValue,
  AnsiText,
  Avatar,
  AvatarGroup,
  Badge,
  Breadcrumb,
  Button,
  type Command,
  CommandPalette,
  ContextMenu,
  DataTable,
  Dialog,
  Dropdown,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
  DualPane,
  EditorStatusBar,
  type FileItem,
  FileList,
  FilePreview,
  Footer,
  FunctionKeyBar,
  Gauge,
  Header,
  HistoryGraph,
  type HistoryPoint,
  InputDialog,
  KeyValueList,
  KeyboardShortcuts,
  LineGraph,
  type LineGraphVariant,
  LineNumbers,
  type LogEntry,
  LogStream,
  LogViewer,
  MenuBar,
  MonoText,
  Pagination,
  PaginationInfo,
  type Process,
  ProcessList,
  ProgressBar,
  ScrollableArea,
  SearchBar,
  SelectDialog,
  SelectableList,
  Separator,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarToggle,
  StatCard,
  StatusBar,
  type StatusSegment,
  SyntaxHighlight,
  Tabs,
  TerminalBox,
  TerminalGrid,
  TerminalPanel,
  TerminalProvider,
  type TerminalThemeName,
  TerminalWindow,
  Text,
  TextEditor,
  ThemeProvider,
  Tooltip,
  Tree,
  type TreeNode,
  VerticalMeter,
  useKeyboard,
} from "web-tui";

type ServiceRow = {
  name: string;
  status: string;
  uptime: string;
  latency: number;
};

const PROCESS_DATA: Process[] = [
  {
    pid: 1042,
    name: "api-gateway",
    cpu: 38,
    memory: 420000000,
    status: "running",
  },
  {
    pid: 2150,
    name: "metrics-agent",
    cpu: 12,
    memory: 150000000,
    status: "running",
  },
  {
    pid: 3120,
    name: "cron-worker",
    cpu: 6,
    memory: 82000000,
    status: "sleeping",
  },
  {
    pid: 4512,
    name: "orchestrator",
    cpu: 19,
    memory: 260000000,
    status: "running",
  },
];

const FILE_ITEMS: FileItem[] = [
  { name: "README.md", type: "file", size: 4096, modified: "10:22" },
  { name: "apps", type: "folder", modified: "09:48" },
  { name: "deploy.sh", type: "file", size: 512, modified: "09:31" },
  { name: "dist", type: "folder", modified: "09:05" },
  { name: "package.json", type: "file", size: 2096, modified: "08:55" },
];

const FILE_CONTENT: Record<string, string> = {
  "README.md": "# Web TUI\n\nTerminal-inspired component kit.",
  "deploy.sh": "#!/usr/bin/env bash\nbun run build && bun run deploy",
  "package.json":
    '{ "name": "web-tui-demo", "scripts": { "dev": "bun run dev" } }',
};

const FILE_METADATA: Record<string, Record<string, string>> = {
  "README.md": { Owner: "alex", Mode: "644" },
  "deploy.sh": { Owner: "alex", Mode: "755" },
  "package.json": { Owner: "alex", Mode: "644" },
};

const LOG_FEED: LogEntry[] = [
  {
    id: "1",
    level: "info",
    message: "[info] Scheduler waiting",
    timestamp: "10:20:11",
  },
  {
    id: "2",
    level: "success",
    message: "[success] Build promotion ready",
    timestamp: "10:21:03",
  },
  {
    id: "3",
    level: "warn",
    message: "[warn] Cache hit ratio below threshold",
    timestamp: "10:21:44",
  },
  {
    id: "4",
    level: "error",
    message: "[error] Worker shard 2 restarted",
    timestamp: "10:22:01",
  },
  {
    id: "5",
    level: "debug",
    message: "[debug] Heartbeat ack latency 18ms",
    timestamp: "10:22:15",
  },
];

const STREAM_LOGS: LogEntry[] = [
  { message: "service:api boot sequence started", level: "info" },
  { message: "warn: high memory usage detected", level: "warn" },
  { message: "error: retrying connection to redis", level: "error" },
  { message: "success: deployment finished", level: "success" },
  { message: "debug: subscription refresh scheduled", level: "debug" },
];

const TREE_DATA: TreeNode[] = [
  {
    id: "workspace",
    label: "workspace",
    meta: "root",
    children: [
      {
        id: "apps",
        label: "apps",
        meta: "3 dirs",
        children: [
          { id: "lib", label: "packages/lib", meta: "core" },
          { id: "demo", label: "packages/demo", meta: "demo" },
        ],
      },
      {
        id: "tools",
        label: "tools",
        children: [
          { id: "scripts", label: "scripts" },
          { id: "config", label: "config" },
        ],
      },
    ],
  },
];

const SERVICE_DATA: ServiceRow[] = [
  { name: "api-gateway", status: "Healthy", uptime: "4d 3h", latency: 32 },
  { name: "worker", status: "Degraded", uptime: "2d 11h", latency: 58 },
  { name: "scheduler", status: "Healthy", uptime: "9d 4h", latency: 22 },
  { name: "edge-cache", status: "Scaling", uptime: "16h", latency: 12 },
];

const KEY_VALUE_ITEMS = [
  { key: "Hostname", value: "web-tui.local" },
  { key: "Kernel", value: "Darwin 25.1" },
  { key: "Uptime", value: "4 days 03:18:09" },
  { key: "Users", value: "2" },
  { key: "Load Avg", value: "0.46 0.38 0.36" },
  { key: "Temp", value: "48°C" },
];

const SHORTCUTS = [
  { combo: "ctrl+k", description: "Command palette" },
  { combo: "ctrl+shift+f", description: "Global search" },
  { combo: "cmd+.", description: "Focus terminal" },
  { combo: "cmd+shift+p", description: "Open palette (native)" },
];

const FUNCTION_KEYS = [
  { key: "F1", label: "Help" },
  { key: "F2", label: "Rename" },
  { key: "F3", label: "Find" },
  { key: "F4", label: "Logs" },
  { key: "F5", label: "Build" },
  { key: "F6", label: "Format" },
  { key: "F7", label: "Test" },
  { key: "F8", label: "Deploy" },
];

const HISTORY_POINTS = [
  { label: "10:00", value: 25 },
  { label: "10:05", value: 32 },
  { label: "10:10", value: 48 },
  { label: "10:15", value: 41 },
  { label: "10:20", value: 63 },
  { label: "10:25", value: 59 },
  { label: "10:30", value: 72 },
];

const historyFromValues = (values: number[]): HistoryPoint[] =>
  HISTORY_POINTS.map((point, index) => ({
    ...point,
    value: values[index] ?? point.value,
  }));

type DataFrame = {
  stats: {
    requests: number;
    requestsDelta: number;
    errorRate: number;
    errorDelta: number;
    bandwidth: number;
    bandwidthDelta: number;
  };
  resources: { cpu: number; memory: number; disk: number };
  cores: number[];
  gauge: number;
  throughput: number;
  history: HistoryPoint[];
  line: number[];
};

const DATA_FRAMES: DataFrame[] = [
  {
    stats: {
      requests: 1482,
      requestsDelta: 4.2,
      errorRate: 0.21,
      errorDelta: -0.1,
      bandwidth: 507_400_000,
      bandwidthDelta: 180,
    },
    resources: { cpu: 72, memory: 58, disk: 41 },
    cores: [72, 48, 91, 36],
    gauge: 62,
    throughput: 61.8,
    history: historyFromValues([25, 32, 48, 41, 63, 59, 72]),
    line: [24, 30, 26, 38, 34, 44, 52, 46, 60, 58],
  },
  {
    stats: {
      requests: 1610,
      requestsDelta: 6.8,
      errorRate: 0.32,
      errorDelta: 0.4,
      bandwidth: 643_000_000,
      bandwidthDelta: 122,
    },
    resources: { cpu: 84, memory: 69, disk: 54 },
    cores: [82, 71, 96, 64],
    gauge: 74,
    throughput: 74.2,
    history: historyFromValues([38, 45, 57, 62, 68, 71, 80]),
    line: [32, 42, 54, 61, 72, 69, 64, 70, 76, 82],
  },
  {
    stats: {
      requests: 1334,
      requestsDelta: -2.1,
      errorRate: 0.18,
      errorDelta: -0.22,
      bandwidth: 468_000_000,
      bandwidthDelta: -94,
    },
    resources: { cpu: 63, memory: 52, disk: 37 },
    cores: [54, 48, 70, 39],
    gauge: 58,
    throughput: 55.5,
    history: historyFromValues([28, 34, 39, 42, 47, 44, 52]),
    line: [22, 28, 34, 29, 36, 32, 40, 38, 44, 42],
  },
  {
    stats: {
      requests: 1526,
      requestsDelta: 3.1,
      errorRate: 0.24,
      errorDelta: 0.12,
      bandwidth: 589_000_000,
      bandwidthDelta: 76,
    },
    resources: { cpu: 78, memory: 63, disk: 46 },
    cores: [76, 58, 83, 50],
    gauge: 68,
    throughput: 67.3,
    history: historyFromValues([33, 40, 48, 52, 57, 61, 70]),
    line: [28, 38, 46, 52, 58, 62, 66, 62, 70, 68],
  },
  {
    stats: {
      requests: 1412,
      requestsDelta: -1.4,
      errorRate: 0.27,
      errorDelta: -0.05,
      bandwidth: 523_000_000,
      bandwidthDelta: -40,
    },
    resources: { cpu: 69, memory: 56, disk: 42 },
    cores: [69, 51, 77, 46],
    gauge: 63,
    throughput: 63.4,
    history: historyFromValues([30, 37, 44, 48, 54, 58, 63]),
    line: [30, 34, 38, 44, 50, 48, 52, 56, 60, 58],
  },
];

const INITIAL_FRAME = DATA_FRAMES[0];
const VERTICAL_LABELS = ["core 0", "core 1", "core 2", "core 3"];

const ANSI_MESSAGE =
  "\x1b[32m✔ build complete\x1b[0m  \x1b[33m• warming cache\x1b[0m  \x1b[31m✖ retry pending\x1b[0m";

const RELEASE_NOTES = [
  "[10:21] pipeline queued for deploy",
  "[10:22] artifact published to s3",
  "[10:23] smoke tests running",
  "[10:24] metrics sampling stable",
  "[10:25] rollout 25%",
  "[10:26] rollout 50%",
  "[10:27] rollout 75%",
];

const COMMAND_PALETTE_COMMANDS: Command[] = [
  {
    id: "open",
    label: "Open File",
    description: "Jump to any file in the workspace",
    shortcut: "ctrl+p",
  },
  {
    id: "deploy",
    label: "Deploy Latest",
    description: "Trigger blue/green deployment",
    shortcut: "ctrl+d",
  },
  {
    id: "logs",
    label: "Tail Logs",
    description: "Stream production logs",
    shortcut: "ctrl+l",
  },
];

const SELECT_OPTIONS = [
  {
    id: "btop-classic",
    label: "BTOP Classic",
    description: "Cyan and lime like the original btops",
  },
  {
    id: "polar-night",
    label: "Polar Night",
    description: "Deep navy with frosty blues",
  },
  {
    id: "retro-amber",
    label: "Retro Amber",
    description: "Warm amber CRT glow",
  },
  {
    id: "matrix-green",
    label: "Matrix Green",
    description: "Neon green terminal haze",
  },
  {
    id: "red-alert",
    label: "Red Alert",
    description: "Critical crimson dashboard",
  },
];

const TASKS = [
  {
    id: "deploy",
    label: "Deploy build",
    description: "Ship the latest artifact",
  },
  { id: "restart", label: "Restart workers", description: "Graceful restart" },
  { id: "scale", label: "Scale edge", description: "Add two nodes" },
  { id: "metrics", label: "Export metrics", description: "Snapshot cluster" },
];

const SAMPLE_CODE = `export const handler = async () => {
  const response = await fetch("/api/health");
  if (!response.ok) {
    throw new Error("Service unavailable");
  }
  return response.json();
};`;

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "pending";
  lastLogin: string;
};

const USER_DATA: UserRow[] = [
  { id: "1", name: "Alice Chen", email: "alice@example.com", role: "Admin", status: "active", lastLogin: "2 hours ago" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", role: "Editor", status: "active", lastLogin: "1 day ago" },
  { id: "3", name: "Carol Wu", email: "carol@example.com", role: "Viewer", status: "inactive", lastLogin: "2 weeks ago" },
  { id: "4", name: "David Lee", email: "david@example.com", role: "Editor", status: "pending", lastLogin: "Never" },
  { id: "5", name: "Eve Martinez", email: "eve@example.com", role: "Admin", status: "active", lastLogin: "5 min ago" },
  { id: "6", name: "Frank Johnson", email: "frank@example.com", role: "Viewer", status: "active", lastLogin: "3 days ago" },
  { id: "7", name: "Grace Kim", email: "grace@example.com", role: "Editor", status: "active", lastLogin: "12 hours ago" },
  { id: "8", name: "Henry Brown", email: "henry@example.com", role: "Viewer", status: "inactive", lastLogin: "1 month ago" },
];

const themeOptions: TerminalThemeName[] = [
  "btop-classic",
  "polar-night",
  "retro-amber",
  "matrix-green",
  "red-alert",
];
const MATCH_TOTAL = 8;

function App() {
  const [themePreset, setThemePreset] =
    useState<TerminalThemeName>("btop-classic");
  const [activeTab, setActiveTab] = useState("layout");
  const [dualPaneActive, setDualPaneActive] = useState<"left" | "right">(
    "left",
  );
  const [panelActive, setPanelActive] = useState(0);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inputDialogOpen, setInputDialogOpen] = useState(false);
  const [selectDialogOpen, setSelectDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem>(FILE_ITEMS[0]);
  const [logStreamFilter, setLogStreamFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("service");
  const [replaceValue, setReplaceValue] = useState("server");
  const [matchIndex, setMatchIndex] = useState(0);
  const [selectedCommands, setSelectedCommands] = useState<string[]>([
    "deploy",
  ]);
  const [lastAction, setLastAction] = useState("Idle");
  const [animatedThroughput, setAnimatedThroughput] = useState(
    INITIAL_FRAME.throughput,
  );
  const [actionMessage, setActionMessage] = useState("No workflow triggered");
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    position: { x: 0, y: 0 },
  });
  const [editorValue, setEditorValue] = useState(SAMPLE_CODE);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarActiveItem, setSidebarActiveItem] = useState("dashboard");
  const [adminPage, setAdminPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<Set<React.Key>>(new Set());
  const [statMetrics, setStatMetrics] = useState(INITIAL_FRAME.stats);
  const [resourceUsage, setResourceUsage] = useState(INITIAL_FRAME.resources);
  const [coreLoads, setCoreLoads] = useState(INITIAL_FRAME.cores);
  const [clusterGauge, setClusterGauge] = useState(INITIAL_FRAME.gauge);
  const [historyPoints, setHistoryPoints] = useState<HistoryPoint[]>(
    INITIAL_FRAME.history,
  );
  const [lineGraphValues, setLineGraphValues] = useState(INITIAL_FRAME.line);
  const [dataFrameIndex, setDataFrameIndex] = useState(0);
  const [graphVariant, setGraphVariant] = useState<LineGraphVariant>("crt");

  useKeyboard({
    "ctrl+k": (event) => {
      event.preventDefault();
      setPaletteOpen(true);
    },
  });

  useEffect(() => {
    const interval = setInterval(
      () => setDataFrameIndex((prev) => (prev + 1) % DATA_FRAMES.length),
      2600,
    );
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const nextFrame = DATA_FRAMES[dataFrameIndex];
    setStatMetrics(nextFrame.stats);
    setResourceUsage(nextFrame.resources);
    setCoreLoads(nextFrame.cores);
    setClusterGauge(nextFrame.gauge);
    setAnimatedThroughput(nextFrame.throughput);
    setHistoryPoints(nextFrame.history);
    setLineGraphValues(nextFrame.line);
  }, [dataFrameIndex]);

  const menuItems = useMemo(
    () => [
      {
        label: "File",
        items: [
          {
            label: "New Session",
            onSelect: () => setLastAction("Spawned new session"),
          },
          {
            label: "Command Palette",
            shortcut: "ctrl+k",
            onSelect: () => setPaletteOpen(true),
          },
        ],
      },
      {
        label: "Theme",
        items: themeOptions.map((preset) => ({
          label: preset,
          onSelect: () => {
            setThemePreset(preset);
            setLastAction(`Theme set to ${preset}`);
          },
        })),
      },
      {
        label: "Help",
        onSelect: () => setDialogOpen(true),
      },
    ],
    [],
  );

  const handleContextMenuAction = (message: string) => {
    setLastAction(message);
    setContextMenu((prev) => ({ ...prev, visible: false }));
  };

  const contextMenuItems = [
    {
      label: "Copy path",
      shortcut: "cmd+shift+c",
      onSelect: () => handleContextMenuAction("Path copied"),
    },
    {
      label: "Open in editor",
      onSelect: () => handleContextMenuAction("Opened in editor"),
    },
    {
      label: "Delete",
      danger: true,
      onSelect: () => handleContextMenuAction("Delete requested"),
    },
  ];

  const workflowActions: Action[] = [
    {
      id: "deploy",
      label: "Deploy",
      onSelect: () => {
        setActionMessage("Deploy dispatched");
        setLastAction("Deploy dispatched");
      },
    },
    {
      id: "restart",
      label: "Restart pods",
      variant: "secondary",
      onSelect: () => {
        setActionMessage("Restart scheduled");
        setLastAction("Restart scheduled");
      },
    },
    {
      id: "halt",
      label: "Stop",
      variant: "danger",
      onSelect: () => {
        setActionMessage("Stop acknowledged");
        setLastAction("Stop acknowledged");
      },
    },
  ];

  const layoutTab = (
    <TerminalGrid columns={2} gap="md">
      <TerminalBox
        title="Terminal Panel"
        subtitle="Click panes to focus"
        borderStyle="double"
        toolbar={<Badge variant="success">Linked</Badge>}
      >
        <TerminalPanel
          split="horizontal"
          activeIndex={panelActive}
          onActiveChange={setPanelActive}
          header="Session splits"
          footer={`Active pane: ${panelActive + 1}`}
        >
          <MonoText muted wrap>
            build:watch — watching 24 files
          </MonoText>
          <MonoText muted wrap>
            tests:e2e — queued (8 specs)
          </MonoText>
        </TerminalPanel>
      </TerminalBox>
      <TerminalBox
        title="Dual Pane"
        subtitle="Scroll stays in sync"
        borderStyle="dashed"
      >
        <DualPane
          leftTitle="Live Logs"
          rightTitle="Release Notes"
          activePane={dualPaneActive}
          onActivePaneChange={setDualPaneActive}
          left={
            <ScrollableArea autoStick className="bg-terminal-black/40">
              {LOG_FEED.map((log) => (
                <MonoText key={log.id} className="text-xs">
                  {log.timestamp} — {log.message}
                </MonoText>
              ))}
            </ScrollableArea>
          }
          right={
            <ScrollableArea className="bg-terminal-black/40">
              {RELEASE_NOTES.map((line) => (
                <MonoText key={line} className="text-xs">
                  {line}
                </MonoText>
              ))}
            </ScrollableArea>
          }
        />
      </TerminalBox>
      <TerminalBox title="Quick Layout Grid" subtitle="TerminalBox + Grid">
        <TerminalGrid columns={3} minColumnWidth={18} gap="sm">
          <Badge variant="success" dot>
            Online
          </Badge>
          <Badge variant="warning" dot>
            Pending
          </Badge>
          <Badge variant="danger" dot>
            Alerts
          </Badge>
          <MonoText muted>Region</MonoText>
          <MonoText>us-west-2</MonoText>
          <MonoText muted>Cluster</MonoText>
          <MonoText>terminal-ui</MonoText>
          <Separator label="Services" />
        </TerminalGrid>
      </TerminalBox>
      <TerminalBox title="Status Bars">
        <StatusBar
          position="top"
          segments={[
            { label: "Build", value: "passing", tone: "success" },
            { label: "Deploy", value: "progress", tone: "info" },
          ]}
        />
        <StatusBar
          segments={[
            { label: "user", value: "alex" },
            { label: "env", value: "demo", tone: "warning" },
            { label: "latency", value: "32ms", tone: "info" },
          ]}
        />
      </TerminalBox>
    </TerminalGrid>
  );

  const dataTab = (
    <div className="space-y-4">
      <TerminalBox title="Graph Style" borderStyle="single">
        <div className="flex items-center gap-3">
          <Text variant="dim" className="text-sm">
            Style:
          </Text>
          <select
            value={graphVariant}
            onChange={(e) => setGraphVariant(e.target.value as LineGraphVariant)}
            className="rounded-terminal border border-terminal-gridLine/60 bg-terminal-black/60 px-3 py-1.5 text-sm font-mono text-terminal-foreground focus:border-terminal-green/60 focus:outline-none focus:ring-1 focus:ring-terminal-green/40"
          >
            <option value="smooth">Smooth</option>
            <option value="stepped">Stepped</option>
            <option value="crt">CRT (Pixelated)</option>
          </select>
          <Text variant="dim" className="text-xs">
            {graphVariant === "smooth" && "Smooth curves"}
            {graphVariant === "stepped" && "Blocky steps"}
            {graphVariant === "crt" && "CRT scanlines + quantization"}
          </Text>
        </div>
      </TerminalBox>
      <TerminalGrid columns={3} gap="md">
        <StatCard
          label="Requests / s"
        value={statMetrics.requests}
        secondary={`${statMetrics.requestsDelta >= 0 ? "+" : ""}${Math.abs(
          statMetrics.requestsDelta,
        ).toFixed(1)}%`}
        trend={statMetrics.requestsDelta >= 0 ? "up" : "down"}
        hint="vs last 5m"
        formatValue={(val) =>
          typeof val === "number" ? Math.round(val).toLocaleString() : val
        }
      />
      <StatCard
        label="Error rate"
        value={statMetrics.errorRate}
        secondary={`${statMetrics.errorDelta >= 0 ? "+" : ""}${Math.abs(
          statMetrics.errorDelta,
        ).toFixed(2)}%`}
        trend={statMetrics.errorDelta >= 0 ? "up" : "down"}
        hint="All clusters"
        formatValue={(val) =>
          typeof val === "number" ? `${val.toFixed(2)}%` : val
        }
      />
      <StatCard
        label="Bandwidth"
        value={statMetrics.bandwidth}
        secondary={`${
          statMetrics.bandwidthDelta >= 0 ? "↑" : "↓"
        } ${Math.abs(statMetrics.bandwidthDelta).toFixed(0)} MB/s`}
        trend={statMetrics.bandwidthDelta >= 0 ? "up" : "down"}
      />
      <TerminalBox title="Resource Progress" borderStyle="single">
        <ProgressBar
          label="CPU"
          value={resourceUsage.cpu}
          variant={graphVariant === "crt" ? "pixelated" : "smooth"}
        />
        <ProgressBar
          label="Memory"
          value={resourceUsage.memory}
          char="▓"
          variant={graphVariant === "crt" ? "pixelated" : "smooth"}
        />
        <ProgressBar
          label="Disk"
          value={resourceUsage.disk}
          showValue={false}
          variant={graphVariant === "crt" ? "pixelated" : "smooth"}
        />
      </TerminalBox>
      <TerminalBox title="Per-Core Load">
        <VerticalMeter
          values={coreLoads}
          labels={VERTICAL_LABELS}
          variant={graphVariant === "crt" ? "pixelated" : "smooth"}
        />
      </TerminalBox>
      <TerminalBox title="Cluster Gauge">
        <Gauge
          value={clusterGauge}
          label="Cluster load"
          variant={graphVariant === "crt" ? "pixelated" : "smooth"}
        />
        <div className="flex items-center gap-2">
          <AnimatedValue
            value={animatedThroughput}
            format={(val) => `${val.toFixed(1)}%`}
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setAnimatedThroughput((prev) => (prev + 13) % 100)}
          >
            Pulse
          </Button>
        </div>
      </TerminalBox>
      <TerminalBox
        title="Realtime Latency"
        variant={graphVariant === "crt" ? "crt" : "sunken"}
      >
        <LineGraph
          values={lineGraphValues}
          height={80}
          variant={graphVariant}
          pixelSize={graphVariant === "crt" ? 8 : undefined}
        />
      </TerminalBox>
      <TerminalBox
        title="History Graph"
        variant={graphVariant === "crt" ? "crt" : "sunken"}
      >
        <HistoryGraph
          title="CPU history"
          points={historyPoints}
          variant={graphVariant}
          pixelSize={graphVariant === "crt" ? 8 : undefined}
        />
      </TerminalBox>
      </TerminalGrid>
    </div>
  );

  const contentTab = (
    <div className="space-y-4">
      <TerminalGrid columns={2} gap="md">
        <TerminalBox title="Service Table">
          <DataTable<ServiceRow>
            columns={[
              { key: "name", label: "Service", sortable: true },
              { key: "status", label: "Status" },
              { key: "uptime", label: "Uptime", align: "center" },
              {
                key: "latency",
                label: "Latency",
                align: "right",
                sortable: true,
                render: (row) => `${row.latency} ms`,
              },
            ]}
            data={SERVICE_DATA}
            onRowClick={(row) => setLastAction(`Selected ${row.name}`)}
          />
        </TerminalBox>
        <TerminalBox title="Process List">
          <ProcessList
            processes={PROCESS_DATA}
            onTerminate={(pid) => setLastAction(`Kill ${pid}`)}
            onRestart={(pid) => setLastAction(`Restart ${pid}`)}
          />
        </TerminalBox>
      </TerminalGrid>
      <TerminalGrid columns={2} gap="md">
        <TerminalBox title="System Info">
          <KeyValueList items={KEY_VALUE_ITEMS} />
        </TerminalBox>
        <TerminalBox title="Log Viewer">
          <LogViewer logs={LOG_FEED} />
        </TerminalBox>
      </TerminalGrid>
      <TerminalGrid columns={2} gap="md">
        <TerminalBox title="Live Log Stream">
          <LogStream
            logs={STREAM_LOGS}
            onFilterChange={(value) => setLogStreamFilter(value)}
          />
        </TerminalBox>
        <TerminalBox title="Files & Preview">
          <div className="grid gap-4 lg:grid-cols-2">
            <FileList
              items={FILE_ITEMS}
              onSelect={(item) => {
                setSelectedFile(item);
                setLastAction(`Opened ${item.name}`);
              }}
            />
            <FilePreview
              name={selectedFile.name}
              path={`/demo/${selectedFile.name}`}
              language="ts"
              content={FILE_CONTENT[selectedFile.name] ?? "// directory"}
              metadata={FILE_METADATA[selectedFile.name]}
            />
          </div>
        </TerminalBox>
      </TerminalGrid>
      <TerminalGrid columns={2} gap="md">
        <TerminalBox title="Repository Tree">
          <Tree
            nodes={TREE_DATA}
            defaultExpanded={["workspace", "apps"]}
            onSelect={(node) => setLastAction(`Tree selected ${node.label}`)}
          />
        </TerminalBox>
        <TerminalBox title="Scrollable Area">
          <ScrollableArea autoStick maxHeight={200}>
            {RELEASE_NOTES.map((line) => (
              <MonoText key={line}>{line}</MonoText>
            ))}
          </ScrollableArea>
        </TerminalBox>
      </TerminalGrid>
    </div>
  );

  const interactionTab = (
    <div className="space-y-4">
      <TerminalBox title="Text & Separator">
        <AnsiText value={ANSI_MESSAGE} className="text-sm" />
        <Separator label="Metrics" />
        <MonoText align="right" muted>
          aligned to the right
        </MonoText>
      </TerminalBox>
      <TerminalGrid columns={2} gap="md">
        <TerminalBox title="Search Bar">
          <SearchBar
            query={searchQuery}
            replace={replaceValue}
            onQueryChange={setSearchQuery}
            onReplaceChange={setReplaceValue}
            onNext={() => setMatchIndex((prev) => (prev + 1) % MATCH_TOTAL)}
            onPrev={() =>
              setMatchIndex((prev) => (prev - 1 + MATCH_TOTAL) % MATCH_TOTAL)
            }
            onReplace={() =>
              setLastAction(`Replace ${searchQuery} → ${replaceValue}`)
            }
            onReplaceAll={() => setLastAction("Replace all triggered")}
            matchCount={MATCH_TOTAL}
            currentIndex={matchIndex}
          />
        </TerminalBox>
        <TerminalBox title="Selectable Commands">
          <SelectableList
            items={TASKS}
            multiSelect
            onSelectionChange={(ids) => setSelectedCommands(ids)}
          />
          <Text variant="dim" className="mt-2">
            Selected: {selectedCommands.join(", ") || "none"}
          </Text>
        </TerminalBox>
      </TerminalGrid>
      <TerminalGrid columns={2} gap="md">
        <TerminalBox title="Action Bar">
          <ActionBar actions={workflowActions} />
          <Text variant="dim" className="mt-2">
            {actionMessage}
          </Text>
        </TerminalBox>
        <TerminalBox title="Keyboard & Tooltip">
          <Tooltip content="Ctrl + K">
            <Button size="sm" onClick={() => setPaletteOpen(true)}>
              Command Palette
            </Button>
          </Tooltip>
          <KeyboardShortcuts shortcuts={SHORTCUTS} className="mt-3" />
        </TerminalBox>
      </TerminalGrid>
      <TerminalBox title="Context Menu">
        <div
          className="rounded-terminal border border-terminal-gridLine/60 p-4"
          onContextMenu={(event) => {
            event.preventDefault();
            setContextMenu({
              visible: true,
              position: { x: event.clientX, y: event.clientY },
            });
          }}
        >
          <MonoText muted>Right-click to open the context menu.</MonoText>
        </div>
        <Text variant="dim" className="mt-2">
          Last action: {lastAction}
        </Text>
      </TerminalBox>
      <TerminalBox title="Dialogs & Modals">
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            Show Dialog
          </Button>
          <Button size="sm" onClick={() => setInputDialogOpen(true)}>
            Input Dialog
          </Button>
          <Button size="sm" onClick={() => setSelectDialogOpen(true)}>
            Select Theme
          </Button>
        </div>
      </TerminalBox>
    </div>
  );

  const editorTab = (
    <div className="space-y-4">
      <TerminalBox title="Text Editor">
        <TextEditor
          value={editorValue}
          onChange={setEditorValue}
          language="ts"
        />
        <EditorStatusBar
          fileName="demo.ts"
          line={editorValue.split("\n").length}
          column={editorValue.split("\n").slice(-1)[0].length}
        />
      </TerminalBox>
      <TerminalGrid columns={2} gap="md">
        <TerminalBox title="Syntax Highlight">
          <SyntaxHighlight
            code={editorValue}
            language="ts"
            className="rounded-terminal border border-terminal-gridLine/60 bg-terminal-black/60 p-3 text-xs"
          />
        </TerminalBox>
        <TerminalBox title="Standalone Line Numbers">
          <LineNumbers lineCount={8} currentLine={3} />
        </TerminalBox>
      </TerminalGrid>
    </div>
  );

  const userColumns: AdminTableColumn<UserRow>[] = [
    {
      key: "name",
      label: "User",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <Avatar name={row.name} size="sm" status={row.status === "active" ? "online" : row.status === "pending" ? "away" : "offline"} />
          <span>{row.name}</span>
        </div>
      ),
    },
    { key: "email", label: "Email", sortable: true },
    { key: "role", label: "Role" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge variant={row.status === "active" ? "success" : row.status === "pending" ? "warning" : "neutral"} dot>
          {row.status}
        </Badge>
      ),
    },
    { key: "lastLogin", label: "Last Login", align: "right" },
    {
      key: "actions",
      label: "",
      width: "50px",
      render: (row) => (
        <Dropdown
          trigger={<Button size="sm" variant="ghost">...</Button>}
          align="right"
        >
          <DropdownLabel>Actions</DropdownLabel>
          <DropdownItem onClick={() => setLastAction(`Edit ${row.name}`)}>Edit user</DropdownItem>
          <DropdownItem onClick={() => setLastAction(`Reset password for ${row.name}`)}>Reset password</DropdownItem>
          <DropdownSeparator />
          <DropdownItem destructive onClick={() => setLastAction(`Delete ${row.name}`)}>Delete user</DropdownItem>
        </Dropdown>
      ),
    },
  ];

  const adminTab = (
    <div className="space-y-4">
      <TerminalGrid columns={2} gap="md">
        <TerminalBox title="Sidebar Navigation" className="min-h-[300px]">
          <div className="flex h-full border border-terminal-gridLine">
            <Sidebar
              collapsed={sidebarCollapsed}
              onCollapsedChange={setSidebarCollapsed}
              width="180px"
            >
              <SidebarHeader>
                <SidebarToggle />
                {!sidebarCollapsed && <Text variant="bold" className="ml-2">Admin</Text>}
              </SidebarHeader>
              <SidebarContent>
                <SidebarGroup label="Main">
                  <SidebarItem
                    icon={<span>◈</span>}
                    active={sidebarActiveItem === "dashboard"}
                    onClick={() => { setSidebarActiveItem("dashboard"); setLastAction("Dashboard"); }}
                  >
                    Dashboard
                  </SidebarItem>
                  <SidebarItem
                    icon={<span>◎</span>}
                    active={sidebarActiveItem === "users"}
                    badge={<Badge variant="info">8</Badge>}
                    onClick={() => { setSidebarActiveItem("users"); setLastAction("Users"); }}
                  >
                    Users
                  </SidebarItem>
                  <SidebarItem
                    icon={<span>⚙</span>}
                    active={sidebarActiveItem === "settings"}
                    onClick={() => { setSidebarActiveItem("settings"); setLastAction("Settings"); }}
                  >
                    Settings
                  </SidebarItem>
                </SidebarGroup>
                <SidebarGroup label="Reports">
                  <SidebarItem
                    icon={<span>▤</span>}
                    active={sidebarActiveItem === "analytics"}
                    onClick={() => { setSidebarActiveItem("analytics"); setLastAction("Analytics"); }}
                  >
                    Analytics
                  </SidebarItem>
                  <SidebarItem
                    icon={<span>⚡</span>}
                    active={sidebarActiveItem === "logs"}
                    onClick={() => { setSidebarActiveItem("logs"); setLastAction("Logs"); }}
                  >
                    Logs
                  </SidebarItem>
                </SidebarGroup>
              </SidebarContent>
              <SidebarFooter>
                <SidebarItem icon={<span>?</span>} onClick={() => setLastAction("Help clicked")}>
                  Help
                </SidebarItem>
              </SidebarFooter>
            </Sidebar>
            <div className="flex-1 p-4">
              <Text variant="dim">Active: {sidebarActiveItem}</Text>
            </div>
          </div>
        </TerminalBox>
        <TerminalBox title="Avatar Components">
          <div className="space-y-4">
            <div>
              <Text variant="dim" className="mb-2 block">Sizes & Status</Text>
              <div className="flex items-end gap-3">
                <Avatar name="Alice Chen" size="xs" status="online" />
                <Avatar name="Bob Smith" size="sm" status="away" />
                <Avatar name="Carol Wu" size="md" status="busy" />
                <Avatar name="David Lee" size="lg" status="offline" />
                <Avatar src="https://api.dicebear.com/7.x/pixel-art/svg?seed=demo" size="xl" />
              </div>
            </div>
            <div>
              <Text variant="dim" className="mb-2 block">Avatar Group</Text>
              <AvatarGroup max={4}>
                <Avatar name="Alice Chen" />
                <Avatar name="Bob Smith" />
                <Avatar name="Carol Wu" />
                <Avatar name="David Lee" />
                <Avatar name="Eve Martinez" />
                <Avatar name="Frank Johnson" />
              </AvatarGroup>
            </div>
            <div>
              <Text variant="dim" className="mb-2 block">Square Avatars</Text>
              <div className="flex gap-2">
                <Avatar name="Terminal" size="md" square />
                <Avatar name="Admin" size="md" square status="online" />
              </div>
            </div>
          </div>
        </TerminalBox>
      </TerminalGrid>

      <TerminalBox title="Admin Table with Selection & Pagination">
        <AdminTable<UserRow>
          columns={userColumns}
          data={USER_DATA}
          getRowKey={(row) => row.id}
          selectable
          selectedRows={selectedUsers}
          onSelectionChange={setSelectedUsers}
          pagination
          pageSize={4}
          currentPage={adminPage}
          onPageChange={setAdminPage}
          striped
          initialSort={{ key: "name", direction: "asc" }}
          onRowClick={(row) => setLastAction(`Clicked ${row.name}`)}
        />
      </TerminalBox>

      <TerminalGrid columns={2} gap="md">
        <TerminalBox title="Dropdown Menu">
          <div className="flex gap-4">
            <Dropdown trigger={<Button size="sm">Actions</Button>}>
              <DropdownItem icon={<span>+</span>} shortcut="Ctrl+N">New item</DropdownItem>
              <DropdownItem icon={<span>↺</span>}>Refresh</DropdownItem>
              <DropdownSeparator />
              <DropdownLabel>Danger Zone</DropdownLabel>
              <DropdownItem destructive icon={<span>×</span>}>Delete all</DropdownItem>
            </Dropdown>
            <Dropdown trigger={<Button size="sm" variant="secondary">Right-aligned</Button>} align="right">
              <DropdownItem onClick={() => setLastAction("Export CSV")}>Export CSV</DropdownItem>
              <DropdownItem onClick={() => setLastAction("Export JSON")}>Export JSON</DropdownItem>
            </Dropdown>
          </div>
        </TerminalBox>
        <TerminalBox title="Standalone Pagination">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <PaginationInfo currentPage={adminPage} pageSize={4} totalItems={USER_DATA.length} />
              <Pagination
                currentPage={adminPage}
                totalPages={Math.ceil(USER_DATA.length / 4)}
                onPageChange={setAdminPage}
              />
            </div>
            <Text variant="dim">Page {adminPage} of {Math.ceil(USER_DATA.length / 4)}</Text>
          </div>
        </TerminalBox>
      </TerminalGrid>
    </div>
  );

  const tabs = [
    { id: "layout", label: "Layout", content: layoutTab },
    { id: "data", label: "Data Viz", content: dataTab },
    { id: "content", label: "Content", content: contentTab },
    { id: "interaction", label: "Interaction", content: interactionTab },
    { id: "editor", label: "Editor", content: editorTab },
    { id: "admin", label: "Admin", content: adminTab },
  ];

  const statusSegments: StatusSegment[] = [
    { label: "Tab", value: activeTab },
    { label: "Filter", value: logStreamFilter || "all", tone: "info" },
    { label: "Action", value: lastAction, tone: "neutral" },
  ];

  return (
    <ThemeProvider preset={themePreset} className="app-shell">
      <TerminalProvider defaultTheme="dark">
        <div
          className="flex h-screen w-full overflow-hidden bg-terminal-background/90 p-2 sm:p-4"
          onPointerDown={() => {
            if (contextMenu.visible) {
              setContextMenu((prev) => ({ ...prev, visible: false }));
            }
          }}
        >
          <TerminalWindow
            title="web-tui showcase"
            className="mx-auto flex w-full max-w-6xl flex-1 flex-col overflow-hidden"
            onClose={() => setDialogOpen(true)}
            onMinimize={() => setLastAction("Window minimized")}
            onMaximize={() => setLastAction("Window maximized")}
          >
            <Header className="flex-col gap-2 md:flex-row">
              <div>
                <Text variant="bold">Terminal-Style Component Library</Text>
                <Breadcrumb
                  segments={[
                    { label: "home", onClick: () => setLastAction("home") },
                    { label: "demos", onClick: () => setLastAction("demos") },
                    { label: activeTab },
                  ]}
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="success" dot>
                  Live
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setPaletteOpen(true)}
                >
                  Open Palette
                </Button>
              </div>
            </Header>

            <div className="flex flex-1 flex-col overflow-hidden">
              <MenuBar items={menuItems} className="mb-3 shrink-0" />
              <div className="flex-1 overflow-y-auto pr-1">
                <Tabs tabs={tabs} activeId={activeTab} onTabChange={setActiveTab} />
              </div>
              <StatusBar segments={statusSegments} className="mt-4 shrink-0" />
              <Footer className="mt-3 flex-col gap-2 shrink-0">
                <FunctionKeyBar keys={FUNCTION_KEYS} className="w-full" />
                <Text variant="dim">
                  Terminal-like UI components for the modern web.
                </Text>
              </Footer>
            </div>
          </TerminalWindow>
        </div>
        <CommandPalette
          commands={COMMAND_PALETTE_COMMANDS}
          open={paletteOpen}
          onClose={() => setPaletteOpen(false)}
          onSelect={(command) => {
            setLastAction(`Command: ${command.label}`);
            setPaletteOpen(false);
          }}
        />
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          title="Cluster overview"
          description="Current status across all services."
          actions={[
            {
              id: "ok",
              label: "Acknowledged",
              onSelect: () => setDialogOpen(false),
            },
          ]}
        >
          <Text>All clusters synced within SLA.</Text>
        </Dialog>
        <InputDialog
          open={inputDialogOpen}
          onClose={() => setInputDialogOpen(false)}
          title="Create note"
          onConfirm={(value) => setLastAction(`Note: ${value}`)}
        />
        <SelectDialog
          open={selectDialogOpen}
          onClose={() => setSelectDialogOpen(false)}
          title="Choose Theme"
          options={SELECT_OPTIONS}
          onSelect={(option) => {
            setThemePreset(option.id as TerminalThemeName);
            setSelectDialogOpen(false);
          }}
        />
        <ContextMenu
          items={contextMenuItems}
          visible={contextMenu.visible}
          position={contextMenu.position}
        />
      </TerminalProvider>
    </ThemeProvider>
  );
}

export default App;
