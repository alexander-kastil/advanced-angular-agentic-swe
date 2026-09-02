import { describe, it, expect, beforeEach } from 'vitest';
import { SimpleMessageService } from './simple.service';
import { msgs } from './test-data';

describe('Service - No Injection - SimpleMessageService', () => {
  let service: SimpleMessageService;

  beforeEach(() => {
    service = new SimpleMessageService();
  });

  it('should have no messages to start', () => {
    expect(service.messages.length).toBe(0);
  });

  it('should add a message when add is called', () => {
    service.add('message1');
    service.add('message2');
    expect(service.messages.length).toBe(2);
  });

  it('should remove all messages when clear is called', () => {
    service.add('message1');
    service.clear();
    expect(service.messages.length).toBe(0);
  });

  it('should delete the correct item', () => {
    service.messages = msgs;
    service.delete('Hello World');
    expect(service.messages.length).toBe(2);
    expect(service.messages).toContain('Szia World');
    expect(service.messages).toContain('Servus Welt');
  });
});
