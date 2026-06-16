(function(){
'use strict';
const data=window.CABW_CREDIT_DATA||{digits:[],purchaseOrders:[],signatureOrders:[],meta:{}};
function $(s,c){return (c||document).querySelector(s)}
function $all(s,c){return Array.from((c||document).querySelectorAll(s))}
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function money(v){return 'US$ '+Number(v||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});}
function num(v){return Number(v||0).toLocaleString('pt-BR');}
function unique(a){return Array.from(new Set(a.filter(v=>v!==undefined&&v!==null&&String(v).trim()!==''))).sort((a,b)=>String(a).localeCompare(String(b),'pt-BR'))}
function opt(sel, vals, first){if(!sel)return; const keep=sel.value; sel.innerHTML='<option value="">'+esc(first||'Todos')+'</option>'+vals.map(v=>'<option value="'+esc(v)+'">'+esc(v)+'</option>').join(''); if(vals.map(String).includes(keep)) sel.value=keep;}
function pct(a,b){return b?((a/b)*100).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})+'%':'0,00%';}
function omLabel(r){return r.omLabel || ((r.sigla||'N/I')+(r.nomeUgr?' - '+r.nomeUgr:''));}
function projectLabel(code){return String(code||'').trim();}
function projectLabels(r){ if(Array.isArray(r.projetosLabels)&&r.projetosLabels.length) return r.projetosLabels; if(Array.isArray(r.projetos)) return r.projetos.map(projectLabel).filter(Boolean); if(r.projetoLabel) return [r.projetoLabel]; if(r.projeto) return [projectLabel(r.projeto)]; return []; }
function matchesProject(row, project){ if(!project) return true; return projectLabels(row).includes(project); }
function valuesOfFilter(){return {ug:$('#creditFilterUg')?.value||'', acao:$('#creditFilterAcao')?.value||'', natureza:$('#creditFilterNatureza')?.value||'', projeto:$('#creditFilterProjeto')?.value||''};}
function isAmendSignatureOrder(r){return String((r&&r.alteracao)||'').trim().toUpperCase().startsWith('AMEND');}
function rowMatches(r,f){return (!f.ug||omLabel(r)===f.ug)&&(!f.acao||r.acao===f.acao)&&(!f.natureza||r.natureza===f.natureza)&&matchesProject(r,f.projeto)}
function filtered(){ const f=valuesOfFilter(); return {digits:data.digits.filter(r=>rowMatches(r,f)), pos:data.purchaseOrders.filter(r=>rowMatches(r,f)), sig:data.signatureOrders.filter(r=>rowMatches(r,f)&&!isAmendSignatureOrder(r)), f}; }
function initFilters(){
  const d=data.digits||[], p=data.purchaseOrders||[], s=data.signatureOrders||[];
  opt($('#creditFilterUg'), unique([].concat(d.map(omLabel),p.map(omLabel),s.map(omLabel))).filter(v=>!/^\d+$/.test(String(v).trim())), 'Todas as UGs');
  opt($('#creditFilterAcao'), unique([].concat(d.map(r=>r.acao),p.map(r=>r.acao),s.map(r=>r.acao))), 'Todas as ações');
  opt($('#creditFilterNatureza'), unique([].concat(d.map(r=>r.natureza),p.map(r=>r.natureza),s.map(r=>r.natureza))), 'Todas as naturezas');
  opt($('#creditFilterProjeto'), unique([].concat(...d.map(projectLabels),...p.map(projectLabels),...s.map(projectLabels))), 'Todos os projetos');
  $all('#creditFilterUg,#creditFilterAcao,#creditFilterNatureza,#creditFilterProjeto').forEach(el=>el.addEventListener('change', renderAll));
  $('#clearCreditFilters')?.addEventListener('click',()=>{$all('#creditFilterUg,#creditFilterAcao,#creditFilterNatureza,#creditFilterProjeto').forEach(e=>e.value=''); renderAll();});
}
function renderExecutive(){
  if(!$('#kpiCreditAvailable')) return;
  const {digits,pos,sig}=filtered(); const credito=digits.reduce((a,r)=>a+Number(r.saldo||0),0); const empenhado=pos.reduce((a,r)=>a+Number(r.valorUsd||0),0); const assinatura=sig.reduce((a,r)=>a+Number(r.valorUsd||0),0); const total=credito+empenhado+assinatura;
  $('#kpiCreditAvailable').textContent=money(credito); $('#kpiCommitted').textContent=money(empenhado); $('#kpiSigning').textContent=money(assinatura); $('#kpiReceived').textContent=money(total); $('#kpiAvailablePct').textContent=pct(credito,total); $('#kpiDigitsCount').textContent=num(digits.length);
  const table=$('#executiveSummaryBody'); if(table){ table.innerHTML='<tr><td>2026</td><td class="text-right">'+money(credito)+'</td><td class="text-right">'+money(empenhado)+'</td><td class="text-right">'+money(assinatura)+'</td><td class="text-right">'+money(total)+'</td><td class="text-center">'+pct(credito,total)+'</td><td class="text-center">'+num(digits.length)+'</td></tr>'; }
}
function renderUG(){
  if(!$('#ugChart') && !$('#ugTableBody')) return;
  const {digits}=filtered(); const map=new Map(); digits.forEach(r=>{const k=omLabel(r); if(!map.has(k)) map.set(k,{label:k,sigla:r.sigla||'N/I',nome:r.nomeUgr||'',valor:0,lanc:0}); const o=map.get(k); o.valor+=Number(r.saldo||0); o.lanc++;});
  const rows=Array.from(map.values()).sort((a,b)=>b.valor-a.valor);
  const body=$('#ugTableBody'); if(body){body.innerHTML=rows.map(r=>'<tr><td>'+esc(r.sigla)+'</td><td>'+esc(r.nome)+'</td><td class="text-center">'+num(r.lanc)+'</td><td class="text-right">'+money(r.valor)+'</td></tr>').join('');}
  if(window.Plotly && $('#ugChart')) Plotly.newPlot('ugChart',[{type:'bar',orientation:'h',y:rows.map(r=>r.sigla).reverse(),x:rows.map(r=>r.valor).reverse(),text:rows.map(r=>money(r.valor)).reverse(),textposition:'auto',hovertext:rows.map(r=>r.label+'<br>'+money(r.valor)).reverse(),hoverinfo:'text', marker:{color:'#003b7a'}}],{margin:{l:110,r:30,t:20,b:40},xaxis:{title:'Saldo disponível (US$)'},height:Math.max(420,rows.length*30)}, {displayModeBar:false,responsive:true});
}
function renderAction(){
  if(!$('#actionChart') && !$('#actionTableBody')) return;
  const {digits}=filtered(); const map=new Map(); digits.forEach(r=>{const k=r.acao||'Sem ação'; if(!map.has(k)) map.set(k,{acao:k,desc:r.objetivo||'',ptres:new Set(),valor:0,lanc:0}); const o=map.get(k); o.valor+=Number(r.saldo||0); o.lanc++; if(r.ptres)o.ptres.add(r.ptres);});
  const rows=Array.from(map.values()).sort((a,b)=>b.valor-a.valor);
  const body=$('#actionTableBody'); if(body){body.innerHTML=rows.map(r=>'<tr><td>'+esc(r.acao)+'</td><td>'+esc(r.desc)+'</td><td>'+esc(Array.from(r.ptres).join(', '))+'</td><td class="text-center">'+num(r.lanc)+'</td><td class="text-right">'+money(r.valor)+'</td></tr>').join('');}
  if(window.Plotly && $('#actionChart')) Plotly.newPlot('actionChart',[{type:'bar',orientation:'h',y:rows.map(r=>r.acao).reverse(),x:rows.map(r=>r.valor).reverse(),text:rows.map(r=>money(r.valor)).reverse(),textposition:'auto',hovertext:rows.map(r=>r.desc+'<br>'+money(r.valor)).reverse(),hoverinfo:'text', marker:{color:'#003b7a'}}],{margin:{l:110,r:30,t:20,b:40},height:Math.max(420,rows.length*30)}, {displayModeBar:false,responsive:true});
}
function renderDetail(){
  if(!$('#detailTableBody')) return;
  const {digits}=filtered(); const total=digits.reduce((a,r)=>a+Number(r.saldo||0),0);
  $('#detailKpiCredit') && ($('#detailKpiCredit').textContent=money(total)); $('#detailKpiUgs') && ($('#detailKpiUgs').textContent=num(unique(digits.map(omLabel)).length)); $('#detailKpiActions') && ($('#detailKpiActions').textContent=num(unique(digits.map(r=>r.acao)).length));
  $('#detailTableBody').innerHTML=digits.sort((a,b)=>Number(b.saldo||0)-Number(a.saldo||0)).map(r=>'<tr><td>'+esc(r.digito)+'</td><td>'+esc(r.sigla)+'</td><td>'+esc(r.nomeUgr)+'</td><td>'+esc(r.acao)+'</td><td>'+esc(r.ptres)+'</td><td>'+esc(r.natureza)+'</td><td>'+esc(r.projetosTextoDetalhado||projectLabels(r).join(', '))+'</td><td class="text-right">'+money(r.saldo)+'</td><td>'+esc(r.objetivo)+'</td></tr>').join('');
}
function renderConsistency(){
  if(!$('#consistencyTableBody')) return;
  const all=data.digits||[]; const total=all.reduce((a,r)=>a+Number(r.saldo||0),0); const zeros=all.filter(r=>Number(r.saldo||0)===0).length; const positives=all.filter(r=>Number(r.saldo||0)>0).length;
  $('#consistencyTableBody').innerHTML='<tr><td>Total de dígitos carregados</td><td class="text-right">'+num(all.length)+'</td><td>Fonte: '+esc(data.meta.sourceDigits||'digitos.xlsx')+'</td></tr><tr><td>Dígitos com saldo disponível</td><td class="text-right">'+num(positives)+'</td><td>'+money(total)+'</td></tr><tr><td>Dígitos sem saldo disponível</td><td class="text-right">'+num(zeros)+'</td><td>Saldo igual a US$ 0.00</td></tr>';
}
function renderAll(){renderExecutive(); renderUG(); renderAction(); renderDetail(); renderConsistency();}
document.addEventListener('DOMContentLoaded',()=>{try{initFilters(); renderAll();}catch(e){console.error('CABW credit panel error',e);}});
})();
