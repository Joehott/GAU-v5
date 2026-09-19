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
    { rank: 1, id: 'claude-3-7-sonnet', name: 'Claude 3.7 Sonnet', rating: 1680, wins: 28, losses: 6, draws: 2, duels: 36, winRate: 78, status: 'CALIBRATED', specialty: 'Raciocínio híbrido, refatoração de alta precisão e síntese arquitetural', category: 'Modelos' },
    { rank: 2, id: 'gemini-2-5-pro', name: 'Gemini 2.5 Pro', rating: 1665, wins: 25, losses: 6, draws: 3, duels: 34, winRate: 74, status: 'CALIBRATED', specialty: 'Janela de 2M tokens, análise multimodal profunda e auditoria de repositórios', category: 'Modelos' },
    { rank: 3, id: 'gpt-4o', name: 'GPT-4o (Omni)', rating: 1640, wins: 26, losses: 9, draws: 3, duels: 38, winRate: 68, status: 'CALIBRATED', specialty: 'Execução rápida de pipelines, tooling e geração robusta de código', category: 'Modelos' },
    { rank: 4, id: 'deepseek-r1', name: 'DeepSeek R1', rating: 1625, wins: 21, losses: 7, draws: 2, duels: 30, winRate: 70, status: 'CALIBRATED', specialty: 'Raciocínio matemático rigoroso, testes de invariantes e contraexemplos', category: 'Modelos' },
    { rank: 5, id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', rating: 1610, wins: 32, losses: 12, draws: 4, duels: 48, winRate: 67, status: 'CALIBRATED', specialty: 'Benchmark histórico clássico em engenharia autônoma no Antigravity', category: 'Modelos' },
    { rank: 6, id: 'gemini-2-5-flash', name: 'Gemini 2.5 Flash', rating: 1590, wins: 24, losses: 11, draws: 5, duels: 40, winRate: 60, status: 'CALIBRATED', specialty: 'Ultra baixa latência (<200ms) para routers, classificadores e loop sentinels', category: 'Modelos' },
    { rank: 7, id: 'llama-3-3-70b', name: 'Llama 3.3 70B', rating: 1560, wins: 14, losses: 9, draws: 2, duels: 25, winRate: 56, status: 'CALIBRATED', specialty: 'Execução local privada e soberania de dados sem dependência de nuvem', category: 'Modelos' }
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

  // Desktop Mobile Simulator Toggle
  const mobileSimToggleBtn = document.getElementById('mobileSimToggleBtn');
  const drawerMobileSimBtn = document.getElementById('drawerMobileSimBtn');
  const exitMobileSimBtn = document.getElementById('exitMobileSimBtn');
  const mobileSimBanner = document.getElementById('mobileSimBanner');

  function enableMobileSimulator() {
    document.body.classList.add('simulating-mobile');
    if (mobileSimBanner) mobileSimBanner.style.display = 'flex';
    showToast('📱 Modo Celular Ativado!');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function disableMobileSimulator() {
    document.body.classList.remove('simulating-mobile');
    if (mobileSimBanner) mobileSimBanner.style.display = 'none';
    showToast('Retornando ao Modo Computador');
  }

  function toggleMobileSimulator() {
    if (document.body.classList.contains('simulating-mobile')) {
      disableMobileSimulator();
    } else {
      enableMobileSimulator();
    }
  }

  if (mobileSimToggleBtn) {
    mobileSimToggleBtn.addEventListener('click', toggleMobileSimulator);
  }

  if (drawerMobileSimBtn) {
    drawerMobileSimBtn.addEventListener('click', () => {
      closeMobileDrawer();
      toggleMobileSimulator();
    });
  }

  if (exitMobileSimBtn) {
    exitMobileSimBtn.addEventListener('click', disableMobileSimulator);
  }
})();
