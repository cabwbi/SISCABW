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
const normalized=value=>String(value==null?'':value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const selections=select=>select?Array.from(select.selectedOptions).map(option=>option.value).filter(Boolean):[];
let requestTerms=[];
let currentAnalysis=null;
let filtersDirty=false;
const chartModes={credit:'total',request:'status'};
const DETAIL_COLORS=['#003676','#2e9d57','#f28e2b','#7656b5','#0097a7','#c44e52','#8a6d1d','#4e79a7','#d65f5f','#6b8e23','#a45aa5','#007f73'];

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
  wrapper.innerHTML=`<button class="compat-ms__button" type="button" aria-haspopup="listbox" aria-expanded="false">${esc(wrapper.dataset.placeholder)}</button><div class="compat-ms__menu"><div class="compat-ms__search"><input type="search" placeholder="Filtrar opções a partir de 1 caractere"><div class="compat-ms__actions"><button type="button" data-action="all">Marcar visíveis</button><button type="button" data-action="clear">Limpar seleção</button></div></div>${menuItems||'<div class="compat-empty">Sem opções.</div>'}<div class="compat-ms__no-results" hidden>Nenhuma opção encontrada.</div></div>`;
  const button=wrapper.querySelector('.compat-ms__button');const menu=wrapper.querySelector('.compat-ms__menu');const search=wrapper.querySelector('input[type="search"]');
  function update(){
    const chosen=Array.from(select.selectedOptions).map(option=>option.textContent.trim());
    button.textContent=!chosen.length?wrapper.dataset.placeholder:(chosen.length<=2?chosen.join(', '):`${chosen.length} selecionadas`);
    button.removeAttribute('title');button.setAttribute('aria-label',!chosen.length?wrapper.dataset.placeholder:`${chosen.length} opção${chosen.length===1?'':'ões'} selecionada${chosen.length===1?'':'s'}`);
    wrapper.querySelectorAll('.compat-ms__option input').forEach(input=>{const option=Array.from(select.options).find(item=>item.value===input.value);input.checked=Boolean(option&&option.selected);});
  }
  button.addEventListener('click',event=>{
    event.preventDefault();event.stopPropagation();
    $$('.compat-ms.open').forEach(item=>{if(item!==wrapper){item.classList.remove('open');item.querySelector('.compat-ms__button')?.setAttribute('aria-expanded','false');}});
    wrapper.classList.toggle('open');button.setAttribute('aria-expanded',wrapper.classList.contains('open')?'true':'false');
    if(wrapper.classList.contains('open'))setTimeout(()=>{wrapper.classList.toggle('align-right',menu.getBoundingClientRect().right>window.innerWidth-12);search&&search.focus();},0);
  });
  wrapper.querySelectorAll('.compat-ms__option input').forEach(input=>input.addEventListener('change',()=>{
    const option=Array.from(select.options).find(item=>item.value===input.value);if(option)option.selected=input.checked;
    update();select.dispatchEvent(new Event('change',{bubbles:true}));
  }));
  search&&search.addEventListener('input',()=>{
    const query=normalized(search.value),compactQuery=query.replace(/[^a-z0-9]/g,'');let visible=0;
    wrapper.querySelectorAll('.compat-ms__option').forEach(label=>{const value=normalized(label.textContent),compactValue=value.replace(/[^a-z0-9]/g,'');const show=!query||value.includes(query)||(compactQuery&&compactValue.includes(compactQuery));label.hidden=!show;label.style.display=show?'flex':'none';if(show)visible+=1;});
    const noResults=wrapper.querySelector('.compat-ms__no-results');if(noResults)noResults.hidden=visible>0;
  });
  wrapper.querySelector('[data-action="all"]')?.addEventListener('click',event=>{event.preventDefault();wrapper.querySelectorAll('.compat-ms__option').forEach(label=>{if(label.hidden||label.style.display==='none')return;const input=label.querySelector('input');const option=Array.from(select.options).find(item=>item.value===input.value);if(option)option.selected=true;});update();select.dispatchEvent(new Event('change',{bubbles:true}));});
  wrapper.querySelector('[data-action="clear"]')?.addEventListener('click',event=>{event.preventDefault();Array.from(select.options).forEach(option=>option.selected=false);update();select.dispatchEvent(new Event('change',{bubbles:true}));});
  wrapper.addEventListener('keydown',event=>{if(event.key==='Escape'){wrapper.classList.remove('open');button.setAttribute('aria-expanded','false');button.focus();}});
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
  $$('.compat-filter-stack .compat-native').forEach(select=>select.addEventListener('change',markFiltersDirty));
  document.addEventListener('click',event=>{if(!event.target.closest('.compat-ms'))$$('.compat-ms.open').forEach(item=>{item.classList.remove('open');item.querySelector('.compat-ms__button')?.setAttribute('aria-expanded','false');});});
}
function creditFilters(){return {om:selections($('#filterCreditOm')),acao:selections($('#filterCreditAcao')),planoInterno:selections($('#filterCreditPi')),natureza:selections($('#filterCreditNatureza')),projeto:selections($('#filterCreditProjeto')),fonte:selections($('#filterCreditFonte')),objetivo:selections($('#filterCreditObjetivo'))};}
function requestFilters(){const typed=String($('#filterReqText')?.value||'').trim();return {om:selections($('#filterReqOm')),projeto:selections($('#filterReqProjeto')),natureza:selections($('#filterReqNatureza')),prioridade:selections($('#filterReqPrioridade')),termos:unique([...requestTerms,...(typed?[typed]:[])])};}

function markFiltersDirty(){
  filtersDirty=true;
  $('#applyCompatFilters')?.classList.add('is-dirty');
  const status=$('#compatFilterStatus');if(status)status.textContent='Seleções alteradas. Clique em Consultar para atualizar a análise.';
}

function renderTerms(){
  const target=$('#reqTermChips');if(!target)return;
  target.innerHTML=requestTerms.map((term,index)=>`<span class="compat-term__chip" title="${esc(term)}">${esc(term.length>30?term.slice(0,30)+'…':term)}<button type="button" data-remove-term="${index}" aria-label="Remover ${esc(term)}">×</button></span>`).join('');
  target.querySelectorAll('[data-remove-term]').forEach(button=>button.addEventListener('click',()=>{requestTerms.splice(Number(button.dataset.removeTerm),1);renderTerms();markFiltersDirty();}));
}
function addTerm(){const input=$('#filterReqText');const term=String(input.value||'').trim();if(term&&!requestTerms.includes(term))requestTerms.push(term);input.value='';renderTerms();markFiltersDirty();}

function statusLabel(prefix){return {'M-':'Mapa aprovado','G-':'Mapa gerado','C-':'Em cotação','P-':'Pronto para cotação','I-':'Inserida para avaliação'}[prefix]||prefix;}
function shortDescription(value){const text=String(value==null?'':value).trim();return text.length>30?text.slice(0,30)+'...':text;}
function stableColor(value){const text=String(value||'N/I');let hash=0;for(let index=0;index<text.length;index+=1)hash=((hash<<5)-hash+text.charCodeAt(index))|0;return DETAIL_COLORS[Math.abs(hash)%DETAIL_COLORS.length];}
function projectDetail(codes){const projects=unique(codes||[]);if(!projects.length)return 'Sem projeto informado';if(projects.length===1)return (data.lookups?.projetos||{})[projects[0]]||projects[0];return `Compartilhado: ${projects.join(' / ')}`;}
function compactCategory(row,key){
  const omCode=String(row.omCodigo||String(key||'').split('|')[0]||'N/I');
  const fullLabel=String(row.label||omCode);const acronym=(fullLabel.split(/\s+-\s+/)[0]||omCode).trim();
  return `${omCode} · ${acronym} · ND ${row.natureza||'N/I'}`;
}
function chartLayout(title,height,maxValue,categoryKeys,categoryLabels,annotations){return {
  height,autosize:true,
  margin:{l:210,r:24,t:76,b:55,pad:0,autoexpand:false},
  paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',
  font:{family:'Montserrat,Arial,sans-serif',color:'#16345e',size:11},
  xaxis:{title,domain:[0,1],gridcolor:'#e7edf5',zeroline:false,tickprefix:'US$ ',tickformat:',.2s',range:[0,maxValue],rangemode:'tozero',fixedrange:true,automargin:false},
  yaxis:{domain:[0,1],categoryorder:'array',categoryarray:(categoryKeys||[]).slice(),tickmode:'array',tickvals:(categoryKeys||[]).slice(),ticktext:(categoryLabels||[]).slice(),automargin:false,fixedrange:true},
  legend:{orientation:'h',x:0,xanchor:'left',y:1.025,yanchor:'bottom',font:{size:10}},
  annotations:annotations||[],barmode:'overlay',hovermode:'closest',hoverlabel:{namelength:-1,align:'left',bgcolor:'#fff',bordercolor:'#cad7e6',font:{family:'Montserrat,Arial,sans-serif',size:11,color:'#16345e'}}
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
  const creditPeak=Math.max(0,...creditValues),demandPeak=Math.max(0,...demandTotals);
  const creditMax=creditPeak>0?creditPeak*1.08:1,demandMax=demandPeak>0?demandPeak*1.08:1,sharedMax=Math.max(creditMax,demandMax);
  return {order,labels,full,creditMap,demandMap,creditValues,demandTotals,creditMax,demandMax,sharedMax};
}
function placeSegments(rows,categoryOrder,detailValue,idValue){
  const positions=new Map(categoryOrder.map((key,index)=>[key,index]));const cursor=new Map();
  return (rows||[]).slice().sort((a,b)=>(positions.get(a.key)??Number.MAX_SAFE_INTEGER)-(positions.get(b.key)??Number.MAX_SAFE_INTEGER)||String(detailValue(a)).localeCompare(String(detailValue(b)),'pt-BR')||String(idValue(a)).localeCompare(String(idValue(b)),'pt-BR')).map(row=>{
    const base=cursor.get(row.key)||0;cursor.set(row.key,base+Number(row.valor||0));return {...row,base};
  });
}
function creditSegments(analysis,mode,categoryOrder){
  const rows=engine.buildPools(analysis.credits||[]).filter(pool=>Number(pool.original)>0).map(pool=>{
    const project=projectDetail(pool.projetos);const detail=mode==='action'?(pool.acao||'Ação não informada'):(mode==='project'?project:'Crédito disponível');
    return {key:engine.omNaturezaKey(pool.om,pool.natureza),valor:Number(pool.original),digito:pool.digito||'N/I',acao:pool.acao||'N/I',project,detail,color:mode==='total'?'#003676':stableColor(detail)};
  });
  return placeSegments(rows,categoryOrder,row=>row.detail,row=>row.digito);
}
function requestSegments(analysis,mode,categoryOrder){
  const rows=(analysis.compatible||[]).filter(row=>Number(row.valorUsd)>0).map(row=>{
    const prefix=engine.statusPrefix(row.status),project=row.projetoLabel||((data.lookups?.projetos||{})[row.projeto])||row.projeto||'Projeto não informado';const detail=mode==='project'?project:statusLabel(prefix);
    return {key:engine.omNaturezaKey(row.omCodigo,row.natureza),valor:Number(row.valorUsd),requisicao:row.requisicao||'N/I',project,descricao:shortDescription(row.descricao||row.nomenclatura),detail,color:mode==='project'?stableColor(project):(engine.STATUS_COLORS[prefix]||'#8d99a8')};
  });
  return placeSegments(rows,categoryOrder,row=>row.detail,row=>row.requisicao);
}
function creditTrace(segments,mode){const projectLine=mode==='project'?'<br><b>Projeto(s):</b> %{customdata[3]}':'';return {type:'bar',orientation:'h',showlegend:false,y:segments.map(row=>row.key),x:segments.map(row=>row.valor),base:segments.map(row=>row.base),customdata:segments.map(row=>[row.acao,row.digito,money(row.valor),row.project]),marker:{color:segments.map(row=>row.color),line:{color:'rgba(255,255,255,.42)',width:.35}},hovertemplate:`<b>Ação:</b> %{customdata[0]}<br><b>Dígito:</b> %{customdata[1]}<br><b>Saldo disponível:</b> %{customdata[2]}${projectLine}<extra></extra>`};}
function requestTrace(segments){return {type:'bar',orientation:'h',showlegend:false,y:segments.map(row=>row.key),x:segments.map(row=>row.valor),base:segments.map(row=>row.base),customdata:segments.map(row=>[row.project,row.requisicao,money(row.valor),row.descricao]),marker:{color:segments.map(row=>row.color),line:{color:'rgba(255,255,255,.38)',width:.3}},hovertemplate:'<b>Projeto:</b> %{customdata[0]}<br><b>Requisição:</b> %{customdata[1]}<br><b>Valor:</b> %{customdata[2]}<br><b>Descrição:</b> %{customdata[3]}<extra></extra>'};}
function statusLegendTraces(mode){return mode!=='status'?[]:engine.STATUS_ORDER.map(prefix=>({type:'bar',orientation:'h',name:statusLabel(prefix),x:[null],y:[null],showlegend:true,hoverinfo:'skip',marker:{color:engine.STATUS_COLORS[prefix]}}));}
function totalAnnotations(keys,values,maxValue,prefix){return keys.map((key,index)=>{const value=Number(values[index]||0);if(!value)return null;const inside=value>maxValue*.23;return {x:value,y:key,text:`${prefix||'Total'} ${money(value)}`,showarrow:false,xanchor:inside?'right':'left',xshift:inside?-4:4,yanchor:'middle',bgcolor:'rgba(255,255,255,.9)',bordercolor:'#d6e0ec',borderwidth:1,borderpad:2,font:{family:'Montserrat,Arial,sans-serif',size:9,color:'#16345e'}};}).filter(Boolean);}
async function drawCharts(analysis,creditTarget,requestTarget,exportMode,forceComparable){
  if(!window.Plotly)return;
  const series=chartSeries(analysis);const reversedLabels=series.labels.slice().reverse();const reversedKeys=series.order.slice().reverse();const height=Math.max(exportMode?520:430,series.order.length*27+120);
  const toggle=$('#compareCompatScale');const comparable=typeof forceComparable==='boolean'?forceComparable:(toggle?toggle.checked:true);const creditMax=comparable?series.sharedMax:series.creditMax;const demandMax=comparable?series.sharedMax:series.demandMax;
  const creditValues=reversedKeys.map(key=>Number(series.creditMap.get(key)?.valor||0)),creditRows=creditSegments(analysis,chartModes.credit,reversedKeys),requestRows=requestSegments(analysis,chartModes.request,reversedKeys);
  await Plotly.newPlot(creditTarget,[creditTrace(creditRows,chartModes.credit)],chartLayout('Saldo dos dígitos',height,creditMax,reversedKeys,reversedLabels,totalAnnotations(reversedKeys,creditValues,creditMax,'Total')), {displayModeBar:false,responsive:!exportMode,staticPlot:Boolean(exportMode)});
  const demandTotals=reversedKeys.map(key=>engine.STATUS_ORDER.reduce((sum,prefix)=>sum+Number((series.demandMap.get(key)?.values||{})[prefix]||0),0));
  await Plotly.newPlot(requestTarget,[requestTrace(requestRows),...statusLegendTraces(chartModes.request)],chartLayout('Valor das requisições',height,demandMax,reversedKeys,reversedLabels,totalAnnotations(reversedKeys,demandTotals,demandMax,'Total')),{displayModeBar:false,responsive:!exportMode,staticPlot:Boolean(exportMode)});
}

function setChartMode(group,mode){
  if(!Object.prototype.hasOwnProperty.call(chartModes,group))return;
  chartModes[group]=mode;
  const selector=group==='credit'?'[data-credit-detail]':'[data-request-detail]';
  $$(selector).forEach(button=>{const value=group==='credit'?button.dataset.creditDetail:button.dataset.requestDetail;const active=value===mode;button.classList.toggle('is-active',active);button.setAttribute('aria-pressed',active?'true':'false');});
  if(currentAnalysis)drawCharts(currentAnalysis,$('#chartCompatCredit'),$('#chartCompatRequests'),false);
}

function transferText(row){
  const transfers=(row.transfers||[]).map(item=>`${item.origemDigito||'N/I'} → ${(item.destinoDigitos||[]).join(', ')||'definir destino'}`);
  return unique(transfers).join('; ')||'Definir dígitos de origem e destino';
}

function planRows(plans,stage){return plans.filter(row=>row.stage===stage).sort((a,b)=>b.valorUsd-a.valorUsd);}
function immediateDigitRows(plans){
  const map=new Map();
  planRows(plans,'imediato').forEach(row=>(row.sources||[]).forEach(source=>{
    const digit=String(source.digito||'N/I');
    if(!map.has(digit))map.set(digit,{digito:digit,requisicoes:new Set(),oms:new Set(),naturezas:new Set(),valor:0});
    const target=map.get(digit);target.requisicoes.add(row.requisicao);target.oms.add(row.om||row.omCodigo);target.naturezas.add(row.natureza);target.valor+=Number(source.valor||0);
  }));
  return Array.from(map.values()).sort((a,b)=>b.valor-a.valor||a.digito.localeCompare(b.digito));
}
function immediateSourceCell(row){
  const sources=(row.sources||[]).slice().sort((a,b)=>String(a.digito).localeCompare(String(b.digito)));
  return sources.map(source=>`<div><strong>${esc(source.digito||'N/I')}</strong><br><small>Parcela: ${money(source.valor)}</small></div>`).join('')||'Não identificado';
}
function emptyRow(cols,text){return `<tr><td class="compat-empty" colspan="${cols}">${esc(text)}</td></tr>`;}
function renderPlans(analysis){
  const plans=analysis.allocation.plans;
  const immediate=planRows(plans,'imediato'),project=planRows(plans,'projeto'),pi=planRows(plans,'pi');
  $('#totalImmediate').textContent=money(immediate.reduce((sum,row)=>sum+row.valorUsd,0));
  $('#totalProjectMove').textContent=money(project.reduce((sum,row)=>sum+row.valorUsd,0));
  $('#totalPiMove').textContent=money(pi.reduce((sum,row)=>sum+row.valorUsd,0));
  $('#tableImmediate').innerHTML=immediate.length?immediate.map(row=>`<tr title="${esc(row.descricao)}"><td>${esc(row.requisicao)}</td><td>${esc(row.om)}<br>ND ${esc(row.natureza)}</td><td>${esc(row.projetoLabel||row.projeto)}</td><td>${immediateSourceCell(row)}</td><td>${money(row.valorUsd)}</td></tr>`).join(''):emptyRow(5,'Nenhuma requisição integralmente coberta sem realocação.');
  $('#tableProjectMove').innerHTML=project.length?project.slice(0,200).map(row=>{const origins=unique(row.sources.flatMap(source=>source.projetos||[]).filter(code=>code!==row.projeto)).join(', ')||'Projeto compartilhado';return `<tr title="Requisição ${esc(row.requisicao)}"><td>${esc(row.om)}<br>${esc(row.natureza)}</td><td>${esc(transferText(row))}</td><td>${esc(origins)} → ${esc(row.projeto)}</td><td>${money(row.valorUsd)}</td></tr>`;}).join(''):emptyRow(4,'Nenhuma realocação entre projetos necessária.');
  $('#tablePiMove').innerHTML=pi.length?pi.slice(0,200).map(row=>{const sourcePi=unique(row.sources.map(source=>source.planoInterno)).join(', ')||'Não informado';return `<tr title="Requisição ${esc(row.requisicao)}"><td>${esc(row.om)}<br>${esc(row.natureza)}</td><td>${esc(transferText(row))}</td><td>${esc(sourcePi)} → ${esc(row.destinoPi)}</td><td>${money(row.valorUsd)}</td></tr>`;}).join(''):emptyRow(4,'Nenhuma realocação entre Planos Internos necessária.');
}
function render(){
  if(!engine){$('#compatFilterStatus').textContent='Mecanismo de compatibilidade indisponível.';return;}
  const aligned=harmonizeFilters(creditFilters(),requestFilters());
  currentAnalysis=engine.analyze(data,aligned.credit,aligned.request);
  const summary=currentAnalysis.summary;
  $('#kpiCompatCredit').textContent=money(summary.creditoDisponivel);
  $('#kpiCompatDemand').textContent=money(summary.demandaCompativel);
  $('#kpiCompatPotential').textContent=money(summary.potencialEmpenho);
  $('#kpiCompatCount').textContent=integer(summary.requisicoesCobertas);
  $('#kpiCompatRemaining').textContent=money(summary.saldoAposPotencial);
  filtersDirty=false;$('#applyCompatFilters')?.classList.remove('is-dirty');
  $('#compatFilterStatus').textContent=`${integer(currentAnalysis.credits.length)} dígitos · ${integer(currentAnalysis.requests.length)} requisições selecionadas · ${integer(currentAnalysis.compatible.length)} compatíveis · OM, ND e projeto sincronizados`;
  drawCharts(currentAnalysis,$('#chartCompatCredit'),$('#chartCompatRequests'),false);
  renderPlans(currentAnalysis);
}

function mergeSelection(base,additional){
  if(!base.length)return additional.slice();if(!additional.length)return base.slice();
  const extra=new Set(additional);const intersection=base.filter(value=>extra.has(value));return intersection.length?intersection:['__SEM_CORRESPONDENCIA__'];
}
function harmonizeFilters(credit,request){
  const cf={...(credit||{})},rf={...(request||{})};
  ['om','natureza','projeto'].forEach(key=>{const shared=mergeSelection((cf[key]||[]).slice(),(rf[key]||[]).slice());cf[key]=shared.slice();rf[key]=shared.slice();});
  return {credit:cf,request:rf};
}
function reportAnalysis(){
  const aligned=harmonizeFilters(creditFilters(),requestFilters()),cf=aligned.credit,rf=aligned.request;const reportOms=selections($('#reportOm')),reportActions=selections($('#reportAcao'));
  cf.om=mergeSelection(cf.om,reportOms);cf.acao=mergeSelection(cf.acao,reportActions);rf.om=mergeSelection(rf.om,reportOms);
  return {analysis:engine.analyze(data,cf,rf),reportOms,reportActions};
}
function reportStyles(){return `<style>@page{size:A4 landscape;margin:9mm}body{font-family:Arial,sans-serif;color:#102d56;margin:24px}h1{margin:0;color:#00265f;font-size:23px}.meta{color:#607089;margin-top:5px;font-size:11px}.note{padding:9px 11px;background:#eef4fb;border-left:4px solid #003676;font-size:11px;line-height:1.4}.area{margin-top:18px;border:1px solid #dce4ef;border-radius:9px;overflow:hidden}.area-head{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:10px 12px;background:#f3f7fc;border-bottom:2px solid #ffd200}.area-head h2{margin:0;color:#00265f;font-size:16px}.area-summary{display:flex;gap:14px;color:#52627a;font-size:10px;white-space:nowrap}.area-summary strong{color:#003676;font-size:13px}table{width:100%;border-collapse:collapse;font-size:8.8px}th,td{padding:5px;border:1px solid #dce4ef;vertical-align:top}th{background:#003676;color:#fff;text-align:left}.action{font-weight:bold;color:#003676}.reqs{max-width:260px;line-height:1.35;overflow-wrap:anywhere}.muted{color:#65738a;font-size:9.5px}.print{position:sticky;top:0;margin-bottom:10px;padding:7px 0;background:#fff}.print button{padding:8px 12px;border:0;border-radius:7px;background:#003676;color:#fff;font-weight:bold}@media print{body{margin:0}.print{display:none}.area{break-before:auto}thead{display:table-header-group}tr{break-inside:avoid}}</style>`;}
function immediateReportRows(plans){
  const map=new Map();
  (plans||[]).filter(row=>row.stage==='imediato').forEach(row=>(row.sources||[]).forEach(source=>{
    const key=[source.digito,row.omCodigo,row.natureza,source.acao,source.planoInterno,row.projeto].join('|');
    if(!map.has(key))map.set(key,{digito:source.digito,om:row.om,omCodigo:row.omCodigo,natureza:row.natureza,acao:source.acao,pi:source.planoInterno,projeto:row.projetoLabel||row.projeto,requisicoes:new Set(),valor:0});
    const target=map.get(key);target.requisicoes.add(row.requisicao);target.valor+=Number(source.valor||0);
  }));
  return Array.from(map.values()).sort((a,b)=>b.valor-a.valor||String(a.digito).localeCompare(String(b.digito)));
}
function adjustmentReportRows(plans){
  const map=new Map();
  (plans||[]).filter(row=>row.stage==='projeto'||row.stage==='pi').forEach(row=>(row.transfers||[]).forEach(item=>{
    const origemProjetos=unique(item.origemProjetos||[]),destinoDigitos=unique(item.destinoDigitos||[]),destinoPis=unique(item.destinoPis||[]);const projetoDestino=row.projetoLabel||item.destinoProjeto||row.projeto;
    const tipo=row.stage==='projeto'?'Entre projetos (mesmo PI)':'Entre projetos com ajuste de PI';
    const key=[row.stage,row.omCodigo,row.natureza,item.origemAcao,item.origemDigito,destinoDigitos.join(','),origemProjetos.join(','),item.origemPi,destinoPis.join(','),row.projeto].join('|');
    if(!map.has(key))map.set(key,{tipo,om:row.om,omCodigo:row.omCodigo,natureza:row.natureza,acao:item.origemAcao,origemDigito:item.origemDigito,destinoDigitos,origemProjetos,projetoDestino,origemPi:item.origemPi,destinoPis,requisicoes:new Set(),valor:0});
    const target=map.get(key);target.requisicoes.add(row.requisicao);target.valor+=Number(item.valor||0);
  }));
  return Array.from(map.values()).sort((a,b)=>a.tipo.localeCompare(b.tipo,'pt-BR')||b.valor-a.valor);
}
function reportMetrics(rows){const requisicoes=new Set();let valor=0;(rows||[]).forEach(row=>{(row.requisicoes||[]).forEach(req=>requisicoes.add(req));valor+=Number(row.valor||0);});return {qtd:requisicoes.size,valor,requisicoes};}
function reportRequestList(row){return Array.from(row.requisicoes||[]).sort((a,b)=>String(a).localeCompare(String(b))).join(', ');}
function generateReport(){
  if(filtersDirty){alert('Há seleções ainda não consultadas. Clique em Consultar antes de gerar o relatório.');return;}
  const popup=window.open('','_blank');if(!popup){alert('Autorize pop-ups para gerar o relatório.');return;}
  popup.document.write('<p style="font-family:Arial;padding:30px">Gerando relatório para emprego do crédito…</p>');
  try{
    const bundle=reportAnalysis(),plans=bundle.analysis.allocation.plans,immediate=immediateReportRows(plans),adjustments=adjustmentReportRows(plans),immediateMetrics=reportMetrics(immediate),adjustmentMetrics=reportMetrics(adjustments);
    const omText=bundle.reportOms.length?bundle.reportOms.map(code=>(data.lookups.om||{})[code]||code).join('; '):'Todas as OM dos filtros analíticos';const actionText=bundle.reportActions.length?bundle.reportActions.join(', '):'Todas as ações dos filtros analíticos';
    const immediateBody=immediate.length?immediate.map(row=>`<tr><td class="action">${esc(row.digito||'N/I')}</td><td>${esc(row.om)}<br>ND ${esc(row.natureza)}</td><td>${esc(row.acao||'N/I')}<br>PI ${esc(row.pi||'N/I')}</td><td>${esc(row.projeto||'N/I')}</td><td class="reqs">${esc(reportRequestList(row))}</td><td>${integer(row.requisicoes.size)}</td><td>${money(row.valor)}</td></tr>`).join(''):'<tr><td colspan="7">Nenhum potencial empenho imediato nos filtros selecionados.</td></tr>';
    const adjustmentBody=adjustments.length?adjustments.map(row=>`<tr><td class="action">${esc(row.tipo)}</td><td>${esc(row.om)}<br>ND ${esc(row.natureza)}</td><td>${esc(row.origemProjetos.join(', ')||'N/I')} → ${esc(row.projetoDestino||'N/I')}</td><td>${esc(row.origemDigito||'N/I')} → ${esc(row.destinoDigitos.join(', ')||'Definir destino')}</td><td>${esc(row.acao||'N/I')}<br>PI ${esc(row.origemPi||'N/I')} → ${esc(row.destinoPis.join(', ')||'Definir PI')}</td><td class="reqs">${esc(reportRequestList(row))}</td><td>${integer(row.requisicoes.size)}</td><td>${money(row.valor)}</td></tr>`).join(''):'<tr><td colspan="8">Nenhum ajuste entre projetos necessário nos filtros selecionados.</td></tr>';
    const html=`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Relatório para emprego do crédito</title>${reportStyles()}</head><body><div class="print"><button onclick="window.print()">Imprimir / salvar em PDF</button></div><h1>Relatório para emprego do crédito</h1><div class="meta">Dados atualizados em ${esc(data.meta.geradoEm||'data não informada')} · Gerado em ${new Date().toLocaleString('pt-BR')}</div><p class="note"><strong>Filtros:</strong> OM requisitante: ${esc(omText)} · Ação orçamentária: ${esc(actionText)}.<br>Os valores representam parcelas efetivamente atribuídas a cada dígito. Toda origem e todo destino preservam a natureza de despesa da requisição; os dígitos de destino são candidatos e devem ser confirmados antes da movimentação.</p><section class="area"><div class="area-head"><h2>Potenciais empenhos imediatos</h2><div class="area-summary"><span><strong>${integer(immediateMetrics.qtd)}</strong> requisições</span><span><strong>${money(immediateMetrics.valor)}</strong> potencial</span></div></div><table><thead><tr><th>Dígito aplicável</th><th>OM / ND</th><th>Ação / PI</th><th>Projeto</th><th>Requisições</th><th>Qtd.</th><th>Valor potencialmente consumido</th></tr></thead><tbody>${immediateBody}</tbody></table></section><section class="area"><div class="area-head"><h2>Ajustes entre projetos para empenhar</h2><div class="area-summary"><span><strong>${integer(adjustmentMetrics.qtd)}</strong> requisições</span><span><strong>${money(adjustmentMetrics.valor)}</strong> a ajustar</span></div></div><table><thead><tr><th>Tipo de ajuste</th><th>OM / ND</th><th>Projeto origem → destino</th><th>Dígito origem → destino sugerido</th><th>Ação / PI origem → destino</th><th>Requisições</th><th>Qtd.</th><th>Valor a movimentar</th></tr></thead><tbody>${adjustmentBody}</tbody></table></section><p class="muted">As duas áreas abrangem todas as requisições integralmente financiáveis no cenário filtrado, sem duplicar o valor potencial.</p></body></html>`;
    popup.document.open();popup.document.write(html);popup.document.close();
  }catch(error){console.error(error);popup.document.body.innerHTML='<p style="font-family:Arial;padding:30px;color:#8b1a1a">Não foi possível gerar o relatório. Recarregue o painel e tente novamente.</p>';}
}

function resetFilters(){
  $$('.compat-native').forEach(select=>Array.from(select.options).forEach(option=>option.selected=false));$$('.compat-ms__search input').forEach(input=>{input.value='';input.dispatchEvent(new Event('input',{bubbles:true}));});requestTerms=[];$('#filterReqText').value='';renderTerms();updateAllMultis();render();
}
function applyFilters(){$$('.compat-ms.open').forEach(item=>{item.classList.remove('open');item.querySelector('.compat-ms__button')?.setAttribute('aria-expanded','false');});render();}
function init(){
  initFilters();renderTerms();
  $('#addReqTerm').addEventListener('click',addTerm);$('#filterReqText').addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();addTerm();}});$('#filterReqText').addEventListener('input',markFiltersDirty);
  $('#applyCompatFilters').addEventListener('click',applyFilters);$('#resetCompatFilters').addEventListener('click',resetFilters);$('#generateCompatReport').addEventListener('click',generateReport);
  $$('[data-credit-detail]').forEach(button=>button.addEventListener('click',()=>setChartMode('credit',button.dataset.creditDetail)));
  $$('[data-request-detail]').forEach(button=>button.addEventListener('click',()=>setChartMode('request',button.dataset.requestDetail)));
  const scaleToggle=$('#compareCompatScale');scaleToggle.checked=true;scaleToggle.addEventListener('change',()=>{if(currentAnalysis)drawCharts(currentAnalysis,$('#chartCompatCredit'),$('#chartCompatRequests'),false);});
  $('#compatGeneratedAt').textContent='Dados atualizados em '+(data.meta.geradoEm||'data não informada');
  $('#compatSource').textContent=`Fontes: ${data.meta.fonteCreditos||'digitos.xlsx'} e ${data.meta.fonteRequisicoes||'requisicoes.xlsx'} · Atualização: ${data.meta.geradoEm||'não informada'}.`;
  render();
  Object.assign(window.CABW_COMPAT_PANEL_TEST,{getAnalysis:()=>currentAnalysis,creditFilters,requestFilters,reportAnalysis,applyFilters});
}
window.CABW_COMPAT_PANEL_TEST={chartSeries,chartLayout,drawCharts,creditSegments,requestSegments,creditTrace,requestTrace,statusLegendTraces,totalAnnotations,shortDescription,setChartMode,getChartModes:()=>({...chartModes}),immediateDigitRows,immediateReportRows,adjustmentReportRows,reportMetrics,generateReport,mergeSelection,harmonizeFilters};
document.addEventListener('DOMContentLoaded',()=>{try{init();}catch(error){console.error('CABW compatibility error',error);const status=$('#compatFilterStatus');if(status)status.textContent='Não foi possível inicializar a análise.';}});
})();
