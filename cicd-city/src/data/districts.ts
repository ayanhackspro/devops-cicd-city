// ============================================================
// DISTRICT DATA — Six Pipeline Districts
// Hierarchical arc layout: CODE→BUILD→TEST fan left/center,
// PACKAGE→DEPLOY fan right, MONITOR center-right foreground.
// Every district has a UNIQUE X position with NO occlusions.
// ============================================================

export interface DistrictContent {
  description: string;
  sublabels: string[];
  commands: string[];
}

export interface District {
  id: 'code' | 'build' | 'test' | 'package' | 'deploy' | 'monitor';
  index: string;           // "01"–"06"
  label: string;
  accentColour: string;
  position: [number, number, number];
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  glbModel: string;
  buildingType: string;
  content: DistrictContent;
}

export const DISTRICTS: District[] = [
  {
    id: 'code',
    index: '01',
    label: 'CODE',
    accentColour: '#A3A58A',
    // Far-left arc — development campus
    position: [-34, 0, -4],
    cameraPosition: [-38, 20, 16],
    cameraTarget: [-34, 6, -4],
    glbModel: '/models/district-code.glb',
    buildingType: 'Development Office Campus',
    content: {
      description:
        'Where software begins. Developers plan, write, review and commit code in a collaborative environment. Version control, branching strategies and code review are the physical fabric of this district.',
      sublabels: ['PLAN', 'DEVELOP', 'REVIEW', 'COMMIT', 'COLLABORATE'],
      commands: [
        'git init',
        'git checkout -b feature/new-service',
        'git add .',
        'git commit -m "feat: add pipeline stage"',
        'git push origin feature/new-service',
      ],
    },
  },
  {
    id: 'build',
    index: '02',
    label: 'BUILD',
    accentColour: '#A8A6A0',
    // Mid-left — wide industrial facility
    position: [-18, 0, -18],
    cameraPosition: [-24, 18, -4],
    cameraTarget: [-18, 5, -18],
    glbModel: '/models/district-build.glb',
    buildingType: 'Compute & Data Facility',
    content: {
      description:
        'Raw source code enters the factory floor. Compilers, dependency resolvers and container engines transform human-written instructions into deployable artifacts — reliably, repeatably, at scale.',
      sublabels: ['COMPILE', 'DEPENDENCIES', 'CONTAINERS', 'ARTIFACTS'],
      commands: [
        'npm ci',
        'npm run build',
        'docker build -t app:$CI_SHA .',
        'docker tag app:$CI_SHA registry/app:$CI_SHA',
      ],
    },
  },
  {
    id: 'test',
    index: '03',
    label: 'TEST',
    accentColour: '#D6B36A',
    // Center-back — symmetric laboratory campus, twin towers
    position: [-2, 0, -26],
    cameraPosition: [4, 20, -12],
    cameraTarget: [-2, 8, -26],
    glbModel: '/models/district-test.glb',
    buildingType: 'Laboratory & Quality Campus',
    content: {
      description:
        'Nothing ships without validation. Automated test suites, integration checks, security scans and quality gates ensure that every artifact leaving this campus meets the standard.',
      sublabels: ['AUTOMATED TESTS', 'INTEGRATION', 'SECURITY', 'QUALITY'],
      commands: [
        'npm test',
        'npm run test:integration',
        'npm run test:e2e',
        'trivy image registry/app:$CI_SHA',
        'sonar-scanner',
      ],
    },
  },
  {
    id: 'package',
    index: '04',
    label: 'PACKAGE',
    accentColour: '#C8A84A',
    // Mid-right — stepped logistics hub
    position: [18, 0, -18],
    cameraPosition: [24, 16, -4],
    cameraTarget: [18, 4, -18],
    glbModel: '/models/district-package.glb',
    buildingType: 'Logistics & Artifact Centre',
    content: {
      description:
        'Validated artifacts are versioned, tagged and stored in the registry. This logistics centre prepares software for distribution — immutable, traceable, ready for any environment.',
      sublabels: ['ARTIFACTS', 'VERSIONS', 'REGISTRY', 'DISTRIBUTION'],
      commands: [
        'docker push registry/app:$CI_SHA',
        'helm package ./charts/app',
        'helm push app-chart.tgz oci://registry/charts',
        'cosign sign registry/app:$CI_SHA',
      ],
    },
  },
  {
    id: 'deploy',
    index: '05',
    label: 'DEPLOY',
    accentColour: '#B86B4B',
    // Far-right arc — infrastructure tower cluster
    position: [32, 0, -4],
    cameraPosition: [42, 22, 14],
    cameraTarget: [32, 8, -4],
    glbModel: '/models/district-deploy.glb',
    buildingType: 'Network Infrastructure District',
    content: {
      description:
        'The release network. Infrastructure is provisioned, configuration is applied and software flows outward to its destinations. Rolling deployments, blue-green switches and canary releases happen here.',
      sublabels: ['INFRASTRUCTURE', 'CONFIGURATION', 'RELEASE', 'SCALE'],
      commands: [
        'terraform apply -auto-approve',
        'kubectl apply -f k8s/',
        'kubectl rollout status deployment/app',
        'kubectl scale deployment/app --replicas=5',
      ],
    },
  },
  {
    id: 'monitor',
    index: '06',
    label: 'MONITOR',
    accentColour: '#5A7080',
    // Center-right foreground — tallest control tower, skyline anchor
    position: [6, 0, 10],
    cameraPosition: [14, 30, 32],
    cameraTarget: [6, 16, 10],
    glbModel: '/models/district-monitor.glb',
    buildingType: 'Operations & Control Tower',
    content: {
      description:
        'The observation deck. From here, operators watch the entire delivery system — metrics, logs, traces and alerts form a continuous feedback loop that drives improvement across all six districts.',
      sublabels: ['OBSERVABILITY', 'METRICS', 'LOGS', 'TRACES', 'ALERTS'],
      commands: [
        'kubectl logs -f deployment/app',
        'kubectl top nodes',
        'curl -s prometheus:9090/api/v1/query?query=up',
        'alertmanager --config.file=alerts.yml',
      ],
    },
  },
];

export const PIPELINE_STAGES = DISTRICTS.map((d) => ({
  index: d.index,
  label: d.label,
  id: d.id,
  accentColour: d.accentColour,
}));
