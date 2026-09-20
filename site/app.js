(() => {
  const ideas = window.GAU_IDEAS || [];
  const grid = document.getElementById('ideasGrid');
  const search = document.getElementById('ideaSearch');
  const filters = document.getElementById('ideaFilters');
  const count = document.getElementById('ideaCount');
  let activeCategory = 'Todas';

  const escapeHtml = (value='') => value.replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const categories = ['Todas', ...new Set(ideas.map(i => i.category))];

  function renderFilters(){
    filters.innerHTML = categories.map(cat => {
      const cnt = cat === 'Todas' ? ideas.length : ideas.filter(i => i.category === cat).length;
      return `<button class="filter-btn ${cat === activeCategory ? 'active' : ''}" data-cat="${escapeHtml(cat)}">${escapeHtml(cat)} <small style="opacity:0.75; font-size:9px;">(${cnt})</small></button>`;
    }).join('');
    filters.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => {
      activeCategory = btn.dataset.cat;
      renderFilters(); renderIdeas();
    }));
  }
  function getSkillSlug(id, name) {
    const num = String(id).padStart(2, '0');
    const clean = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    return `gau-${num}-${clean}`;
  }

  // Detailed metadata generator for the 69 ideas
  function getIdeaDetails(item) {
    const slug = getSkillSlug(item.id, item.name);
    const categoryMechanisms = {
      'Roteamento': 'O mecanismo monitora incerteza, complexidade de requisitos e taxa de vitória histórica para selecionar o modelo e subagente ideais pelo ranking Elo. Caso ocorra falha ou timeout, ativa o grafo de fallback automático sem loops de repetição.',
      'Councils': 'Convoca de 6 a 12 cérebros especializados com perspectivas divergentes e revisão cega. O sintetizador dialético unifica os pontos fortes sem viés de concordância (sycophancy) e submete a decisão ao Tribunal de Evidências.',
      'Raciocínio': 'Desacopla o problema em linhas independentes de raciocínio, formulando hipóteses concorrentes testadas por experimentos discriminatórios com decaimento temporal para as sem evidência física.',
      'Memória': 'Grava checkpoints e fatos canônicos com hashes SHA-256 no banco local SQLite em modo WAL. Implementa auto-pruning para eliminar ruídos de log e preservar contratos de interface e caminhos rejeitados.',
      'Execução': 'Paraleliza a codificação em worktrees isoladas do Git via Coding Swarm. Cada coder opera com interfaces congeladas, e apenas implementações aprovadas na suíte de testes são integradas à árvore principal.',
      'Governança': 'Dimensiona compute proporcionalmente ao risco da tarefa (Risk-Based Compute). Aplica tetos orçamentários rígidos e interrompe o consumo assim que a prova física de conclusão for atingida.'
    };

    const categoryRules = {
      'Roteamento': 'Regra Inviolável: O agente que falhou nunca decide sozinho se merece mais uma tentativa. O roteamento exige evidência comparável de benchmark.',
      'Councils': 'Regra Inviolável: Maioria de votos nunca apaga uma falha reproduzível em teste real. A evidência física supera qualquer consenso verbal.',
      'Raciocínio': 'Regra Inviolável: Proibido assumir hipóteses sem teste discriminatório. Toda premissa deve ser rotulada como comprovada ou especulativa.',
      'Memória': 'Regra Inviolável: Memória não altera a realidade física do disco. Toda suposição vinda do histórico deve ser revalidada contra o workspace atual.',
      'Execução': 'Regra Inviolável: Nenhum código é integrado na branch principal sem execução física e código de saída 0 no terminal.',
      'Governança': 'Regra Inviolável: Compute é interrompido imediatamente após satisfação do gate formal. Overengineering e desperdício de tokens são censurados.'
    };

    return {
      slug,
      mechanism: categoryMechanisms[item.category] || 'Mecanismo cognitivo autônomo operando sob contratos formais, telemetria em tempo real e verificação física no Antigravity.',
      rule: categoryRules[item.category] || 'Regra Inviolável: Toda conclusão técnica exige teste executado via terminal com código de saída 0 e integridade auditada.'
    };
  }

  // Modal elements
  const ideaModal = document.getElementById('ideaModal');
  const ideaModalBackdrop = document.getElementById('ideaModalBackdrop');
  const modalIdeaId = document.getElementById('modalIdeaId');
  const modalIdeaCat = document.getElementById('modalIdeaCat');
  const modalIdeaTitle = document.getElementById('modalIdeaTitle');
  const modalIdeaSkill = document.getElementById('modalIdeaSkill');
  const modalIdeaSummary = document.getElementById('modalIdeaSummary');
  const modalIdeaMechanism = document.getElementById('modalIdeaMechanism');
  const modalIdeaRule = document.getElementById('modalIdeaRule');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalFooterCloseBtn = document.getElementById('modalFooterCloseBtn');
  const modalCopySkillBtn = document.getElementById('modalCopySkillBtn');

  function openIdeaModal(item) {
    if (!ideaModal || !ideaModalBackdrop) return;
    const details = getIdeaDetails(item);
    if (modalIdeaId) modalIdeaId.textContent = `#${String(item.id).padStart(2, '0')}`;
    if (modalIdeaCat) modalIdeaCat.textContent = item.category;
    if (modalIdeaTitle) modalIdeaTitle.textContent = item.name;
    if (modalIdeaSkill) modalIdeaSkill.textContent = details.slug;
    if (modalIdeaSummary) modalIdeaSummary.textContent = item.summary;
    if (modalIdeaMechanism) modalIdeaMechanism.textContent = details.mechanism;
    if (modalIdeaRule) modalIdeaRule.textContent = details.rule;

    ideaModalBackdrop.style.display = 'block';
    ideaModal.style.display = 'block';
    setTimeout(() => {
      ideaModalBackdrop.classList.add('open');
      ideaModal.classList.add('open');
    }, 10);
    document.body.style.overflow = 'hidden';
  }

  function closeIdeaModal() {
    if (!ideaModal || !ideaModalBackdrop) return;
    ideaModalBackdrop.classList.remove('open');
    ideaModal.classList.remove('open');
    setTimeout(() => {
      ideaModalBackdrop.style.display = 'none';
      ideaModal.style.display = 'none';
      document.body.style.overflow = '';
    }, 280);
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeIdeaModal);
  if (modalFooterCloseBtn) modalFooterCloseBtn.addEventListener('click', closeIdeaModal);
  if (ideaModalBackdrop) ideaModalBackdrop.addEventListener('click', closeIdeaModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && ideaModal && ideaModal.classList.contains('open')) {
      closeIdeaModal();
    }
  });

  if (modalCopySkillBtn) {
    modalCopySkillBtn.addEventListener('click', async () => {
      const skillText = modalIdeaSkill ? modalIdeaSkill.textContent : '';
      if (!skillText) return;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(skillText);
        } else {
          const ta = document.createElement('textarea');
          ta.value = skillText;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        showToast(`Skill copiada: ${skillText}`);
        const old = modalCopySkillBtn.textContent;
        modalCopySkillBtn.textContent = 'Copiado! ✓';
        setTimeout(() => { modalCopySkillBtn.textContent = old; }, 1600);
      } catch {
        showToast(`Selecione: ${skillText}`);
      }
    });
  }

  function renderIdeas(){
    const q = (search.value || '').toLocaleLowerCase('pt-BR').trim();
    const filtered = ideas.filter(i => (activeCategory === 'Todas' || i.category === activeCategory) && (`${i.id} ${i.name} ${i.summary} ${i.category}`.toLocaleLowerCase('pt-BR').includes(q)));
    grid.innerHTML = filtered.map(i => {
      const slug = getSkillSlug(i.id, i.name);
      return `<article class="idea-card" data-ideaid="${i.id}" title="Clique para abrir detalhes da ideia ${escapeHtml(i.name)}">
        <div class="idea-top"><span class="idea-id">#${String(i.id).padStart(2,'0')}</span><span class="idea-cat">${escapeHtml(i.category)}</span></div>
        <h3>${escapeHtml(i.name)}</h3>
        <p>${escapeHtml(i.summary)}</p>
        <span class="idea-skill-tag">⚙ ${escapeHtml(slug)}</span>
        <span class="idea-inspect-hint">🔍 Inspecionar mecanismo →</span>
      </article>`;
    }).join('');
    count.textContent = filtered.length;

    grid.querySelectorAll('.idea-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = parseInt(card.dataset.ideaid, 10);
        const item = ideas.find(x => x.id === id);
        if (item) openIdeaModal(item);
      });
    });

    if (typeof applyTiltToElements === 'function') {
      applyTiltToElements(grid.querySelectorAll('.idea-card'));
    }
  }
  search.addEventListener('input', renderIdeas);
  renderFilters(); renderIdeas();

  const observer = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting){e.target.classList.add('visible'); observer.unobserve(e.target);} }), {threshold:.12});
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  document.querySelectorAll('.copy-btn').forEach(btn => btn.addEventListener('click', async () => {
    const old = btn.textContent;
    try { await navigator.clipboard.writeText(btn.dataset.copy); btn.textContent = 'Copiado ✓'; }
    catch { btn.textContent = 'Selecione o comando'; }
    setTimeout(() => btn.textContent = old, 1600);
  }));

  const runBtn = document.getElementById('runMission');
  const resetBtn = document.getElementById('resetMission');
  const missionInput = document.getElementById('missionInput');
  const timeline = document.getElementById('missionTimeline');
  const missionStatus = document.getElementById('missionStatus');
  const statCompute = document.getElementById('statCompute');
  const statBrains = document.getElementById('statBrains');
  const statConfidence = document.getElementById('statConfidence');
  const statEvidence = document.getElementById('statEvidence');
  const memoryState = document.getElementById('memoryState');
  const memFacts = document.getElementById('memFacts');
  const memHyp = document.getElementById('memHyp');
  const memReject = document.getElementById('memReject');
  const memCheck = document.getElementById('memCheck');
  let missionTimer = null;

  const scenarios = {
    'auth-bug': {
      title: 'Corrigir um bug intermitente de autenticação e race condition em tokens JWT sem introduzir regressões.',
      initialStats: {compute:'SMART', brains:1, conf:34, e:'E0', facts:0, hyp:0, reject:0, check:0},
      steps: [
        {id:'30', name:'Requirement Council', detail:'Baseline fixado. 4 critérios de prova definidos.', brains:3, conf:46, e:'E0', facts:4, hyp:0, reject:0, check:1, compute:'SMART'},
        {id:'01', name:'Adaptive Model Router 3.0', detail:'Incerteza 0.65 detectada. Escalado para equipe profunda.', brains:6, conf:52, e:'E1', facts:5, hyp:2, reject:0, check:1, compute:'DEEP'},
        {id:'06', name:'Hypothesis Laboratory', detail:'6 hipóteses concorrentes. 3 eliminadas por testes discriminatórios.', brains:6, conf:68, e:'E2', facts:9, hyp:3, reject:3, check:2, compute:'DEEP'},
        {id:'15', name:'Project Brain + Checkpoint', detail:'Causa raiz e caminhos rejeitados gravados no SQLite.', brains:4, conf:74, e:'E2', facts:12, hyp:3, reject:3, check:3, compute:'SMART'},
        {id:'08', name:'Coding Swarm', detail:'Correção atômica em worktree com mutex distribuído no refresh.', brains:6, conf:82, e:'E3', facts:15, hyp:1, reject:5, check:4, compute:'DEEP'},
        {id:'22', name:'Evidence Court', detail:'Evidência validada: 2.000 requisições simultâneas sem falhas.', brains:6, conf:89, e:'E4', facts:18, hyp:1, reject:5, check:5, compute:'COUNCIL'},
        {id:'53', name:'Independent Verification Tree', detail:'Verificação independente: segurança, regressão e concorrência.', brains:6, conf:95, e:'E5', facts:21, hyp:0, reject:6, check:6, compute:'COUNCIL'},
        {id:'36', name:'Final Completion Tribunal', detail:'Completion Proof fechado. Nenhuma obrigação crítica pendente.', brains:3, conf:99, e:'E5', facts:22, hyp:0, reject:6, check:7, compute:'SMART'}
      ]
    },
    'arch-refactor': {
      title: 'Refatorar a camada de persistência para SQLite concorrente com modo WAL, índices e migrações idempotentes.',
      initialStats: {compute:'COUNCIL', brains:1, conf:28, e:'E0', facts:0, hyp:0, reject:0, check:0},
      steps: [
        {id:'07', name:'Architecture Council', detail:'6 arquitetos avaliam isolamento de transações e concorrência.', brains:7, conf:48, e:'E0', facts:6, hyp:0, reject:0, check:1, compute:'COUNCIL'},
        {id:'28', name:'Database Council', detail:'Schema e migrações idempotentes validados em sandbox descartável.', brains:5, conf:64, e:'E1', facts:10, hyp:1, reject:1, check:2, compute:'SMART'},
        {id:'37', name:'Rollback Brain', detail:'Plano de reversão atômico documentado e testado com sucesso.', brains:4, conf:75, e:'E2', facts:14, hyp:1, reject:1, check:3, compute:'SMART'},
        {id:'26', name:'Performance Council', detail:'Benchmark comprovado: latência de escrita reduzida em 64% com WAL.', brains:6, conf:86, e:'E3', facts:19, hyp:0, reject:2, check:4, compute:'DEEP'},
        {id:'35', name:'Regression Hunters', detail:'16 testes de invariantes de dados legados executados sem quebras.', brains:4, conf:94, e:'E4', facts:24, hyp:0, reject:2, check:5, compute:'SMART'},
        {id:'36', name:'Final Completion Tribunal', detail:'Migração aprovada. Contratos e dados legados 100% preservados.', brains:3, conf:98, e:'E4', facts:25, hyp:0, reject:2, check:6, compute:'SMART'}
      ]
    },
    'swarm-feature': {
      title: 'Implementar barramento assíncrono de eventos com 3 coders paralelos e torneio de soluções.',
      initialStats: {compute:'DEEP', brains:1, conf:30, e:'E0', facts:0, hyp:0, reject:0, check:0},
      steps: [
        {id:'48', name:'Knowledge Decomposition', detail:'Separação em 3 contratos independentes: Publisher, Queue e Worker.', brains:4, conf:44, e:'E0', facts:5, hyp:0, reject:0, check:1, compute:'SMART'},
        {id:'34', name:'Parallel Worktree Swarm', detail:'3 agentes codificando em worktrees isoladas simultaneamente.', brains:7, conf:62, e:'E1', facts:11, hyp:2, reject:0, check:2, compute:'DEEP'},
        {id:'03', name:'Solution Tournament', detail:'Implementações comparadas sob estresse de 50.000 mensagens/segundo.', brains:6, conf:76, e:'E2', facts:16, hyp:1, reject:2, check:3, compute:'DEEP'},
        {id:'29', name:'Integration Council', detail:'Testes de fronteira, retries exponenciais e backpressure aprovados.', brains:5, conf:88, e:'E3', facts:20, hyp:0, reject:2, check:4, compute:'COUNCIL'},
        {id:'53', name:'Independent Verification Tree', detail:'Verificação independente sem contaminação dos coders originais.', brains:6, conf:96, e:'E4', facts:26, hyp:0, reject:2, check:5, compute:'COUNCIL'},
        {id:'36', name:'Final Completion Tribunal', detail:'Integração concluída com cobertura total de requisitos.', brains:3, conf:99, e:'E4', facts:28, hyp:0, reject:2, check:6, compute:'SMART'}
      ]
    },
    'security-audit': {
      title: 'Auditoria adversarial de ponta a ponta com geração autônoma de vetores de ataque e contraexemplos.',
      initialStats: {compute:'COUNCIL', brains:1, conf:25, e:'E0', facts:0, hyp:0, reject:0, check:0},
      steps: [
        {id:'25', name:'Security Council', detail:'Mapeamento da superfície de ataque, segredos e headers HTTP.', brains:6, conf:45, e:'E0', facts:7, hyp:0, reject:0, check:1, compute:'COUNCIL'},
        {id:'05', name:'Adversarial Council', detail:'6 agentes adversariais tentam bypass de autenticação e injeções.', brains:8, conf:63, e:'E1', facts:14, hyp:3, reject:1, check:2, compute:'DEEP'},
        {id:'66', name:'Self-Generated Adversarial Cases', detail:'Geração de 42 casos hostis derivados dos critérios de aceitação.', brains:6, conf:78, e:'E2', facts:20, hyp:1, reject:3, check:3, compute:'DEEP'},
        {id:'67', name:'Counterexample Generator', detail:'Nenhum contraexemplo conseguiu quebrar os invariantes do sistema.', brains:5, conf:90, e:'E3', facts:25, hyp:0, reject:4, check:4, compute:'COUNCIL'},
        {id:'68', name:'Proof Obligation System', detail:'Todas as 8 obrigações de segurança resolvidas com logs atuais.', brains:4, conf:97, e:'E4', facts:29, hyp:0, reject:4, check:5, compute:'SMART'},
        {id:'36', name:'Final Completion Tribunal', detail:'Certificação de segurança emitida com aprovação unânime.', brains:3, conf:100, e:'E4', facts:30, hyp:0, reject:4, check:6, compute:'SMART'}
      ]
    }
  };

  let currentScenarioKey = 'auth-bug';

  // Telemetry & Cockpit elements
  const telemetryStatus = document.getElementById('telemetryStatus');
  const telemetryPing = document.getElementById('telemetryPing');
  const telemetryAgents = document.getElementById('telemetryAgents');
  const ladderLevelLabel = document.getElementById('ladderLevelLabel');
  const proofLadder = document.getElementById('proofLadder');
  const matrixStatusLabel = document.getElementById('matrixStatusLabel');
  const agentMatrixGrid = document.getElementById('agentMatrixGrid');
  const dagProgressFill = document.getElementById('dagProgressFill');
  const dagProgressText = document.getElementById('dagProgressText');

  const ladderLevels = ['E0', 'E1', 'E2', 'E3', 'E4', 'E5'];
  const ladderLabels = {
    'E0': 'E0: Baseline Inicial',
    'E1': 'E1: Execução Isolada',
    'E2': 'E2: Registro de Logs',
    'E3': 'E3: Reprodutibilidade',
    'E4': 'E4: Contra-teste Hostil',
    'E5': 'E5: Verificado & Aprovado'
  };

  function updateProofLadder(currentLvl) {
    if (!proofLadder) return;
    const currentIdx = ladderLevels.indexOf(currentLvl);
    const steps = proofLadder.querySelectorAll('.ladder-step');
    steps.forEach((step, idx) => {
      step.classList.remove('active', 'complete');
      if (idx < currentIdx) {
        step.classList.add('complete');
      } else if (idx === currentIdx) {
        step.classList.add('active');
      }
    });
    if (ladderLevelLabel && ladderLabels[currentLvl]) {
      ladderLevelLabel.textContent = ladderLabels[currentLvl];
    }
  }

  function updateAgentMatrix(stepName, isFinished = false) {
    if (!agentMatrixGrid) return;
    const chips = agentMatrixGrid.querySelectorAll('.matrix-chip');
    
    if (isFinished) {
      chips.forEach(chip => {
        if (chip.classList.contains('active')) {
          chip.classList.remove('active');
          chip.classList.add('verified');
        }
      });
      if (matrixStatusLabel) matrixStatusLabel.textContent = '8 agentes sincronizados';
      return;
    }

    const stepLower = (stepName || '').toLowerCase();
    const activeMap = {
      'requirement': ['gau-requirements', 'gau-orchestrator'],
      'router': ['gau-orchestrator'],
      'hypothesis': ['gau-investigator'],
      'laboratory': ['gau-investigator'],
      'project brain': ['gau-orchestrator'],
      'checkpoint': ['gau-orchestrator'],
      'coding': ['gau-implementer', 'gau-architect'],
      'worktree': ['gau-implementer'],
      'tournament': ['gau-implementer', 'gau-verifier'],
      'evidence': ['gau-verifier'],
      'verification': ['gau-verifier'],
      'regression': ['gau-verifier'],
      'security': ['gau-security'],
      'adversarial': ['gau-security'],
      'counterexample': ['gau-security'],
      'architecture': ['gau-architect'],
      'database': ['gau-architect'],
      'performance': ['gau-architect'],
      'tribunal': ['gau-judge', 'gau-verifier']
    };

    for (const [key, agents] of Object.entries(activeMap)) {
      if (stepLower.includes(key)) {
        agents.forEach(ag => {
          const chip = agentMatrixGrid.querySelector(`[data-agent="${ag}"]`);
          if (chip) {
            chip.classList.add('active');
          }
        });
      }
    }

    const activeCount = agentMatrixGrid.querySelectorAll('.matrix-chip.active, .matrix-chip.verified').length;
    if (matrixStatusLabel) {
      matrixStatusLabel.textContent = `${activeCount} agente(s) mobilizado(s)`;
    }
  }

  function setStats(s){
    statCompute.textContent=s.compute; statBrains.textContent=s.brains; statConfidence.textContent=s.conf+'%'; statEvidence.textContent=s.e;
    memFacts.textContent=s.facts; memHyp.textContent=s.hyp; memReject.textContent=s.reject; memCheck.textContent=s.check; memoryState.textContent='synced';
    if (telemetryAgents) telemetryAgents.textContent = `${s.brains}/16`;
    if (telemetryPing) telemetryPing.textContent = `${Math.floor(Math.random() * 6) + 11}ms`;
    updateProofLadder(s.e);
  }

  function resetMission(){
    clearInterval(missionTimer); missionTimer=null; runBtn.disabled=false; runBtn.textContent='Rodar missão';
    missionStatus.textContent='waiting'; timeline.innerHTML='<div class="timeline-empty">Pressione <b>Rodar missão</b> para iniciar o fluxo.</div>';
    const sc = scenarios[currentScenarioKey];
    setStats(sc.initialStats); memoryState.textContent='idle';
    if (telemetryStatus) telemetryStatus.innerHTML = '<i></i> SYS_IDLE';
    if (dagProgressFill) dagProgressFill.style.width = '0%';
    if (dagProgressText) dagProgressText.textContent = '0%';
    if (agentMatrixGrid) {
      agentMatrixGrid.querySelectorAll('.matrix-chip').forEach(c => c.classList.remove('active', 'verified'));
    }
    if (matrixStatusLabel) matrixStatusLabel.textContent = 'Pronto para iniciar';
  }

  function addStep(s,index,totalSteps = 6){
    if(index===0) {
      timeline.innerHTML='';
      if (telemetryStatus) telemetryStatus.innerHTML = '<i></i> SWARM_ACTIVE';
    }
    const el=document.createElement('div'); el.className='timeline-step';
    el.innerHTML=`<div class="timeline-badge">${s.id}</div><div class="timeline-body"><b>${escapeHtml(s.name)}</b><span>${escapeHtml(s.detail)}</span></div><div class="timeline-state">PASS</div>`;
    timeline.appendChild(el); timeline.scrollTop=timeline.scrollHeight; setStats(s);
    updateAgentMatrix(s.name);
    if (dagProgressFill && totalSteps > 0) {
      const pct = Math.round(((index + 1) / totalSteps) * 100);
      dagProgressFill.style.width = pct + '%';
      if (dagProgressText) dagProgressText.textContent = pct + '%';
    }
  }

  runBtn.addEventListener('click', () => {
    if(missionTimer) return;
    resetMission(); runBtn.disabled=true; runBtn.textContent='Executando...'; missionStatus.textContent='running'; memoryState.textContent='opening';
    if (telemetryStatus) telemetryStatus.innerHTML = '<i></i> SWARM_ACTIVE';
    const sc = scenarios[currentScenarioKey];
    const steps = sc.steps;
    let i=0; addStep(steps[i],i,steps.length); i++;
    missionTimer=setInterval(()=>{
      if(i<steps.length){
        addStep(steps[i],i,steps.length);
        i++;
      } else {
        clearInterval(missionTimer); missionTimer=null; missionStatus.textContent='COMPLETE'; runBtn.disabled=false; runBtn.textContent='Rodar novamente';
        if (telemetryStatus) telemetryStatus.innerHTML = '<i></i> SYS_PASS';
        if (dagProgressFill) dagProgressFill.style.width = '100%';
        if (dagProgressText) dagProgressText.textContent = '100%';
        updateProofLadder('E5');
        updateAgentMatrix('', true);
        showToast('Missão concluída com verificação independente formal (E5 PASS)!');
      }
    }, 650);
  });
  resetBtn.addEventListener('click', resetMission);

  const scenarioPills = document.querySelectorAll('.scenario-pill');
  scenarioPills.forEach(pill => {
    pill.addEventListener('click', () => {
      scenarioPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentScenarioKey = pill.dataset.scenario;
      const sc = scenarios[currentScenarioKey];
      if (missionInput) missionInput.value = sc.title;
      resetMission();
    });
  });

  // Sanitizar inputs para tabelas Markdown
  const sanitizeMd = (val = '') => String(val).replace(/\|/g, '\\|').replace(/[\r\n]+/g, ' ').trim();

  // Exportar Dossiê de Auditoria
  const exportBtn = document.getElementById('exportDossier');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const sc = scenarios[currentScenarioKey];
      const rawObj = (missionInput ? missionInput.value : '').trim() || sc.title;
      const obj = sanitizeMd(rawObj);
      const status = sanitizeMd(missionStatus.textContent || 'waiting');
      const compute = sanitizeMd(statCompute.textContent);
      const brains = sanitizeMd(statBrains.textContent);
      const conf = sanitizeMd(statConfidence.textContent);
      const evidence = sanitizeMd(statEvidence.textContent);
      const facts = sanitizeMd(memFacts.textContent);
      const hyp = sanitizeMd(memHyp.textContent);
      const reject = sanitizeMd(memReject.textContent);
      const check = sanitizeMd(memCheck.textContent);

      // Extract executed steps or fallback to scenario steps
      const stepElements = timeline.querySelectorAll('.timeline-step');
      let stepsData = [];
      if (stepElements.length > 0) {
        stepElements.forEach(el => {
          const badge = el.querySelector('.timeline-badge')?.textContent?.trim() || '';
          const name = el.querySelector('.timeline-body b')?.textContent?.trim() || '';
          const detail = el.querySelector('.timeline-body span')?.textContent?.trim() || '';
          const state = el.querySelector('.timeline-state')?.textContent?.trim() || 'PASS';
          stepsData.push({ id: badge, name, detail, state });
        });
      } else {
        stepsData = sc.steps.map(s => ({ id: s.id, name: s.name, detail: s.detail, state: 'PLANNED' }));
      }

      const stepsTable = stepsData.map(s =>
        `| **${sanitizeMd(s.id)}** | ${sanitizeMd(s.name)} | ${sanitizeMd(s.detail)} | \`${sanitizeMd(s.state)}\` |`
      ).join('\n');

      const nowIso = new Date().toISOString();
      const missionId = 'mission-' + Math.random().toString(16).substring(2, 14);

      const dossierMd = `# 🛡️ DOSSIÊ DE AUDITORIA COGNITIVA — GAU v5

**ID da Missão:** \`${missionId}\`
**Data da Auditoria:** ${nowIso}
**Status da Missão:** \`${status.toUpperCase()}\`
**Ecossistema:** Antigravity Cognitive Layer (GAU v5.0.0)

---

## 📋 1. Resumo Executivo da Missão
- **Cenário de Referência:** ${sc.title}
- **Objetivo da Missão:** ${obj}
- **Veredito do Tribunal de Conclusão:** ${status === 'COMPLETE' ? 'APROVADO COM PROVA FORMAL DE EXECUÇÃO (PASS)' : 'EXECUÇÃO EM ANDAMENTO OU REVISÃO PENDENTE'}

---

## ⚡ 2. Governança de Computação & Epistemologia
| Métrica | Valor Registrado | Significado Operacional |
|:---|:---:|:---|
| **Modo de Compute** | \`${compute}\` | Alocação proporcional ao risco e incerteza |
| **Cérebros Mobilizados** | \`${brains}\` | Instâncias isoladas em sessões do Antigravity |
| **Confiança Epistêmica** | \`${conf}\` | Grau de suporte das hipóteses validadas |
| **Nível de Evidência** | \`${evidence}\` | Escala formal E0 (afirmação) a E5 (verificação independente) |

---

## 🧠 3. Project Brain (Memória Estruturada no SQLite)
- **Fatos Comprovados:** ${facts}
- **Hipóteses Ativas:** ${hyp}
- **Caminhos Rejeitados:** ${reject} (preservados contra repetição de estratégias)
- **Checkpoints Salvos:** ${check} (marcos de estado atômicos e reversíveis)

---

## 🔍 4. Trilha de Execução (Cognitive DAG)
| Passo | Mecanismo Cognitivo | Ações & Critérios de Prova | Estado |
|:---:|:---|:---|:---:|
${stepsTable}

---

## ⚖️ 5. Atestado de Integridade & Provas
- **Isolamento de Sessão:** Agentes verificadores operam sem contaminação do implementador.
- **Rastreabilidade Forense:** Todos os comandos e logs possuem hashes SHA-256 no banco local.
- **Regra de Sucesso:** \`PASS\` comprova execução de testes reais; nunca consenso cego sem teste.

---
*Gerado automaticamente pelo Mission Lab — GAU v5 Cognitive Orchestration Engine*
`;

      const blob = new Blob([dossierMd], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Dossie-Auditoria-GAU-v5-${currentScenarioKey}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  // Leaderboard Data: Agents & Models
  const AGENT_LEADERBOARD = [
    { rank: 1, id: 'gau-implementer', name: 'GAU Implementer', rating: 1500, wins: 1, losses: 0, draws: 0, duels: 1, winRate: 100, status: 'PROVISIONAL', specialty: 'Implementação TDD, refatoração atômica e isolamento em worktrees', category: 'Engenharia' },
    { rank: 2, id: 'gau-verifier', name: 'GAU Verifier', rating: 1500, wins: 0, losses: 0, draws: 0, duels: 0, winRate: 0, status: 'PROVISIONAL', specialty: 'Verificação independente, integridade de snapshots e testes de aceitação', category: 'Verificação' },
    { rank: 3, id: 'gau-investigator', name: 'GAU Investigator', rating: 1500, wins: 0, losses: 0, draws: 0, duels: 0, winRate: 0, status: 'PROVISIONAL', specialty: 'Laboratório de hipóteses, isolamento de causa raiz e testes discriminatórios', category: 'Raciocínio' },
    { rank: 4, id: 'gau-security', name: 'GAU Security', rating: 1500, wins: 0, losses: 0, draws: 0, duels: 0, winRate: 0, status: 'PROVISIONAL', specialty: 'Auditoria adversarial, modelagem de ameaças e superfícies de ataque', category: 'Segurança' },
    { rank: 5, id: 'gau-adversarial', name: 'GAU Adversarial', rating: 1500, wins: 0, losses: 0, draws: 0, duels: 0, winRate: 0, status: 'PROVISIONAL', specialty: 'Red teaming, quebra de hipóteses, contraexemplos e fuzzing', category: 'Segurança' },
    { rank: 6, id: 'gau-architect', name: 'GAU Architect', rating: 1500, wins: 0, losses: 0, draws: 0, duels: 0, winRate: 0, status: 'PROVISIONAL', specialty: 'Decisões arquiteturais, DAG de tarefas, diagramas e migrações', category: 'Engenharia' },
    { rank: 7, id: 'gau-performance', name: 'GAU Performance', rating: 1500, wins: 0, losses: 0, draws: 0, duels: 0, winRate: 0, status: 'PROVISIONAL', specialty: 'Benchmarks, profiling de latência e concorrência, otimização WAL', category: 'Engenharia' },
    { rank: 8, id: 'gau-database', name: 'GAU Database', rating: 1500, wins: 0, losses: 0, draws: 0, duels: 0, winRate: 0, status: 'PROVISIONAL', specialty: 'Schemas relacionais, transações ACID e integridade referencial', category: 'Engenharia' },
    { rank: 9, id: 'gau-integration', name: 'GAU Integration', rating: 1500, wins: 0, losses: 0, draws: 0, duels: 0, winRate: 0, status: 'PROVISIONAL', specialty: 'Contratos de API, barramentos assíncronos, backpressure e resiliência', category: 'Engenharia' },
    { rank: 10, id: 'gau-orchestrator', name: 'GAU Orchestrator', rating: 1500, wins: 0, losses: 0, draws: 0, duels: 0, winRate: 0, status: 'PROVISIONAL', specialty: 'Governança de compute, alocação de cérebros e resolução de impasses', category: 'Orquestração' },
    { rank: 11, id: 'gau-memory', name: 'GAU Memory', rating: 1500, wins: 0, losses: 0, draws: 0, duels: 0, winRate: 0, status: 'PROVISIONAL', specialty: 'Project Brain, auditoria de memória e conciliação de contradições', category: 'Memória' },
    { rank: 12, id: 'gau-judge', name: 'GAU Judge', rating: 1500, wins: 0, losses: 0, draws: 0, duels: 0, winRate: 0, status: 'PROVISIONAL', specialty: 'Tribunais de consenso ponderado e avaliação sem viés de maioria', category: 'Orquestração' },
    { rank: 13, id: 'gau-requirements', name: 'GAU Requirements', rating: 1500, wins: 0, losses: 0, draws: 0, duels: 0, winRate: 0, status: 'PROVISIONAL', specialty: 'Baseline de requisitos verificáveis e critérios de aceitação rigorosos', category: 'Verificação' },
    { rank: 14, id: 'gau-evidence', name: 'GAU Evidence', rating: 1500, wins: 0, losses: 0, draws: 0, duels: 0, winRate: 0, status: 'PROVISIONAL', specialty: 'Rastreabilidade forense de provas, cadeia de custódia e logs imutáveis', category: 'Verificação' },
    { rank: 15, id: 'gau-research', name: 'GAU Research', rating: 1500, wins: 0, losses: 0, draws: 0, duels: 0, winRate: 0, status: 'PROVISIONAL', specialty: 'Pesquisa técnica externa, documentação viva e análise comparativa', category: 'Raciocínio' },
    { rank: 16, id: 'gau-ux', name: 'GAU UX', rating: 1500, wins: 0, losses: 0, draws: 0, duels: 0, winRate: 0, status: 'PROVISIONAL', specialty: 'Design systems, jornadas do usuário, acessibilidade e microinterações', category: 'Engenharia' }
  ];

  const MODEL_LEADERBOARD = [
    { rank: 1, id: 'claude-fable-5-1', name: 'Claude Fable 5.1', rating: 1925, wins: 52, losses: 5, draws: 3, duels: 60, winRate: 87, status: 'CALIBRATED', specialty: 'Agência contínua, zero atalhos e refatoração cirúrgica com cache read -75%', category: 'Anthropic' },
    { rank: 2, id: 'gpt-6-astra', name: 'GPT-6 Astra', rating: 1920, wins: 50, losses: 6, draws: 4, duels: 60, winRate: 83, status: 'CALIBRATED', specialty: 'Flagship multi-agente, navegação web e controle nativo de SO (Computer Use)', category: 'OpenAI' },
    { rank: 3, id: 'claude-mythos-5-1', name: 'Claude Mythos 5.1', rating: 1915, wins: 49, losses: 7, draws: 4, duels: 60, winRate: 82, status: 'CALIBRATED', specialty: 'Engenharia de alta densidade sem filtros restritivos para pesquisa e red-teaming', category: 'Anthropic' },
    { rank: 4, id: 'gemini-3-8-flash', name: 'Gemini 3.8 Flash', rating: 1910, wins: 48, losses: 8, draws: 4, duels: 60, winRate: 80, status: 'CALIBRATED', specialty: 'Cavalo de batalha inteligente, streaming a 240 tok/s e Agentic Video nativo', category: 'Google DeepMind' },
    { rank: 5, id: 'gemini-3-8-flash-cyber', name: 'Gemini 3.8 Cyber', rating: 1905, wins: 47, losses: 9, draws: 4, duels: 60, winRate: 78, status: 'CALIBRATED', specialty: 'Detecção autônoma de vulnerabilidades 0-day, sandbox estrita e auto-patching', category: 'Google DeepMind' },
    { rank: 6, id: 'deepseek-v4-flash', name: 'DeepSeek V4.1-Flash', rating: 1895, wins: 46, losses: 9, draws: 5, duels: 60, winRate: 77, status: 'CALIBRATED', specialty: 'MoE Manifold Hyper-Connections, 1M context e custo de inferência hiper-reduzido', category: 'DeepSeek' },
    { rank: 7, id: 'qwen-3-8-max', name: 'Qwen 3.8-Max (2.4T)', rating: 1890, wins: 45, losses: 10, draws: 5, duels: 60, winRate: 75, status: 'CALIBRATED', specialty: '2.4 Trilhões de parâmetros Sparse MoE, multimodalidade e raciocínio de código', category: 'Alibaba' },
    { rank: 8, id: 'grok-4-6', name: 'Grok 4.6 (Colleague)', rating: 1885, wins: 44, losses: 11, draws: 5, duels: 60, winRate: 73, status: 'CALIBRATED', specialty: 'Digital Colleague, reflexão científica em cadeia e resolução formal STEM', category: 'xAI' },
    { rank: 9, id: 'claude-3-7-sonnet', name: 'Claude 3.7 Sonnet', rating: 1865, wins: 48, losses: 15, draws: 5, duels: 68, winRate: 71, status: 'CALIBRATED', specialty: 'Raciocínio híbrido (Extended Thinking), refatoração e síntese de código', category: 'Anthropic' },
    { rank: 10, id: 'grok-3', name: 'Grok 3 (Reasoning)', rating: 1860, wins: 45, losses: 16, draws: 5, duels: 66, winRate: 68, status: 'CALIBRATED', specialty: 'Raciocínio matemático e científico profundo com fronteira de STEM e coding', category: 'xAI' },
    { rank: 11, id: 'gemini-2-pro', name: 'Gemini 2.0 Pro Exp', rating: 1855, wins: 43, losses: 17, draws: 5, duels: 65, winRate: 66, status: 'CALIBRATED', specialty: 'Janela de contexto ultra-longa, análise multimodal e síntese de código complexo', category: 'Google DeepMind' },
    { rank: 12, id: 'deepseek-r1', name: 'DeepSeek-R1', rating: 1850, wins: 42, losses: 18, draws: 5, duels: 65, winRate: 65, status: 'CALIBRATED', specialty: 'Cadeia de pensamento aberta (<think>), provas formais e quebra de contraexemplos', category: 'DeepSeek' },
    { rank: 13, id: 'o3-mini', name: 'o3-mini (High)', rating: 1845, wins: 40, losses: 18, draws: 6, duels: 64, winRate: 63, status: 'CALIBRATED', specialty: 'Raciocínio lógico compacto de alta densidade e geração veloz de algoritmos', category: 'OpenAI' },
    { rank: 14, id: 'qwen-3-8-omni-flash', name: 'Qwen 3.8-Omni', rating: 1840, wins: 38, losses: 19, draws: 5, duels: 62, winRate: 61, status: 'CALIBRATED', specialty: 'Interações omni-modais em tempo real (áudio/vídeo) com baixa latência', category: 'Alibaba' },
    { rank: 15, id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet v2', rating: 1820, wins: 44, losses: 26, draws: 6, duels: 76, winRate: 58, status: 'CALIBRATED', specialty: 'Benchmark clássico em engenharia autônoma e ferramentas no Antigravity', category: 'Anthropic' },
    { rank: 16, id: 'gpt-4o', name: 'GPT-4o (Omni)', rating: 1790, wins: 36, losses: 28, draws: 6, duels: 70, winRate: 51, status: 'CALIBRATED', specialty: 'Execução rápida de pipelines, integração de tooling e geração robusta de APIs', category: 'OpenAI' }
  ];

  let currentLbDimension = 'agents';
  let activeLbCat = 'Todos';

  const podiumEl = document.getElementById('leaderboardPodium');
  const lbGridEl = document.getElementById('agentLeaderboardGrid');
  const lbFiltersEl = document.getElementById('agentLeaderboardFilters');
  const lbDimensionTabs = document.getElementById('lbDimensionTabs');

  if (lbDimensionTabs) {
    lbDimensionTabs.querySelectorAll('.dim-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        lbDimensionTabs.querySelectorAll('.dim-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentLbDimension = tab.dataset.dim;
        activeLbCat = 'Todos';
        renderLeaderboard();
      });
    });
  }

  function renderLeaderboard() {
    if (!podiumEl || !lbGridEl) return;
    const currentList = currentLbDimension === 'models' ? MODEL_LEADERBOARD : AGENT_LEADERBOARD;

    // Podium rendering (Top 3)
    const top3 = currentList.slice(0, 3);
    const crownIcons = ['🥇', '🥈', '🥉'];
    const rankTitles = ['OURO • LÍDER', 'PRATA • TITÂNIO', 'BRONZE • ORBITAL'];

    podiumEl.innerHTML = top3.map((a, idx) => `
      <div class="podium-card rank-${idx + 1}">
        <span class="podium-crown">${crownIcons[idx]}</span>
        <div class="podium-rank">#${String(idx + 1).padStart(2, '0')} ${rankTitles[idx]}</div>
        <div class="podium-name">${escapeHtml(a.name)}</div>
        <div class="podium-rating">
          <strong>${a.rating}</strong>
          <span>Elo</span>
        </div>
        <div class="podium-stats">
          <span class="stat-pill">Vitórias: <b>${a.wins}</b></span>
          <span class="stat-pill">Duelos: <b>${a.duels}</b></span>
          <span class="stat-pill">Taxa: <b>${a.winRate}%</b></span>
        </div>
        <p class="podium-spec">${escapeHtml(a.specialty)}</p>
      </div>
    `).join('');

    // Filters row
    if (lbFiltersEl) {
      if (currentLbDimension === 'models') {
        lbFiltersEl.style.display = 'none';
      } else {
        lbFiltersEl.style.display = 'flex';
        const cats = ['Todos', ...new Set(AGENT_LEADERBOARD.map(a => a.category))];
        lbFiltersEl.innerHTML = cats.map(c => `
          <button class="filter-btn ${c === activeLbCat ? 'active' : ''}" data-lbcat="${escapeHtml(c)}">${escapeHtml(c)}</button>
        `).join('');
        lbFiltersEl.querySelectorAll('button').forEach(btn => {
          btn.addEventListener('click', () => {
            activeLbCat = btn.dataset.lbcat;
            renderLeaderboard();
          });
        });
      }
    }

    // Grid rendering
    const filtered = currentList.filter(a => activeLbCat === 'Todos' || a.category === activeLbCat);
    lbGridEl.innerHTML = filtered.map(a => `
      <article class="agent-card">
        <div class="agent-card-top">
          <span class="agent-rank">#${String(a.rank).padStart(2, '0')}</span>
          <span class="agent-status-badge ${a.status.toLowerCase()}">${escapeHtml(a.status)}</span>
        </div>
        <h3>${escapeHtml(a.name)}</h3>
        <span class="agent-slug"><code>${escapeHtml(a.id)}</code></span>
        <div class="agent-rating-row">
          <span class="agent-rating-val">${a.rating}</span>
          <span class="agent-rating-lbl">Elo Rating</span>
        </div>
        <div class="agent-stats-row">
          <span class="stat-pill">Vitórias: <b>${a.wins}</b></span>
          <span class="stat-pill">Duelos: <b>${a.duels}</b></span>
          <span class="stat-pill">Taxa: <b>${a.winRate}%</b></span>
        </div>
        <div class="winrate-wrap">
          <div class="winrate-meta">
            <span>TAXA DE VITÓRIA</span>
            <strong>${a.winRate}%</strong>
          </div>
          <div class="winrate-bar-track">
            <div class="winrate-bar-fill" style="width: ${Math.max(a.winRate, 6)}%;"></div>
          </div>
        </div>
        <p class="agent-specialty">${escapeHtml(a.specialty)}</p>
        <div class="agent-card-footer">
          <span class="agent-cat-tag">${escapeHtml(a.category)}</span>
          ${a.wins > 0 ? `<span class="agent-win-badge">✓ ${a.wins} vitória(s)</span>` : ''}
        </div>
      </article>
    `).join('');
  }

  // Satellites Interactive System
  const satellites = document.querySelectorAll('.satellite');
  const capsuleTitle = document.getElementById('capsuleTitle');
  const capsuleDesc = document.getElementById('capsuleDesc');
  const capsuleIcon = document.getElementById('capsuleIcon');
  const orbitalLiveStatus = document.getElementById('orbitalLiveStatus');
  const orbitalCoreNode = document.getElementById('orbitalCoreNode');

  satellites.forEach(sat => {
    const handleSelect = () => {
      satellites.forEach(s => s.classList.remove('active'));
      sat.classList.add('active');
      const satId = sat.dataset.sat || '';
      const name = sat.dataset.name || '';
      const desc = sat.dataset.desc || '';

      if (capsuleTitle) capsuleTitle.textContent = `#${satId} • ${name}`;
      if (capsuleDesc) capsuleDesc.textContent = desc;
      if (capsuleIcon) capsuleIcon.textContent = '🛰️';
      if (orbitalLiveStatus) orbitalLiveStatus.innerHTML = `<i></i> SAT ${satId} ONLINE`;
    };

    sat.addEventListener('click', handleSelect);
    sat.addEventListener('mouseenter', handleSelect);
  });

  if (orbitalCoreNode) {
    orbitalCoreNode.addEventListener('click', () => {
      satellites.forEach(s => s.classList.remove('active'));
      if (capsuleTitle) capsuleTitle.textContent = 'Núcleo Central GAU v5 (Global Agentic Universe)';
      if (capsuleDesc) capsuleDesc.textContent = 'Orquestrador quântico unificado operando no Antigravity com 16 agentes, 69 ideias aprovadas e tolerância zero a alucinação.';
      if (capsuleIcon) capsuleIcon.textContent = '⚡';
      if (orbitalLiveStatus) orbitalLiveStatus.innerHTML = '<i></i> QUANTUM CORE 100%';
    });
  }

  // Interactive Pipeline do /goal
  const pipeNodes = document.querySelectorAll('#goalPipeline .pipe-node');
  const pipeStepBadge = document.getElementById('pipeStepBadge');
  const pipeStepGate = document.getElementById('pipeStepGate');
  const pipeStepTitle = document.getElementById('pipeStepTitle');
  const pipeStepDesc = document.getElementById('pipeStepDesc');
  const pipeStepAgents = document.getElementById('pipeStepAgents');
  const pipeStepProof = document.getElementById('pipeStepProof');

  const pipeStepData = [
    {
      badge: 'ETAPA 00 • INPUT',
      gate: 'GATE: Abertura',
      title: 'Entrada do Comando /goal [tarefa]',
      desc: 'O desenvolvedor digita /goal diretamente no terminal do Antigravity. O GAU intercepta a intenção, analisa restrições e inicializa a governança sem quebrar a assinatura do comando nativo.',
      agents: 'gau-orchestrator',
      proof: 'E0: Requisitos Verificáveis'
    },
    {
      badge: 'ETAPA 01 • BASELINE',
      gate: 'GATE: Congelamento de Requisitos',
      title: 'Requirement Council (Idea #30)',
      desc: 'Fixa o baseline formal antes de qualquer código ser alterado. Define exatamente quais testes matemáticos ou funcionais provarão que a tarefa foi cumprida com êxito.',
      agents: 'gau-requirements, gau-judge',
      proof: 'E0 ➔ E1: Critérios Fixados'
    },
    {
      badge: 'ETAPA 02 • ROTEAMENTO',
      gate: 'GATE: Alocação Orçamentária',
      title: 'Adaptive Model Router & Compute Governor (Ideas #01, #38)',
      desc: 'Calcula o risco e a incerteza da missão. Tarefas rotineiras recebem compute SMART; cenários complexos convocam debates de múltiplos modelos e equipes profundas.',
      agents: 'gau-orchestrator, gau-router',
      proof: 'E1: Rota e Orçamento Definidos'
    },
    {
      badge: 'ETAPA 03 • EXECUÇÃO',
      gate: 'GATE: Testes de Unidade Isolados',
      title: 'Execution Graph & Worktree Swarms (Ideas #08, #34)',
      desc: 'Implementação simultânea em worktrees isoladas do Git via Coding Swarm. Cada coder desenvolve sob interfaces congeladas sem poluir a branch principal.',
      agents: 'gau-implementer, gau-architect',
      proof: 'E2 ➔ E3: Código Executado e Logs Coletados'
    },
    {
      badge: 'ETAPA 04 • AUDITORIA',
      gate: 'GATE: Contraexemplos e Regressão',
      title: 'Evidence Court & Regression Hunters (Ideas #22, #35)',
      desc: 'Sessão cega de verificação adversária. Tenta quebrar a solução proposta através de testes de estresse, injeção de falhas e caça ativa a regressões.',
      agents: 'gau-evidence, gau-adversarial',
      proof: 'E4: Testes sob Estresse Aprovados'
    },
    {
      badge: 'ETAPA 05 • CONCLUSÃO',
      gate: 'GATE FINAL: Prova Física SHA-256',
      title: 'Final Completion Tribunal (Idea #36)',
      desc: 'O tribunal emite o veredito PASS apenas após inspecionar o código de saída 0 no terminal, logs íntegros e hashes imutáveis gravados no banco SQLite WAL.',
      agents: 'gau-judge, gau-verifier',
      proof: 'E5: Verificação Independente Concluída'
    }
  ];

  pipeNodes.forEach(node => {
    node.addEventListener('click', () => {
      pipeNodes.forEach(n => n.classList.remove('active'));
      node.classList.add('active');
      const stepIdx = parseInt(node.dataset.step, 10) || 0;
      const data = pipeStepData[stepIdx] || pipeStepData[0];

      if (pipeStepBadge) pipeStepBadge.textContent = data.badge;
      if (pipeStepGate) pipeStepGate.textContent = data.gate;
      if (pipeStepTitle) pipeStepTitle.textContent = data.title;
      if (pipeStepDesc) pipeStepDesc.textContent = data.desc;
      if (pipeStepAgents) pipeStepAgents.textContent = data.agents;
      if (pipeStepProof) pipeStepProof.textContent = data.proof;
    });
  });

  renderLeaderboard();
  resetMission();

  // ==========================================
  // Toast Notification System
  // ==========================================
  const toastEl = document.getElementById('toastNotification');
  let toastTimer = null;
  function showToast(message, duration = 3000) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');
    if (typeof playCyberSound === 'function') {
      playCyberSound('switch');
    }
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, duration);
  }

  // ==========================================
  // SHA-256 Copy Button Handler
  // ==========================================
  const copyHashBtn = document.getElementById('copyHashBtn');
  if (copyHashBtn) {
    copyHashBtn.addEventListener('click', async () => {
      const hash = copyHashBtn.dataset.copy || 'f28fba15827bf5b050e999d6dc41e0993b13fa4c8f4bdacadf23f330fcc2560b';
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(hash);
        } else {
          const ta = document.createElement('textarea');
          ta.value = hash;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        const oldText = copyHashBtn.textContent;
        copyHashBtn.textContent = 'Hash Copiado! ✓';
        showToast('SHA-256 copiado para a área de transferência!');
        setTimeout(() => {
          copyHashBtn.textContent = oldText;
        }, 2000);
      } catch (err) {
        showToast('Não foi possível copiar automaticamente. Selecione manualmente o hash.');
      }
    });
  }

  // ==========================================
  // WhatsApp Official Channel & Modal
  // ==========================================
  const GAU_WHATSAPP_CHANNEL_URL = 'https://whatsapp.com/channel/0029Vb97dV88vd1KJxutZh3V';

  const whatsappModal = document.getElementById('whatsappModal');
  const whatsappToggleBtn = document.getElementById('whatsappToggleBtn');
  const whatsappCloseBtn = document.getElementById('whatsappCloseBtn');
  const tooltipCloseBtn = document.getElementById('tooltipClose');
  const whatsappTooltip = document.getElementById('whatsappTooltip');
  const whatsappSendBtn = document.getElementById('whatsappSendBtn');
  const sectionOpenChatBtn = document.getElementById('sectionOpenChatBtn');

  function openWhatsappModal() {
    if (!whatsappModal) return;
    whatsappModal.classList.add('active');
    whatsappModal.classList.add('open');
    if (whatsappTooltip) {
      whatsappTooltip.style.display = 'none';
    }
  }

  function closeWhatsappModal() {
    if (whatsappModal) {
      whatsappModal.classList.remove('active');
      whatsappModal.classList.remove('open');
    }
  }

  function openWhatsappChannel() {
    window.open(GAU_WHATSAPP_CHANNEL_URL, '_blank', 'noopener,noreferrer');
    showToast('Acessando o Canal Oficial do GAU v5 no WhatsApp...');
    closeWhatsappModal();
  }

  if (whatsappToggleBtn) {
    whatsappToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (whatsappModal && (whatsappModal.classList.contains('active') || whatsappModal.classList.contains('open'))) {
        closeWhatsappModal();
      } else {
        openWhatsappModal();
      }
    });
  }

  if (whatsappCloseBtn) {
    whatsappCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeWhatsappModal();
    });
  }

  if (tooltipCloseBtn) {
    tooltipCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (whatsappTooltip) {
        whatsappTooltip.style.display = 'none';
      }
    });
  }

  if (sectionOpenChatBtn) {
    sectionOpenChatBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openWhatsappModal();
    });
  }

  if (whatsappSendBtn) {
    whatsappSendBtn.addEventListener('click', () => {
      showToast('Acessando o Canal Oficial do GAU v5 no WhatsApp...');
      closeWhatsappModal();
    });
  }

  // Close modal when clicking outside
  document.addEventListener('click', (e) => {
    if (whatsappModal && (whatsappModal.classList.contains('active') || whatsappModal.classList.contains('open'))) {
      if (!whatsappModal.contains(e.target) && 
          !(whatsappToggleBtn && whatsappToggleBtn.contains(e.target)) && 
          !(sectionOpenChatBtn && sectionOpenChatBtn.contains(e.target))) {
        closeWhatsappModal();
      }
    }
  });

  // Escape key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && whatsappModal && (whatsappModal.classList.contains('active') || whatsappModal.classList.contains('open'))) {
      closeWhatsappModal();
    }
  });

  // Commercial Video Auto-scroll & Play
  const commercialVideo = document.getElementById('gauCommercialVideo');
  document.querySelectorAll('a[href="#comercial"]').forEach(link => {
    link.addEventListener('click', () => {
      if (commercialVideo) {
        setTimeout(() => {
          commercialVideo.play().catch(() => {});
        }, 500);
      }
    });
  });

  const shareWhatsappBtn = document.getElementById('shareWhatsappBtn');
  if (shareWhatsappBtn) {
    shareWhatsappBtn.addEventListener('click', () => {
      showToast('Abrindo WhatsApp para compartilhar o GAU v5...');
    });
  }

  // Mobile Navigation Drawer
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const mobileNavBackdrop = document.getElementById('mobileNavBackdrop');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');

  function openMobileDrawer() {
    if (mobileMenuBtn) mobileMenuBtn.classList.add('active');
    if (mobileNavDrawer) mobileNavDrawer.classList.add('open');
    if (mobileNavBackdrop) mobileNavBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileDrawer() {
    if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
    if (mobileNavDrawer) mobileNavDrawer.classList.remove('open');
    if (mobileNavBackdrop) mobileNavBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      if (mobileNavDrawer && mobileNavDrawer.classList.contains('open')) {
        closeMobileDrawer();
      } else {
        openMobileDrawer();
      }
    });
  }

  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeMobileDrawer);
  if (mobileNavBackdrop) mobileNavBackdrop.addEventListener('click', closeMobileDrawer);

  document.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', closeMobileDrawer);
  });

  // Dock WhatsApp Button
  const dockWhatsappBtn = document.getElementById('dockWhatsappBtn');
  if (dockWhatsappBtn) {
    dockWhatsappBtn.addEventListener('click', openWhatsappModal);
  }

  // Dock Active Navigation Tracker & Scrollspy
  const dockItems = document.querySelectorAll('.mobile-bottom-dock .dock-item');
  function setDockActive(targetId) {
    dockItems.forEach(item => {
      const href = item.getAttribute('href');
      if (href === targetId || (targetId === '#top' && item.id === 'dockHome')) {
        item.classList.add('active');
      } else if (item.id !== 'dockWhatsappBtn') {
        item.classList.remove('active');
      }
    });
  }

  dockItems.forEach(item => {
    item.addEventListener('click', () => {
      const href = item.getAttribute('href');
      if (href && href.startsWith('#')) {
        setDockActive(href);
      }
    });
  });

  const navLinks = document.querySelectorAll('.topbar .nav a');
  const spySections = [
    { id: '#top', el: document.getElementById('top') },
    { id: '#architecture', el: document.getElementById('architecture') },
    { id: '#lab', el: document.getElementById('lab') },
    { id: '#comercial', el: document.getElementById('comercial') },
    { id: '#leaderboard', el: document.getElementById('leaderboard') },
    { id: '#ideas', el: document.getElementById('ideas') },
    { id: '#goal', el: document.getElementById('goal') },
    { id: '#deploy', el: document.getElementById('deploy') },
    { id: '#contato', el: document.getElementById('contato') }
  ];

  function setActiveNav(targetId) {
    setDockActive(targetId);
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === targetId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  let scrollTimeout = null;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) return;
    scrollTimeout = setTimeout(() => {
      scrollTimeout = null;
      const scrollPos = window.scrollY + 220;
      for (let i = spySections.length - 1; i >= 0; i--) {
        const s = spySections[i];
        if (s.el && s.el.offsetTop <= scrollPos) {
          setActiveNav(s.id);
          break;
        }
      }
    }, 80);
  }, { passive: true });

  // Hero Quick Prompt Launchers
  document.querySelectorAll('.prompt-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const promptText = chip.dataset.prompt;
      const mInput = document.getElementById('missionInput');
      if (mInput && promptText) {
        mInput.value = promptText;
        showToast('⚡ Prompt transferido para o Mission Lab!');
        const labSection = document.getElementById('lab');
        if (labSection) {
          labSection.scrollIntoView({ behavior: 'smooth' });
          setTimeout(() => mInput.focus(), 600);
        }
      }
    });
  });

  // Commercial Video Chapters
  const videoEl = document.getElementById('gauCommercialVideo');
  const chapterPills = document.querySelectorAll('.chapter-pill');
  chapterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      chapterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const time = parseFloat(pill.dataset.time || '0');
      if (videoEl) {
        videoEl.currentTime = time;
        videoEl.play().catch(() => {});
        showToast(`Reproduzindo capítulo aos ${pill.textContent.trim()}`);
      }
    });
  });

  // Deploy OS Selector Tabs
  const osTabs = document.querySelectorAll('.os-tab');
  const osPanes = {
    powershell: document.getElementById('panePowerShell'),
    bash: document.getElementById('paneBash'),
    python: document.getElementById('panePython')
  };

  osTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      osTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const os = tab.dataset.os;
      Object.entries(osPanes).forEach(([key, pane]) => {
        if (pane) {
          if (key === os) {
            pane.style.display = 'block';
            pane.classList.add('active');
          } else {
            pane.style.display = 'none';
            pane.classList.remove('active');
          }
        }
      });
    });
  });

  // Animated Number Counters
  const countElements = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && countElements.length > 0) {
    const countObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          if (!isNaN(target)) {
            let cur = 0;
            const step = Math.max(1, Math.ceil(target / 24));
            const timer = setInterval(() => {
              cur += step;
              if (cur >= target) {
                el.textContent = target;
                clearInterval(timer);
              } else {
                el.textContent = cur;
              }
            }, 30);
          }
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.4 });
    countElements.forEach(el => countObserver.observe(el));
  }

  // ==========================================
  // Cyberpunk Audio Feedback (Web Audio API)
  // ==========================================
  let audioCtx = null;
  function isSoundEnabled() {
    return localStorage.getItem('gau_sound_enabled') === 'true';
  }

  function playCyberSound(type = 'click') {
    if (!isSoundEnabled()) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      if (!audioCtx) {
        audioCtx = new AudioContextClass();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'click') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'switch') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.07);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
        osc.start(now);
        osc.stop(now + 0.07);
      } else if (type === 'whoosh') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(520, now + 0.06);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.12);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'terminal') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(1100, now);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
        osc.start(now);
        osc.stop(now + 0.025);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(660, now + 0.06);
        osc.frequency.setValueAtTime(880, now + 0.12);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.22);
      }
    } catch (e) {
      // Audio silently ignored if blocked by browser policy
    }
  }

  function initAudioFeedback() {
    const audioToggleBtn = document.getElementById('audioToggleBtn');
    const audioIcon = document.getElementById('audioIcon');

    function updateAudioUI() {
      const enabled = isSoundEnabled();
      if (audioToggleBtn) {
        if (enabled) {
          audioToggleBtn.classList.add('sound-on');
          if (audioIcon) audioIcon.textContent = '🔊';
          audioToggleBtn.setAttribute('aria-label', 'Desativar Sons');
        } else {
          audioToggleBtn.classList.remove('sound-on');
          if (audioIcon) audioIcon.textContent = '🔇';
          audioToggleBtn.setAttribute('aria-label', 'Ativar Sons');
        }
      }
    }

    if (audioToggleBtn) {
      audioToggleBtn.addEventListener('click', () => {
        const nextState = !isSoundEnabled();
        localStorage.setItem('gau_sound_enabled', String(nextState));
        updateAudioUI();
        if (nextState) {
          playCyberSound('success');
          showToast('🔊 Efeitos Sonoros Cyberpunk Ativados!');
        } else {
          showToast('🔇 Sons Desativados');
        }
      });
    }

    updateAudioUI();
  }

  // ==========================================
  // Quantum Reactive Starfield Canvas
  // ==========================================
  function initQuantumCanvas() {
    const canvas = document.getElementById('quantumCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles = [];
    let animId = null;
    let mouse = { x: -1000, y: -1000, radius: 140 };

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      createParticles();
    }

    function createParticles() {
      if (width <= 768) {
        particles = [];
        return;
      }
      const count = Math.min(50, Math.floor(width / 28));
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 1.6 + 0.8,
          baseAlpha: Math.random() * 0.35 + 0.2,
          color: Math.random() > 0.4 ? 'rgba(98, 230, 255,' : 'rgba(167, 139, 250,'
        });
      }
    }

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    function loop() {
      if (document.hidden || width <= 768 || particles.length === 0) {
        animId = requestAnimationFrame(loop);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const dxMouse = p.x - mouse.x;
        const dyMouse = p.y - mouse.y;
        const distMouse = Math.hypot(dxMouse, dyMouse);
        if (distMouse < mouse.radius && distMouse > 0) {
          const force = (mouse.radius - distMouse) / mouse.radius;
          p.x += (dxMouse / distMouse) * force * 1.1;
          p.y += (dyMouse / distMouse) * force * 1.1;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color} ${p.baseAlpha})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 105) {
            const alpha = (1 - dist / 105) * 0.16;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(98, 230, 255, ${alpha})`;
            ctx.lineWidth = 0.55;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(loop);
    }

    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    });

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && width > 768 && !animId) {
        loop();
      }
    });

    resize();
    loop();
  }

  // ==========================================
  // 3D Holographic Tilt with Specular Glare
  // ==========================================
  function applyTiltToElements(elements) {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    elements.forEach(card => {
      if (card.dataset.tiltApplied) return;
      card.dataset.tiltApplied = 'true';
      card.classList.add('tilt-card');
      let glare = card.querySelector('.tilt-glare');
      if (!glare) {
        glare = document.createElement('div');
        glare.className = 'tilt-glare';
        card.appendChild(glare);
      }

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotX = (0.5 - y) * 10;
        const rotY = (x - 0.5) * 10;
        card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
        glare.style.transform = `translate(${((x - 0.5) * 100).toFixed(1)}%, ${((y - 0.5) * 100).toFixed(1)}%)`;
        glare.style.opacity = '0.35';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        glare.style.opacity = '0';
      });
    });
  }

  function init3DTilt() {
    applyTiltToElements(document.querySelectorAll('.layer-card, .podium-card, .roi-card, .deploy-card'));
  }

  // ==========================================
  // Cognitive ROI & Token Efficiency Calculator
  // ==========================================
  function initRoiCalculator() {
    const range = document.getElementById('roiTasksRange');
    const tasksCount = document.getElementById('roiTasksCount');
    const hoursSaved = document.getElementById('roiHoursSaved');
    const tokensSaved = document.getElementById('roiTokensSaved');
    const successRate = document.getElementById('roiSuccessRate');

    if (!range || !tasksCount || !hoursSaved || !tokensSaved) return;

    function calculateROI() {
      const tasks = parseInt(range.value, 10) || 25;
      tasksCount.textContent = `${tasks} tarefas`;

      // Cada tarefa autônoma economiza ~3.5 horas de debug e triagem por mês
      const hours = (tasks * 3.5).toFixed(1);
      hoursSaved.textContent = `${hours}h`;

      // Economia de tokens: ~0.5M tokens poupados em loops prevenidos
      const tokens = (tasks * 0.5).toFixed(1);
      tokensSaved.textContent = `${tokens}M`;

      if (successRate) {
        successRate.textContent = '100%';
      }
    }

    range.addEventListener('input', () => {
      calculateROI();
      playCyberSound('click');
    });

    calculateROI();
  }

  // ==========================================
  // Interactive CLI Terminal Playground
  // ==========================================
  function initCliPlayground() {
    const terminalBody = document.getElementById('terminalBody');
    const terminalInput = document.getElementById('terminalInput');
    const terminalSendBtn = document.getElementById('terminalSendBtn');
    const terminalClearBtn = document.getElementById('terminalClearBtn');
    const cliChips = document.querySelectorAll('.cli-chip');

    if (!terminalBody || !terminalInput) return;

    function appendLine(type, content) {
      const line = document.createElement('div');
      if (type === 'prompt') {
        line.className = 'terminal-line prompt-line';
        line.innerHTML = `<span class="t-prompt">gau&gt;</span> <span class="t-text">${escapeHtml(content)}</span>`;
      } else if (type === 'output') {
        line.className = 'terminal-output';
        line.innerHTML = content;
      } else if (type === 'system') {
        line.className = 'terminal-line system-msg';
        line.textContent = content;
      }
      terminalBody.appendChild(line);
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    function runCommand(rawCmd) {
      const cmd = (rawCmd || '').trim();
      if (!cmd) return;

      appendLine('prompt', cmd);
      playCyberSound('terminal');

      const lower = cmd.toLowerCase();

      if (lower === 'clear' || lower === 'cls') {
        terminalBody.innerHTML = '';
        appendLine('system', 'Console limpo. Digite um comando ou use os botões rápidos.');
        return;
      }

      if (lower === 'help') {
        appendLine('output', `
          <span class="t-cyan">Comandos disponíveis no simulador:</span><br>
          &bull; <span class="t-green">gau doctor</span> &mdash; Validação de integridade e ambiente do runtime<br>
          &bull; <span class="t-green">gau match &lt;termo&gt;</span> &mdash; Busca semântica de ideias e subagentes<br>
          &bull; <span class="t-green">/goal</span> &mdash; Disparo de engenharia autônoma sob evidências físicas<br>
          &bull; <span class="t-green">gau leaderboard</span> &mdash; Consulta do ranking Elo atualizado<br>
          &bull; <span class="t-green">clear</span> &mdash; Limpar histórico do console
        `);
        return;
      }

      if (lower === 'gau doctor') {
        appendLine('output', `
          <span class="t-green">✔ Python 3.13.2 detected (64-bit Windows)</span><br>
          <span class="t-green">✔ SQLite WAL journal mode verified (.gau/events.sqlite3)</span><br>
          <span class="t-green">✔ Git Worktree Swarm isolated and healthy</span><br>
          <span class="t-green">✔ JEV Decision Fabric: Loop Sentinel & Verifier online</span><br>
          <span class="t-cyan">🛡️ 69 Ideias, 16 Subagentes e Provas E0-E5 ativas. Runtime operacional!</span>
        `);
        return;
      }

      if (lower.startsWith('gau match')) {
        const query = cmd.replace(/^gau\s+match\s*/i, '').replace(/["']/g, '').trim() || 'auth';
        appendLine('output', `
          <span class="t-cyan">Buscando mecanismos para: "${escapeHtml(query)}"</span><br>
          &bull; <strong>Idea #25: Security Council</strong> (Pontuação: 98.4%) &mdash; Sanitização e OWASP<br>
          &bull; <strong>Subagente gau-security</strong> &mdash; Auditoria de permissões e vazamentos<br>
          &bull; <strong>Idea #05: Adversarial Council</strong> &mdash; Testes de quebra de autenticação
        `);
        return;
      }

      if (lower === '/goal' || lower.startsWith('/goal')) {
        appendLine('output', `
          <span class="t-cyan">Orquestrando missão autônoma via /goal...</span><br>
          1. Decomposição de requisitos pelo <em>gau-requirements</em><br>
          2. Congelamento de interfaces pelo <em>gau-architect</em><br>
          3. Coding Swarm paralelo em worktrees isoladas<br>
          4. Verificação independente cega pelo <em>gau-verifier</em> (Exit Code 0)<br>
          <span class="t-green">✔ Missão concluída com 100% de evidências comprovadas!</span>
        `);
        return;
      }

      if (lower === 'gau leaderboard') {
        appendLine('output', `
          <span class="t-cyan">🏆 Leaderboard Elo Atualizado:</span><br>
          1. 🥇 Claude 3.7 Sonnet &mdash; <strong>1850 Elo</strong> (94% win rate)<br>
          2. 🥈 GPT-4o &mdash; <strong>1780 Elo</strong> (88% win rate)<br>
          3. 🥉 Gemini 2.0 Flash &mdash; <strong>1710 Elo</strong> (85% win rate)<br>
          4. 🏅 DeepSeek-V3 &mdash; <strong>1690 Elo</strong> (82% win rate)
        `);
        return;
      }

      appendLine('output', `
        <span class="t-yellow">Comando "${escapeHtml(cmd)}" não reconhecido.</span><br>
        Digite <span class="t-cyan">help</span> para visualizar os comandos suportados no simulador.
      `);
    }

    if (terminalSendBtn) {
      terminalSendBtn.addEventListener('click', () => {
        const val = terminalInput.value;
        terminalInput.value = '';
        runCommand(val);
      });
    }

    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const val = terminalInput.value;
        terminalInput.value = '';
        runCommand(val);
      }
    });

    if (terminalClearBtn) {
      terminalClearBtn.addEventListener('click', () => {
        terminalBody.innerHTML = '';
        appendLine('system', 'Console limpo.');
        playCyberSound('click');
      });
    }

    cliChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const cmd = chip.dataset.cmd;
        if (cmd) {
          runCommand(cmd);
        }
      });
    });
  }

  // ==========================================
  // Dedicated Mobile Quick Action Bar (<= 768px)
  // ==========================================
  function initMobileQuickBar() {
    const quickBar = document.getElementById('mobileQuickBar');
    if (!quickBar) return;

    const chips = quickBar.querySelectorAll('.mobile-quick-chip');
    if (!chips.length) return;

    const sectionIds = ['top', 'architecture', 'lab', 'comercial', 'roi', 'leaderboard', 'ideas', 'goal', 'deploy'];
    const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const targetId = `#${entry.target.id}`;
          chips.forEach(chip => {
            if (chip.getAttribute('href') === targetId) {
              chip.classList.add('active');
              chip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            } else {
              chip.classList.remove('active');
            }
          });
        }
      });
    }, { threshold: 0.25 });

    sections.forEach(sec => observer.observe(sec));

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        playCyberSound('click');
      });
    });
  }

  // Inicializar novos módulos
  initAudioFeedback();
  initQuantumCanvas();
  init3DTilt();
  initRoiCalculator();
  initCliPlayground();
  initMobileQuickBar();

  // ==========================================
  // UX 1: Spotlight Command Palette (Ctrl+K)
  // ==========================================
  const spotlightBackdrop = document.getElementById('spotlightBackdrop');
  const spotlightModal = document.getElementById('spotlightModal');
  const spotlightTriggerBtn = document.getElementById('spotlightTriggerBtn');
  const spotlightInput = document.getElementById('spotlightInput');
  const spotlightResults = document.getElementById('spotlightResults');
  const spotlightEscBtn = document.getElementById('spotlightEscBtn');

  const SPOTLIGHT_COMMANDS = [
    { title: '/start', desc: 'Inicialização de sessão com pré-flight visível e alinhamento', tag: 'Comando', icon: '🚀', action: 'copy', val: '/start' },
    { title: '/goal', desc: 'Engenharia autônoma orientada pelo protocolo GAU v5', tag: 'Comando', icon: '🎯', action: 'copy', val: '/goal' },
    { title: '/gau-ultra-super-goal', desc: 'Protocolo sequencial de estado crítico unificando 116 ideias', tag: 'Comando', icon: '⚡', action: 'copy', val: '/gau-ultra-super-goal' },
    { title: '/gau-council', desc: 'Conselhos deliberativos, debates multi-agente e torneio de código', tag: 'Comando', icon: '⚖️', action: 'copy', val: '/gau-council' },
    { title: '/gau-doctor', desc: 'Diagnóstico instantâneo de saúde do Python, SQLite WAL e Git', tag: 'Comando', icon: '🩺', action: 'copy', val: '/gau-doctor' },
    { title: '/gau-status', desc: 'Consulta de status da missão ativa, tarefas e gate formal', tag: 'Comando', icon: '📊', action: 'copy', val: '/gau-status' },
    { title: '/gau-leaderboard', desc: 'Ranking Elo calibrado de agentes, skills e modelos', tag: 'Comando', icon: '🏆', action: 'scroll', target: '#leaderboard' },
    { title: '/gau-computer-use', desc: 'Automação no Windows: janelas, digitação e cliques', tag: 'Comando', icon: '🖱️', action: 'copy', val: '/gau-computer-use' },
    { title: '/gau-screen-vision', desc: 'Captura de tela e auditoria visual multissensor', tag: 'Comando', icon: '👁️', action: 'copy', val: '/gau-screen-vision' },
    { title: 'gau match "<meta>"', desc: 'Busca semântica de ideias no terminal para meta de código', tag: 'CLI', icon: '💻', action: 'copy', val: 'gau match "<meta>"' },
    { title: 'python tools/gau_ctl.py doctor', desc: 'Validação CLI do runtime e banco SQLite local', tag: 'CLI', icon: '💻', action: 'copy', val: 'python tools/gau_ctl.py doctor' }
  ];

  const SPOTLIGHT_LAYERS = [
    { title: 'Camada 1: Governança Cognitiva & Subagentes', desc: '31 subagentes com modelo inherit e revisão cega', tag: 'Arquitetura', icon: '🧠', action: 'scroll', target: '#architecture' },
    { title: 'Camada 2: Inteligência Tri-Modal', desc: 'Precedência API ➔ Computer Layer ➔ Browser DevTools', tag: 'Arquitetura', icon: '🌐', action: 'scroll', target: '#architecture' },
    { title: 'Camada 3: Motor de Status & Evidências Físicas', desc: 'PLANNED ➔ EXECUTING ➔ EXECUTED ➔ VERIFYING ➔ VERIFIED', tag: 'Arquitetura', icon: '🛡️', action: 'scroll', target: '#architecture' },
    { title: 'Camada 4: Persistência SQLite WAL & Memória', desc: 'Barramento de eventos, snapshots e rollbacks físicos', tag: 'Arquitetura', icon: '💾', action: 'scroll', target: '#architecture' },
    { title: 'Camada 5: Resiliência Ciber-Física & Governança', desc: 'Secret Broker, travas de emergência e leases temporários', tag: 'Arquitetura', icon: '🔒', action: 'scroll', target: '#architecture' },
    { title: 'Camada 6: Intent-to-Reality Engine', desc: 'Zero-prompt runtime, cápsula de intenção e contratos', tag: 'Arquitetura', icon: '👑', action: 'scroll', target: '#architecture' }
  ];

  let currentSpotlightItems = [];
  let spotlightSelectedIndex = 0;

  function openSpotlight() {
    if (!spotlightModal || !spotlightBackdrop) return;
    if (typeof playCyberSound === 'function') {
      playCyberSound('whoosh');
    }
    spotlightBackdrop.style.display = 'block';
    spotlightModal.style.display = 'flex';
    requestAnimationFrame(() => {
      spotlightBackdrop.classList.add('open');
      spotlightModal.classList.add('open');
      if (spotlightInput) {
        spotlightInput.value = '';
        spotlightInput.focus();
      }
      renderSpotlightResults('');
    });
  }

  function closeSpotlight() {
    if (!spotlightModal || !spotlightBackdrop) return;
    if (typeof playCyberSound === 'function') {
      playCyberSound('click');
    }
    spotlightBackdrop.classList.remove('open');
    spotlightModal.classList.remove('open');
    setTimeout(() => {
      spotlightBackdrop.style.display = 'none';
      spotlightModal.style.display = 'none';
    }, 220);
  }

  function renderSpotlightResults(query) {
    if (!spotlightResults) return;
    const q = (query || '').trim().toLowerCase();

    let filteredCommands = SPOTLIGHT_COMMANDS.filter(c =>
      !q || c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)
    );

    let filteredLayers = SPOTLIGHT_LAYERS.filter(l =>
      !q || l.title.toLowerCase().includes(q) || l.desc.toLowerCase().includes(q)
    );

    let filteredAgents = AGENT_LEADERBOARD.filter(a =>
      !q || a.name.toLowerCase().includes(q) || a.specialty.toLowerCase().includes(q) || a.id.toLowerCase().includes(q)
    ).map(a => ({
      title: a.name,
      desc: a.specialty,
      tag: a.category,
      icon: '🤖',
      action: 'agent',
      agentId: a.id,
      name: a.name
    }));

    let filteredIdeas = ideas.filter(i =>
      !q || `${i.id} ${i.name} ${i.summary} ${i.category}`.toLowerCase().includes(q)
    ).map(i => ({
      title: `#${String(i.id).padStart(2, '0')} ${i.name}`,
      desc: i.summary,
      tag: i.category,
      icon: '💡',
      action: 'idea',
      ideaItem: i
    }));

    // Limites de exibição
    if (!q) {
      filteredCommands = filteredCommands.slice(0, 4);
      filteredLayers = filteredLayers.slice(0, 3);
      filteredAgents = filteredAgents.slice(0, 4);
      filteredIdeas = filteredIdeas.slice(0, 5);
    } else {
      filteredCommands = filteredCommands.slice(0, 5);
      filteredLayers = filteredLayers.slice(0, 4);
      filteredAgents = filteredAgents.slice(0, 6);
      filteredIdeas = filteredIdeas.slice(0, 10);
    }

    currentSpotlightItems = [
      ...filteredCommands,
      ...filteredLayers,
      ...filteredAgents,
      ...filteredIdeas
    ];

    spotlightSelectedIndex = 0;

    if (currentSpotlightItems.length === 0) {
      spotlightResults.innerHTML = `
        <div class="spotlight-empty">
          Nenhum resultado encontrado para <strong>"${escapeHtml(query)}"</strong>.
        </div>
      `;
      return;
    }

    let html = '';
    let globalIdx = 0;

    const appendSection = (label, list) => {
      if (!list.length) return;
      html += `<div class="spotlight-group-label">${label} (${list.length})</div>`;
      list.forEach(item => {
        const isSel = globalIdx === spotlightSelectedIndex;
        html += `
          <div class="spotlight-item ${isSel ? 'selected' : ''}" data-index="${globalIdx}">
            <div class="spotlight-item-left">
              <span class="spotlight-item-icon">${item.icon}</span>
              <div class="spotlight-item-info">
                <div class="spotlight-item-title">${escapeHtml(item.title)}</div>
                <div class="spotlight-item-desc">${escapeHtml(item.desc)}</div>
              </div>
            </div>
            <span class="spotlight-item-tag">${escapeHtml(item.tag)}</span>
          </div>
        `;
        globalIdx++;
      });
    };

    appendSection('Comandos Rápidos & CLI', filteredCommands);
    appendSection('Camadas de Arquitetura', filteredLayers);
    appendSection('Agentes Especializados', filteredAgents);
    appendSection('Ideias Operacionais GAU', filteredIdeas);

    spotlightResults.innerHTML = html;

    spotlightResults.querySelectorAll('.spotlight-item').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.dataset.index, 10);
        executeSpotlightItem(idx);
      });
      el.addEventListener('mouseenter', () => {
        spotlightSelectedIndex = parseInt(el.dataset.index, 10);
        updateSpotlightSelection();
      });
    });
  }

  function updateSpotlightSelection() {
    if (!spotlightResults) return;
    const items = spotlightResults.querySelectorAll('.spotlight-item');
    items.forEach((item, idx) => {
      if (idx === spotlightSelectedIndex) {
        item.classList.add('selected');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('selected');
      }
    });
  }

  async function executeSpotlightItem(idx) {
    const item = currentSpotlightItems[idx];
    if (!item) return;

    if (item.action === 'copy') {
      try {
        await navigator.clipboard.writeText(item.val);
        showToast(`Comando copiado: ${item.val}`);
      } catch {
        showToast(`Comando: ${item.val}`);
      }
      closeSpotlight();
    } else if (item.action === 'scroll') {
      closeSpotlight();
      const el = document.querySelector(item.target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (item.action === 'agent') {
      closeSpotlight();
      const lb = document.getElementById('leaderboard');
      if (lb) lb.scrollIntoView({ behavior: 'smooth' });
      showToast(`Agente selecionado: ${item.name}`);
    } else if (item.action === 'idea') {
      closeSpotlight();
      if (item.ideaItem) {
        openIdeaModal(item.ideaItem);
      }
    }
  }

  if (spotlightTriggerBtn) {
    spotlightTriggerBtn.addEventListener('click', openSpotlight);
  }
  if (spotlightEscBtn) {
    spotlightEscBtn.addEventListener('click', closeSpotlight);
  }
  if (spotlightBackdrop) {
    spotlightBackdrop.addEventListener('click', closeSpotlight);
  }
  if (spotlightInput) {
    spotlightInput.addEventListener('input', (e) => {
      renderSpotlightResults(e.target.value);
    });
  }

  document.addEventListener('keydown', (e) => {
    // Ctrl+K or Cmd+K
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      if (spotlightModal && spotlightModal.classList.contains('open')) {
        closeSpotlight();
      } else {
        openSpotlight();
      }
      return;
    }

    // Escape
    if (e.key === 'Escape' && spotlightModal && spotlightModal.classList.contains('open')) {
      closeSpotlight();
      return;
    }

    // Arrow navigation when spotlight is open
    if (spotlightModal && spotlightModal.classList.contains('open')) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (currentSpotlightItems.length > 0) {
          spotlightSelectedIndex = (spotlightSelectedIndex + 1) % currentSpotlightItems.length;
          updateSpotlightSelection();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (currentSpotlightItems.length > 0) {
          spotlightSelectedIndex = (spotlightSelectedIndex - 1 + currentSpotlightItems.length) % currentSpotlightItems.length;
          updateSpotlightSelection();
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        executeSpotlightItem(spotlightSelectedIndex);
      }
    }
  });

  // ==========================================
  // UX 2: Interactive Before vs After Comparison Slider
  // ==========================================
  const compSlider = document.getElementById('comparisonSlider');
  const compPaneBefore = document.getElementById('compPaneBefore');
  const compHandle = document.getElementById('compHandle');
  const compPresetBtns = document.querySelectorAll('.comp-preset-btn');

  if (compSlider && compPaneBefore && compHandle) {
    let isDraggingSlider = false;
    let currentPct = 50;

    function setSliderPosition(pct, smooth = false) {
      currentPct = Math.max(0, Math.min(100, pct));

      if (smooth) {
        compPaneBefore.style.transition = 'clip-path 0.32s cubic-bezier(0.16, 1, 0.3, 1)';
        compHandle.style.transition = 'left 0.32s cubic-bezier(0.16, 1, 0.3, 1)';
      } else {
        compPaneBefore.style.transition = 'none';
        compHandle.style.transition = 'none';
      }

      compPaneBefore.style.clipPath = `polygon(0 0, ${currentPct}% 0, ${currentPct}% 100%, 0 100%)`;
      compHandle.style.left = `clamp(20px, ${currentPct}%, calc(100% - 20px))`;
      compHandle.setAttribute('aria-valuenow', Math.round(currentPct));

      if (compPresetBtns.length > 0) {
        compPresetBtns.forEach(btn => {
          const p = parseFloat(btn.dataset.preset);
          if (Math.abs(p - currentPct) < 4) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });
      }
    }

    function handleDrag(clientX) {
      const rect = compSlider.getBoundingClientRect();
      const offsetX = clientX - rect.left;
      const pct = (offsetX / rect.width) * 100;
      setSliderPosition(pct, false);
    }

    compSlider.addEventListener('mousedown', (e) => {
      isDraggingSlider = true;
      handleDrag(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDraggingSlider) return;
      e.preventDefault();
      handleDrag(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      if (isDraggingSlider) {
        isDraggingSlider = false;
      }
    });

    compSlider.addEventListener('touchstart', (e) => {
      isDraggingSlider = true;
      if (e.touches && e.touches[0]) {
        handleDrag(e.touches[0].clientX);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDraggingSlider) return;
      if (e.touches && e.touches[0]) {
        handleDrag(e.touches[0].clientX);
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDraggingSlider = false;
    });

    compHandle.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSliderPosition(currentPct - 5, true);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setSliderPosition(currentPct + 5, true);
      }
    });

    compPresetBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const p = parseFloat(btn.dataset.preset);
        setSliderPosition(p, true);
      });
    });

    // Inicializar em 50%
    setSliderPosition(50, false);
  }

  // ==========================================
  // MEGA PACK V5 (v5.5.0) — SUPER-CAPACIDADES
  // ==========================================

  // ------------------------------------------
  // 1. Matrix Mode & Digital Rain Canvas
  // ------------------------------------------
  function initMatrixMode() {
    const canvas = document.getElementById('matrixCanvas');
    const brandLogo = document.getElementById('gauBrandLogo');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    const chars = '0123456789ABCDEF01アイウエオカキクケコサシスセソタチツテト';
    const fontSize = 14;
    let columns = Math.floor(width / fontSize);
    let drops = Array(columns).fill(1);
    let matrixAnimId = null;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = Math.floor(width / fontSize);
      drops = Array(columns).fill(1);
    }

    function drawMatrix() {
      if (!document.body.classList.contains('matrix-mode')) {
        ctx.clearRect(0, 0, width, height);
        matrixAnimId = null;
        return;
      }

      ctx.fillStyle = 'rgba(2, 4, 8, 0.08)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#00ff66';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      matrixAnimId = requestAnimationFrame(drawMatrix);
    }

    function toggleMatrixMode() {
      const active = document.body.classList.toggle('matrix-mode');
      if (active) {
        showToast('🔓 SISTEMA DE ALTO PRIVILÉGIO ATIVADO • MODO MATRIX');
        playCyberSound('terminal');
        if (!matrixAnimId) {
          ctx.clearRect(0, 0, width, height);
          drawMatrix();
        }
      } else {
        showToast('Retornando ao Modo Padrão GAU');
        playCyberSound('click');
        if (matrixAnimId) {
          cancelAnimationFrame(matrixAnimId);
          matrixAnimId = null;
          ctx.clearRect(0, 0, width, height);
        }
      }
    }

    // Secret Key Sequence: "gau"
    let keyBuffer = '';
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      keyBuffer += e.key.toLowerCase();
      if (keyBuffer.length > 5) keyBuffer = keyBuffer.slice(-5);
      if (keyBuffer.endsWith('gau')) {
        toggleMatrixMode();
      }
    });

    // Triple click on Logo
    if (brandLogo) {
      let clickCount = 0;
      let clickTimer = null;
      brandLogo.addEventListener('click', (e) => {
        clickCount++;
        if (clickCount === 3) {
          e.preventDefault();
          toggleMatrixMode();
          clickCount = 0;
        }
        clearTimeout(clickTimer);
        clickTimer = setTimeout(() => { clickCount = 0; }, 600);
      });
    }

    window.addEventListener('resize', resize);
  }

  // ------------------------------------------
  // 2. DAG Workflow Simulator
  // ------------------------------------------
  function initDagSimulator() {
    const playBtn = document.getElementById('dagPlayBtn');
    const pauseBtn = document.getElementById('dagPauseBtn');
    const resetBtn = document.getElementById('dagResetBtn');
    const stateBadge = document.getElementById('dagStateBadge');
    const scenBtns = document.querySelectorAll('.dag-scen-btn');
    const inspTitle = document.getElementById('inspTitle');
    const inspBadge = document.getElementById('inspBadge');
    const inspBody = document.getElementById('inspBody');
    const nodes = document.querySelectorAll('.dag-node');

    const edges = {
      1: document.getElementById('dagEdge1'),
      '2a': document.getElementById('dagEdge2a'),
      '2b': document.getElementById('dagEdge2b'),
      '3a': document.getElementById('dagEdge3a'),
      '3b': document.getElementById('dagEdge3b'),
      4: document.getElementById('dagEdge4')
    };

    const nodeData = {
      req: {
        name: 'gau-requirements',
        tag: 'E0 Baseline & Invariantes',
        icon: '📋',
        desc: 'Decompõe o objetivo em critérios formais e invariantes matemáticos antes da primeira linha de código.',
        rule: 'Regra Inviolável: Nenhum agente programa antes dos contratos de aceitação estarem aprovados.',
        logs: '[REQ-01] Meta decomposta em 3 contratos de interface.\n[REQ-02] Testes de fronteira e edge cases definidos.\n[REQ-03] Baseline E0 selado com hash de integridade.',
        hash: 'sha256:d8a9f01c4e7239ba8c01bfe01289cf789'
      },
      arch: {
        name: 'gau-architect',
        tag: 'Freeze Gate #107',
        icon: '🏛️',
        desc: 'Congela as assinaturas de tipos e interfaces de comunicação antes de despachar o coding swarm.',
        rule: 'Regra Inviolável: O coder não pode alterar assinaturas públicas sem reabertura formal pelo Arquiteto.',
        logs: '[ARCH-01] Interface AuthSession congelada em AST.\n[ARCH-02] Contrato de chamadas REST/gRPC bloqueado.\n[ARCH-03] Worktrees paralelas autorizadas para fork.',
        hash: 'sha256:4b1e8f9901dcefa0021b7642ea802f012'
      },
      coderA: {
        name: 'gau-implementer-a',
        tag: 'Worktree Swarm /core (#08)',
        icon: '⚡',
        desc: 'Implementação de baixo acoplamento focada exclusivamente na lógica central do microsserviço.',
        rule: 'Regra Inviolável: Operação estritamente isolada em worktree sem interferência na branch main.',
        logs: '[SWARM-A] Forking branch worktree/core-auth...\n[SWARM-A] Implementando validação de token JWT assíncrono.\n[SWARM-A] 142 linhas geradas sob tipagem estrita.',
        hash: 'sha256:7c92a54b321e09dfa4b189cc01a765089'
      },
      coderB: {
        name: 'gau-implementer-b',
        tag: 'Worktree Swarm /adapter (#08)',
        icon: '🔌',
        desc: 'Implementação paralela dos adaptadores de persistência e rate limiting sob o mesmo contrato.',
        rule: 'Regra Inviolável: Não reinventar tipos; consumir a interface congelada pelo arquiteto.',
        logs: '[SWARM-B] Forking branch worktree/rate-limiter...\n[SWARM-B] Criando Token Bucket com persistência em memória.\n[SWARM-B] 98 linhas geradas e compiladas com sucesso.',
        hash: 'sha256:2f81de9a008cba76541098ef765219084'
      },
      adv: {
        name: 'gau-adversarial',
        tag: 'Stress Probe & Red Team (#103)',
        icon: '🗡️',
        desc: 'Gera vetores sintéticos maliciosos e edge cases extremos para tentar quebrar a solução do coder.',
        rule: 'Regra Inviolável: O código só avança se resistir a injeções SQL, XSS, race conditions e ReDoS.',
        logs: '[ADV-01] Disparando 450 probes de estresse sintético...\n[ADV-02] Verificação contra bypass de cabeçalho: 0 falhas.\n[ADV-03] Auditoria de concorrência: livre de race conditions.',
        hash: 'sha256:e310c98f554019a87bcfe901289ef7601'
      },
      verif: {
        name: 'gau-verifier',
        tag: 'Verificação Cega E5 (#108)',
        icon: '🛡️',
        desc: 'Árbitro final sem viés de autoria: executa a suíte física de testes no terminal do Antigravity.',
        rule: 'Regra Inviolável: Nenhuma tarefa é concluída sem teste executado com Exit Code 0.',
        logs: '[VERIF] py -3 -m unittest discover: 24/24 PASS.\n[VERIF] Exit Code 0 verificado fisicamente no terminal.\n[VERIF] Gate de conclusão E5 selado e comprovado!',
        hash: 'sha256:9a41b2289f0102cd8bbaef8901256fe43'
      }
    };

    let simInterval = null;
    let currentStep = 0;
    let isRunning = false;

    function renderInspector(key) {
      const data = nodeData[key];
      if (!data || !inspTitle || !inspBody) return;

      inspTitle.innerHTML = `${data.icon} ${data.name}`;
      inspBadge.textContent = data.tag;
      inspBody.innerHTML = `
        <p><strong>Propósito:</strong> ${escapeHtml(data.desc)}</p>
        <p style="color: #ffbd2e; margin-top: 6px;"><strong>${escapeHtml(data.rule)}</strong></p>
        <div class="insp-terminal">${escapeHtml(data.logs)}</div>
        <div class="insp-hash-box">🔑 Selo Criptográfico: ${data.hash}</div>
      `;
      playCyberSound('click');
    }

    nodes.forEach(node => {
      node.addEventListener('click', () => {
        const key = node.dataset.node;
        renderInspector(key);
      });
    });

    function setEdgeState(edge, state) {
      if (!edge) return;
      edge.classList.remove('active', 'passed');
      if (state === 'active') edge.classList.add('active');
      if (state === 'passed') edge.classList.add('passed');
    }

    function resetSimulation() {
      if (simInterval) clearInterval(simInterval);
      isRunning = false;
      currentStep = 0;
      if (playBtn) playBtn.style.display = 'inline-flex';
      if (pauseBtn) pauseBtn.style.display = 'none';
      if (stateBadge) stateBadge.textContent = 'IDLE • Aguardando Início';

      nodes.forEach(n => n.classList.remove('active-sim', 'verified-sim'));
      Object.values(edges).forEach(e => setEdgeState(e, 'default'));
    }

    function stepSimulation() {
      currentStep++;

      if (currentStep === 1) {
        stateBadge.textContent = 'ETAPA 1/5 • gau-requirements decompondo meta';
        document.getElementById('dagNodeReq')?.classList.add('active-sim');
        renderInspector('req');
        playCyberSound('terminal');
      } else if (currentStep === 2) {
        document.getElementById('dagNodeReq')?.classList.replace('active-sim', 'verified-sim');
        setEdgeState(edges[1], 'passed');
        document.getElementById('dagNodeArch')?.classList.add('active-sim');
        setEdgeState(edges['2a'], 'active');
        setEdgeState(edges['2b'], 'active');
        stateBadge.textContent = 'ETAPA 2/5 • gau-architect congelando interfaces';
        renderInspector('arch');
        playCyberSound('terminal');
      } else if (currentStep === 3) {
        document.getElementById('dagNodeArch')?.classList.replace('active-sim', 'verified-sim');
        setEdgeState(edges['2a'], 'passed');
        setEdgeState(edges['2b'], 'passed');
        document.getElementById('dagNodeCoderA')?.classList.add('active-sim');
        document.getElementById('dagNodeCoderB')?.classList.add('active-sim');
        setEdgeState(edges['3a'], 'active');
        setEdgeState(edges['3b'], 'active');
        stateBadge.textContent = 'ETAPA 3/5 • Coding Swarm paralelo em worktrees';
        renderInspector('coderA');
        playCyberSound('terminal');
      } else if (currentStep === 4) {
        document.getElementById('dagNodeCoderA')?.classList.replace('active-sim', 'verified-sim');
        document.getElementById('dagNodeCoderB')?.classList.replace('active-sim', 'verified-sim');
        setEdgeState(edges['3a'], 'passed');
        setEdgeState(edges['3b'], 'passed');
        document.getElementById('dagNodeAdv')?.classList.add('active-sim');
        setEdgeState(edges[4], 'active');
        stateBadge.textContent = 'ETAPA 4/5 • gau-adversarial estressando inputs';
        renderInspector('adv');
        playCyberSound('terminal');
      } else if (currentStep === 5) {
        document.getElementById('dagNodeAdv')?.classList.replace('active-sim', 'verified-sim');
        setEdgeState(edges[4], 'passed');
        document.getElementById('dagNodeVerif')?.classList.add('active-sim');
        stateBadge.textContent = 'ETAPA 5/5 • gau-verifier executando suíte física';
        renderInspector('verif');
        playCyberSound('terminal');
      } else if (currentStep >= 6) {
        document.getElementById('dagNodeVerif')?.classList.replace('active-sim', 'verified-sim');
        stateBadge.textContent = '✔ CONCLUÍDO • E5 PROVA SELADA COM SUCESSO';
        clearInterval(simInterval);
        isRunning = false;
        if (playBtn) playBtn.style.display = 'inline-flex';
        if (pauseBtn) pauseBtn.style.display = 'none';
        playCyberSound('success');
        showToast('🎯 DAG Concluído com Verificação E5 (Exit Code 0)!');
      }
    }

    if (playBtn) {
      playBtn.addEventListener('click', () => {
        if (currentStep >= 6) resetSimulation();
        isRunning = true;
        playBtn.style.display = 'none';
        if (pauseBtn) pauseBtn.style.display = 'inline-flex';
        stepSimulation();
        simInterval = setInterval(stepSimulation, 1500);
      });
    }

    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => {
        clearInterval(simInterval);
        isRunning = false;
        pauseBtn.style.display = 'none';
        if (playBtn) playBtn.style.display = 'inline-flex';
        stateBadge.textContent = 'PAUSADO';
        playCyberSound('click');
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        resetSimulation();
        playCyberSound('click');
      });
    }

    scenBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        scenBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        resetSimulation();
        showToast(`Cenário DAG carregado: ${btn.textContent.trim()}`);
        playCyberSound('click');
      });
    });
  }

  // ------------------------------------------
  // 3. Model Tournament Arena (#03 & #45)
  // ------------------------------------------
  // 3. Model Tournament Arena (#03 & #45)
  // ------------------------------------------
  function initModelArena() {
    const fightBtn = document.getElementById('startDuelBtn');
    const challengeSelect = document.getElementById('arenaChallengeSelect');
    const fighterASelect = document.getElementById('fighterASelect');
    const fighterBSelect = document.getElementById('fighterBSelect');

    const panelA = document.getElementById('fighterPanelA');
    const panelB = document.getElementById('fighterPanelB');
    const platformA = document.getElementById('fighterPlatformA');
    const platformB = document.getElementById('fighterPlatformB');
    const nameA = document.getElementById('fighterNameA');
    const nameB = document.getElementById('fighterNameB');
    const eloA = document.getElementById('fighterEloA');
    const eloB = document.getElementById('fighterEloB');

    const codeA = document.getElementById('fighterCodeA');
    const codeB = document.getElementById('fighterCodeB');
    const statusA = document.getElementById('fighterStatusA');
    const statusB = document.getElementById('fighterStatusB');
    const speedA = document.getElementById('fighterSpeedA');
    const speedB = document.getElementById('fighterSpeedB');
    const testsA = document.getElementById('fighterTestsA');
    const testsB = document.getElementById('fighterTestsB');
    const compA = document.getElementById('fighterCompA');
    const compB = document.getElementById('fighterCompB');
    const verdictBox = document.getElementById('arenaVerdictBox');
    const verdictTitle = document.getElementById('verdictTitle');
    const verdictReason = document.getElementById('verdictReason');
    const verdictEloBadges = document.getElementById('verdictEloBadges');

    if (!fightBtn || !codeA || !codeB) return;

    // Comprehensive Registry of Current AI Models by Platform
    const MODELS_REGISTRY = {
      'claude-fable-5-1': {
        name: 'Claude Fable 5.1',
        platform: 'Anthropic',
        platClass: 'plat-anthropic',
        elo: 1925,
        speed: '140 tok/s',
        stepSize: 9,
        comp: 'O(V+E) Surgical',
        thinking: `/* [Claude Fable 5.1 • Agentic Knowledge Architecture]
 * • Zero-shortcut root-cause invariant analysis.
 * • Cache read efficiency optimized (-75% cost).
 * • Proving acyclic Kahn ordering with isolated memory state.
 */\n\n`
      },
      'claude-mythos-5-1': {
        name: 'Claude Mythos 5.1',
        platform: 'Anthropic',
        platClass: 'plat-anthropic',
        elo: 1915,
        speed: '135 tok/s',
        stepSize: 9,
        comp: 'O(V+E) Unrestricted',
        thinking: `/* [Claude Mythos 5.1 • Unrestricted Research & RedTeam]
 * • Deep AST inspection without guardrail latency.
 */\n\n`
      },
      'gpt-6-astra': {
        name: 'GPT-6 Astra',
        platform: 'OpenAI',
        platClass: 'plat-openai',
        elo: 1920,
        speed: '150 tok/s',
        stepSize: 10,
        comp: 'O(V+E) Autonomous',
        thinking: `# [OpenAI GPT-6 Astra • Autonomous OS & Agentic Runtime]
# 1. Native software control & environment DAG verification
# 2. Mathematical invariant: Kahn queue BFS visits exactly N nodes
# 3. Stack-safe zero-overhead execution confirmed\n\n`
      },
      'gemini-3-8-flash': {
        name: 'Gemini 3.8 Flash',
        platform: 'Google DeepMind',
        platClass: 'plat-google',
        elo: 1910,
        speed: '240 tok/s',
        stepSize: 16,
        comp: 'O(V+E) UltraStream',
        thinking: `# [Gemini 3.8 Flash • Agentic Workhorse 240 tok/s]
# Context compiled in 14ms with Agentic Video & Code understanding.
# In-degree queue initialization completed O(V).\n\n`
      },
      'gemini-3-8-flash-cyber': {
        name: 'Gemini 3.8 Cyber',
        platform: 'Google DeepMind',
        platClass: 'plat-google',
        elo: 1905,
        speed: '210 tok/s',
        stepSize: 14,
        comp: 'O(V+E) Hardened',
        thinking: `# [Gemini 3.8 Flash Cyber • Zero-Day Hardened Sandbox]
# AST vulnerability check: zero tainted input patterns detected.\n\n`
      },
      'deepseek-v4-flash': {
        name: 'DeepSeek V4.1-Flash',
        platform: 'DeepSeek',
        platClass: 'plat-deepseek',
        elo: 1895,
        speed: '190 tok/s',
        stepSize: 12,
        comp: 'O(V+E) Manifold MoE',
        thinking: `<think>
1. Architecture: Manifold-Constrained Hyper-Connections (MCHC).
2. Optimization: KV Cache footprint minimized for 1M context.
3. Kahn algorithm logic: in_degree map + deque BFS popleft.
4. Correctness: returns visited_count != num_nodes.
</think>\n\n`
      },
      'qwen-3-8-max': {
        name: 'Qwen 3.8-Max (2.4T)',
        platform: 'Alibaba',
        platClass: 'plat-alibaba',
        elo: 1890,
        speed: '130 tok/s',
        stepSize: 9,
        comp: 'O(V+E) 2.4T MoE',
        thinking: `# [Alibaba Qwen 3.8-Max 0902 • 2.4T Sparse MoE Architecture]
# Global topological traversal verified across full AST graph.
# Linear O(V+E) bounds enforced.\n\n`
      },
      'qwen-3-8-omni-flash': {
        name: 'Qwen 3.8-Omni',
        platform: 'Alibaba',
        platClass: 'plat-alibaba',
        elo: 1840,
        speed: '200 tok/s',
        stepSize: 13,
        comp: 'O(V+E) Realtime',
        thinking: `# [Qwen 3.8-Omni-Flash • Realtime Multimodal Stream]\n\n`
      },
      'grok-4-6': {
        name: 'Grok 4.6 (Colleague)',
        platform: 'xAI',
        platClass: 'plat-xai',
        elo: 1885,
        speed: '135 tok/s',
        stepSize: 9,
        comp: 'O(V+E) Colossus CoT',
        thinking: `// [xAI Grok 4.6 • Digital Colleague Reflection]
// Invariant Proof: DAG exists <=> topological ordering covers all V vertices.
// Using double-ended queue for optimal O(1) removals.
// Verified against cycloid edge cases.\n\n`
      },
      'claude-3-7-sonnet': {
        name: 'Claude 3.7 Sonnet',
        platform: 'Anthropic',
        platClass: 'plat-anthropic',
        elo: 1865,
        speed: '95 tok/s',
        stepSize: 7,
        comp: 'O(V+E) Formal',
        thinking: `/* [Claude 3.7 Sonnet • Hybrid Thinking Mode: Ativo]
 * • Invariante: Grafo acíclico direcionado sse ordenação topológica cobre todos os vértices.
 * • Tipagem forte, tratamento de nós isolados e complexidade assintótica O(V + E).
 */\n\n`
      },
      'claude-3-5-sonnet': {
        name: 'Claude 3.5 Sonnet v2',
        platform: 'Anthropic',
        platClass: 'plat-anthropic',
        elo: 1820,
        speed: '115 tok/s',
        stepSize: 8,
        comp: 'O(V+E)',
        thinking: `// [Claude 3.5 Sonnet • Fast CoT Pipeline]\n// Validação de contratos e tratamento de grafos desconexos.\n\n`
      },
      'claude-3-5-haiku': {
        name: 'Claude 3.5 Haiku',
        platform: 'Anthropic',
        platClass: 'plat-anthropic',
        elo: 1730,
        speed: '175 tok/s',
        stepSize: 12,
        comp: 'O(V+E) Light',
        thinking: `// [Claude 3.5 Haiku • Instant Response]\n\n`
      },
      'o3-mini': {
        name: 'o3-mini (High)',
        platform: 'OpenAI',
        platClass: 'plat-openai',
        elo: 1845,
        speed: '145 tok/s',
        stepSize: 10,
        comp: 'O(V+E) STEM',
        thinking: `# [o3-mini • High Reasoning CoT]
# 1. Zero-indegree queue initialized O(V)
# 2. Invariant: BFS visits exactly N nodes iff acyclic
# 3. Verified zero recursion overhead\n\n`
      },
      'o1': {
        name: 'o1 (Deep Reasoning)',
        platform: 'OpenAI',
        platClass: 'plat-openai',
        elo: 1840,
        speed: '80 tok/s',
        stepSize: 6,
        comp: 'O(V+E) Proved',
        thinking: `# [OpenAI o1 • Deep Logical Proof]
# Proof obligation: Cycle presence <==> visited_count < num_nodes
# Inductive step verified across all edge cases.\n\n`
      },
      'gpt-4o': {
        name: 'GPT-4o (Omni)',
        platform: 'OpenAI',
        platClass: 'plat-openai',
        elo: 1790,
        speed: '135 tok/s',
        stepSize: 9,
        comp: 'O(V+E)',
        thinking: `# [GPT-4o • Direct Production Implementation]\n\n`
      },
      'gemini-2-pro': {
        name: 'Gemini 2.0 Pro Exp',
        platform: 'Google DeepMind',
        platClass: 'plat-google',
        elo: 1855,
        speed: '120 tok/s',
        stepSize: 8,
        comp: 'O(V+E) Scaled',
        thinking: `# [Gemini 2.0 Pro • Deep Reasoning Engine]
# Multimodal & AST context compiled.
# Topological sorting with zero memory leakage.\n\n`
      },
      'gemini-2-flash': {
        name: 'Gemini 2.0 Flash',
        platform: 'Google DeepMind',
        platClass: 'plat-google',
        elo: 1775,
        speed: '220 tok/s',
        stepSize: 15,
        comp: 'O(V+E) Blazing',
        thinking: `# [Gemini 2.0 Flash • 220 tok/s Stream]\n\n`
      },
      'gemini-1-5-pro': {
        name: 'Gemini 1.5 Pro',
        platform: 'Google DeepMind',
        platClass: 'plat-google',
        elo: 1760,
        speed: '75 tok/s',
        stepSize: 6,
        comp: 'O(V+E)',
        thinking: `# [Gemini 1.5 Pro • 2M Context Buffer]\n\n`
      },
      'deepseek-r1': {
        name: 'DeepSeek-R1',
        platform: 'DeepSeek',
        platClass: 'plat-deepseek',
        elo: 1850,
        speed: '85 tok/s',
        stepSize: 6,
        comp: 'O(V+E) CoT',
        thinking: `<think>
1. Compreensão do problema: Kahn cycle detection.
2. Contrato: in_degree array + queue BFS.
3. Se total_visitado < N => existe ciclo direcionado.
4. Complexidade espacial O(V+E), sem estouro de pilha.
</think>\n\n`
      },
      'deepseek-v3': {
        name: 'DeepSeek-V3 (671B)',
        platform: 'DeepSeek',
        platClass: 'plat-deepseek',
        elo: 1785,
        speed: '140 tok/s',
        stepSize: 10,
        comp: 'O(V+E) MoE',
        thinking: `# [DeepSeek-V3 671B MoE Architecture]\n\n`
      },
      'grok-3': {
        name: 'Grok 3 (Reasoning)',
        platform: 'xAI',
        platClass: 'plat-xai',
        elo: 1860,
        speed: '110 tok/s',
        stepSize: 8,
        comp: 'O(V+E) Frontier',
        thinking: `// [xAI Grok 3 • Frontier STEM Mode]
// Direct topological invariants with edge-case guardrails.\n\n`
      },
      'grok-2': {
        name: 'Grok 2',
        platform: 'xAI',
        platClass: 'plat-xai',
        elo: 1745,
        speed: '95 tok/s',
        stepSize: 7,
        comp: 'O(V+E)',
        thinking: `// [xAI Grok 2]\n\n`
      },
      'qwen-2-5-coder': {
        name: 'Qwen 2.5 Coder 32B',
        platform: 'Alibaba',
        platClass: 'plat-alibaba',
        elo: 1750,
        speed: '120 tok/s',
        stepSize: 9,
        comp: 'O(V+E) AST',
        thinking: `# [Qwen 2.5 Coder • Open Coding Champion]\n\n`
      },
      'llama-3-3-70b': {
        name: 'Llama 3.3 70B',
        platform: 'Meta',
        platClass: 'plat-meta',
        elo: 1740,
        speed: '90 tok/s',
        stepSize: 7,
        comp: 'O(V+E)',
        thinking: `# [Meta Llama 3.3 70B Instruct • Open Weights]\n\n`
      },
      'mistral-large-2': {
        name: 'Mistral Large 2',
        platform: 'Mistral AI',
        platClass: 'plat-mistral',
        elo: 1735,
        speed: '105 tok/s',
        stepSize: 8,
        comp: 'O(V+E)',
        thinking: `# [Mistral Large 2 • Reasoning Model]\n\n`
      }
    };

    // Code Snippet Implementations by Challenge
    const CHALLENGE_SNIPPETS = {
      kahn: {
        optimal: (thinking) => `${thinking}def detect_cycle_kahn(num_nodes: int, edges: list[tuple[int, int]]) -> bool:
    in_degree = [0] * num_nodes
    adj = collections.defaultdict(list)
    for u, v in edges:
        adj[u].append(v)
        in_degree[v] += 1
    
    queue = collections.deque([i for i in range(num_nodes) if in_degree[i] == 0])
    visited_count = 0
    
    while queue:
        curr = queue.popleft()
        visited_count += 1
        for neighbor in adj[curr]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
                
    return visited_count != num_nodes  # True if cycle detected O(V+E)`,
        alternative: (thinking) => `${thinking}def detect_cycle_dfs(num_nodes: int, edges: list[tuple[int, int]]) -> bool:
    WHITE, GRAY, BLACK = 0, 1, 2
    state = [WHITE] * num_nodes
    graph = collections.defaultdict(list)
    for u, v in edges:
        graph[u].append(v)
        
    def dfs(u):
        state[u] = GRAY
        for v in graph[u]:
            if state[v] == GRAY:
                return True
            if state[v] == WHITE and dfs(v):
                return True
        state[u] = BLACK
        return False
        
    return any(state[i] == WHITE and dfs(i) for i in range(num_nodes))`
      },
      tokenbucket: {
        optimal: (thinking) => `${thinking}class AsyncTokenBucket:
    def __init__(self, capacity: int, refill_rate: float):
        self.capacity = capacity
        self.refill_rate = refill_rate
        self.tokens = float(capacity)
        self.last_update = time.monotonic()
        self._lock = asyncio.Lock()

    async def consume(self, amount: int = 1) -> bool:
        async with self._lock:
            now = time.monotonic()
            elapsed = now - self.last_update
            self.tokens = min(self.capacity, self.tokens + elapsed * self.refill_rate)
            self.last_update = now
            if self.tokens >= amount:
                self.tokens -= amount
                return True
            return False`,
        alternative: (thinking) => `${thinking}class RateLimiter:
    def __init__(self, limit: int, window: int):
        self.limit = limit
        self.window = window
        self.requests = []

    def allow_request(self) -> bool:
        now = time.time()
        self.requests = [t for t in self.requests if now - t < self.window]
        if len(self.requests) < self.limit:
            self.requests.append(now)
            return True
        return False`
      },
      owasp: {
        optimal: (thinking) => `${thinking}def sanitize_owasp_input(raw: str, max_len: int = 256) -> str:
    if not isinstance(raw, str):
        raise TypeError("Input must be string")
    trimmed = raw.strip()[:max_len]
    # Neutralize HTML/XSS entities
    sanitized = html.escape(trimmed, quote=True)
    # Reject active SQL injection signatures
    if re.search(r'(--|;|/\\*|union\\s+select)', sanitized, re.I):
        raise SecurityValidationError("Potential SQLi pattern rejected")
    return sanitized`,
        alternative: (thinking) => `${thinking}def clean_input(user_string: str) -> str:
    cleaned = user_string.replace("<script>", "").replace("</script>", "")
    cleaned = re.sub(r"[;'\"\\\\]", "", cleaned)
    return cleaned.strip()`
      }
    };

    // Synchronize UI headers when user changes dropdown selects
    function updateFighterHeader(selectEl, platformEl, nameEl, eloEl) {
      const key = selectEl.value;
      const meta = MODELS_REGISTRY[key] || {
        name: key,
        platform: 'IA',
        platClass: 'plat-anthropic',
        elo: 1750
      };
      if (platformEl) {
        platformEl.textContent = meta.platform;
        platformEl.className = 'fighter-platform-badge ' + meta.platClass;
      }
      if (nameEl) nameEl.textContent = meta.name;
      if (eloEl) eloEl.textContent = `${meta.elo} Elo`;
    }

    fighterASelect.addEventListener('change', () => {
      updateFighterHeader(fighterASelect, platformA, nameA, eloA);
      playCyberSound('click');
    });

    fighterBSelect.addEventListener('change', () => {
      updateFighterHeader(fighterBSelect, platformB, nameB, eloB);
      playCyberSound('click');
    });

    // Initial sync
    updateFighterHeader(fighterASelect, platformA, nameA, eloA);
    updateFighterHeader(fighterBSelect, platformB, nameB, eloB);

    let duelTimer = null;

    fightBtn.addEventListener('click', () => {
      const challengeKey = challengeSelect.value;
      const keyA = fighterASelect.value;
      const keyB = fighterBSelect.value;

      const metaA = MODELS_REGISTRY[keyA] || MODELS_REGISTRY['claude-fable-5-1'];
      const metaB = MODELS_REGISTRY[keyB] || MODELS_REGISTRY['gpt-6-astra'];

      if (duelTimer) clearInterval(duelTimer);
      verdictBox.style.display = 'none';
      panelA.className = 'fighter-panel';
      panelB.className = 'fighter-panel';

      // Decide optimal vs alternative implementation based on relative Elo
      const isAWinner = metaA.elo >= metaB.elo;
      const snippetA = isAWinner
        ? CHALLENGE_SNIPPETS[challengeKey].optimal(metaA.thinking)
        : CHALLENGE_SNIPPETS[challengeKey].alternative(metaA.thinking);
      const snippetB = !isAWinner
        ? CHALLENGE_SNIPPETS[challengeKey].optimal(metaB.thinking)
        : CHALLENGE_SNIPPETS[challengeKey].alternative(metaB.thinking);

      statusA.className = 'fighter-status-badge typing';
      statusA.textContent = metaA.thinking.includes('think') || metaA.thinking.includes('Thinking') ? 'Raciocinando CoT...' : 'Digitando...';
      statusB.className = 'fighter-status-badge typing';
      statusB.textContent = metaB.thinking.includes('think') || metaB.thinking.includes('Thinking') ? 'Raciocinando CoT...' : 'Digitando...';

      speedA.textContent = metaA.speed;
      speedB.textContent = metaB.speed;
      testsA.textContent = '0/3';
      testsB.textContent = '0/3';
      compA.textContent = metaA.comp;
      compB.textContent = metaB.comp;

      codeA.textContent = '';
      codeB.textContent = '';

      let idxA = 0;
      let idxB = 0;
      playCyberSound('terminal');

      duelTimer = setInterval(() => {
        idxA += metaA.stepSize || 8;
        idxB += metaB.stepSize || 8;

        codeA.textContent = snippetA.slice(0, idxA);
        codeB.textContent = snippetB.slice(0, idxB);

        if (idxA >= snippetA.length && idxB >= snippetB.length) {
          clearInterval(duelTimer);
          codeA.textContent = snippetA;
          codeB.textContent = snippetB;

          // Judge evaluation scores
          const scoreA = isAWinner ? '3/3 PASS' : (challengeKey === 'owasp' ? '2/3 PASS (Bypass)' : '3/3 PASS (Maior Latência)');
          const scoreB = !isAWinner ? '3/3 PASS' : (challengeKey === 'owasp' ? '2/3 PASS (Bypass)' : '3/3 PASS (Maior Latência)');

          testsA.textContent = scoreA;
          testsB.textContent = scoreB;

          // Calculate genuine Elo delta based on standard formula
          const expectedA = 1 / (1 + Math.pow(10, (metaB.elo - metaA.elo) / 400));
          const deltaA = Math.round(32 * ((isAWinner ? 1 : 0) - expectedA));
          const deltaB = -deltaA;

          const newEloA = metaA.elo + deltaA;
          const newEloB = metaB.elo + deltaB;

          if (isAWinner) {
            statusA.className = 'fighter-status-badge winner';
            statusA.textContent = 'Vencedor 🏆';
            panelA.classList.add('winner-card');

            statusB.className = 'fighter-status-badge';
            statusB.textContent = 'Finalizado';
            panelB.classList.add('loser-card');

            verdictTitle.textContent = `Vitória Decisiva: ${metaA.name} (${metaA.platform})`;
          } else {
            statusB.className = 'fighter-status-badge winner';
            statusB.textContent = 'Vencedor 🏆';
            panelB.classList.add('winner-card');

            statusA.className = 'fighter-status-badge';
            statusA.textContent = 'Finalizado';
            panelA.classList.add('loser-card');

            verdictTitle.textContent = `Vitória Decisiva: ${metaB.name} (${metaB.platform})`;
          }

          verdictBox.style.display = 'flex';

          // Tailored reasoning explanation
          if (challengeKey === 'owasp') {
            verdictReason.textContent = isAWinner
              ? `${metaA.name} neutralizou entidades HTML com html.escape e ativou regex de rejeição a injeções SQL, enquanto ${metaB.name} utilizou replace simples suscetível a bypass por tags aninhadas.`
              : `${metaB.name} aplicou escape estrito de entidades e sanitização semântica contra vetores SQLi, superando a implementação de ${metaA.name}.`;
          } else if (challengeKey === 'tokenbucket') {
            verdictReason.textContent = isAWinner
              ? `${metaA.name} garantiu concorrência segura usando asyncio.Lock e relógio monotônico, prevenindo race conditions sob alta carga de requisições simultâneas.`
              : `${metaB.name} demonstrou controle assíncrono superior com bloqueio mutex atômico e recalibração temporal contínua.`;
          } else {
            verdictReason.textContent = isAWinner
              ? `${metaA.name} implementou o algoritmo ideal de Kahn com fila BFS O(V+E) e consumo constante de memória, prevenindo o risco de estouro de pilha por recursão profunda presente no DFS.`
              : `${metaB.name} comprovou invariantes Kahn com menor footprint de memória e ordenação estrita sem overhead recursivo.`;
          }

          verdictEloBadges.innerHTML = `
            <span class="elo-pill ${deltaA >= 0 ? 'gain' : 'loss'}">${metaA.name}: ${deltaA >= 0 ? '+' : ''}${deltaA} Elo (Novo: ${newEloA})</span>
            <span class="elo-pill ${deltaB >= 0 ? 'gain' : 'loss'}">${metaB.name}: ${deltaB >= 0 ? '+' : ''}${deltaB} Elo (Novo: ${newEloB})</span>
          `;

          playCyberSound('success');
          showToast(`⚔️ Duelo Finalizado! ${isAWinner ? metaA.name : metaB.name} venceu o desafio.`);
        }
      }, 35);
    });
  }

  // ------------------------------------------
  // 4. Squad Builder (Montador de Esquadrão)
  // ------------------------------------------
  function initSquadBuilder() {
    const archetypes = document.querySelectorAll('.archetype-card');
    const archetypeName = document.getElementById('rosterArchetypeName');
    const hoursSaved = document.getElementById('rosterHoursSaved');
    const chipsWrap = document.getElementById('rosterChipsWrap');
    const cliCode = document.getElementById('squadCliCode');
    const copyBtn = document.getElementById('squadCopyBtn');

    if (!archetypes.length || !chipsWrap) return;

    const archetypeRosters = {
      web: {
        title: 'Web Fullstack & APIs',
        hours: '~140 horas/mês',
        cmd: '/gau-goal "Construir arquitetura Web Fullstack com contratos de API, autenticação segura e testes E5"',
        agents: [
          { name: 'gau-orchestrator', role: 'Coordenação DAG Kahn', icon: '🧠' },
          { name: 'gau-requirements', role: 'Baseline & Tipos', icon: '📋' },
          { name: 'gau-architect', role: 'Freeze Gate #107', icon: '🏛️' },
          { name: 'gau-implementer', role: 'Coding Swarm Worktrees', icon: '⚡' },
          { name: 'gau-security', role: 'Sanitização OWASP', icon: '🛡️' },
          { name: 'gau-verifier', role: 'Testes Físicos Exit 0', icon: '✔' }
        ]
      },
      win: {
        title: 'Automação Windows & CLIs',
        hours: '~95 horas/mês',
        cmd: '/gau-goal "Automatizar rotinas de arquivos e processos locais no Windows com guardrails de segurança A1"',
        agents: [
          { name: 'gau-computer-layer', role: 'Scripts PowerShell & CMD', icon: '🖥️' },
          { name: 'gau-orchestrator', role: 'Orquestração Local', icon: '🧠' },
          { name: 'gau-evidence', role: 'Hashes SHA-256 e Logs', icon: '💾' },
          { name: 'gau-verifier', role: 'Validação de Execução', icon: '✔' }
        ]
      },
      sec: {
        title: 'Segurança & Pentest',
        hours: '~180 horas/mês',
        cmd: '/gau-goal "Executar varredura de vulnerabilidades OWASP Top 10, caça a segredos e quarentena de falhas"',
        agents: [
          { name: 'gau-security', role: 'Auditoria de Permissões', icon: '🛡️' },
          { name: 'gau-adversarial', role: 'Synthetic Adversary #103', icon: '🗡️' },
          { name: 'gau-inquisitor', role: 'Testes Metamórficos #111', icon: '🔬' },
          { name: 'gau-secret-broker', role: 'Vault Cifrado #105', icon: '🔒' },
          { name: 'gau-verifier', role: 'Prova de Imunidade E5', icon: '✔' }
        ]
      },
      db: {
        title: 'Banco de Dados & WAL',
        hours: '~110 horas/mês',
        cmd: '/gau-goal "Configurar banco SQLite em modo WAL, criar migrações seguras e auditar ausência de deadlocks"',
        agents: [
          { name: 'gau-database', role: 'Schemas e Migrations', icon: '🗄️' },
          { name: 'gau-architect', role: 'Modelagem de Entidades', icon: '🏛️' },
          { name: 'gau-performance', role: 'Benchmarking e Índices', icon: '⚡' },
          { name: 'gau-verifier', role: 'Integridade Referencial', icon: '✔' }
        ]
      }
    };

    function renderArchetype(key) {
      const data = archetypeRosters[key];
      if (!data) return;

      if (archetypeName) archetypeName.textContent = data.title;
      if (hoursSaved) hoursSaved.textContent = `⏱️ Economia Estimada: ${data.hours}`;
      if (cliCode) cliCode.textContent = data.cmd;
      if (copyBtn) copyBtn.dataset.copy = data.cmd;

      chipsWrap.innerHTML = data.agents.map(a => `
        <div class="roster-chip">
          <span class="roster-chip-icon">${a.icon}</span>
          <div>
            <div class="roster-chip-name">${escapeHtml(a.name)}</div>
            <div class="roster-chip-role">${escapeHtml(a.role)}</div>
          </div>
        </div>
      `).join('');
    }

    archetypes.forEach(card => {
      card.addEventListener('click', () => {
        archetypes.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const arch = card.dataset.archetype;
        renderArchetype(arch);
        playCyberSound('click');
      });
    });

    renderArchetype('web');
  }

  // ------------------------------------------
  // 5. Cockpit HUD & Wave Oscilloscope (#120)
  // ------------------------------------------
  function initCockpitHud() {
    const toggleBtn = document.getElementById('cockpitToggleBtn');
    const closeBtn = document.getElementById('cockpitCloseBtn');
    const backdrop = document.getElementById('cockpitBackdrop');
    const modal = document.getElementById('cockpitModal');
    const canvas = document.getElementById('cockpitWaveCanvas');
    const stream = document.getElementById('cockpitEventsStream');
    const clearBtn = document.getElementById('cockpitClearEvents');

    if (!toggleBtn || !modal || !backdrop) return;

    let waveCtx = canvas ? canvas.getContext('2d') : null;
    let waveAnimId = null;
    let waveOffset = 0;
    let eventStreamInterval = null;

    function drawWave() {
      if (!modal || modal.style.display === 'none' || !waveCtx) return;
      const w = canvas.width;
      const h = canvas.height;

      waveCtx.fillStyle = 'rgba(6, 8, 16, 0.2)';
      waveCtx.fillRect(0, 0, w, h);

      waveCtx.beginPath();
      waveCtx.strokeStyle = '#62e6ff';
      waveCtx.lineWidth = 1.8;

      for (let x = 0; x < w; x++) {
        const rad = (x + waveOffset) * 0.04;
        let y = h / 2 + Math.sin(rad) * 18;
        // Jitter simulation
        if (Math.sin(rad * 0.5) > 0.85) {
          y += (Math.random() - 0.5) * 22;
        }
        if (x === 0) waveCtx.moveTo(x, y);
        else waveCtx.lineTo(x, y);
      }
      waveCtx.stroke();
      waveOffset += 2;
      waveAnimId = requestAnimationFrame(drawWave);
    }

    const mockEvents = [
      'EVENT_SPINE: SQLite WAL mode confirmed (.gau/events.sqlite3)',
      'CAPABILITY_LEASE: Lease granted for gau-security (TTL: 300s)',
      'WORKTREE_SWARM: Branch "swarm-feature-auth" isolated from main',
      'SECRET_BROKER: Secure token emitted SEC_TOKEN_819...',
      'PROOF_CARRIER: SHA-256 seal computed: a7f8c24b9102...',
      'METAMORPHIC_PROBE: 120 input mutations tested with 0 invariants broken',
      'GATE_VERIFIED: Exit code 0 attest verified in terminal'
    ];

    function appendEvent() {
      if (!stream || modal.style.display === 'none') return;
      const line = document.createElement('div');
      const time = new Date().toTimeString().split(' ')[0];
      const ev = mockEvents[Math.floor(Math.random() * mockEvents.length)];
      line.textContent = `[${time}] ${ev}`;
      stream.appendChild(line);
      stream.scrollTop = stream.scrollHeight;
    }

    function openCockpit() {
      backdrop.style.display = 'block';
      modal.style.display = 'flex';
      playCyberSound('whoosh');
      drawWave();
      if (!eventStreamInterval) {
        eventStreamInterval = setInterval(appendEvent, 2200);
      }
    }

    function closeCockpit() {
      backdrop.style.display = 'none';
      modal.style.display = 'none';
      if (waveAnimId) cancelAnimationFrame(waveAnimId);
      if (eventStreamInterval) {
        clearInterval(eventStreamInterval);
        eventStreamInterval = null;
      }
      playCyberSound('click');
    }

    toggleBtn.addEventListener('click', openCockpit);
    closeBtn.addEventListener('click', closeCockpit);
    backdrop.addEventListener('click', closeCockpit);

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (stream) stream.innerHTML = '';
        playCyberSound('click');
      });
    }
  }

  // ------------------------------------------
  // 6. 60s Guided Cinematic Presentation Tour
  // ------------------------------------------
  function initGuidedTour() {
    const startTopBtn = document.getElementById('startTourBtn');
    const startHeroBtn = document.getElementById('heroTourBtn');
    const backdrop = document.getElementById('tourBackdrop');
    const card = document.getElementById('tourCard');
    const closeBtn = document.getElementById('tourCloseBtn');
    const prevBtn = document.getElementById('tourPrevBtn');
    const nextBtn = document.getElementById('tourNextBtn');
    const playPauseBtn = document.getElementById('tourPlayPauseBtn');
    const stepBadge = document.getElementById('tourStepBadge');
    const stepTitle = document.getElementById('tourStepTitle');
    const stepText = document.getElementById('tourStepText');
    const progressBar = document.getElementById('tourProgressBar');

    if (!card || !backdrop) return;

    const tourSteps = [
      {
        target: '#top',
        title: '1. O que é o GAU v5?',
        text: 'O GAU v5 transforma o comando nativo /goal do Antigravity em uma usina de engenharia autônoma orientada por evidências físicas, zero falsos "Done" e orçamentos rígidos.'
      },
      {
        target: '#architecture',
        title: '2. Arquitetura Cognitiva em 6 Camadas',
        text: 'Topologia tri-modal completa: Governança de Subagentes, Raciocínio Concorrente, Memória SQLite WAL, Resiliência Física e o motor Intent-to-Reality.'
      },
      {
        target: '#dagSimulatorSection',
        title: '3. Grafo DAG Kahn & Coding Swarm',
        text: 'Nenhum coder colide: tarefas são compiladas em DAG sem ciclos, as interfaces são congeladas e coders trabalham em worktrees isoladas do Git.'
      },
      {
        target: '#comercial',
        title: '4. Demonstração em Vídeo Comercial (38s)',
        text: 'Uma visão cinematográfica condensada de como a inteligência do GAU opera em tempo real dentro do ecossistema do Google Antigravity.'
      },
      {
        target: '#roi',
        title: '5. Calculadora de Impacto Cognitivo',
        text: 'Cada bug eliminado antes da main salva em média 3.5 horas de debug e poupa milhões de tokens desperdiçados em loops infinitos.'
      },
      {
        target: '#modelArenaSection',
        title: '6. Arena de Duelo & Leaderboard Elo',
        text: 'Os modelos de IA duelam sob a mesma suíte de testes unitários. O árbitro formal pontua eficiência assintótica e ajusta o rating Elo ao vivo.'
      },
      {
        target: '#ideas',
        title: '7. O Atlas das 69 Ideias Aprovadas',
        text: 'Do Roteamento Adaptativo ao Tribunal de Evidências, 69 mecanismos cognitivos prontos para consulta com regras invioláveis de governança.'
      },
      {
        target: '#deploy',
        title: '8. Instalação e Execução Imediata',
        text: 'Pacote Master com 9.087 arquivos pronto para instalação no seu workspace local. Um comando ativa o GAU e preserva seu /goal nativo.'
      }
    ];

    let currentStep = 0;
    let tourTimer = null;
    let isAutoPlaying = true;

    function showStep(idx) {
      currentStep = Math.max(0, Math.min(tourSteps.length - 1, idx));
      const step = tourSteps[currentStep];

      stepBadge.textContent = `${currentStep + 1} de ${tourSteps.length}`;
      stepTitle.textContent = step.title;
      stepText.textContent = step.text;
      progressBar.style.width = `${((currentStep + 1) / tourSteps.length) * 100}%`;

      const targetEl = document.querySelector(step.target);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      playCyberSound('switch');
    }

    function nextStep() {
      if (currentStep < tourSteps.length - 1) {
        showStep(currentStep + 1);
      } else {
        stopTour();
        showToast('🎬 Apresentação do GAU v5 Concluída!');
      }
    }

    function prevStep() {
      if (currentStep > 0) {
        showStep(currentStep - 1);
      }
    }

    function startAutoTimer() {
      if (tourTimer) clearInterval(tourTimer);
      if (isAutoPlaying) {
        tourTimer = setInterval(() => {
          nextStep();
        }, 7500);
      }
    }

    function startTour() {
      backdrop.style.display = 'block';
      card.style.display = 'flex';
      isAutoPlaying = true;
      playPauseBtn.textContent = '⏸ Pausar';
      showStep(0);
      startAutoTimer();
      playCyberSound('whoosh');
    }

    function stopTour() {
      backdrop.style.display = 'none';
      card.style.display = 'none';
      if (tourTimer) clearInterval(tourTimer);
      playCyberSound('click');
    }

    if (startTopBtn) startTopBtn.addEventListener('click', startTour);
    if (startHeroBtn) startHeroBtn.addEventListener('click', startTour);
    closeBtn.addEventListener('click', stopTour);
    nextBtn.addEventListener('click', () => {
      nextStep();
      startAutoTimer();
    });
    prevBtn.addEventListener('click', () => {
      prevStep();
      startAutoTimer();
    });

    playPauseBtn.addEventListener('click', () => {
      isAutoPlaying = !isAutoPlaying;
      if (isAutoPlaying) {
        playPauseBtn.textContent = '⏸ Pausar';
        startAutoTimer();
      } else {
        playPauseBtn.textContent = '▶ Continuar';
        if (tourTimer) clearInterval(tourTimer);
      }
      playCyberSound('click');
    });
  }

  // Inicializar Mega Pack V5 (v5.5.0)
  initMatrixMode();
  initDagSimulator();
  initModelArena();
  initSquadBuilder();
  initCockpitHud();
  initGuidedTour();
})();
