/**
 * 파일명: handlers.ts
 * 
 * 파일 용도:
 * MSW 핸들러 정의
 * - 모든 API 엔드포인트에 대한 Mock 응답
 * - 개발 환경에서 백엔드 없이 프론트엔드 개발 가능
 */

import { http, HttpResponse } from 'msw'

// Mock 데이터 저장소 (메모리)
const mockUsers: Record<string, any> = {}
const mockProjects: Record<string, any> = {}
const mockWizardData: Record<string, any> = {}
const mockEvaluations: Record<string, any> = {}
const mockBusinessPlans: Record<string, any> = {}
const mockExports: Record<string, any> = {}

export const handlers = [
  // ========== 인증 API ==========
  
  // 회원가입
  http.post('/api/v1/auth/signup', async ({ request }) => {
    const body = await request.json() as any
    const userId = `user-${Date.now()}`
    
    const user = {
      id: userId,
      email: body.email,
      name: body.name,
      plan: body.plan,
      planEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      provider: body.socialProvider,
    }
    
    mockUsers[userId] = user
    
    return HttpResponse.json({
      success: true,
      data: {
        user,
        subscription: {
          planKey: body.plan,
          originalPrice: 50000,
          discountedPrice: body.promotionCode ? 40000 : 50000,
          discountRate: body.promotionCode ? 20 : 0,
        },
        tokens: {
          accessToken: `mock-access-token-${userId}`,
          refreshToken: `mock-refresh-token-${userId}`,
          expiresIn: 3600,
        },
      },
    })
  }),

  // 로그인
  http.post('/api/v1/auth/login', async ({ request }) => {
    const body = await request.json() as any
    const userId = Object.keys(mockUsers).find(
      id => mockUsers[id].email === body.email
    ) || `user-${Date.now()}`
    
    if (!mockUsers[userId]) {
      mockUsers[userId] = {
        id: userId,
        email: body.email,
        name: body.email.split('@')[0],
        plan: '기본',
        planEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      }
    }
    
    return HttpResponse.json({
      success: true,
      data: {
        user: mockUsers[userId],
        tokens: {
          accessToken: `mock-access-token-${userId}`,
          refreshToken: `mock-refresh-token-${userId}`,
          expiresIn: 3600,
        },
      },
    })
  }),

  // 소셜 로그인
  http.post('/api/v1/auth/social/:provider', async ({ params, request }) => {
    const { provider } = params as { provider: string }
    const body = await request.json() as any
    const userId = `user-${provider}-${Date.now()}`
    
    const mockEmails: Record<string, string> = {
      google: 'user@gmail.com',
      kakao: 'user@kakao.com',
      naver: 'user@naver.com',
    }
    
    const mockNames: Record<string, string> = {
      google: '구글 사용자',
      kakao: '카카오 사용자',
      naver: '네이버 사용자',
    }
    
    const user = {
      id: userId,
      email: mockEmails[provider] || 'user@example.com',
      name: mockNames[provider] || '사용자',
      plan: body.plan,
      planEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      provider,
    }
    
    mockUsers[userId] = user
    
    return HttpResponse.json({
      success: true,
      data: {
        user,
        tokens: {
          accessToken: `mock-access-token-${userId}`,
          refreshToken: `mock-refresh-token-${userId}`,
          expiresIn: 3600,
        },
        isNewUser: true,
      },
    })
  }),

  // 토큰 갱신
  http.post('/api/v1/auth/refresh', async ({ request }) => {
    const body = await request.json() as any
    const userId = body.refreshToken?.replace('mock-refresh-token-', '') || 'user-1'
    
    return HttpResponse.json({
      success: true,
      data: {
        accessToken: `mock-access-token-${userId}`,
        refreshToken: `mock-refresh-token-${userId}`,
        expiresIn: 3600,
      },
    })
  }),

  // 로그아웃
  http.post('/api/v1/auth/logout', () => {
    return HttpResponse.json({ success: true, data: null })
  }),

  // 프로필 조회
  http.get('/api/v1/auth/profile', () => {
    const userId = 'user-1'
    return HttpResponse.json({
      success: true,
      data: mockUsers[userId] || {
        id: userId,
        email: 'user@example.com',
        name: '사용자',
        plan: '기본',
      },
    })
  }),

  // ========== 프로젝트 API ==========
  
  // 프로젝트 목록
  http.get('/api/v1/projects', () => {
    return HttpResponse.json({
      success: true,
      data: Object.values(mockProjects),
    })
  }),

  // 프로젝트 조회
  http.get('/api/v1/projects/:id', ({ params }) => {
    const { id } = params
    const project = mockProjects[id as string]
    
    if (!project) {
      return HttpResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: '프로젝트를 찾을 수 없습니다' } },
        { status: 404 }
      )
    }
    
    return HttpResponse.json({ success: true, data: project })
  }),

  // 프로젝트 생성
  http.post('/api/v1/projects', async ({ request }) => {
    const body = await request.json() as any
    const projectId = `project-${Date.now()}`
    
    const project = {
      id: projectId,
      name: body.name,
      templateId: body.templateId,
      templateName: body.templateId === 'pre-startup' ? '예비창업패키지' : '초기창업패키지',
      supportProgram: body.supportProgram,
      description: body.description,
      status: 'draft' as const,
      progress: {
        currentStep: 1,
        totalSteps: 7,
        completedSteps: [],
        percentComplete: 0,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    mockProjects[projectId] = project
    
    return HttpResponse.json({ success: true, data: project })
  }),

  // 프로젝트 수정
  http.put('/api/v1/projects/:id', async ({ params, request }) => {
    const { id } = params
    const body = await request.json() as any
    
    if (!mockProjects[id as string]) {
      return HttpResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: '프로젝트를 찾을 수 없습니다' } },
        { status: 404 }
      )
    }
    
    mockProjects[id as string] = {
      ...mockProjects[id as string],
      ...body,
      updatedAt: new Date().toISOString(),
    }
    
    return HttpResponse.json({ success: true, data: mockProjects[id as string] })
  }),

  // 프로젝트 삭제
  http.delete('/api/v1/projects/:id', ({ params }) => {
    const { id } = params
    delete mockProjects[id as string]
    return HttpResponse.json({ success: true, data: null })
  }),

  // ========== Wizard API ==========
  
  // Wizard 데이터 조회
  http.get('/api/v1/projects/:id/wizard', ({ params }) => {
    const { id } = params
    const wizard = mockWizardData[id as string] || {
      projectId: id,
      templateId: 'pre-startup',
      currentStep: 1,
      steps: [],
      lastSavedAt: new Date().toISOString(),
    }
    
    return HttpResponse.json({ success: true, data: wizard })
  }),

  // Wizard 데이터 저장
  http.put('/api/v1/projects/:id/wizard', async ({ params, request }) => {
    const { id } = params
    const body = await request.json() as any
    
    if (!mockWizardData[id as string]) {
      mockWizardData[id as string] = {
        projectId: id,
        templateId: 'pre-startup',
        currentStep: body.currentStep || 1,
        steps: [],
        lastSavedAt: new Date().toISOString(),
      }
    }
    
    const wizard = mockWizardData[id as string]
    wizard.currentStep = body.currentStep || wizard.currentStep
    wizard.lastSavedAt = new Date().toISOString()
    
    // 단계 데이터 업데이트
    const stepIndex = wizard.steps.findIndex((s: any) => s.stepId === body.currentStep)
    if (stepIndex >= 0) {
      wizard.steps[stepIndex].data = body.stepData
      wizard.steps[stepIndex].status = body.isStepComplete ? 'completed' : 'in_progress'
    } else {
      wizard.steps.push({
        stepId: body.currentStep,
        title: `Step ${body.currentStep}`,
        status: body.isStepComplete ? 'completed' : 'in_progress',
        data: body.stepData,
      })
    }
    
    return HttpResponse.json({
      success: true,
      data: {
        lastSavedAt: wizard.lastSavedAt,
        progress: {
          currentStep: wizard.currentStep,
          totalSteps: 7,
          completedSteps: wizard.steps.filter((s: any) => s.status === 'completed').map((s: any) => s.stepId),
          percentComplete: Math.round((wizard.steps.filter((s: any) => s.status === 'completed').length / 7) * 100),
        },
      },
    })
  }),

  // 예산 검증
  http.post('/api/v1/projects/:id/budget/validate', async ({ params, request }) => {
    const body = await request.json() as any
    
    return HttpResponse.json({
      success: true,
      data: {
        isValid: true,
        summary: {
          totalBudget: body.totalBudget || 0,
          phase1Total: body.phase1Total || 0,
          phase2Total: body.phase2Total || 0,
        },
        validations: [],
        warnings: [],
      },
    })
  }),

  // ========== 평가 API ==========
  
  // 평가 생성
  http.post('/api/v1/evaluations', async ({ request }) => {
    const body = await request.json() as any
    const evaluationId = `eval-${Date.now()}`
    
    mockEvaluations[evaluationId] = {
      evaluationId,
      status: 'pending',
      progress: 0,
      currentStage: '초기화',
      stages: [
        { id: 'stage1', name: '사업 아이디어 분석', status: 'pending', score: null },
        { id: 'stage2', name: '시장성 분석', status: 'pending', score: null },
        { id: 'stage3', name: '기술성 분석', status: 'pending', score: null },
        { id: 'stage4', name: '재무 분석', status: 'pending', score: null },
        { id: 'stage5', name: '팀 역량 분석', status: 'pending', score: null },
      ],
    }
    
    // 비동기로 상태 업데이트 시뮬레이션
    setTimeout(() => {
      if (mockEvaluations[evaluationId]) {
        mockEvaluations[evaluationId].status = 'processing'
        mockEvaluations[evaluationId].progress = 20
      }
    }, 1000)
    
    return HttpResponse.json({
      success: true,
      data: {
        evaluationId,
        status: 'pending',
      },
    })
  }),

  // 평가 상태 조회
  http.get('/api/v1/evaluations/:id/status', ({ params }) => {
    const { id } = params
    const evaluation = mockEvaluations[id as string]
    
    if (!evaluation) {
      return HttpResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: '평가를 찾을 수 없습니다' } },
        { status: 404 }
      )
    }
    
    // 진행 상태 시뮬레이션
    if (evaluation.status === 'processing' && evaluation.progress < 100) {
      evaluation.progress = Math.min(evaluation.progress + 10, 100)
      if (evaluation.progress === 100) {
        evaluation.status = 'completed'
      }
    }
    
    return HttpResponse.json({ success: true, data: evaluation })
  }),

  // 평가 결과 조회
  http.get('/api/v1/evaluations/:id/result', ({ params }) => {
    const { id } = params
    const evaluation = mockEvaluations[id as string]
    
    if (!evaluation || evaluation.status !== 'completed') {
      return HttpResponse.json(
        { success: false, error: { code: 'NOT_READY', message: '평가가 아직 완료되지 않았습니다' } },
        { status: 400 }
      )
    }
    
    return HttpResponse.json({
      success: true,
      data: {
        evaluationId: id,
        summary: {
          totalScore: 75,
          grade: 'B+',
          passRate: 65,
          passRateMessage: '합격 가능성이 높습니다',
        },
        scores: {
          idea: { score: 80, label: '사업 아이디어', letter: 'A', color: 'emerald', maxScore: 100 },
          market: { score: 70, label: '시장성', letter: 'B', color: 'blue', maxScore: 100 },
          technology: { score: 75, label: '기술성', letter: 'B+', color: 'cyan', maxScore: 100 },
          finance: { score: 70, label: '재무', letter: 'B', color: 'amber', maxScore: 100 },
          team: { score: 80, label: '팀 역량', letter: 'A', color: 'emerald', maxScore: 100 },
        },
        strengths: [
          { area: 'idea', title: '명확한 문제 정의', description: '타겟 고객의 문제를 명확히 정의했습니다', isBlurred: false },
        ],
        weaknesses: [
          { area: 'market', title: '경쟁 분석 부족', description: '경쟁사 분석을 더 보강하면 좋겠습니다', isBlurred: false },
        ],
        recommendations: [
          { priority: 1, area: 'market', title: '시장 조사 강화', description: '더 깊이 있는 시장 조사를 권장합니다', isBlurred: false },
        ],
        accessLevel: 'demo',
      },
    })
  }),

  // ========== 사업계획서 API ==========
  
  // 사업계획서 생성
  http.post('/api/v1/projects/:id/business-plan/generate', async ({ params, request }) => {
    const { id } = params
    const generationId = `gen-${Date.now()}`
    
    return HttpResponse.json({
      success: true,
      data: {
        generationId,
        status: 'generating',
      },
    })
  }),

  // 사업계획서 조회
  http.get('/api/v1/projects/:id/business-plan', ({ params }) => {
    const { id } = params
    const businessPlan = mockBusinessPlans[id as string] || {
      id: `bp-${id}`,
      projectId: id,
      templateId: 'pre-startup',
      version: 1,
      status: 'draft',
      sections: [],
      metadata: {
        totalWordCount: 0,
        estimatedPages: 0,
        generatedAt: new Date().toISOString(),
        aiModel: 'gemini-2.0-flash',
      },
      financialSummary: {
        totalBudget: 0,
        phase1: 0,
        phase2: 0,
        year1Revenue: 0,
        breakEvenMonth: 0,
      },
    }
    
    return HttpResponse.json({ success: true, data: businessPlan })
  }),

  // 섹션 재생성
  http.post('/api/v1/projects/:id/business-plan/sections/:sectionId/regenerate', async ({ params, request }) => {
    const { sectionId } = params
    const body = await request.json() as any
    
    return HttpResponse.json({
      success: true,
      data: {
        id: sectionId,
        title: `Section ${sectionId}`,
        order: 1,
        content: body.instruction ? `재생성된 내용: ${body.instruction}` : '재생성된 섹션 내용',
        wordCount: 100,
        lastEditedAt: new Date().toISOString(),
      },
    })
  }),

  // 섹션 수정
  http.put('/api/v1/projects/:id/business-plan/sections/:sectionId', async ({ params, request }) => {
    const { sectionId } = params
    const body = await request.json() as any
    
    return HttpResponse.json({
      success: true,
      data: {
        id: sectionId,
        title: `Section ${sectionId}`,
        order: 1,
        content: body.content,
        wordCount: body.content.length,
        lastEditedAt: new Date().toISOString(),
      },
    })
  }),

  // ========== 내보내기 API ==========
  
  // 내보내기 생성
  http.post('/api/v1/projects/:id/export', async ({ params, request }) => {
    const { id } = params
    const exportId = `export-${Date.now()}`
    const body = await request.json() as any
    
    mockExports[exportId] = {
      exportId,
      status: 'pending',
      format: body.format,
      fileName: undefined,
      fileSize: undefined,
      downloadUrl: undefined,
      expiresAt: undefined,
      completedAt: undefined,
      errorMessage: undefined,
    }
    
    // 비동기로 처리 시뮬레이션
    setTimeout(() => {
      if (mockExports[exportId]) {
        mockExports[exportId].status = 'processing'
      }
    }, 500)
    
    setTimeout(() => {
      if (mockExports[exportId]) {
        mockExports[exportId].status = 'completed'
        mockExports[exportId].fileName = `business-plan.${body.format}`
        mockExports[exportId].fileSize = 1024 * 100 // 100KB
        mockExports[exportId].downloadUrl = `/api/v1/exports/${exportId}/download`
        mockExports[exportId].completedAt = new Date().toISOString()
        mockExports[exportId].expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }
    }, 3000)
    
    return HttpResponse.json({
      success: true,
      data: {
        exportId,
        status: 'pending',
      },
    })
  }),

  // 내보내기 상태 조회
  http.get('/api/v1/exports/:id/status', ({ params }) => {
    const { id } = params
    const exportData = mockExports[id as string]
    
    if (!exportData) {
      return HttpResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: '내보내기를 찾을 수 없습니다' } },
        { status: 404 }
      )
    }
    
    return HttpResponse.json({ success: true, data: exportData })
  }),

  // 파일 다운로드
  http.get('/api/v1/exports/:id/download', ({ params }) => {
    const { id } = params
    const exportData = mockExports[id as string]
    
    if (!exportData || exportData.status !== 'completed') {
      return HttpResponse.json(
        { success: false, error: { code: 'NOT_READY', message: '파일이 아직 준비되지 않았습니다' } },
        { status: 400 }
      )
    }
    
    // Mock 파일 생성
    const content = `Mock ${exportData.format.toUpperCase()} file content`
    const blob = new Blob([content], { type: 'application/octet-stream' })
    
    return new Response(blob, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${exportData.fileName}"`,
      },
    })
  }),
]

