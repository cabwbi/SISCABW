(function () {
  'use strict';

  const DATA = window.CABW_PROCESSOS_DATA || { meta: {}, summary: {}, materials: [], repairs: [] };
  const pageMode = document.body && document.body.dataset.processPage;
  const $ = (selector, scope) => (scope || document).querySelector(selector);
  const $$ = (selector, scope) => Array.from((scope || document).querySelectorAll(selector));
  const money = value => 'US$ ' + Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const number = value => Number(value || 0).toLocaleString('pt-BR', { maximumFractionDigits: 2 });
  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const norm = value => String(value || '').toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

  function dateTime(value) {
    if (!value) return 'Data de geração não informada';
    const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);
    return match ? `Dados gerados em ${match[3]}/${match[2]}/${match[1]} às ${match[4]}:${match[5]}` : `Dados gerados em ${value}`;
  }

  function initLanding() {
    const materials = DATA.summary.materiais2026 || DATA.summary.materials2026 || {};
    const repairs = DATA.summary.reparos2026 || {};
    const values = {
      materialsCount: number(materials.requisicoes),
      materialsValue: money(materials.valorEmpenhadoUsd),
      repairsCount: number(repairs.requisicoes),
      repairsValue: money(repairs.valorEmpenhadoUsd),
    };
    Object.entries(values).forEach(([key, value]) => {
      $$(`[data-summary="${key}"]`).forEach(element => { element.textContent = value; element.title = value; });
    });
    $$('[data-generated-at]').forEach(element => { element.textContent = dateTime(DATA.meta.geradoEm); });
  }

  const FILTERS = [
    ['om', 'OM Requisitante'],
    ['projetoLabel', 'Projeto'],
    ['anoAbertura', 'Ano'],
    ['faixaValor', 'Faixa de Valor'],
    ['tipoRequisicao', 'Tipo da requisição'],
    ['grandeComando', 'Grande Comando'],
    ['empresaVencedora', 'Empresa vencedora'],
    ['empresaFabricante', 'Empresa fabricante'],
    ['descricao', 'Descrição do item'],
    ['partNumber', 'Part Number'],
    ['requisicao', 'Número da requisição'],
    ['certame', 'Número do certame SILOMS'],
    ['status', 'Situação da requisição'],
    ['po', 'Número da ordem de compra'],
    ['situacaoRetorno', 'Situação de retorno do item'],
    ['situacaoReparavel', 'Situação do reparável'],
  ];
  const RANGE_ORDER = ['Até US$ 10 mil', 'US$ 10 mil a US$ 50 mil', 'US$ 50 mil a US$ 250 mil', 'US$ 250 mil a US$ 1 milhão', 'Acima de US$ 1 milhão'];
  let sourceRows = [];
  let filteredRows = [];
  let currentPage = 1;
  const pageSize = 25;

  function unique(rows, field) {
    const values = Array.from(new Set(rows.map(row => String(row[field] || '').trim()).filter(Boolean)));
    if (field === 'faixaValor') return RANGE_ORDER.filter(value => values.includes(value));
    return values.sort((a, b) => a.localeCompare(b, 'pt-BR', { numeric: true }));
  }

  function selectedValues(select) {
    return select ? Array.from(select.selectedOptions).map(option => option.value) : [];
  }

  function buttonText(select) {
    const chosen = Array.from(select.selectedOptions).map(option => option.textContent.trim());
    if (!chosen.length) return 'Todas as opções';
    if (chosen.length <= 2) return chosen.join(', ');
    return `${chosen.length} selecionadas`;
  }

  function syncMulti(select, wrapper) {
    const button = $('.proc-multi__button', wrapper);
    button.textContent = buttonText(select);
    button.title = Array.from(select.selectedOptions).map(option => option.textContent.trim()).join(', ');
    const selected = new Set(selectedValues(select));
    $$('.proc-multi__option input', wrapper).forEach(input => { input.checked = selected.has(input.value); });
  }

  function buildMulti(select) {
    const wrapper = document.createElement('div');
    wrapper.className = 'proc-multi';
    const options = Array.from(select.options);
    wrapper.innerHTML = `
      <button class="proc-multi__button" type="button" aria-haspopup="listbox" aria-expanded="false">Todas as opções</button>
      <div class="proc-multi__menu">
        <div class="proc-multi__search"><input type="search" autocomplete="off" placeholder="Pesquisar opção..."><button type="button" data-multi-action="apply">Aplicar</button></div>
        <div class="proc-multi__actions"><button type="button" data-multi-action="all">Marcar todas</button><button type="button" data-multi-action="clear">Limpar</button></div>
        <div class="proc-multi__options">${options.map(option => `<label class="proc-multi__option"><input type="checkbox" value="${esc(option.value)}"><span>${esc(option.textContent)}</span></label>`).join('')}</div>
      </div>`;
    select.insertAdjacentElement('afterend', wrapper);
    const button = $('.proc-multi__button', wrapper);
    const menu = $('.proc-multi__menu', wrapper);
    const search = $('.proc-multi__search input', wrapper);
    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      $$('.proc-multi.open').forEach(other => { if (other !== wrapper) other.classList.remove('open'); });
      wrapper.classList.toggle('open');
      wrapper.classList.remove('align-right');
      button.setAttribute('aria-expanded', wrapper.classList.contains('open') ? 'true' : 'false');
      if (wrapper.classList.contains('open')) {
        setTimeout(() => { if (menu.getBoundingClientRect().right > window.innerWidth - 14) wrapper.classList.add('align-right'); }, 0);
      }
    });
    menu.addEventListener('click', event => event.stopPropagation());
    search.addEventListener('input', () => {
      const query = norm(search.value);
      $$('.proc-multi__option', wrapper).forEach(label => { label.hidden = !!query && !norm(label.textContent).includes(query); });
    });
    $('[data-multi-action="all"]', wrapper).addEventListener('click', () => {
      $$('.proc-multi__option:not([hidden]) input', wrapper).forEach(input => { input.checked = true; });
    });
    $('[data-multi-action="clear"]', wrapper).addEventListener('click', () => {
      $$('.proc-multi__option input', wrapper).forEach(input => { input.checked = false; });
      search.value = '';
      $$('.proc-multi__option', wrapper).forEach(label => { label.hidden = false; });
    });
    $('[data-multi-action="apply"]', wrapper).addEventListener('click', () => {
      const checked = new Set($$('.proc-multi__option input:checked', wrapper).map(input => input.value));
      Array.from(select.options).forEach(option => { option.selected = checked.has(option.value); });
      syncMulti(select, wrapper);
      wrapper.classList.remove('open');
      select.dispatchEvent(new Event('change', { bubbles: true }));
    });
    syncMulti(select, wrapper);
  }

  function populateFilters() {
    FILTERS.forEach(([field]) => {
      const select = $(`select[data-filter="${field}"]`);
      if (!select) return;
      select.multiple = true;
      unique(sourceRows, field).forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
      });
      buildMulti(select);
      select.addEventListener('change', applyFilters);
    });
    document.addEventListener('click', () => $$('.proc-multi.open').forEach(wrapper => wrapper.classList.remove('open')));
  }

  function applyFilters() {
    const active = FILTERS.map(([field]) => {
      const select = $(`select[data-filter="${field}"]`);
      return [field, new Set(selectedValues(select))];
    }).filter(([, values]) => values.size);
    filteredRows = sourceRows.filter(row => active.every(([field, values]) => values.has(String(row[field] || '').trim())));
    currentPage = 1;
    renderAll();
  }

  function resetFilters() {
    $$('select[data-filter]').forEach(select => {
      Array.from(select.options).forEach(option => { option.selected = false; });
      const wrapper = select.nextElementSibling;
      if (wrapper && wrapper.classList.contains('proc-multi')) syncMulti(select, wrapper);
    });
    applyFilters();
  }

  function sum(rows, field) { return rows.reduce((total, row) => total + Number(row[field] || 0), 0); }
  function countDistinct(rows, field) { return new Set(rows.map(row => row[field]).filter(Boolean)).size; }
  function countReturn(rows, label) { return sum(rows.filter(row => row.situacaoRetorno === label), 'quantidade'); }
  function economy(rows) {
    const comparable = rows.filter(row => Number(row.valorReferenciaUsd || 0) > 0);
    const reference = sum(comparable, 'valorReferenciaUsd');
    const total = sum(comparable, 'valorEmpenhadoUsd');
    const absolute = reference - total;
    const percent = reference ? absolute / reference * 100 : 0;
    return { absolute, percent, comparable: comparable.length };
  }

  function kpiCard(label, value, icon, note) {
    return `<article class="proc-kpi"><div class="proc-kpi__top"><span class="proc-kpi__icon"><i class="bi ${esc(icon)}"></i></span></div><div class="proc-kpi__label">${esc(label)}</div><strong title="${esc(value)}">${esc(value)}</strong><small>${esc(note || 'Conforme filtros aplicados')}</small></article>`;
  }

  function renderKpis() {
    const container = $('#procKpis');
    if (!container) return;
    const base = [
      ['Quantidade de requisições', number(filteredRows.length), 'bi-file-earmark-text', 'Registros no escopo selecionado'],
      ['Valor total empenhado', money(sum(filteredRows, 'valorEmpenhadoUsd')), 'bi-currency-dollar', 'Soma do valor das requisições'],
      ['Requisitantes atendidos', number(countDistinct(filteredRows, 'om')), 'bi-buildings', 'OMs requisitantes distintas'],
    ];
    const saving = economy(filteredRows);
    base.push([
      'Economia da licitação',
      money(saving.absolute),
      'bi-graph-down-arrow',
      saving.comparable
        ? `${saving.percent >= 0 ? 'Redução' : 'Acréscimo'} de ${number(Math.abs(saving.percent))}% sobre o valor de referência`
        : 'Sem valor de referência no recorte',
    ]);
    if (pageMode === 'materials') {
      base.push(['Itens em atraso', number(sum(filteredRows, 'itensAtrasados')), 'bi-clock-history', 'Quantidade pendente com DPE vencida']);
    } else {
      base.push(
        ['Quantidade de itens', number(sum(filteredRows, 'quantidade')), 'bi-box-seam', 'Soma das quantidades requisitadas'],
        ['BER', number(countReturn(filteredRows, 'BER')), 'bi-exclamation-octagon', 'Itens classificados como BER'],
        ['BPR', number(countReturn(filteredRows, 'BPR')), 'bi-wrench-adjustable', 'Itens classificados como BPR'],
        ['AS IS', number(countReturn(filteredRows, 'AS IS')), 'bi-box-arrow-up-right', 'Itens classificados como AS IS'],
        ['Reparados', number(countReturn(filteredRows, 'Reparado')), 'bi-check2-circle', 'Itens com retorno reparado'],
        ['Em processo', number(countReturn(filteredRows, 'Em processo')), 'bi-hourglass-split', 'Condição de retorno ainda em branco'],
      );
    }
    container.innerHTML = base.map(item => kpiCard(...item)).join('');
  }

  function topBuckets(rows, key, valueField, limit) {
    const map = new Map();
    rows.forEach(row => {
      const label = String(row[key] || 'Não informado').trim() || 'Não informado';
      const value = valueField ? Number(row[valueField] || 0) : 1;
      map.set(label, (map.get(label) || 0) + value);
    });
    const ordered = Array.from(map, ([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
    const selected = ordered.slice(0, limit || 14);
    if (ordered.length > selected.length) selected.push({ label: 'Outros', value: ordered.slice(selected.length).reduce((total, item) => total + item.value, 0) });
    return selected.reverse();
  }

  function drawBar(id, rows, key, valueField, color, isMoney) {
    const element = document.getElementById(id);
    if (!element) return;
    if (!window.Plotly) { element.innerHTML = '<p class="proc-empty">Biblioteca de gráficos não carregada.</p>'; return; }
    const items = topBuckets(rows, key, valueField, 14);
    const x = items.map(item => item.value);
    const y = items.map(item => item.label);
    Plotly.react(element, [{
      type: 'bar', orientation: 'h', x, y,
      marker: { color },
      customdata: x.map(value => isMoney ? money(value) : number(value)),
      hovertemplate: '<b>%{y}</b><br>%{customdata}<extra></extra>',
    }], {
      margin: { l: 185, r: 24, t: 18, b: 42 },
      xaxis: { gridcolor: '#e6edf5', zeroline: false, tickformat: isMoney ? '$,.2s' : ',.0f', automargin: true },
      yaxis: { automargin: true, tickfont: { size: 10 } },
      paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: '#fff',
      font: { family: 'Montserrat, Arial, sans-serif', color: '#244160' },
      showlegend: false,
    }, { displayModeBar: false, responsive: true });
  }

  function drawReturnByCompany() {
    const element = document.getElementById('chartRetornoEmpresa');
    if (!element || !window.Plotly) return;
    const companies = topBuckets(filteredRows, 'empresaVencedora', null, 11).filter(item => item.label !== 'Outros').reverse().map(item => item.label);
    const statuses = ['BER', 'BPR', 'AS IS', 'Reparado', 'Em processo', 'Outros'];
    const knownStatuses = new Set(statuses.filter(status => status !== 'Outros'));
    const colors = ['#b4232f', '#ef8b27', '#758399', '#17805c', '#1769aa', '#6f7783'];
    const companyTotals = new Map(companies.map(company => [company, filteredRows.filter(row => row.empresaVencedora === company).length]));
    const traces = statuses.map((status, index) => {
      const counts = companies.map(company => filteredRows.filter(row => row.empresaVencedora === company && (status === 'Outros' ? !knownStatuses.has(row.situacaoRetorno) : row.situacaoRetorno === status)).length);
      return {
        type: 'bar', orientation: 'h', name: status, y: companies, x: counts,
        customdata: counts.map((count, companyIndex) => companyTotals.get(companies[companyIndex]) ? count / companyTotals.get(companies[companyIndex]) * 100 : 0),
        marker: { color: colors[index] },
        hovertemplate: `<b>%{y}</b><br>${status}: %{x} requisição(ões)<br>%{customdata:.1f}%<extra></extra>`,
      };
    });
    Plotly.react(element, traces, {
      barmode: 'stack', barnorm: 'percent',
      margin: { l: 210, r: 26, t: 24, b: 50 },
      xaxis: { title: 'Percentual dentro da empresa', ticksuffix: '%', range: [0, 100], gridcolor: '#e6edf5' },
      yaxis: { automargin: true, tickfont: { size: 10 } },
      legend: { orientation: 'h', y: 1.13, x: 0 },
      paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: '#fff',
      font: { family: 'Montserrat, Arial, sans-serif', color: '#244160' },
    }, { displayModeBar: false, responsive: true });
  }

  function renderCharts() {
    drawBar('chartValorOm', filteredRows, 'om', 'valorEmpenhadoUsd', '#00569b', true);
    drawBar('chartQtdOm', filteredRows, 'om', null, '#4f7eaa', false);
    drawBar('chartQtdEmpresa', filteredRows, 'empresaVencedora', null, '#d4a900', false);
    drawBar('chartValorEmpresa', filteredRows, 'empresaVencedora', 'valorEmpenhadoUsd', '#e1b900', true);
    drawBar('chartQtdProjeto', filteredRows, 'projetoLabel', null, '#48728f', false);
    drawBar('chartValorProjeto', filteredRows, 'projetoLabel', 'valorEmpenhadoUsd', '#0b7a75', true);
    drawBar('chartQtdSituacao', filteredRows, 'status', null, '#6f42c1', false);
    drawBar('chartValorSituacao', filteredRows, 'status', 'valorEmpenhadoUsd', '#8b5cc7', true);
    if (pageMode === 'repairs') drawReturnByCompany();
  }

  function dateBr(value) {
    const parts = String(value || '').slice(0, 10).split('-');
    return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : '—';
  }

  function tableRow(row) {
    const base = `
      <td><strong>${esc(row.requisicao)}</strong></td>
      <td>${esc(row.certame)}</td>
      <td class="proc-table__desc" title="${esc(row.descricaoCompleta || row.descricao)}">${esc(row.descricao)}</td>
      <td>${esc(number(row.quantidade))}</td>
      <td>${esc(row.empresaFabricante)}</td>
      <td>${esc(row.empresaVencedora)}</td>
      <td>${esc(row.po)}</td>
      <td class="proc-table__money">${esc(money(row.valorEmpenhadoUsd))}</td>
      <td class="proc-table__money">${esc(money(row.saldoPoUsd))}</td>
      <td><span class="proc-status${row.atrasada ? ' proc-status--late' : ''}">${esc(row.status)}</span></td>
      <td>${esc(dateBr(row.dpe))}</td>`;
    if (pageMode === 'repairs') return `<tr>${base}<td><span class="proc-status">${esc(row.situacaoRetorno)}</span></td><td>${esc(row.situacaoReparavel)}</td></tr>`;
    return `<tr>${base}</tr>`;
  }

  function renderTable() {
    const body = $('#procTableBody');
    if (!body) return;
    const pages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
    currentPage = Math.min(currentPage, pages);
    const start = (currentPage - 1) * pageSize;
    const rows = filteredRows.slice(start, start + pageSize);
    const columns = pageMode === 'repairs' ? 13 : 11;
    body.innerHTML = rows.length ? rows.map(tableRow).join('') : `<tr><td colspan="${columns}" class="proc-empty">Nenhuma requisição corresponde aos filtros selecionados.</td></tr>`;
    const info = $('#procTableInfo');
    if (info) info.textContent = filteredRows.length ? `Exibindo ${start + 1}–${Math.min(start + pageSize, filteredRows.length)} de ${number(filteredRows.length)} requisições` : 'Nenhuma requisição encontrada';
    const current = $('#procPageCurrent');
    if (current) current.textContent = `${currentPage} / ${pages}`;
    const previous = $('#procPagePrev');
    const next = $('#procPageNext');
    if (previous) previous.disabled = currentPage <= 1;
    if (next) next.disabled = currentPage >= pages;
  }

  function renderAll() {
    renderKpis();
    renderCharts();
    renderTable();
    const total = $('#procFilteredTotal');
    if (total) total.textContent = `${number(filteredRows.length)} requisições no recorte atual`;
  }

  function initDashboard() {
    sourceRows = pageMode === 'repairs' ? (DATA.repairs || []) : (DATA.materials || []);
    filteredRows = sourceRows.slice();
    const generated = $('#procGeneratedAt');
    if (generated) generated.textContent = dateTime(DATA.meta.geradoEm);
    populateFilters();
    $('#procResetFilters')?.addEventListener('click', resetFilters);
    $('#procPagePrev')?.addEventListener('click', () => { if (currentPage > 1) { currentPage -= 1; renderTable(); } });
    $('#procPageNext')?.addEventListener('click', () => { if (currentPage * pageSize < filteredRows.length) { currentPage += 1; renderTable(); } });
    renderAll();
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (pageMode === 'landing') initLanding();
    if (pageMode === 'materials' || pageMode === 'repairs') initDashboard();
  });
}());
