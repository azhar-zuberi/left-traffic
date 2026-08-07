// Flat ESLint config.
//
// Beyond the standard Expo rules, this file exists to make CLAUDE.md's
// architectural "don'ts" mechanical. Those constraints were learned the hard
// way (Alert.alert silently no-ops on web; screens reading the static
// sample-data arrays caused likes/comments to desync across screens), and
// prose in CLAUDE.md degrades as an agent's context fills up. A lint rule
// doesn't degrade.
//
// If you relax one of these, update the matching section of CLAUDE.md too —
// they're meant to say the same thing.
//
// NOTE ON COMPOSITION: in flat config, a later block's rule options *replace*
// an earlier block's rather than merging with them. So the UI-layer block
// below spreads the shared lists instead of redeclaring only its own entry —
// otherwise scoping a rule to screens/ would quietly switch the shared
// restrictions off for exactly the directories that need them most.

const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier');

/** Applies everywhere. */
const RESTRICTED_PATHS = [
  {
    name: 'react-native',
    importNames: ['Alert'],
    message:
      'Alert.alert is a silent no-op on react-native-web, so it breaks `npm run web` with no error. Use components/ActionSheet.tsx (see CLAUDE.md → "Dialogs and menus").',
  },
  {
    name: 'react-native',
    importNames: ['ActionSheetIOS'],
    message:
      'ActionSheetIOS only exists on iOS. Use components/ActionSheet.tsx, which works on iOS, Android and web (see CLAUDE.md → "Dialogs and menus").',
  },
  {
    name: 'react-native',
    importNames: ['useColorScheme'],
    message:
      'app.json sets userInterfaceStyle: "light" — the app deliberately does not follow OS dark mode. Dark navy surfaces are an editorial choice (see CLAUDE.md → "Theme").',
  },
];

/** Applies everywhere except utils/sampleData.ts, which owns the raw JSON. */
const RESTRICTED_PATTERNS = [
  {
    group: ['**/sample-data/*.json', '@/sample-data/*.json'],
    message:
      'Import from @/utils/sampleData instead, so the JSON arrives typed (see CLAUDE.md → "Data layer").',
  },
];

// Live, mutable state must come through the AppDataProvider. The static arrays
// in utils/sampleData don't trigger re-renders when mutated, which is exactly
// why likes and comments used to desync across screens.
//
// `activity` is deliberately absent from importNames: useAppData doesn't
// expose it yet, so ActivityScreen has no alternative. Once activity moves
// into the provider, add it here.
const UI_LAYER_RESTRICTED_PATH = {
  name: '@/utils/sampleData',
  importNames: ['posts', 'comments', 'aircraft', 'users'],
  message:
    'Read live state via useAppData() from @/hooks/useAppData. The utils/sampleData arrays are seed data — mutating them does not re-render, which is what desynced likes/comments across screens (see CLAUDE.md → "Data layer").',
};

module.exports = [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'dist-ci/**',
      'dist-verify/**',
      '.expo/**',
      'expo-env.d.ts',
      'ios/**',
      'android/**',
    ],
  },

  ...expoConfig,

  // Must come after expoConfig: turns off stylistic rules that would fight
  // Prettier. Formatting is Prettier's job, not ESLint's.
  prettierConfig,

  // Unused imports/vars are the main way a scope-reduction pass leaves debris
  // behind. Error, not warn — but allow the _-prefix escape hatch.
  //
  // Scoped to ts/tsx: eslint-config-expo only registers the @typescript-eslint
  // plugin for those files, so referencing the rule globally would crash ESLint
  // when it reaches a plain .js/.mjs file (this config, scripts/*.mjs).
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    rules: {
      'no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
    },
  },

  {
    rules: {
      'no-restricted-imports': [
        'error',
        { paths: RESTRICTED_PATHS, patterns: RESTRICTED_PATTERNS },
      ],
    },
  },

  // The UI layer additionally may not reach past the provider for live state.
  {
    files: ['screens/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}', 'app/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [...RESTRICTED_PATHS, UI_LAYER_RESTRICTED_PATH],
          patterns: RESTRICTED_PATTERNS,
        },
      ],
    },
  },

  // utils/sampleData.ts is the one place allowed to touch the raw JSON — it's
  // what casts it to the types everything else consumes. Listed last so it
  // wins over the blanket restriction above.
  {
    files: ['utils/sampleData.ts'],
    rules: { 'no-restricted-imports': ['error', { paths: RESTRICTED_PATHS }] },
  },
];
