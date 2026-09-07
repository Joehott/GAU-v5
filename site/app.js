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
  function renderIdeas(){
    const q = (search.value || '').toLocaleLowerCase('pt-BR').trim();
    const filtered = ideas.filter(i => (activeCategory === 'Todas' || i.category === activeCategory) && (`${i.id} ${i.name} ${i.summary} ${i.category}`.toLocaleLowerCase('pt-BR').includes(q)));
    grid.innerHTML = filtered.map(i => `<article class="idea-card"><div class="idea-top"><span class="idea-id">#${String(i.id).padStart(2,'0')}</span><span class="idea-cat">${escapeHtml(i.category)}</span></div><h3>${escapeHtml(i.name)}</h3><p>${escapeHtml(i.summary)}</p></article>`).join('');
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

  const steps = [
    {id:'30',name:'Requirement Council',detail:'Baseline criado. 5 critérios de aceitação e 2 riscos explícitos.',brains:3,conf:46,e:'E1',facts:4,hyp:0,reject:0,check:1,compute:'SMART'},
    {id:'01',name:'Adaptive Model Router 3.0',detail:'Complexidade alta detectada. Equipe expandida por incerteza.',brains:6,conf:52,e:'E1',facts:5,hyp:0,reject:0,check:1,compute:'DEEP'},
    {id:'06',name:'Hypothesis Laboratory',detail:'6 hipóteses independentes. 3 eliminadas por testes discriminatórios.',brains:6,conf:68,e:'E2',facts:9,hyp:3,reject:3,check:2,compute:'DEEP'},
    {id:'15',name:'Project Brain + Checkpoint',detail:'Fatos, caminhos rejeitados e evidência gravados no checkpoint R-017.',brains:4,conf:71,e:'E2',facts:12,hyp:3,reject:3,check:3,compute:'SMART'},
    {id:'08',name:'Coding Swarm',detail:'Implementação isolada em worktree. Patch escolhido por testes comparativos.',brains:6,conf:78,e:'E3',facts:15,hyp:1,reject:5,check:4,compute:'DEEP'},
    {id:'22',name:'Evidence Court',detail:'Claims críticos ligados a logs, testes e checkpoint do código.',brains:6,conf:87,e:'E4',facts:18,hyp:1,reject:5,check:5,compute:'COUNCIL'},
    {id:'53',name:'Independent Verification Tree',detail:'Verificação independente: requisitos, regressões, segurança e integração.',brains:6,conf:94,e:'E5',facts:21,hyp:0,reject:6,check:6,compute:'COUNCIL'},
    {id:'36',name:'Final Completion Tribunal',detail:'Completion Proof fechado. Nenhuma obrigação crítica permaneceu aberta.',brains:3,conf:98,e:'E5',facts:22,hyp:0,reject:6,check:7,compute:'SMART'}
  ];

  function setStats(s){
    statCompute.textContent=s.compute; statBrains.textContent=s.brains; statConfidence.textContent=s.conf+'%'; statEvidence.textContent=s.e;
    memFacts.textContent=s.facts; memHyp.textContent=s.hyp; memReject.textContent=s.reject; memCheck.textContent=s.check; memoryState.textContent='synced';
  }
  function resetMission(){
    clearInterval(missionTimer); missionTimer=null; runBtn.disabled=false; runBtn.textContent='Rodar missão';
    missionStatus.textContent='waiting'; timeline.innerHTML='<div class="timeline-empty">Pressione <b>Rodar missão</b> para iniciar o fluxo.</div>';
    setStats({compute:'SMART',brains:1,conf:34,e:'E0',facts:0,hyp:0,reject:0,check:0}); memoryState.textContent='idle';
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
    let i=0; addStep(steps[i],i); i++;
    missionTimer=setInterval(()=>{
      if(i<steps.length){addStep(steps[i],i);i++;}
      else{clearInterval(missionTimer); missionTimer=null; missionStatus.textContent='COMPLETE'; runBtn.disabled=false; runBtn.textContent='Rodar novamente';}
    },720);
  });
  resetBtn.addEventListener('click', resetMission);
})();
