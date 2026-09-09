(function(){
'use strict';
const data=window.CABW_COMPAT_DATA||{creditos:[],requisicoes:[],lookups:{om:{},projetos:{}},meta:{}};
const engine=window.CABW_COMPAT_ENGINE;
const $=selector=>document.querySelector(selector);
const $$=selector=>Array.from(document.querySelectorAll(selector));
const esc=value=>String(value==null?'':value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const money=value=>'US$ '+Number(value||0).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
const integer=value=>Number(value||0).toLocaleString('pt-BR',{maximumFractionDigits:0});
const unique=values=>Array.from(new Set((values||[]).map(value=>String(value==null?'':value).trim()).filter(Boolean))).sort((a,b)=>a.localeCompare(b,'pt-BR'));
const selections=select=>select?Array.from(select.selectedOptions).map(option=>option.value).filter(Boolean):[];
let requestTerms=[];
let currentAnalysis=null;

function options(values,labels){
  const labelMap=labels||{};
  return unique(values).map(value=>({value,label:labelMap[value]||value})).sort((a,b)=>a.label.localeCompare(b.label,'pt-BR'));
}
function fillSelect(id,items,placeholder){
  const select=$(id);if(!select)return;
  select.innerHTML=items.map(item=>`<option value="${esc(item.value)}">${esc(item.label)}</option>`).join('');
  buildMulti(select,placeholder);
}
function buildMulti(select,placeholder){
  const wrapper=document.createElement('div');wrapper.className='compat-ms';
  wrapper.dataset.placeholder=placeholder||'Todas as opções';
  select.insertAdjacentElement('afterend',wrapper);
  const menuItems=Array.from(select.options).map(option=>`<label class="compat-ms__option"><input type="checkbox" value="${esc(option.value)}"><span>${esc(option.textContent)}</span></label>`).join('');
  wrapper.innerHTML=`<button class="compat-ms__button" type="button" aria-haspopup="listbox" aria-expanded="false">${esc(wrapper.dataset.placeholder)}</button><div class="compat-ms__menu"><div class="compat-ms__search"><input type="search" placeholder="Pesquisar nesta lista"><div class="compat-ms__actions"><button type="button" data-action="all">Todas</button><button type="button" data-action="clear">Limpar</button></div></div>${menuItems||'<div class="compat-empty">Sem opções.</div>'}</div>`;
  const button=wrapper.querySelector('.compat-ms__button');const menu=wrapper.querySelector('.compat-ms__menu');const search=wrapper.querySelector('input[type="search"]');
  function update(){
    const chosen=Array.from(select.selectedOptions).map(option=>option.textContent.trim());
    button.textContent=!chosen.length?wrapper.dataset.placeholder:(chosen.length<=2?chosen.join(', '):`${chosen.length} selecionadas`);
    button.title=chosen.join(', ');
    wrapper.querySelectorAll('.compat-ms__option input').forEach(input=>{const option=Array.from(select.options).find(item=>item.value===input.value);input.checked=Boolean(option&&option.selected);});
  }
  button.addEventListener('click',event=>{
    event.preventDefault();event.stopPropagation();
    $$('.compat-ms.open').forEach(item=>{if(item!==wrapper)item.classList.remove('open');});
    wrapper.classList.toggle('open');button.setAttribute('aria-expanded',wrapper.classList.contains('open')?'true':'false');
    if(wrapper.classList.contains('open'))setTimeout(()=>{wrapper.classList.toggle('align-right',menu.getBoundingClientRect().right>window.innerWidth-12);search&&search.focus();},0);
  });
  wrapper.querySelectorAll('.compat-ms__option input').forEach(input=>input.addEventListener('change',()=>{
    const option=Array.from(select.options).find(item=>item.value===input.value);if(option)option.selected=input.checked;
    update();select.dispatchEvent(new Event('change',{bubbles:true}));
  }));
  search&&search.addEventListener('input',()=>{
    const query=search.value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    wrapper.querySelectorAll('.compat-ms__option').forEach(label=>{const value=label.textContent.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();label.style.display=!query||value.includes(query)?'flex':'none';});
  });
  wrapper.querySelector('[data-action="all"]')?.addEventListener('click',event=>{event.preventDefault();Array.from(select.options).forEach(option=>option.selected=true);update();select.dispatchEvent(new Event('change',{bubbles:true}));});
  wrapper.querySelector('[data-action="clear"]')?.addEventListener('click',event=>{event.preventDefault();Array.from(select.options).forEach(option=>option.selected=false);update();select.dispatchEvent(new Event('change',{bubbles:true}));});
  select._compatUpdate=update;update();
}
function updateAllMultis(){$$('.compat-native').forEach(select=>select._compatUpdate&&select._compatUpdate());}

function initFilters(){
  const credits=data.creditos||[];const requests=data.requisicoes||[];const omLabels=(data.lookups||{}).om||{};const projectLabels=(data.lookups||{}).projetos||{};
  fillSelect('#filterCreditOm',options(credits.flatMap(row=>row.omCodigos||[]),omLabels),'Todas as OM');
  fillSelect('#filterCreditAcao',options(credits.map(row=>row.acao)),'Todas as ações');
  fillSelect('#filterCreditPi',options(credits.map(row=>row.planoInterno)),'Todos os PI');
  fillSelect('#filterCreditNatureza',options(credits.map(row=>row.natureza)),'Todas as naturezas');
  fillSelect('#filterCreditProjeto',options(credits.flatMap(row=>row.projetos||[]),projectLabels),'Todos os projetos');
  fillSelect('#filterCreditFonte',options(credits.map(row=>row.fonte)),'Todas as fontes');
  fillSelect('#filterCreditObjetivo',options(credits.map(row=>row.objetivo)),'Todos os objetivos');
  fillSelect('#filterReqOm',options(requests.map(row=>row.omCodigo),omLabels),'Todas as OM');
  fillSelect('#filterReqProjeto',options(requests.map(row=>row.projeto),projectLabels),'Todos os projetos');
  fillSelect('#filterReqNatureza',options(requests.map(row=>row.natureza)),'Todas as naturezas');
  fillSelect('#filterReqPrioridade',options(requests.map(row=>row.prioridade).map(value=>value==='0'?'0':value),{'0':'0 - Não definida','1':'1 - Prioridade máxima','2':'2','3':'3','4':'4','5':'5'}),'Todas as prioridades');
  fillSelect('#reportOm',options(requests.map(row=>row.omCodigo),omLabels),'Todas as OM');
  fillSelect('#reportAcao',options(credits.map(row=>row.acao)),'Todas as ações');
  $$('.compat-filter-stack .compat-native').forEach(select=>select.addEventListener('change',render));
  document.addEventListener('click',event=>{if(!event.target.closest('.compat-ms'))$$('.compat-ms.open').forEach(item=>item.classList.remove('open'));});
}
function creditFilters(){return {om:selections($('#filterCreditOm')),acao:selections($('#filterCreditAcao')),planoInterno:selections($('#filterCreditPi')),natureza:selections($('#filterCreditNatureza')),projeto:selections($('#filterCreditProjeto')),fonte:selections($('#filterCreditFonte')),objetivo:selections($('#filterCreditObjetivo'))};}
function requestFilters(){return {om:selections($('#filterReqOm')),projeto:selections($('#filterReqProjeto')),natureza:selections($('#filterReqNatureza')),prioridade:selections($('#filterReqPrioridade')),termos:requestTerms.slice()};}

function renderTerms(){
  const target=$('#reqTermChips');if(!target)return;
  target.innerHTML=requestTerms.map((term,index)=>`<span class="compat-term__chip" title="${esc(term)}">${esc(term.length>30?term.slice(0,30)+'…':term)}<button type="button" data-remove-term="${index}" aria-label="Remover ${esc(term)}">×</button></span>`).join('');
  target.querySelectorAll('[data-remove-term]').forEach(button=>button.addEventListener('click',()=>{requestTerms.splice(Number(button.dataset.removeTerm),1);renderTerms();render();}));
}
function addTerm(){const input=$('#filterReqText');const term=String(input.value||'').trim();if(term&&!requestTerms.includes(term))requestTerms.push(term);input.value='';renderTerms();render();}

function statusLabel(prefix){return {'M-':'Mapa aprovado','G-':'Mapa gerado','C-':'Em cotação','P-':'Pronto para cotação','I-':'Inserida para avaliação'}[prefix]||prefix;}
function compactCategory(row,key){
  const omCode=String(row.omCodigo||String(key||'').split('|')[0]||'N/I');
  const fullLabel=String(row.label||omCode);const acronym=(fullLabel.split(/\s+-\s+/)[0]||omCode).trim();
  return `${omCode} · ${acronym} · ND ${row.natureza||'N/I'}`;
}
function chartLayout(title,height,maxValue,categoryKeys,categoryLabels){return {
  height,autosize:true,
  margin:{l:210,r:24,t:76,b:55,pad:0,autoexpand:false},
  paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',
  font:{family:'Montserrat,Arial,sans-serif',color:'#16345e',size:11},
  xaxis:{title,domain:[0,1],gridcolor:'#e7edf5',zeroline:false,tickprefix:'US$ ',tickformat:',.2s',range:[0,maxValue],rangemode:'tozero',fixedrange:true,automargin:false},
  yaxis:{domain:[0,1],categoryorder:'array',categoryarray:(categoryKeys||[]).slice(),tickmode:'array',tickvals:(categoryKeys||[]).slice(),ticktext:(categoryLabels||[]).slice(),automargin:false,fixedrange:true},
  legend:{orientation:'h',x:0,xanchor:'left',y:1.025,yanchor:'bottom',font:{size:10}},
  barmode:'stack',hoverlabel:{namelength:-1}
};}
function chartSeries(analysis){
  const creditRows=analysis.creditByOmNatureza||[];const demandRows=analysis.demandByOmNaturezaStatus||[];
  const creditMap=new Map(creditRows.map(row=>[row.key,row]));const demandMap=new Map(demandRows.map(row=>[row.key,row]));
  const keys=unique([...creditRows.map(row=>row.key),...demandRows.map(row=>row.key)]);
  const order=keys.sort((a,b)=>{
    const av=Number(creditMap.get(a)?.valor||0),bv=Number(creditMap.get(b)?.valor||0);
    return bv-av||a.localeCompare(b,'pt-BR');
  });
  const rows=order.map(key=>creditMap.get(key)||demandMap.get(key)||{});
  const full=rows.map((row,index)=>`${row.label||row.omCodigo||order[index]} · ND ${row.natureza||'N/I'}`);
  const labels=rows.map((row,index)=>compactCategory(row,order[index]));
  const creditValues=order.map(key=>Number(creditMap.get(key)?.valor||0));
  const demandTotals=order.map(key=>engine.STATUS_ORDER.reduce((sum,prefix)=>sum+Number((demandMap.get(key)?.values||{})[prefix]||0),0));
  const greatest=Math.max(0,...creditValues,...demandTotals);const sharedMax=greatest>0?greatest*1.08:1;
  return {order,labels,full,creditMap,demandMap,creditValues,demandTotals,sharedMax};
}
async function drawCharts(analysis,creditTarget,requestTarget,exportMode){
  if(!window.Plotly)return;
  const series=chartSeries(analysis);const reversedLabels=series.labels.slice().reverse();const reversedFull=series.full.slice().reverse();const reversedKeys=series.order.slice().reverse();const height=Math.max(exportMode?520:430,series.order.length*27+120);
  const creditValues=reversedKeys.map(key=>Number(series.creditMap.get(key)?.valor||0));
  await Plotly.newPlot(creditTarget,[{type:'bar',orientation:'h',showlegend:false,y:reversedKeys,x:creditValues,customdata:reversedFull,marker:{color:'#003676'},text:creditValues.map(money),textposition:'auto',hovertemplate:'%{customdata}<br>Saldo dos dígitos: %{x:$,.2f}<extra></extra>'}],chartLayout('Saldo dos dígitos',height,series.sharedMax,reversedKeys,reversedLabels),{displayModeBar:false,responsive:!exportMode,staticPlot:Boolean(exportMode)});
  const traces=engine.STATUS_ORDER.map(prefix=>({type:'bar',orientation:'h',name:statusLabel(prefix),y:reversedKeys,x:reversedKeys.map(key=>Number((series.demandMap.get(key)?.values||{})[prefix]||0)),customdata:reversedFull,marker:{color:engine.STATUS_COLORS[prefix]},hovertemplate:`%{customdata}<br>${statusLabel(prefix)}: %{x:$,.2f}<extra></extra>`}));
  await Plotly.newPlot(requestTarget,traces,chartLayout('Valor das requisições',height,series.sharedMax,reversedKeys,reversedLabels),{displayModeBar:false,responsive:!exportMode,staticPlot:Boolean(exportMode)});
}

function transferText(row){
  const transfers=(row.transfers||[]).map(item=>`${item.origemDigito||'N/I'} → ${(item.destinoDigitos||[]).join(', ')||'definir destino'}`);
  return unique(transfers).join('; ')||'Definir dígitos de origem e destino';
}

function planRows(plans,stage){return plans.filter(row=>row.stage===stage).sort((a,b)=>b.valorUsd-a.valorUsd);}
function emptyRow(cols,text){return `<tr><td class="compat-empty" colspan="${cols}">${esc(text)}</td></tr>`;}
function renderPlans(analysis){
  const plans=analysis.allocation.plans;
  const immediate=planRows(plans,'imediato'),project=planRows(plans,'projeto'),pi=planRows(plans,'pi');
  $('#totalImmediate').textContent=money(immediate.reduce((sum,row)=>sum+row.valorUsd,0));
  $('#totalProjectMove').textContent=money(project.reduce((sum,row)=>sum+row.valorUsd,0));
  $('#totalPiMove').textContent=money(pi.reduce((sum,row)=>sum+row.valorUsd,0));
  $('#tableImmediate').innerHTML=immediate.length?immediate.slice(0,200).map(row=>`<tr title="${esc(row.descricao)}"><td>${esc(row.requisicao)}</td><td>${esc(row.om)}</td><td>${esc(row.natureza)}</td><td>${esc(row.projetoLabel||row.projeto)}</td><td>${money(row.valorUsd)}</td></tr>`).join(''):emptyRow(5,'Nenhuma requisição integralmente coberta sem realocação.');
  $('#tableProjectMove').innerHTML=project.length?project.slice(0,200).map(row=>{const origins=unique(row.sources.flatMap(source=>source.projetos||[]).filter(code=>code!==row.projeto)).join(', ')||'Projeto compartilhado';return `<tr title="Requisição ${esc(row.requisicao)}"><td>${esc(row.om)}<br>${esc(row.natureza)}</td><td>${esc(transferText(row))}</td><td>${esc(origins)} → ${esc(row.projeto)}</td><td>${money(row.valorUsd)}</td></tr>`;}).join(''):emptyRow(4,'Nenhuma realocação entre projetos necessária.');
  $('#tablePiMove').innerHTML=pi.length?pi.slice(0,200).map(row=>{const sourcePi=unique(row.sources.map(source=>source.planoInterno)).join(', ')||'Não informado';return `<tr title="Requisição ${esc(row.requisicao)}"><td>${esc(row.om)}<br>${esc(row.natureza)}</td><td>${esc(transferText(row))}</td><td>${esc(sourcePi)} → ${esc(row.destinoPi)}</td><td>${money(row.valorUsd)}</td></tr>`;}).join(''):emptyRow(4,'Nenhuma realocação entre Planos Internos necessária.');
}
function render(){
  if(!engine){$('#compatFilterStatus').textContent='Mecanismo de compatibilidade indisponível.';return;}
  currentAnalysis=engine.analyze(data,creditFilters(),requestFilters());
  const summary=currentAnalysis.summary;
  $('#kpiCompatCredit').textContent=money(summary.creditoDisponivel);
  $('#kpiCompatDemand').textContent=money(summary.demandaCompativel);
  $('#kpiCompatPotential').textContent=money(summary.potencialEmpenho);
  $('#kpiCompatCount').textContent=integer(summary.requisicoesCobertas);
  $('#kpiCompatRemaining').textContent=money(summary.saldoAposPotencial);
  $('#compatFilterStatus').textContent=`${integer(currentAnalysis.credits.length)} dígitos · ${integer(currentAnalysis.requests.length)} requisições selecionadas · ${integer(currentAnalysis.compatible.length)} compatíveis`;
  drawCharts(currentAnalysis,$('#chartCompatCredit'),$('#chartCompatRequests'),false);
  renderPlans(currentAnalysis);
}

function mergeSelection(base,additional){
  if(!base.length)return additional.slice();if(!additional.length)return base.slice();
  const extra=new Set(additional);const intersection=base.filter(value=>extra.has(value));return intersection.length?intersection:['__SEM_CORRESPONDENCIA__'];
}
function reportAnalysis(){
  const cf=creditFilters(),rf=requestFilters();const reportOms=selections($('#reportOm')),reportActions=selections($('#reportAcao'));
  cf.om=mergeSelection(cf.om,reportOms);cf.acao=mergeSelection(cf.acao,reportActions);rf.om=mergeSelection(rf.om,reportOms);
  return {analysis:engine.analyze(data,cf,rf),reportOms,reportActions};
}
function reportStyles(){return `<style>body{font-family:Arial,sans-serif;color:#102d56;margin:24px}h1{margin:0;color:#00265f;font-size:23px}h2{margin:20px 0 8px;padding-bottom:5px;border-bottom:2px solid #ffd200;color:#00265f;font-size:16px}.meta{color:#607089;margin-top:5px;font-size:11px}.note{padding:9px 11px;background:#eef4fb;border-left:4px solid #003676;font-size:11px;line-height:1.4}.cards{display:grid;grid-template-columns:repeat(5,1fr);gap:7px}.card{padding:9px;border:1px solid #d9e2ef;border-radius:8px;background:#f8fbff}.card span{display:block;color:#5c687b;font-size:9px;font-weight:bold;text-transform:uppercase}.card strong{display:block;margin-top:4px;color:#00265f;font-size:15px}.charts{display:grid;grid-template-columns:1fr 1fr;gap:10px}.charts img{width:100%;border:1px solid #dfe7f1;border-radius:7px}table{width:100%;border-collapse:collapse;font-size:9.5px}th,td{padding:5px;border:1px solid #dce4ef;vertical-align:top}th{background:#003676;color:#fff;text-align:left}.action{font-weight:bold;color:#003676}.muted{color:#65738a;font-size:10px}.print{position:sticky;top:0;margin-bottom:10px;padding:7px 0;background:#fff}.print button{padding:8px 12px;border:0;border-radius:7px;background:#003676;color:#fff;font-weight:bold}@media print{body{margin:10mm}.print{display:none}.charts,.cards,table{break-inside:avoid}h2{break-after:avoid}}</style>`;}
function actionSummaryRows(plans){
  return ['imediato','projeto','pi'].map(stage=>{const rows=plans.filter(row=>row.stage===stage);return {stage,label:rows[0]?.stageLabel||({imediato:'Empenho imediato',projeto:'Realocação entre projetos',pi:'Realocação entre Planos Internos'})[stage],qtd:rows.length,valor:rows.reduce((sum,row)=>sum+Number(row.valorUsd||0),0)};});
}
function transferReportRows(plans){
  const map=new Map();
  plans.filter(row=>row.stage==='projeto'||row.stage==='pi').forEach(row=>(row.transfers||[]).forEach(item=>{
    const destinos=(item.destinoDigitos||[]).join(', ')||'Definir destino';const destinoPi=(item.destinoPis||[]).join(', ')||row.destinoPi||'Definir PI';
    const key=[row.stage,row.omCodigo,row.natureza,item.origemDigito,destinos,item.origemPi,destinoPi,row.projeto].join('|');
    if(!map.has(key))map.set(key,{stageLabel:row.stageLabel,om:row.om,natureza:row.natureza,origem:item.origemDigito,destino:destinos,origemPi:item.origemPi,destinoPi,projeto:row.projetoLabel||row.projeto,requisicoes:new Set(),valor:0});
    const target=map.get(key);target.requisicoes.add(row.requisicao);target.valor+=Number(item.valor||0);
  }));
  return Array.from(map.values()).sort((a,b)=>a.stageLabel.localeCompare(b.stageLabel)||b.valor-a.valor);
}
async function makeReportImages(analysis){
  const host=document.createElement('div');host.style.cssText='position:fixed;left:-20000px;top:0;width:2300px;background:#fff';const divs=Array.from({length:2},()=>document.createElement('div'));divs.forEach(div=>{div.style.width='1050px';host.appendChild(div);});document.body.appendChild(host);
  try{
    await drawCharts(analysis,divs[0],divs[1],true);
    return await Promise.all(divs.map(div=>Plotly.toImage(div,{format:'png',width:1050,height:620,scale:1.25})));
  }finally{divs.forEach(div=>{try{Plotly.purge(div);}catch(e){}});host.remove();}
}
async function generateReport(){
  const popup=window.open('','_blank');if(!popup){alert('Autorize pop-ups para gerar o relatório.');return;}
  popup.document.write('<p style="font-family:Arial;padding:30px">Gerando relatório de insights…</p>');
  try{
    const bundle=reportAnalysis(),analysis=bundle.analysis,summary=analysis.summary,images=await makeReportImages(analysis),actions=actionSummaryRows(analysis.allocation.plans),transfers=transferReportRows(analysis.allocation.plans);
    const omText=bundle.reportOms.length?bundle.reportOms.map(code=>(data.lookups.om||{})[code]||code).join('; '):'Todas as OM dos filtros analíticos';const actionText=bundle.reportActions.length?bundle.reportActions.join(', '):'Todas as ações dos filtros analíticos';
    const actionBody=actions.map(row=>`<tr><td class="action">${esc(row.label)}</td><td>${integer(row.qtd)}</td><td>${money(row.valor)}</td></tr>`).join('');
    const transferBody=transfers.length?transfers.map(row=>`<tr><td class="action">${esc(row.stageLabel)}</td><td>${esc(row.om)}<br>ND ${esc(row.natureza)}</td><td>${esc(row.origem)} → ${esc(row.destino)}</td><td>${esc(row.origemPi||'N/I')} → ${esc(row.destinoPi)}</td><td>${esc(row.projeto)}</td><td>${integer(row.requisicoes.size)}</td><td>${money(row.valor)}</td></tr>`).join(''):'<tr><td colspan="7">Nenhuma realocação necessária nos filtros selecionados.</td></tr>';
    const html=`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Relatório executivo para emprego do crédito</title>${reportStyles()}</head><body><div class="print"><button onclick="window.print()">Imprimir / salvar em PDF</button></div><h1>Relatório executivo para emprego do crédito</h1><div class="meta">Dados atualizados em ${esc(data.meta.geradoEm||'data não informada')} · Gerado em ${new Date().toLocaleString('pt-BR')}</div><p class="note"><strong>Filtros:</strong> OM requisitante: ${esc(omText)} · Ação orçamentária: ${esc(actionText)}.<br>Os cenários devem ser confirmados quanto à autorização orçamentária antes de qualquer movimentação.</p><div class="cards"><div class="card"><span>Crédito disponível</span><strong>${money(summary.creditoDisponivel)}</strong></div><div class="card"><span>Demanda compatível</span><strong>${money(summary.demandaCompativel)}</strong></div><div class="card"><span>Empenho potencial</span><strong>${money(summary.potencialEmpenho)}</strong></div><div class="card"><span>Requisições cobertas</span><strong>${integer(summary.requisicoesCobertas)}</strong></div><div class="card"><span>Saldo após potencial</span><strong>${money(summary.saldoAposPotencial)}</strong></div></div><h2>Crédito × demanda por OM e natureza de despesa</h2><div class="charts"><img src="${images[0]}"><img src="${images[1]}"></div><p class="muted">Os gráficos usam as mesmas categorias, ordem e escala monetária.</p><h2>Resumo das ações</h2><table><thead><tr><th>Ação</th><th>Requisições</th><th>Valor</th></tr></thead><tbody>${actionBody}</tbody></table><h2>Realocações recomendadas</h2><table><thead><tr><th>Ação</th><th>OM / ND</th><th>Dígito origem → destino</th><th>PI origem → destino</th><th>Projeto destino</th><th>Req.</th><th>Valor</th></tr></thead><tbody>${transferBody}</tbody></table><p class="muted">As linhas consolidam requisições com a mesma rota orçamentária. Valores correspondem à parcela proveniente de cada dígito de origem.</p></body></html>`;
    popup.document.open();popup.document.write(html);popup.document.close();
  }catch(error){console.error(error);popup.document.body.innerHTML='<p style="font-family:Arial;padding:30px;color:#8b1a1a">Não foi possível gerar o relatório. Recarregue o painel e tente novamente.</p>';}
}

function resetFilters(){
  $$('.compat-native').forEach(select=>Array.from(select.options).forEach(option=>option.selected=false));requestTerms=[];$('#filterReqText').value='';renderTerms();updateAllMultis();render();
}
function init(){
  initFilters();renderTerms();
  $('#addReqTerm').addEventListener('click',addTerm);$('#filterReqText').addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();addTerm();}});
  $('#resetCompatFilters').addEventListener('click',resetFilters);$('#generateCompatReport').addEventListener('click',generateReport);
  $('#compatGeneratedAt').textContent='Dados atualizados em '+(data.meta.geradoEm||'data não informada');
  $('#compatSource').textContent=`Fontes: ${data.meta.fonteCreditos||'digitos.xlsx'} e ${data.meta.fonteRequisicoes||'requisicoes.xlsx'} · Atualização: ${data.meta.geradoEm||'não informada'}.`;
  render();
  Object.assign(window.CABW_COMPAT_PANEL_TEST,{getAnalysis:()=>currentAnalysis,creditFilters,requestFilters,reportAnalysis});
}
window.CABW_COMPAT_PANEL_TEST={chartSeries,chartLayout,drawCharts};
document.addEventListener('DOMContentLoaded',()=>{try{init();}catch(error){console.error('CABW compatibility error',error);const status=$('#compatFilterStatus');if(status)status.textContent='Não foi possível inicializar a análise.';}});
})();
