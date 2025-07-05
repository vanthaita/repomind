#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */

const fs = require('fs');
const path = require('path');

/**
 * @typedef {Object} MigrationConfig
 * @property {string} type - Loại prompt
 * @property {string} startMarker - Marker bắt đầu prompt
 * @property {string} endMarker - Marker kết thúc prompt
 * @property {string[]} variables - Danh sách variables
 */

/**
 * @typedef {Object.<string, MigrationConfig[]>} MigrationMap
 */

// Mapping của các file cần migrate
/** @type {MigrationMap} */
const MIGRATION_MAP = {
  'src/lib/action.ts': [
    {
      type: 'recommendation-questions',
      startMarker: 'prompt: `',
      endMarker: '`',
      variables: ['answer', 'compiledContext']
    },
    {
      type: 'code-assistant',
      startMarker: 'prompt: `',
      endMarker: '`',
      variables: ['context', 'userQuestion']
    },
    {
      type: 'code-assistant-stream',
      startMarker: 'prompt: `',
      endMarker: '`',
      variables: ['context', 'userQuestion']
    }
  ],
  'src/lib/gemini.ts': [
    {
      type: 'commit-summary',
      startMarker: 'content: `',
      endMarker: '`',
      variables: ['diff']
    },
    {
      type: 'pull-request-analysis',
      startMarker: 'content: `',
      endMarker: '`',
      variables: ['diff']
    },
    {
      type: 'code-summary',
      startMarker: 'content: `',
      endMarker: '`',
      variables: ['fileName', 'code']
    }
  ],
  'src/lib/together.ts': [
    {
      type: 'commit-summary',
      startMarker: 'content: `',
      endMarker: '`',
      variables: ['diff']
    },
    {
      type: 'code-summary-together',
      startMarker: 'content: `',
      endMarker: '`',
      variables: ['fileName', 'code']
    }
  ],
  'src/lib/ollama.ts': [
    {
      type: 'commit-summary',
      startMarker: 'content: `',
      endMarker: '`',
      variables: ['diff']
    },
    {
      type: 'pull-request-analysis',
      startMarker: 'content: `',
      endMarker: '`',
      variables: ['diff']
    },
    {
      type: 'code-summary-local',
      startMarker: 'content: `',
      endMarker: '`',
      variables: ['fileName', 'code']
    }
  ]
};

/**
 * Extract prompt content from file content
 * @param {string} content - File content
 * @param {string} startMarker - Start marker
 * @param {string} endMarker - End marker
 * @returns {string|null} Extracted prompt or null if not found
 */
function extractPrompt(content, startMarker, endMarker) {
  const startIndex = content.indexOf(startMarker);
  if (startIndex === -1) return null;
  
  const actualStart = startIndex + startMarker.length;
  const endIndex = content.indexOf(endMarker, actualStart);
  if (endIndex === -1) return null;
  
  return content.substring(actualStart, endIndex);
}

/**
 * Replace prompt content in file
 * @param {string} content - File content
 * @param {string} startMarker - Start marker
 * @param {string} endMarker - End marker
 * @param {string} replacement - Replacement content
 * @returns {string} Updated content
 */
function replacePrompt(content, startMarker, endMarker, replacement) {
  const startIndex = content.indexOf(startMarker);
  if (startIndex === -1) return content;
  
  const actualStart = startIndex + startMarker.length;
  const endIndex = content.indexOf(endMarker, actualStart);
  if (endIndex === -1) return content;
  
  return content.substring(0, startIndex) + 
         startMarker + 
         replacement + 
         endMarker + 
         content.substring(endIndex + endMarker.length);
}

/**
 * Migrate a single file
 * @param {string} filePath - Path to file to migrate
 */
function migrateFile(filePath) {
  console.log(`\n🔄 Migrating ${filePath}...`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf-8');
  const migrations = /** @type {MigrationConfig[]} */ (MIGRATION_MAP[filePath] || []);
  
  for (const migration of migrations) {
    const prompt = extractPrompt(content, migration.startMarker, migration.endMarker);
    
    if (prompt) {
      console.log(`  📝 Found ${migration.type} prompt`);
      
      // Replace with PromptLoader call
      const replacement = `await PromptLoader.loadAndRender(
        PROMPT_NAMES.${migration.type.toUpperCase().replace(/-/g, '_')},
        {
          ${migration.variables.map((/** @type {string} */ v) => `${v}: \${${v}}`).join(',\n          ')}
        }
      )`;
      
      content = replacePrompt(content, migration.startMarker, migration.endMarker, replacement);
      
      // Add import if not exists
      if (!content.includes('import { PromptLoader, PROMPT_NAMES }')) {
        const importStatement = "import { PromptLoader, PROMPT_NAMES } from '@/lib/prompt-loader';";
        const lastImportIndex = content.lastIndexOf('import');
        const insertIndex = content.indexOf('\n', lastImportIndex) + 1;
        content = content.substring(0, insertIndex) + importStatement + '\n' + content.substring(insertIndex);
      }
    }
  }
  
  // Write back to file
  fs.writeFileSync(filePath, content);
  console.log(`✅ Migrated ${filePath}`);
}

/**
 * Main function to run migration
 */
function main() {
  console.log('🚀 Starting prompt migration...');
  
  for (const filePath of Object.keys(MIGRATION_MAP)) {
    migrateFile(filePath);
  }
  
  console.log('\n🎉 Migration completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Review the changes in each file');
  console.log('2. Test the application to ensure prompts work correctly');
  console.log('3. Remove any unused prompt files if needed');
  console.log('4. Update any remaining hardcoded prompts manually');
}

if (require.main === module) {
  main();
}

module.exports = { migrateFile, MIGRATION_MAP }; 