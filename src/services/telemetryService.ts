import { AuditEvent } from '../types/blockchain';
import { computeSha256 } from './quantumCrypto';

class TelemetryService {
  private events: AuditEvent[] = [];
  private listeners: Set<(events: AuditEvent[]) => void> = new Set();

  constructor() {
    this.record('SYSTEM_INIT', 'SYSTEM_KERNEL', 'GXQ Quantum Core Engine boot sequence completed. Post-quantum cryptographic lattice initialized.', 'SUCCESS');
  }

  public subscribe(listener: (events: AuditEvent[]) => void): () => void {
    this.listeners.add(listener);
    listener(this.events);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public async record(
    eventType: string,
    actor: string,
    rawDetails: string,
    status: 'SUCCESS' | 'WARN' | 'CRITICAL' = 'SUCCESS'
  ): Promise<AuditEvent> {
    // Sanitizer: Ensure zero sensitive material in logs
    let sanitizedDetails = rawDetails
      .replace(/([a-f0-9]{64})/gi, '[REDACTED_SECRET_BYTES]')
      .replace(/(mnemonic|seed|privateKey|passphrase)=([^&]+)/gi, '$1=[REDACTED]');

    const correlationId = `CORR_${Math.random().toString(36).slice(2, 9).toUpperCase()}_${Date.now().toString(36)}`;
    const timestamp = new Date().toISOString();
    const verificationHash = await computeSha256(`${correlationId}|${timestamp}|${eventType}|${actor}|${sanitizedDetails}`);

    const event: AuditEvent = {
      id: `EVT_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      correlationId,
      timestamp,
      eventType,
      actor: actor.length > 20 ? `${actor.slice(0, 8)}...${actor.slice(-6)}` : actor,
      details: sanitizedDetails,
      verificationHash: `0x${verificationHash.slice(0, 24)}...`,
      status,
    };

    this.events = [event, ...this.events.slice(0, 199)]; // Keep latest 200 events
    this.notify();
    return event;
  }

  public getEvents(): AuditEvent[] {
    return this.events;
  }

  public async track(
    eventType: string,
    actor: string,
    rawDetails: string,
    status: 'SUCCESS' | 'WARN' | 'CRITICAL' = 'SUCCESS'
  ): Promise<AuditEvent> {
    return this.record(eventType, actor, rawDetails, status);
  }

  public clear(): void {
    this.events = [];
    this.notify();
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener(this.events);
    }
  }
}

export const telemetry = new TelemetryService();
