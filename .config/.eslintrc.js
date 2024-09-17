module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    browser: true,
    amd: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier', // Make sure this is always the last element in the array.
  ],
  plugins: ['simple-import-sort', 'react-hooks', '@typescript-eslint'],
  rules: {
    "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 1, "maxBOF": 0 }],
    '@typescript-eslint/no-explicit-any': 'off',
    'no-unused-vars': 'off',
    'no-undef': 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react-hooks/rules-of-hooks': 'error',
    // 默认开启 exhaustive-deps, 对于某些确实不需要该规则的场景, 可使用面的注释关闭该规则
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // eslint-disable-line react-hooks/exhaustive-deps
    'react-hooks/exhaustive-deps': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/consistent-type-imports': ['error'],
    // 允许使用async
    'generator-star-spacing': 0,
    'babel/generator-star-spacing': 0,
    '@typescript-eslint/no-var-requires': 2,
    '@typescript-eslint/type-annotation-spacing': 2,
    // 开发环境换行符
    'linebreak-style': [0, 'windows'],
    // 三等号
    eqeqeq: [2, 'always'],
    // 注释符号和注释内容之间必须有空格
    'spaced-comment': [2, 'always'],
    // 关键字后面使用一致的空格
    'keyword-spacing': 2,
    // 强制在 function的左括号之前使用一致的空格
    'space-before-function-paren': 0,
    // 不以新行开始的块前面要不要有空格
    'space-before-blocks': 2,
    // 引号类型
    quotes: [1, 'single'],
    // 禁止出现未使用过的变量
    'no-unused-vars': 0,
    '@typescript-eslint/no-unused-vars': [2],
    // 要求或禁止末尾逗号
    'comma-dangle': 0,
    // js语句结尾必须使用分号
    semi: [2, 'always'],
    'array-bracket-spacing': [2, 'never'],
    'react/jsx-filename-extension': [0, { extensions: ['.tsx', '.ts'] }],
    'react/jsx-uses-react': 0,
    'react/react-in-jsx-scope': 0,
    'react/jsx-props-no-spreading': [0],
    'max-classes-per-file': [2, 2],
    'no-console': 'warn',
    'max-len': ['error', { code: 100, ignoreTemplateLiterals: true }],
    'no-param-reassign': ['error', { props: false }],
    'react/prop-types': [0],
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'no-undef': 'off',
      },
    },
  ],
};
