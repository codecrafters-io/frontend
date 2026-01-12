export type OperatingSystem = 'Windows' | 'macOS' | 'Linux' | 'Unknown';

interface NavigatorUAData {
  getHighEntropyValues(hints: string[]): Promise<{ platform?: string }>;
}

declare global {
  interface Navigator {
    userAgentData?: NavigatorUAData;
  }
}

function detectFromPlatformString(platformString: string): OperatingSystem | null {
  const platform = platformString.toLowerCase();

  if (platform.includes('win')) return 'Windows';
  if (platform.includes('mac')) return 'macOS';
  if (platform.includes('linux')) return 'Linux';

  return null;
}

function detectFromUserAgentString(userAgentString: string): OperatingSystem | null {
  const userAgent = userAgentString.toLowerCase();

  if (userAgent.includes('windows nt')) return 'Windows';
  if (userAgent.includes('mac os x') && !userAgent.includes('iphone') && !userAgent.includes('ipad')) return 'macOS';
  if (userAgent.includes('linux') && !userAgent.includes('android')) return 'Linux';

  return null;
}

async function detectFromUserAgentData(): Promise<OperatingSystem | null> {
  const userAgentData = navigator.userAgentData;

  if (!userAgentData?.getHighEntropyValues) {
    return null;
  }

  try {
    const { platform } = await userAgentData.getHighEntropyValues(['platform']);

    if (platform === 'Windows' || platform === 'macOS' || platform === 'Linux') {
      return platform;
    }
  } catch {
    // fall through to return null
  }

  return null;
}

export default async function detectOperatingSystem(): Promise<OperatingSystem> {
  return (
    (await detectFromUserAgentData()) ??
    detectFromPlatformString(navigator.platform || '') ??
    detectFromUserAgentString(navigator.userAgent) ??
    'Unknown'
  );
}
