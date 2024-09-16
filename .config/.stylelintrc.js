module.exports = {
  extends: ['stylelint-config-standard'],
  plugins: ['stylelint-order'],
  rules: {
    'selector-class-pattern': [
      // 命名规范 -
      '(^([A-Z][a-z0-9]+)+)|(-([a-z]))',
      {
        message: '驼峰命名或短横线命名',
      },
    ],
    'block-no-empty': null,
    'no-empty-source': null,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global'],
      },
    ],
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['/^My/', '/^Custom/'],
      },
    ],
  },
};
