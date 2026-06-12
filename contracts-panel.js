// contracts-panel.js
// Renderiza menus, indicadores, filtros, tabelas e PDF dos painéis de contratos CABW.
(function(){
  'use strict';
  const root = window.CABW_CONTRACTS_DATA || {records: window.contractsData || window.CONTRACTS_DATA || [], summary: window.CONTRACTS_SUMMARY || {}};
  const records = Array.isArray(root.records) ? root.records : (Array.isArray(root) ? root : []);
  const summary = root.summary || window.CONTRACTS_SUMMARY || {};
  const categoryLabels = {administrativos:'Contratos Administrativos', finalisticos:'Contratos Finalísticos', fms:'FMS'};
  const categoryDescriptions = {
    administrativos:'Classificação aplicada: contratos administrativos cujo Grande Comando é CW.',
    finalisticos:'Contratos finalísticos, excluídos os administrativos e os FMS.',
    fms:'Classificação aplicada: contratos FMS cujo CAGE da empresa é W2525.'
  };
  function $(sel, ctx){return (ctx||document).querySelector(sel)}
  function $all(sel, ctx){return Array.from((ctx||document).querySelectorAll(sel))}
  function text(el, value){if(el) el.textContent = value}
  function esc(s){return String(s ?? '').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function money(v, currency){
    const n = Number(v||0); const cur = currency || 'USD';
    try { return new Intl.NumberFormat('pt-BR',{style:'currency',currency:cur,maximumFractionDigits:2}).format(n); }
    catch(e){ return cur+' '+n.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2}); }
  }
  function fmtNum(v){return Number(v||0).toLocaleString('pt-BR');}
  function dateBr(s){if(!s) return '—'; const d = new Date(String(s).slice(0,10)+'T00:00:00'); return isNaN(d) ? String(s) : d.toLocaleDateString('pt-BR');}
  function statusContrato(c){
    if(!c.dataFinal) return 'Sem data final';
    const d = new Date(String(c.dataFinal).slice(0,10)+'T00:00:00');
    if(isNaN(d)) return 'Sem data final';
    const today = new Date(); today.setHours(0,0,0,0);
    return d < today ? 'Encerrado' : 'Vigente';
  }
  function unique(arr){return Array.from(new Set(arr.filter(v => v !== undefined && v !== null && String(v).trim() !== ''))).sort((a,b)=>String(a).localeCompare(String(b),'pt-BR'))}
  function optionize(sel, values, first){
    if(!sel) return;
    const current = sel.value;
    sel.innerHTML = '';
    const opt = document.createElement('option'); opt.value=''; opt.textContent=first || 'Todos'; sel.appendChild(opt);
    values.forEach(v=>{const o=document.createElement('option'); o.value=String(v); o.textContent=String(v); sel.appendChild(o);});
    if(values.map(String).includes(current)) sel.value = current;
  }
  function catRows(cat){return records.filter(r=>r.category===cat)}
  function aggregate(rows){return rows.reduce((a,r)=>{a.count++; a.value+=Number(r.valorContrato||0); a.paidUsd+=Number(r.totalEmpenhadoUsd||0); a.billedUsd+=Number(r.totalFaturadoUsd||0); return a;},{count:0,value:0,paidUsd:0,billedUsd:0});}
  function renderOverview(){
    if(!document.querySelector('[data-contract-overview]')) return;
    const allAgg = aggregate(records);
    text($('[data-all-contracts-count]'), fmtNum(allAgg.count));
    text($('[data-all-contracts-paid]'), money(allAgg.paidUsd,'USD')+' empenhados');
    text($('[data-contract-source]'), 'Fonte: '+(summary.source||'controle_financeiro_contratos.xlsx'));
    $all('[data-contract-summary]').forEach(card=>{
      const cat = card.getAttribute('data-contract-summary');
      const rows = catRows(cat); const a = aggregate(rows);
      text($('[data-summary-count]',card), fmtNum(a.count));
      text($('[data-summary-value]',card), money(a.value, rows[0]?.moeda || 'USD'));
      text($('[data-summary-paid]',card), money(a.paidUsd,'USD'));
    });
  }
  function currentFilterRows(base, filters){
    const q = (filters.search?.value || '').toLowerCase().trim();
    return base.filter(r=>{
      if(filters.empresa?.value && r.empresa !== filters.empresa.value) return false;
      if(filters.unidade?.value && r.unidade !== filters.unidade.value) return false;
      if(filters.gc?.value && r.grandComando !== filters.gc.value) return false;
      if(filters.ordenador?.value && r.ordenadorDespesa !== filters.ordenador.value) return false;
      if(filters.acao?.value && r.acao !== filters.acao.value) return false;
      if(filters.moeda?.value && r.moeda !== filters.moeda.value) return false;
      if(filters.status?.value && statusContrato(r) !== filters.status.value) return false;
      if(q){
        const hay = [r.contrato,r.numero,r.unidade,r.ordenadorDespesa,r.grandComando,r.empresa,r.objetoResumo,r.moeda,r.acao,r.cage].join(' ').toLowerCase();
        if(!hay.includes(q)) return false;
      }
      return true;
    });
  }
  function renderPanel(){
    const cat = document.body.getAttribute('data-contract-category');
    if(!cat) return;
    const base = catRows(cat);
    text($('#contract-section-title'), categoryLabels[cat] || 'Contratos');
    text($('.contract-section-card__status'), categoryDescriptions[cat] || '');
    const filters = {empresa: $('#filterEmpresa'), unidade: $('#filterUnidade'), gc: $('#filterGrandeComando'), ordenador: $('#filterOrdenador'), acao: $('#filterAcao'), moeda: $('#filterMoeda'), status: $('#filterStatus'), search: $('#filterContratoSearch')};
    optionize(filters.empresa, unique(base.map(r=>r.empresa)), 'Todas as empresas');
    optionize(filters.unidade, unique(base.map(r=>r.unidade)), 'Todas as unidades');
    optionize(filters.gc, unique(base.map(r=>r.grandComando)), 'Todos os Grandes Comandos');
    optionize(filters.ordenador, unique(base.map(r=>r.ordenadorDespesa)), 'Todos os Ordenadores de Despesas');
    optionize(filters.acao, unique(base.map(r=>r.acao)), 'Todas as ações');
    optionize(filters.moeda, unique(base.map(r=>r.moeda)), 'Todas as moedas');
    function render(){
      const rows = currentFilterRows(base, filters); const a = aggregate(rows);
      text($('[data-kpi="count"]'), fmtNum(a.count));
      text($('[data-kpi="value"]'), money(a.value, rows[0]?.moeda || 'USD'));
      text($('[data-kpi="paidUsd"]'), money(a.paidUsd,'USD'));
      text($('[data-kpi="billedUsd"]'), money(a.billedUsd,'USD'));
      text($('[data-contract-results]'), fmtNum(rows.length)+' contrato(s)');
      text($('[data-contract-source]'), 'Fonte: '+(summary.source||'controle_financeiro_contratos.xlsx'));
      const tbody = $('#contractsTable tbody'); if(tbody){ tbody.innerHTML=''; rows.forEach(r=>{ const tr=document.createElement('tr');
        tr.innerHTML = '<td>'+esc(r.contrato)+'</td><td>'+esc(r.numero)+'</td><td>'+esc(r.unidade)+'</td><td>'+esc(r.ordenadorDespesa)+'</td><td>'+esc(r.grandComando)+'</td><td>'+esc(r.empresa)+'</td><td>'+esc(r.objetoResumo)+'</td><td>'+esc(r.moeda)+'</td><td class="text-right">'+money(r.valorContrato,r.moeda||'USD')+'</td><td class="text-right">'+money(r.totalEmpenhadoUsd,'USD')+'</td><td class="text-right">'+money(r.totalFaturadoUsd,'USD')+'</td><td>'+dateBr(r.dataFinal)+'</td><td>'+statusContrato(r)+'</td>';
        tbody.appendChild(tr);
      }); }
      const mobile = $('#contractsMobileList'); if(mobile){ mobile.innerHTML=''; rows.slice(0,300).forEach(r=>{ const d=document.createElement('article'); d.className='contracts-mobile-card'; d.innerHTML='<h3>'+esc(r.numero||r.contrato)+'</h3><p>'+esc(r.empresa)+'</p><p>'+esc(r.objetoResumo)+'</p><dl><div><dt>Contrato</dt><dd>'+esc(r.contrato)+'</dd></div><div><dt>Valor</dt><dd>'+money(r.valorContrato,r.moeda||'USD')+'</dd></div><div><dt>Vigência</dt><dd>'+statusContrato(r)+'</dd></div></dl>'; mobile.appendChild(d); }); }
    }
    Object.values(filters).forEach(el=>{ if(el) el.addEventListener(el.tagName==='INPUT'?'input':'change', render); });
    const reset=$('#resetContractFilters'); if(reset) reset.addEventListener('click',()=>{ Object.values(filters).forEach(el=>{if(el) el.value='';}); render(); });
    const pdf=$('#generateContractsPdf'); if(pdf) pdf.addEventListener('click',()=>generatePdf(categoryLabels[cat]||'Contratos', currentFilterRows(base, filters)));
    render();
  }
  function generatePdf(title, rows){
    if(!window.jspdf || !window.jspdf.jsPDF){ alert('Biblioteca PDF não carregada.'); return; }
    const doc = new window.jspdf.jsPDF({orientation:'landscape',unit:'pt',format:'a4'});
    doc.setFont('helvetica','bold'); doc.setFontSize(15); doc.text('Painel CABW - '+title,40,40);
    doc.setFont('helvetica','normal'); doc.setFontSize(9); doc.text('Fonte: '+(summary.source||'controle_financeiro_contratos.xlsx')+' | Registros filtrados: '+rows.length,40,58);
    const body = rows.map(r=>[r.contrato,r.numero,r.unidade,r.ordenadorDespesa,r.grandComando,r.empresa,short(r.objetoResumo,70),r.moeda,money(r.valorContrato,r.moeda||'USD'),money(r.totalEmpenhadoUsd,'USD'),money(r.totalFaturadoUsd,'USD'),dateBr(r.dataFinal),statusContrato(r)]);
    doc.autoTable({head:[['Contrato','Número','Unidade','OD','GC','Empresa','Objeto','Moeda','Valor','Emp. USD','Fat. USD','Data final','Vigência']],body, startY:75, styles:{fontSize:6,cellPadding:2,overflow:'linebreak'}, headStyles:{fillColor:[18,64,112]}, columnStyles:{6:{cellWidth:160},8:{halign:'right'},9:{halign:'right'},10:{halign:'right'}}});
    doc.save('contratos-cabw.pdf');
  }
  function short(s,n){s=String(s||''); return s.length>n?s.slice(0,n-1)+'…':s;}
  document.addEventListener('DOMContentLoaded',()=>{ renderOverview(); renderPanel(); });
})();
