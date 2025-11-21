# [#011] 번들 크기 최적화

## 📌 Status
`🔲 Todo`

## 🏷️ Labels
`performance` `optimization` `priority-3`

## 📝 Description

현재 번들에 불필요한 코드가 포함되어 있거나, 라이브러리 사용이 비효율적일 수 있습니다. Tree-shaking, 라이브러리 대체, 불필요한 의존성 제거 등을 통해 번들 크기를 최적화해야 합니다.

## 🎯 Goal

최종 번들 크기를 **30% 이상 감소**시켜 로딩 속도를 개선하고 사용자 경험을 향상시킵니다.

## 📋 Tasks

### 1. 번들 분석 및 최적화 대상 식별

- [ ] vite-bundle-analyzer로 현재 번들 분석
- [ ] 큰 용량을 차지하는 라이브러리 식별
- [ ] 불필요한 의존성 파악

### 2. Tree-shaking 최적화

- [ ] Named import 사용 확인
- [ ] Side-effect 없는 모듈 표시
- [ ] Dead code 제거

### 3. 라이브러리 최적화

- [ ] Recharts import 최적화
- [ ] Lucide React icon tree-shaking
- [ ] React Markdown 경량화 또는 대체
- [ ] 불필요한 polyfill 제거

### 4. 이미지 및 에셋 최적화

- [ ] SVG 최적화
- [ ] 폰트 최적화 (subset, woff2)
- [ ] 이미지 포맷 최적화

### 5. Production Build 최적화

- [ ] Minification 설정 최적화
- [ ] Compression (gzip, brotli) 확인
- [ ] Source map 설정

## 💡 Implementation Example

### Example 1: Tree-shaking 최적화

#### Before (잘못된 import)

```typescript
// ❌ Default import는 전체 라이브러리를 포함할 수 있음
import _ from 'lodash';
import * as lucideIcons from 'lucide-react';

// ❌ 사용하지 않는 함수도 번들에 포함
import { debounce, throttle, cloneDeep, merge, isEmpty, isEqual } from 'lodash';
```

#### After (올바른 import)

```typescript
// ✅ Named import로 필요한 것만
import { debounce } from 'lodash-es'; // ES 모듈 버전 사용

// ✅ 개별 패키지 사용 (더 작음)
import debounce from 'lodash.debounce';

// ✅ Lucide icons는 개별 import
import { Rocket, Check, AlertCircle, TrendingUp } from 'lucide-react';

// ❌ 이렇게 하지 말 것
// import * as Icons from 'lucide-react';
```

---

### Example 2: Recharts 최적화

#### Before

```typescript
// ❌ 전체 Recharts import (300KB+)
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  // ... 사용하지 않는 컴포넌트들
} from 'recharts';
```

#### After

```typescript
// ✅ 필요한 것만 import
import { LineChart, Line } from 'recharts';
import { BarChart, Bar } from 'recharts';
// 각 차트 타입별로 필요한 것만

// 또는 Chart.js나 다른 경량 라이브러리 고려
// import { Chart as ChartJS } from 'chart.js'; // ~120KB (Recharts보다 작음)
```

---

### Example 3: React Markdown 대체

#### Before

```typescript
// ❌ React Markdown + plugins (100KB+)
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

<ReactMarkdown remarkPlugins={[remarkGfm]}>
  {markdown}
</ReactMarkdown>
```

#### After (옵션 1: 경량 라이브러리)

```typescript
// ✅ marked (경량 마크다운 파서, ~40KB)
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const MarkdownContent: React.FC<{ content: string }> = ({ content }) => {
  const html = marked.parse(content);
  const sanitizedHtml = DOMPurify.sanitize(html);
  
  return (
    <div 
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};
```

#### After (옵션 2: 서버 사이드 렌더링)

```typescript
// ✅ 서버에서 HTML로 변환하여 전송 (번들에 포함 안 됨)
// API에서 이미 HTML로 변환된 사업계획서를 받음
const { htmlContent } = await fetchBusinessPlan(projectId);

return (
  <div 
    className="markdown-content"
    dangerouslySetInnerHTML={{ __html: htmlContent }}
  />
);
```

---

### Example 4: package.json 최적화

```json
{
  "dependencies": {
    // ✅ 꼭 필요한 의존성만 유지
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "zustand": "^4.4.7",
    
    // ⚠️ 큰 라이브러리는 재검토
    // "lodash": "^4.17.21" → "lodash-es": "^4.17.21" (ES 모듈)
    "lodash-es": "^4.17.21",
    
    // ⚠️ 또는 개별 패키지 사용
    "lodash.debounce": "^4.0.8",
    "lodash.throttle": "^4.1.1",
    
    // ✅ 경량 대안 고려
    // "moment": "^2.29.4" → "date-fns": "^2.30.0" (tree-shakable)
    "date-fns": "^2.30.0",
    
    // ✅ Chart 라이브러리 재검토
    // "recharts": "^2.10.0" → 더 가벼운 대안?
    "recharts": "^2.10.0", // 또는 "chart.js": "^4.4.0"
    
    // ✅ 마크다운 라이브러리 경량화
    // "react-markdown": "^9.0.0" → "marked": "^11.0.0"
    "marked": "^11.0.0",
    "dompurify": "^3.0.0"
  },
  
  "devDependencies": {
    // ✅ dev dependencies는 번들에 포함되지 않으므로 OK
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0"
  }
}
```

---

### Example 5: Vite 설정 최적화

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    
    // Bundle 분석
    visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
    
    // Gzip & Brotli 압축
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
  ],
  
  build: {
    // Minification 설정
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 프로덕션에서 console.log 제거
        drop_debugger: true,
      },
    },
    
    // Chunk 크기 경고 (KB)
    chunkSizeWarningLimit: 500,
    
    rollupOptions: {
      output: {
        // Manual chunks for better caching
        manualChunks: {
          // Vendor chunks
          'react-core': ['react', 'react-dom'],
          'react-router': ['react-router-dom'],
          'state-management': ['zustand'],
          'ui-icons': ['lucide-react'],
          'charts': ['recharts'],
          'markdown': ['marked', 'dompurify'],
          
          // Feature chunks
          'wizard': [
            './src/pages/WizardStep.tsx',
            './src/components/wizard/QuestionForm.tsx',
          ],
          'financial': [
            './src/components/wizard/FinancialSimulation.tsx',
            './src/stores/useFinancialStore.ts',
          ],
        },
        
        // 파일명에 hash 추가 (캐싱 최적화)
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
      
      // External dependencies (CDN 사용 시)
      external: [
        // 예: React를 CDN으로 제공하는 경우
        // 'react',
        // 'react-dom',
      ],
    },
    
    // Source map 설정 (프로덕션에서는 제거 권장)
    sourcemap: false, // 또는 'hidden'
  },
  
  // CSS 최적화
  css: {
    postcss: {
      plugins: [
        // PurgeCSS로 사용하지 않는 CSS 제거 (Tailwind가 자동으로 함)
      ],
    },
  },
});
```

---

### Example 6: 불필요한 Polyfill 제거

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    target: 'es2015', // 또는 'esnext' (최신 브라우저만 지원 시)
    
    // 폴리필 제거
    polyfillModulePreload: false,
  },
  
  // 최신 브라우저만 지원하는 경우
  // target: 'esnext',
});

// .browserslistrc 또는 package.json
{
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not dead",
    "not ie 11"
  ]
}
```

---

### Example 7: 이미지 및 폰트 최적화

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    // SVG 최적화
    svgr({
      svgrOptions: {
        plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
        svgoConfig: {
          plugins: [
            {
              name: 'removeViewBox',
              active: false,
            },
          ],
        },
      },
    }),
  ],
  
  build: {
    // Asset inline 임계값 (KB) - 작은 파일은 inline base64
    assetsInlineLimit: 4096, // 4KB
  },
});

// 폰트 최적화 (CSS)
/* 
  1. woff2 포맷 사용 (가장 작음)
  2. subset 사용 (필요한 글자만)
  3. font-display: swap (렌더링 차단 방지)
*/
@font-face {
  font-family: 'Pretendard';
  src: url('/fonts/Pretendard-subset.woff2') format('woff2');
  font-display: swap;
  unicode-range: U+AC00-D7A3; /* 한글만 */
}
```

---

### Example 8: 번들 분석 스크립트

```json
// package.json
{
  "scripts": {
    "build": "vite build",
    "build:analyze": "vite build && open dist/stats.html",
    "build:size": "npm run build && du -sh dist/* | sort -h",
    "prebuild": "npm run lint && npm run type-check"
  }
}
```

## 📁 Configuration Files to Update

```
/
├── vite.config.ts                (UPDATE - 최적화 설정)
├── package.json                  (UPDATE - 의존성 최적화)
├── .browserslistrc               (NEW - 타겟 브라우저 명시)
└── postcss.config.js             (UPDATE - CSS 최적화)
```

## ⚠️ Considerations

1. **브라우저 호환성**: Tree-shaking과 최적화가 호환성에 영향을 줄 수 있음
2. **라이브러리 교체 시**: 기능 동일성 확인 필요
3. **번들 크기 vs 개발 경험**: 너무 세밀한 최적화는 개발 속도 저하
4. **CDN 사용**: 큰 라이브러리는 CDN 고려 (캐싱 효과)
5. **정기적 검토**: 의존성 업데이트 시 번들 크기 확인

## 🔗 Related Issues

- #010 - Code Splitting (함께 진행 권장)
- #012 - 접근성 개선 (라이브러리 교체 시 고려)

## 📚 References

- [Vite Performance Optimization](https://vitejs.dev/guide/performance.html)
- [Tree-shaking Guide](https://webpack.js.org/guides/tree-shaking/)
- [Bundle Size Optimization](https://web.dev/reduce-javascript-payloads-with-code-splitting/)
- [Import Cost VS Code Extension](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost)

## ✅ Acceptance Criteria

- [ ] Bundle Analyzer 설정 및 분석 완료
- [ ] 모든 import가 Named import로 변경
- [ ] 불필요한 의존성 제거
- [ ] Recharts 또는 대체 라이브러리 최적화
- [ ] React Markdown 경량화 또는 대체
- [ ] Production build 최적화 설정 완료
- [ ] Gzip/Brotli 압축 적용
- [ ] 최종 번들 크기 30% 이상 감소
- [ ] 각 청크가 500KB 이하로 유지

## ⏱️ Estimated Time

**2일** (16시간)
- 번들 분석 및 현황 파악: 3시간
- Tree-shaking 최적화: 3시간
- 라이브러리 교체/최적화: 4시간
- Vite 설정 최적화: 2시간
- 이미지/폰트 최적화: 2시간
- 테스트 및 검증: 2시간

## 👤 Assignee

_To be assigned_

## 📅 Timeline

- **Start Date**: 2025-11-24
- **Due Date**: 2025-11-26
- **Completed Date**: -

## 💬 Notes

번들 크기 최적화는 사용자 경험에 직접적인 영향을 미치며, 특히 모바일이나 느린 네트워크 환경에서 중요합니다. #010 (Code Splitting)과 함께 진행하면 시너지 효과를 얻을 수 있습니다.

