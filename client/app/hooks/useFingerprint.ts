import useSWR from 'swr';
import FingerprintJS from '@fingerprintjs/fingerprintjs'

export function useFingerprint() {
  return useSWR(['client.fingerprint'], async () => {
    const fpPromise = FingerprintJS.load();
    const fp = await fpPromise;
    return fp.get();
  }, { suspense: false })
}
