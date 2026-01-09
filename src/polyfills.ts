import { webcrypto } from 'crypto';

// Ensure global crypto is available (Node 18 fix)
(globalThis as any).crypto = (globalThis as any).crypto ?? webcrypto;
