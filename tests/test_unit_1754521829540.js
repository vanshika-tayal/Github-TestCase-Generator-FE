const { default: tailwindConfig } = require('./tailwind.config');

describe('Tailwind Config: boxShadow', () => {
  it('should define a "soft" box shadow', () => {
    expect(tailwindConfig.theme.extend.boxShadow.soft).toBeDefined();
    expect(tailwindConfig.theme.extend.boxShadow.soft).toBe('0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)');
  });

  it('should define a "medium" box shadow', () => {
    expect(tailwindConfig.theme.extend.boxShadow.medium).toBeDefined();
    expect(tailwindConfig.theme.extend.boxShadow.medium).toBe('0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)');
  });

  it('should define a "large" box shadow', () => {
    expect(tailwindConfig.theme.extend.boxShadow.large).toBeDefined();
    expect(tailwindConfig.theme.extend.boxShadow.large).toBe('0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 2px 10px -2px rgba(0, 0, 0, 0.05)');
  });

  it('should define all three box shadows', () => {
    expect(Object.keys(tailwindConfig.theme.extend.boxShadow)).toEqual(['soft', 'medium', 'large']);
  });

  it('should throw error if boxShadow is undefined', () => {
    const invalidConfig = { ...tailwindConfig, theme: { ...tailwindConfig.theme, extend: { ...tailwindConfig.theme.extend, boxShadow: undefined } } };
    expect(() => {
        expect(invalidConfig.theme.extend.boxShadow.soft).toBeDefined();
    }).toThrowError();
  });

});