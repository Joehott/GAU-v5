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
    filters.innerHTML = categories.map(cat => `<button class="filter-btn ${cat === activeCategory ? 'active' : ''}" data-cat="${escapeHtml(cat)}">${escapeHtml(cat)}</button>`).join('');
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

  function renderIdeas(){
    const q = (search.value || '').toLocaleLowerCase('pt-BR').trim();
    const filtered = ideas.filter(i => (activeCategory === 'Todas' || i.category === activeCategory) && (`${i.id} ${i.name} ${i.summary} ${i.category}`.toLocaleLowerCase('pt-BR').includes(q)));
    grid.innerHTML = filtered.map(i => {
      const slug = getSkillSlug(i.id, i.name);
      return `<article class="idea-card" title="Skill GAU: ${escapeHtml(slug)}">
        <div class="idea-top"><span class="idea-id">#${String(i.id).padStart(2,'0')}</span><span class="idea-cat">${escapeHtml(i.category)}</span></div>
        <h3>${escapeHtml(i.name)}</h3>
        <p>${escapeHtml(i.summary)}</p>
        <span class="idea-skill-tag">⚙ ${escapeHtml(slug)}</span>
      </article>`;
    }).join('');
    count.textContent = filtered.length;
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

  function setStats(s){
    statCompute.textContent=s.compute; statBrains.textContent=s.brains; statConfidence.textContent=s.conf+'%'; statEvidence.textContent=s.e;
    memFacts.textContent=s.facts; memHyp.textContent=s.hyp; memReject.textContent=s.reject; memCheck.textContent=s.check; memoryState.textContent='synced';
  }
  function resetMission(){
    clearInterval(missionTimer); missionTimer=null; runBtn.disabled=false; runBtn.textContent='Rodar missão';
    missionStatus.textContent='waiting'; timeline.innerHTML='<div class="timeline-empty">Pressione <b>Rodar missão</b> para iniciar o fluxo.</div>';
    const sc = scenarios[currentScenarioKey];
    setStats(sc.initialStats); memoryState.textContent='idle';
  }
  function addStep(s,index){
    if(index===0) timeline.innerHTML='';
    const el=document.createElement('div'); el.className='timeline-step';
    el.innerHTML=`<div class="timeline-badge">${s.id}</div><div class="timeline-body"><b>${escapeHtml(s.name)}</b><span>${escapeHtml(s.detail)}</span></div><div class="timeline-state">PASS</div>`;
    timeline.appendChild(el); timeline.scrollTop=timeline.scrollHeight; setStats(s);
  }
  runBtn.addEventListener('click', () => {
    if(missionTimer) return;
    resetMission(); runBtn.disabled=true; runBtn.textContent='Executando...'; missionStatus.textContent='running'; memoryState.textContent='opening';
    const sc = scenarios[currentScenarioKey];
    const steps = sc.steps;
    let i=0; addStep(steps[i],i); i++;
    missionTimer=setInterval(()=>{
      if(i<steps.length){addStep(steps[i],i);i++;}
      else{clearInterval(missionTimer); missionTimer=null; missionStatus.textContent='COMPLETE'; runBtn.disabled=false; runBtn.textContent='Rodar novamente';}
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

  resetMission();
})();
