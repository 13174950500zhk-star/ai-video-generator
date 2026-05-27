import { GenericVideoProvider } from './generic-provider';
import { VideoProvider } from './types';

export function getVideoProvider(): VideoProvider {
  const provider = process.env.VIDEO_API_PROVIDER ?? 'generic';
  const apiKey = process.env.VIDEO_API_KEY ?? '';
  const endpoint = process.env.VIDEO_API_ENDPOINT ?? '';

  switch (provider) {
    case 'generic':
    default:
      return new GenericVideoProvider(apiKey, endpoint);
  }
}
