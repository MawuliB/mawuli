// Mapping from skill name (lowercased) to a Devicon slug + variant.
// Resolves to a public CDN URL. Names without a Devicon entry fall back
// to the JSON `icon` (emoji) field rendered in the template.

interface DeviconEntry {
  slug: string;
  variant: 'original' | 'plain' | 'original-wordmark';
}

const DEVICON_MAP: Record<string, DeviconEntry> = {
  aws: { slug: 'amazonwebservices', variant: 'original-wordmark' },
  terraform: { slug: 'terraform', variant: 'original' },
  'gitlab ci/cd': { slug: 'gitlab', variant: 'original' },
  jenkins: { slug: 'jenkins', variant: 'original' },
  ansible: { slug: 'ansible', variant: 'original' },
  prometheus: { slug: 'prometheus', variant: 'original' },
  grafana: { slug: 'grafana', variant: 'original' },
  docker: { slug: 'docker', variant: 'original' },
  kafka: { slug: 'apachekafka', variant: 'original' },
  git: { slug: 'git', variant: 'original' },
  linux: { slug: 'linux', variant: 'original' },
  'bash scripting': { slug: 'bash', variant: 'original' },
  python: { slug: 'python', variant: 'original' },
  fastapi: { slug: 'fastapi', variant: 'original' },
  'java spring boot': { slug: 'spring', variant: 'original' },
  postgresql: { slug: 'postgresql', variant: 'original' },
  angular: { slug: 'angularjs', variant: 'original' },
  typescript: { slug: 'typescript', variant: 'original' },
};

export function getSkillIconUrl(name: string): string | null {
  const entry = DEVICON_MAP[name.toLowerCase()];
  if (!entry) return null;
  return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${entry.slug}/${entry.slug}-${entry.variant}.svg`;
}
