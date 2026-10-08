const config = require('../../app.config.js');

describe('app config', () => {
  it('uses the RideX identity and deep-link scheme', () => {
    expect(config.expo.name).toBe('RideX');
    expect(config.expo.slug).toBe('ridex');
    expect(config.expo.scheme).toBe('ridex');
  });

  it('follows the system theme by default (DESIGN.md section 16)', () => {
    expect(config.expo.userInterfaceStyle).toBe('automatic');
  });
});
