import pluginJs from '@eslint/js';
import stylisticTs from '@stylistic/eslint-plugin-ts';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      '@stylistic/ts': stylisticTs
    },
    rules: {
      '@stylistic/ts/dot-notation': 'off',
      '@stylistic/ts/explicit-member-accessibility': [
        'off',
        {
          accessibility: 'explicit'
        }
      ],
      '@stylistic/ts/indent': 'off',
      '@stylistic/ts/member-delimiter-style': [
        'error',
        {
          multiline: {
            delimiter: 'semi',
            requireLast: true
          },
          singleline: {
            delimiter: 'semi',
            requireLast: false
          }
        }
      ],
      '@stylistic/ts/member-ordering': 'off',
      '@stylistic/ts/no-empty-function': 'off',
      '@typescript-eslint/no-empty-object-type': 'error',
      '@stylistic/ts/no-inferrable-types': [
        'off',
        {
          ignoreParameters: true
        }
      ],
      '@typescript-eslint/no-misused-new': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-shadow': [
        'error',
        {
          hoist: 'all'
        }
      ],
      '@typescript-eslint/no-unused-expressions': 'error',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/prefer-function-type': 'error',
      '@stylistic/ts/quotes': ['off', 'single'],
      '@stylistic/ts/semi': ['error', 'always'],
      '@stylistic/ts/type-annotation-spacing': 'error',
      '@typescript-eslint/unified-signatures': 'error',
      'arrow-body-style': 'error',
      'brace-style': ['error', '1tbs'],
      'constructor-super': 'error',
      curly: 'error',
      'dot-notation': 'off',
      'eol-last': 'off',
      eqeqeq: ['warn', 'smart'],
      'guard-for-in': 'error',
      'id-denylist': 'off',
      'id-match': 'off',
      indent: 'off',
      'max-len': [
        'warn',
        {
          code: 200
        }
      ],
      'no-bitwise': 'error',
      'no-caller': 'error',
      'no-console': [
        'error',
        {
          allow: [
            'log',
            'warn',
            'dir',
            'timeLog',
            'assert',
            'clear',
            'count',
            'countReset',
            'group',
            'groupEnd',
            'table',
            'dirxml',
            'error',
            'groupCollapsed',
            'Console',
            'profile',
            'profileEnd',
            'timeStamp',
            'context'
          ]
        }
      ],
      'no-debugger': 'error',
      'no-empty': 'off',
      'no-empty-function': 'off',
      'no-eval': 'error',
      'no-fallthrough': 'error',
      'no-new-wrappers': 'error',
      'no-restricted-imports': ['error', 'rxjs/Rx'],
      'no-shadow': 'off',
      'no-throw-literal': 'error',
      'no-trailing-spaces': 'error',
      'no-undef-init': 'error',
      'no-underscore-dangle': 'off',
      'no-unused-expressions': 'off',
      'no-unused-labels': 'error',
      'no-use-before-define': 'off',
      'no-var': 'error',
      'prefer-const': 'warn',
      quotes: [0, 'single', { avoidEscape: true }],
      radix: 'off',
      semi: 'off',
      'spaced-comment': [
        'error',
        'always',
        {
          markers: ['/']
        }
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      'no-extra-boolean-cast': 'off'
    }
  },
  {
    ignores: ['node_modules/*', 'dist/*']
  }
];
