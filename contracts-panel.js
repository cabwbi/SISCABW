
(function(){
'use strict';
const root=window.CABW_CONTRACTS_DATA||{records:[],summary:{}}; const records=Array.isArray(root.records)?root.records:[]; const summary=root.summary||{};
const $=(s,c)=> (c||document).querySelector(s); const $all=(s,c)=>Array.from((c||document).querySelectorAll(s));
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const money=v=>'US$ '+Number(v||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const num=v=>Number(v||0).toLocaleString('pt-BR');
function selected(sel){if(!sel)return []; return Array.from(sel.selectedOptions).map(o=>o.value).filter(Boolean);}
function unique(a){return Array.from(new Set(a.filter(v=>v!==undefined&&v!==null&&String(v).trim()!==''))).sort((a,b)=>String(a).localeCompare(String(b),'pt-BR'));}

function ensureCabwMultiCss(){
  if(document.getElementById('cabw-multi-dropdown-css')) return;
  const st=document.createElement('style'); st.id='cabw-multi-dropdown-css';
  st.textContent=`
  select.cabw-native-multi-hidden{display:none!important;}
  .cabw-multi-dropdown{position:relative;width:100%;font-family:inherit;}
  .cabw-multi-button{width:100%;min-height:46px;border:1px solid #ccd6e6;border-radius:10px;background:#f8fbff;color:#001f55;padding:10px 42px 10px 14px;text-align:left;font-weight:500;box-shadow:inset 0 1px 0 rgba(255,255,255,.75);cursor:pointer;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .cabw-multi-button:after{content:'▾';position:absolute;right:14px;top:50%;transform:translateY(-50%);font-size:15px;color:#003b7a;pointer-events:none;}
  .cabw-multi-dropdown.open .cabw-multi-button{border-color:#f5c400;box-shadow:0 0 0 .2rem rgba(245,196,0,.18);background:#fff;}
  .cabw-multi-menu{display:none;position:absolute;z-index:3000;left:0;right:0;top:calc(100% + 6px);max-height:300px;overflow:auto;background:#fff;border:1px solid #ccd6e6;border-radius:12px;box-shadow:0 14px 32px rgba(0,31,85,.18);padding:6px;}
  .cabw-multi-dropdown.open .cabw-multi-menu{display:block;}
  .cabw-multi-option{display:flex;gap:9px;align-items:flex-start;padding:8px 9px;border-radius:8px;color:#001f55;font-size:14px;line-height:1.25;cursor:pointer;margin:0;}
  .cabw-multi-option:hover{background:#eef5ff;}
  .cabw-multi-option input{margin-top:2px;accent-color:#003b7a;flex:0 0 auto;}
  .cabw-multi-actions{display:flex;justify-content:space-between;gap:8px;border-bottom:1px solid #e7edf6;margin-bottom:4px;padding:4px 4px 8px;position:sticky;top:0;background:#fff;z-index:1;}
  .cabw-multi-actions button{border:0;border-radius:8px;background:#e9eef6;color:#003b7a;font-weight:700;padding:5px 8px;font-size:12px;cursor:pointer;}
  .cabw-multi-actions button:hover{background:#dce6f2;}
  .cabw-multi-empty{padding:10px;color:#6c7890;font-size:13px;}
  `;
  document.head.appendChild(st);
  document.addEventListener('click',e=>{ if(!e.target.closest('.cabw-multi-dropdown')) document.querySelectorAll('.cabw-multi-dropdown.open').forEach(w=>w.classList.remove('open')); });
}
function multiPlaceholder(sel){
  const label=sel.closest('label'); const span=label?label.querySelector('span'):null; const name=(span?span.textContent.trim():'opções').toLowerCase();
  if(name.includes('empresa')) return 'Todas as empresas';
  if(name.includes('número')) return 'Todos os números';
  if(name.includes('unidade')) return 'Todas as unidades';
  if(name.includes('orden')) return 'Todas as ordenações';
  if(name.includes('grande')) return 'Todos os Grandes Comandos';
  if(name.includes('ação')) return 'Todas as ações';
  if(name.includes('moeda')) return 'Todas as moedas';
  if(name.includes('vigência')) return 'Todas';
  if(name.includes('natureza')) return 'Todas as naturezas';
  if(name.includes('projeto')) return 'Todos os projetos';
  if(name==='om') return 'Todas as OM';
  return 'Todas as opções';
}
function updateCabwMulti(sel){
  const wrap=sel.nextElementSibling && sel.nextElementSibling.classList && sel.nextElementSibling.classList.contains('cabw-multi-dropdown') ? sel.nextElementSibling : null;
  if(!wrap) return;
  const chosen=Array.from(sel.selectedOptions).map(o=>o.textContent.trim()).filter(Boolean);
  const btn=wrap.querySelector('.cabw-multi-button');
  if(btn){ btn.textContent = chosen.length ? (chosen.length<=2 ? chosen.join(', ') : `${chosen.length} selecionadas`) : multiPlaceholder(sel); btn.title = chosen.join(', '); }
  wrap.querySelectorAll('input[type="checkbox"]').forEach(cb=>{ const opt=Array.from(sel.options).find(o=>o.value===cb.value); cb.checked=!!(opt&&opt.selected); });
}
function rebuildCabwMulti(sel){
  ensureCabwMultiCss();
  sel.multiple=true; sel.size=1; sel.classList.remove('cabw-multi-select'); sel.classList.add('cabw-native-multi-hidden'); sel.setAttribute('aria-hidden','true'); sel.tabIndex=-1;
  let wrap=sel.nextElementSibling && sel.nextElementSibling.classList && sel.nextElementSibling.classList.contains('cabw-multi-dropdown') ? sel.nextElementSibling : null;
  if(!wrap){ wrap=document.createElement('div'); wrap.className='cabw-multi-dropdown'; sel.parentNode.insertBefore(wrap, sel.nextSibling); }
  const options=Array.from(sel.options);
  const menuItems=options.length ? options.map(o=>`<label class="cabw-multi-option"><input type="checkbox" value="${esc(o.value)}" ${o.selected?'checked':''}><span>${esc(o.textContent)}</span></label>`).join('') : '<div class="cabw-multi-empty">Sem opções disponíveis</div>';
  wrap.innerHTML=`<button type="button" class="cabw-multi-button" aria-haspopup="listbox" aria-expanded="false"></button><div class="cabw-multi-menu"><div class="cabw-multi-actions"><button type="button" data-ms-action="all">Marcar todas</button><button type="button" data-ms-action="clear">Limpar</button></div>${menuItems}</div>`;
  const btn=wrap.querySelector('.cabw-multi-button');
  btn.addEventListener('click',e=>{e.preventDefault(); e.stopPropagation(); document.querySelectorAll('.cabw-multi-dropdown.open').forEach(w=>{if(w!==wrap)w.classList.remove('open')}); wrap.classList.toggle('open'); btn.setAttribute('aria-expanded',wrap.classList.contains('open')?'true':'false');});
  btn.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '||e.key==='ArrowDown'){e.preventDefault(); btn.click();}});
  wrap.querySelectorAll('input[type="checkbox"]').forEach(cb=>cb.addEventListener('change',()=>{ const opt=Array.from(sel.options).find(o=>o.value===cb.value); if(opt) opt.selected=cb.checked; updateCabwMulti(sel); sel.dispatchEvent(new Event('change',{bubbles:true})); }));
  wrap.querySelector('[data-ms-action="all"]')?.addEventListener('click',e=>{e.preventDefault(); Array.from(sel.options).forEach(o=>o.selected=true); updateCabwMulti(sel); sel.dispatchEvent(new Event('change',{bubbles:true}));});
  wrap.querySelector('[data-ms-action="clear"]')?.addEventListener('click',e=>{e.preventDefault(); Array.from(sel.options).forEach(o=>o.selected=false); updateCabwMulti(sel); sel.dispatchEvent(new Event('change',{bubbles:true}));});
  updateCabwMulti(sel);
}
function updateAllCabwMultis(){document.querySelectorAll('select.cabw-native-multi-hidden').forEach(updateCabwMulti);}

function fillMulti(sel, vals){if(!sel)return; const old=selected(sel); sel.innerHTML=vals.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join(''); old.forEach(v=>{const o=Array.from(sel.options).find(o=>o.value===v); if(o)o.selected=true;}); rebuildCabwMulti(sel);}
function dateBr(s){if(!s)return '—'; const [y,m,d]=String(s).split('-'); return d&&m&&y?`${d}/${m}/${y}`:'—';}
function daysToEnd(r){if(!r.dataFinal)return null; const end=new Date(r.dataFinal+'T00:00:00'); const now=new Date(); now.setHours(0,0,0,0); return Math.ceil((end-now)/(1000*60*60*24));}
function vigenciaBucket(r){const d=daysToEnd(r); if(d===null||Number.isNaN(d)) return 'Sem data final'; if(d<0) return 'Vigência expirada'; if(d<=90) return 'Vencimento em até 90 dias'; if(d<=150) return 'Vencimento entre 90 e 150 dias'; return 'Vencimento acima de 150 dias';}
function risk(r){const d=daysToEnd(r); if(d===null||Number.isNaN(d)) return ''; if(d<0)return 'VENCIDO'; if(d<=90)return 'RISCO'; return '';}
function catRows(cat){return records.filter(r=>!cat||r.category===cat);}
function agg(rows){return {count:rows.length,value:rows.reduce((a,r)=>a+Number(r.valorContrato||0),0),paid:rows.reduce((a,r)=>a+Number(r.totalEmpenhadoUsd||0),0),billed:rows.reduce((a,r)=>a+Number(r.totalFaturadoUsd||0),0),available:rows.reduce((a,r)=>a+Number(r.valorAEmpenhar||0),0)};}
function filters(){return {numero:selected($('#filterNumeroContrato')), empresa:selected($('#filterEmpresa')), unidade:selected($('#filterUnidade')), gc:selected($('#filterGrandeComando')), ordenador:selected($('#filterOrdenador')), acao:selected($('#filterAcao')), moeda:selected($('#filterMoeda')), status:selected($('#filterStatus')), search:($('#filterContratoSearch')?.value||'').trim().toLowerCase()};}
function has(sel,val){return !sel.length||sel.includes(val||'');}
function rowMatches(r,f,cat){const ordVal = cat==='finalisticos' ? r.tipoOrdenacao : r.ordenadorDespesa; const hay=[r.contrato,r.numero,r.empresa,r.objetoResumo,r.unidade,r.grandComando,r.acao,r.cage,ordVal].join(' ').toLowerCase(); return has(f.numero,r.numero)&&has(f.empresa,r.empresa)&&has(f.unidade,r.unidade)&&has(f.gc,r.grandComando)&&has(f.ordenador,ordVal)&&has(f.acao,r.acao)&&has(f.moeda,r.moeda)&&has(f.status,vigenciaBucket(r))&&(!f.search||hay.includes(f.search));}
function populateFilters(rows,cat){fillMulti($('#filterNumeroContrato'), unique(rows.map(r=>r.numero))); fillMulti($('#filterEmpresa'), unique(rows.map(r=>r.empresa))); fillMulti($('#filterUnidade'), unique(rows.map(r=>r.unidade))); fillMulti($('#filterGrandeComando'), unique(rows.map(r=>r.grandComando))); fillMulti($('#filterOrdenador'), cat==='finalisticos' ? ['Ordenação de despesas pela CABW','Ordenação de Despesas pela OM Requisitante'] : unique(rows.map(r=>r.ordenadorDespesa))); fillMulti($('#filterAcao'), unique(rows.map(r=>r.acao))); fillMulti($('#filterMoeda'), unique(rows.map(r=>r.moeda))); fillMulti($('#filterStatus'), ['Vencimento acima de 150 dias','Vencimento entre 90 e 150 dias','Vencimento em até 90 dias','Vigência expirada','Sem data final']);}
function drawChart(rows){const el=$('#contractsValueChart'); if(!el)return; const a=agg(rows); if(window.Plotly){Plotly.newPlot(el,[{type:'bar',x:['Valor contratado','Empenhado','Faturado','Disponível p/ empenho'],y:[a.value,a.paid,a.billed,a.available],text:[money(a.value),money(a.paid),money(a.billed),money(a.available)],textposition:'auto',marker:{color:['#003b7a','#0e63b6','#f5c400','#4c6a92']}}],{height:360,margin:{l:80,r:20,t:20,b:90},yaxis:{title:'US$'}},{displayModeBar:false,responsive:true});}else{el.innerHTML='<p>Plotly não carregado.</p>';}}
function renderOverview(){const rootEl=document.querySelector('[data-contract-overview]'); if(!rootEl)return; const all=agg(records); $('[data-all-contracts-count]')&&($('[data-all-contracts-count]').textContent=num(all.count)); $('[data-all-contracts-paid]')&&($('[data-all-contracts-paid]').textContent=money(all.paid)+' empenhados'); $all('[data-contract-summary]').forEach(card=>{const cat=card.getAttribute('data-contract-summary'); const a=agg(catRows(cat)); $('[data-summary-count]',card)&&($('[data-summary-count]',card).textContent=num(a.count)); $('[data-summary-value]',card)&&($('[data-summary-value]',card).textContent=money(a.value)); $('[data-summary-paid]',card)&&($('[data-summary-paid]',card).textContent=money(a.paid));});}
function renderPanel(){const cat=document.body.getAttribute('data-contract-category'); if(!cat)return; const base=catRows(cat); $('#contract-section-title')&&($('#contract-section-title').textContent={administrativos:'Contratos Administrativos',finalisticos:'Contratos Finalísticos',fms:'FMS (Foreign Military Sales)'}[cat]||'Contratos'); populateFilters(base,cat); function refresh(){const f=filters(); const rows=base.filter(r=>rowMatches(r,f,cat)); const a=agg(rows); $('[data-kpi="count"]')&&($('[data-kpi="count"]').textContent=num(a.count)); $('[data-kpi="value"]')&&($('[data-kpi="value"]').textContent=money(a.value)); $('[data-kpi="paidUsd"]')&&($('[data-kpi="paidUsd"]').textContent=money(a.paid)); $('[data-kpi="billedUsd"]')&&($('[data-kpi="billedUsd"]').textContent=money(a.billed)); const count=$('#contractsTableCount'); if(count) count.textContent=num(rows.length)+' contrato(s)'; const tb=$('#contractsTable tbody'); if(tb) tb.innerHTML=rows.map(r=>`<tr class="${risk(r)?'contract-risk-row':''}"><td>${esc(r.contrato)}</td><td>${esc(r.numero)}</td><td>${esc(r.unidade)}</td><td>${esc(cat==='finalisticos'?r.tipoOrdenacao:r.ordenadorDespesa)}</td><td>${esc(r.grandComando)}</td><td>${esc(r.empresa)}</td><td class="contracts-object-cell">${esc(r.objetoResumo)}</td><td>${esc(r.moeda)}</td><td class="text-right">${money(r.valorContrato)}</td><td class="text-right">${money(r.totalEmpenhadoUsd)}</td><td class="text-right">${money(r.totalFaturadoUsd)}</td><td class="text-right">${money(r.valorAEmpenhar)}</td><td>${dateBr(r.dataFinal)}</td><td>${esc(vigenciaBucket(r))} ${risk(r)?'<strong class="risk-flag">'+risk(r)+'</strong>':''}</td></tr>`).join(''); drawChart(rows);} $all('#filterNumeroContrato,#filterEmpresa,#filterUnidade,#filterGrandeComando,#filterOrdenador,#filterAcao,#filterMoeda,#filterStatus').forEach(el=>el.addEventListener('change',refresh)); $('#filterContratoSearch')?.addEventListener('input',refresh); $('#resetContractFilters')?.addEventListener('click',()=>{ $all('#filterNumeroContrato,#filterEmpresa,#filterUnidade,#filterGrandeComando,#filterOrdenador,#filterAcao,#filterMoeda,#filterStatus').forEach(sel=>Array.from(sel.options).forEach(o=>o.selected=false)); updateAllCabwMultis(); if($('#filterContratoSearch'))$('#filterContratoSearch').value=''; refresh();}); refresh();}
document.addEventListener('DOMContentLoaded',()=>{try{renderOverview();renderPanel();}catch(e){console.error('CABW contracts panel error',e);}});
})();
