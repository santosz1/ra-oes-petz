  // Estoque original (extraído do PDF enviado)
  const produtos = [
    {marca:"Granvita", produto:"Granvita Quatree Select Gatos Sênior", sabor:"Não especificado", data:"2026-09-13", codigo:"7898256303463"},
    {marca:"Matisse", produto:"Matisse Carne & Arroz Adulto", sabor:"Carne & Arroz Adulto", data:"2026-09-17", codigo:"7898940000000 (ilegível)"},
    {marca:"Special Cat", produto:"Special Cat Premium Castrados (Salmão & Arroz) 10,1 kg", sabor:"Salmão & Arroz", data:"2026-09-18", codigo:"7898242032223"},
    {marca:"Guabi Natural", produto:"Guabi Natural Grain Free 1,5kg", sabor:"Salmão e Lentilha", data:"2026-10-21", codigo:"7896050000000 (ilegível)"},
    {marca:"Quaily Day", produto:"Quaily Day Gatos Adultos", sabor:"Salmão", data:"2026-10-02", codigo:"7898936660725"},
    {marca:"Quaily Day", produto:"Quaily Day Gatos Adultos", sabor:"Salmão & Arroz", data:"2026-10-02", codigo:"7898936660701"},
    {marca:"Special Dog", produto:"Special Dog", sabor:"Não especificado", data:"2026-10-08", codigo:"7898242032162"},
    {marca:"Quaily Day", produto:"Quaily Day Gatos Castrados - Carne & Arroz 1 kg", sabor:"Carne & Arroz", data:"2026-10-22", codigo:"7898936660855"},
    {marca:"Quaily Day", produto:"Quaily Day Gatos Castrados - Mix de Sabores", sabor:"Mix", data:"2026-10-30", codigo:"7898936660848"},
    {marca:"Quaily Day", produto:"Quaily Day Gatos Adultos - Carne & Arroz 2,5 kg", sabor:"Carne & Arroz", data:"2026-10-30", codigo:"7898654272323"},
    {marca:"Purina", produto:"Purina Cat Chow Gatos Filhotes", sabor:"Não especificado", data:"2026-11-01", codigo:"7891000248027"},
    {marca:"Purina", produto:"Purina Cat Chow Gatos Adultos", sabor:"Sabor Carne", data:"2026-11-01", codigo:"7891000380611"},
    {marca:"Quaily Day", produto:"Quaily Day Gatos Castrados - Frango & Arroz 2,5 kg", sabor:"Frango & Arroz", data:"2026-11-05", codigo:"7898654272354"},
    {marca:"Quaily Day", produto:"Quaily Day Gatos Filhotes - Frango & Arroz 1 kg", sabor:"Frango & Arroz", data:"2026-11-11", codigo:"7898936660886"},
    {marca:"Quaily Day", produto:"Quaily Day Gatos Adultos - Mix de Sabores 10,1 kg", sabor:"Mix", data:"2026-11-17", codigo:"7898654270077"},
    {marca:"Special Cat", produto:"Special Cat Premium (Gatos)", sabor:"Gatos", data:"2026-11-19", codigo:"7898242032049"},
    {marca:"Guabi Natural", produto:"Guabi Natural Vida Mais Longa e Saudável", sabor:"Frango e Arroz Integral", data:"2026-11-19", codigo:"7896050000000 (ilegível)"},
    {marca:"Quaily Day", produto:"Quaily Day Gatos Adultos - Salmão & Arroz 2,5 kg", sabor:"Salmão & Arroz", data:"2026-11-21", codigo:"7898654272361"},
    {marca:"Quaily Day", produto:"Quaily Day Gatos Castrados - Salmão & Arroz 1 kg", sabor:"Salmão & Arroz", data:"2026-11-25", codigo:"7898936660732"},
    {marca:"Quaily Day", produto:"Quaily Day Gatos Castrados - Salmão & Arroz 2,5 kg", sabor:"Salmão & Arroz", data:"2026-11-25", codigo:"7898654272378"},
    {marca:"Bionatural", produto:"Prime Super Premium Natural", sabor:"Salmão, Maracujá, Cranberry e Aveia", data:"2026-11-24", codigo:""},
    {marca:"Quaily Day", produto:"Quaily Day Gatos Adultos - Frango & Arroz 2,5 kg", sabor:"Frango & Arroz", data:"2026-11-26", codigo:"7898654272347"},
    {marca:"Special Cat", produto:"Special Cat Premium Castrados (Sabor Carne) 10,1 kg", sabor:"Sabor Carne", data:"2026-11-26", codigo:"7898242032018"},
    {marca:"Special Cat", produto:"Special Cat (Gatos)", sabor:"Gatos", data:"2026-11-29", codigo:"7898242032209"},
    {marca:"Purina", produto:"Purina Cat Chow Gatos Adultos", sabor:"Sabor Mix", data:"2026-12-01", codigo:"7891000380352"},
    {marca:"Granvita", produto:"Granvita Quatree Select Gatos Adultos", sabor:"Não especificado", data:"2026-12-20", codigo:"7898256302312"},
  ];

  // Cópia da lista original (do código), guardada para o botão "Restaurar lista original"
  const produtosOriginais = JSON.parse(JSON.stringify(produtos));

  let state = {
    search: "",
    marca: "",
    status: "all",
  };
  let vendidosSessao = 0;
  let historico = [];
  let histState = { tipo: "all" };

  const MS_DIA = 86400000;

  // ---- Persistência no navegador (localStorage) ----
  // Cada clique em "Remover", "Vendido" ou "Adicionar à lista" salva a lista
  // automaticamente neste navegador/aparelho. Ao reabrir a página aqui, a
  // lista salva é carregada em vez da lista original do código.
  const STORAGE_KEY_PRODUTOS = "controleRacoes_produtos_v1";
  const STORAGE_KEY_HISTORICO = "controleRacoes_historico_v1";

  function salvarEstado(){
    try{
      localStorage.setItem(STORAGE_KEY_PRODUTOS, JSON.stringify(produtos));
      localStorage.setItem(STORAGE_KEY_HISTORICO, JSON.stringify(historico));
    }catch(err){
      console.error("Não foi possível salvar as alterações neste navegador:", err);
    }
  }

  function carregarEstadoSalvo(){
    try{
      const produtosSalvos = localStorage.getItem(STORAGE_KEY_PRODUTOS);
      if(produtosSalvos){
        const parsed = JSON.parse(produtosSalvos);
        if(Array.isArray(parsed)){
          produtos.length = 0;
          produtos.push(...parsed);
        }
      }
      const historicoSalvo = localStorage.getItem(STORAGE_KEY_HISTORICO);
      if(historicoSalvo){
        const parsed = JSON.parse(historicoSalvo);
        if(Array.isArray(parsed)) historico = parsed;
      }
    }catch(err){
      console.error("Não foi possível carregar as alterações salvas neste navegador:", err);
    }
  }

  function hoje(){
    const d = new Date();
    d.setHours(0,0,0,0);
    return d;
  }

  function hojeISO(){
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  }

  function calcStatus(dataStr){
    const [ano,mes,dia] = dataStr.split("-").map(Number);
    const dataVenc = new Date(ano, mes-1, dia);
    const dias = Math.round((dataVenc - hoje())/MS_DIA);
    if(dias < 0) return {status:"vencido", dias};
    if(dias <= 30) return {status:"breve", dias};
    return {status:"ok", dias};
  }

  function fmtData(dataStr){
    const [ano,mes,dia] = dataStr.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  function statusLabel(status, dias){
    if(status === "vencido") return `Vencido há ${Math.abs(dias)} dia${Math.abs(dias)===1?"":"s"}`;
    if(status === "breve") return dias === 0 ? "Vence hoje" : `Vence em ${dias} dia${dias===1?"":"s"}`;
    return `Vence em ${dias} dias`;
  }

  function populateMarcas(){
    const select = document.getElementById("marcaSelect");
    const marcas = [...new Set(produtos.map(p=>p.marca))].sort((a,b)=>a.localeCompare(b,'pt-BR'));
    marcas.forEach(m=>{
      const opt = document.createElement("option");
      opt.value = m;
      opt.textContent = m;
      select.appendChild(opt);
    });
  }

  function render(){
    const enriched = produtos.map(p=>({...p, ...calcStatus(p.data)}));

    // Stats (sempre sobre o total, não sobre o filtro)
    document.getElementById("statTotal").textContent = enriched.length;
    document.getElementById("statVencido").textContent = enriched.filter(p=>p.status==="vencido").length;
    document.getElementById("statBreve").textContent = enriched.filter(p=>p.status==="breve").length;
    document.getElementById("statOk").textContent = enriched.filter(p=>p.status==="ok").length;
    document.getElementById("vendidosNota").textContent = vendidosSessao > 0 ? ` · ${vendidosSessao} marcado${vendidosSessao===1?"":"s"} como vendido nesta sessão.` : "";
    document.getElementById("histCount").textContent = historico.length;

    let filtrados = enriched.filter(p=>{
      if(state.status !== "all" && p.status !== state.status) return false;
      if(state.marca && p.marca !== state.marca) return false;
      if(state.search){
        const alvo = `${p.marca} ${p.produto} ${p.sabor}`.toLowerCase();
        if(!alvo.includes(state.search.toLowerCase())) return false;
      }
      return true;
    });

    filtrados.sort((a,b)=> new Date(a.data) - new Date(b.data));

    const list = document.getElementById("list");
    const empty = document.getElementById("emptyState");
    list.innerHTML = "";

    if(filtrados.length === 0){
      empty.style.display = "block";
    } else {
      empty.style.display = "none";
      filtrados.forEach((p, idxVisivel)=>{
        const idxReal = produtos.findIndex(x=>x.marca===p.marca && x.produto===p.produto && x.data===p.data && x.sabor===p.sabor && x.codigo===p.codigo);
        const row = document.createElement("div");
        row.className = `row st-${p.status}`;
        row.innerHTML = `
          <div class="cell date">${fmtData(p.data)}<span class="sub">${statusLabel(p.status,p.dias)}</span></div>
          <div class="cell produto" data-label="Produto">
            <span class="marca">${p.marca}</span>
            <span class="nome">${p.produto}</span>
          </div>
          <div class="cell sabor" data-label="Sabor">${p.sabor && p.sabor !== "Não especificado" ? p.sabor : "—"}</div>
          <div class="cell codigo mono" data-label="Código">${p.codigo ? p.codigo : "—"}</div>
          <div class="cell status" data-label="Status"><span class="badge st-${p.status}">${p.status === "vencido" ? "Vencido" : p.status === "breve" ? "Vencendo" : "Válido"}</span></div>
          <div class="cell actions">
            <button class="qr-btn" data-idx="${idxReal}">QR</button>
            <button class="sold-btn" data-idx="${idxReal}">Vendido</button>
            <button class="remove-btn" data-idx="${idxReal}">Remover</button>
          </div>
        `;
        list.appendChild(row);
      });
    }

    list.querySelectorAll(".remove-btn").forEach(btn=>{
      btn.addEventListener("click", (e)=>{
        const idx = parseInt(e.target.dataset.idx, 10);
        if(idx > -1){
          const p = produtos[idx];
          const status = calcStatus(p.data).status;
          if(status === "vencido"){
            historico.push({...p, tipo:"vencido", dataAcao: hojeISO()});
          }
          produtos.splice(idx,1);
          salvarEstado();
          render();
        }
      });
    });

    list.querySelectorAll(".sold-btn").forEach(btn=>{
      btn.addEventListener("click", (e)=>{
        const idx = parseInt(e.target.dataset.idx, 10);
        if(idx > -1){
          vendidosSessao++;
          historico.push({...produtos[idx], tipo:"vendido", dataAcao: hojeISO()});
          produtos.splice(idx,1);
          salvarEstado();
          render();
        }
      });
    });

    list.querySelectorAll(".qr-btn").forEach(btn=>{
      btn.addEventListener("click", (e)=>{
        const idx = parseInt(e.target.dataset.idx, 10);
        if(idx > -1){
          abrirQr(produtos[idx]);
        }
      });
    });
  }

  function renderHistorico(){
    document.getElementById("histStatTotal").textContent = historico.length;
    document.getElementById("histStatVendido").textContent = historico.filter(h=>h.tipo==="vendido").length;
    document.getElementById("histStatVencido").textContent = historico.filter(h=>h.tipo==="vencido").length;

    let filtrados = historico.filter(h=> histState.tipo === "all" || h.tipo === histState.tipo);
    filtrados.sort((a,b)=> new Date(b.dataAcao) - new Date(a.dataAcao));

    const list = document.getElementById("histList");
    const empty = document.getElementById("histEmptyState");
    list.innerHTML = "";

    if(filtrados.length === 0){
      empty.style.display = "block";
    } else {
      empty.style.display = "none";
      filtrados.forEach(p=>{
        const row = document.createElement("div");
        row.className = `row st-${p.tipo === "vendido" ? "ok" : "vencido"}`;
        row.innerHTML = `
          <div class="cell date">${fmtData(p.data)}<span class="sub">Venc. original</span></div>
          <div class="cell produto" data-label="Produto">
            <span class="marca">${p.marca}</span>
            <span class="nome">${p.produto}</span>
          </div>
          <div class="cell sabor" data-label="Sabor">${p.sabor && p.sabor !== "Não especificado" ? p.sabor : "—"}</div>
          <div class="cell codigo mono" data-label="Código">${p.codigo ? p.codigo : "—"}</div>
          <div class="cell status" data-label="Tipo"><span class="badge st-${p.tipo === "vendido" ? "ok" : "vencido"}">${p.tipo === "vendido" ? "Vendido" : "Vencido"}</span></div>
          <div class="cell hist-date" data-label="Baixa em">${fmtData(p.dataAcao)}</div>
        `;
        list.appendChild(row);
      });
    }
  }

  document.getElementById("histFilters").addEventListener("click", (e)=>{
    if(e.target.tagName !== "BUTTON") return;
    document.querySelectorAll("#histFilters button").forEach(b=>b.classList.remove("active"));
    e.target.classList.add("active");
    histState.tipo = e.target.dataset.tipo;
    renderHistorico();
  });

  document.getElementById("mainTabs").addEventListener("click", (e)=>{
    const btn = e.target.closest(".tab-btn");
    if(!btn) return;
    document.querySelectorAll(".tab-btn").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    const view = btn.dataset.view;
    document.getElementById("viewEstoque").style.display = view === "estoque" ? "" : "none";
    document.getElementById("viewHistorico").style.display = view === "historico" ? "" : "none";
    if(view === "historico") renderHistorico();
  });

  // ---- Modal de QR Code ----
  let qrInstance = null;

  function abrirQr(produto){
    const codigo = (produto.codigo || "").trim();
    const valor = codigo && !codigo.includes("ilegível") ? codigo : `${produto.marca} - ${produto.produto}`;

    document.getElementById("qrTitle").textContent = `${produto.marca} — ${produto.produto}`;
    document.getElementById("qrSub").textContent = codigo && !codigo.includes("ilegível")
      ? "Código de barras do produto"
      : "Código não disponível — usando marca e nome do produto";
    document.getElementById("qrCodeText").textContent = valor;

    const container = document.getElementById("qrcodeCanvas");
    container.innerHTML = "";
    qrInstance = new QRCode(container, {
      text: valor,
      width: 200,
      height: 200,
      colorDark: "#101828",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.M
    });

    document.getElementById("qrOverlay").classList.add("open");
  }

  function fecharQr(){
    document.getElementById("qrOverlay").classList.remove("open");
  }

  document.getElementById("qrCloseBtn").addEventListener("click", fecharQr);
  document.getElementById("qrOverlay").addEventListener("click", (e)=>{
    if(e.target.id === "qrOverlay") fecharQr();
  });

  document.getElementById("qrDownloadBtn").addEventListener("click", ()=>{
    const container = document.getElementById("qrcodeCanvas");
    const img = container.querySelector("img");
    const canvas = container.querySelector("canvas");
    const nomeArquivo = `qrcode-${document.getElementById("qrCodeText").textContent.replace(/[^a-zA-Z0-9]/g,"_")}.png`;
    const link = document.createElement("a");
    link.download = nomeArquivo;
    if(canvas){
      link.href = canvas.toDataURL("image/png");
    } else if(img){
      link.href = img.src;
    }
    link.click();
  });

  document.getElementById("searchInput").addEventListener("input", (e)=>{
    state.search = e.target.value;
    render();
  });
  document.getElementById("marcaSelect").addEventListener("change", (e)=>{
    state.marca = e.target.value;
    render();
  });
  document.getElementById("statusFilters").addEventListener("click", (e)=>{
    if(e.target.tagName !== "BUTTON") return;
    document.querySelectorAll("#statusFilters button").forEach(b=>b.classList.remove("active"));
    e.target.classList.add("active");
    state.status = e.target.dataset.status;
    render();
  });

  // Retira do estoque, de uma vez, tudo que já venceu ou vence em até 20 dias,
  // e registra tudo como "vendido" na aba Histórico.
  document.getElementById("retirarVencendoBtn").addEventListener("click", ()=>{
    const alvo = produtos.filter(p=> calcStatus(p.data).dias <= 20);
    if(alvo.length === 0){
      alert("Nenhum produto vencido ou vencendo em até 20 dias no momento.");
      return;
    }
    const ok = confirm(`Isso vai retirar ${alvo.length} produto(s) do estoque (vencidos ou vencendo em até 20 dias) e marcar como vendido na aba Histórico. Deseja continuar?`);
    if(!ok) return;
    alvo.forEach(p=>{
      historico.push({...p, tipo:"vendido", dataAcao: hojeISO()});
      const idx = produtos.indexOf(p);
      if(idx > -1) produtos.splice(idx,1);
    });
    vendidosSessao += alvo.length;
    salvarEstado();
    populateMarcasRefresh();
    render();
    const statusEl = document.getElementById("importStatus");
    statusEl.textContent = `${alvo.length} produto(s) retirado(s) e marcado(s) como vendido.`;
    statusEl.className = "import-status ok";
  });

  // ---- Importação de planilha (.xlsx / .csv) ----
  function excelSerialToDate(serial){
    const utcDays = Math.floor(serial - 25569);
    const utcValue = utcDays * 86400;
    return new Date(utcValue * 1000);
  }
  function toISO(d){
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  }
  function parseDateCell(value){
    if(value instanceof Date && !isNaN(value)) return toISO(value);
    if(typeof value === "number") return toISO(excelSerialToDate(value));
    if(typeof value === "string"){
      const br = value.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if(br) return `${br[3]}-${br[2].padStart(2,"0")}-${br[1].padStart(2,"0")}`;
      const iso = value.trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
      if(iso) return `${iso[1]}-${iso[2].padStart(2,"0")}-${iso[3].padStart(2,"0")}`;
    }
    return null;
  }
  function acharColuna(headers, ...termos){
    return headers.findIndex(h=>{
      const hn = (h||"").toString().toLowerCase();
      return termos.some(t=>hn.includes(t));
    });
  }

  document.getElementById("fileInput").addEventListener("change", (e)=>{
    const file = e.target.files[0];
    const statusEl = document.getElementById("importStatus");
    if(!file) return;
    statusEl.textContent = "Lendo arquivo…";
    statusEl.className = "import-status";

    const reader = new FileReader();
    reader.onload = (evt)=>{
      try{
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, {type:"array", cellDates:true});
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, {header:1, raw:true});
        if(rows.length < 2) throw new Error("Planilha vazia");

        const headers = rows[0];
        const colData = acharColuna(headers, "data");
        const colMarca = acharColuna(headers, "marca");
        const colProduto = acharColuna(headers, "produto", "nome");
        const colSabor = acharColuna(headers, "sabor");
        const colCodigo = acharColuna(headers, "código", "codigo", "barras");

        if(colData === -1 || colMarca === -1 || colProduto === -1){
          throw new Error("Não encontrei as colunas de Data, Marca e Produto. Confira os cabeçalhos.");
        }

        const novos = [];
        for(let i=1;i<rows.length;i++){
          const row = rows[i];
          if(!row || row.length === 0) continue;
          const dataISO = parseDateCell(row[colData]);
          const marca = (row[colMarca]||"").toString().trim();
          const produto = (row[colProduto]||"").toString().trim();
          if(!dataISO || !marca || !produto) continue;
          novos.push({
            marca,
            produto,
            sabor: colSabor > -1 ? (row[colSabor]||"Não especificado").toString().trim() : "Não especificado",
            data: dataISO,
            codigo: colCodigo > -1 ? (row[colCodigo]||"").toString().trim() : ""
          });
        }

        if(novos.length === 0) throw new Error("Nenhuma linha válida encontrada na planilha.");

        produtos.length = 0;
        produtos.push(...novos);
        salvarEstado();
        populateMarcasRefresh();
        state = {search:"", marca:"", status:"all"};
        document.getElementById("searchInput").value = "";
        document.querySelectorAll("#statusFilters button").forEach(b=>b.classList.remove("active"));
        document.querySelector('#statusFilters button[data-status="all"]').classList.add("active");
        render();

        statusEl.textContent = `${novos.length} produtos importados com sucesso.`;
        statusEl.className = "import-status ok";
      }catch(err){
        statusEl.textContent = "Erro ao importar: " + err.message;
        statusEl.className = "import-status err";
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = "";
  });

  document.getElementById("exportBtn").addEventListener("click", ()=>{
    const linhas = produtos.map(p=>({
      "Data de Vencimento": fmtData(p.data),
      "Marca": p.marca,
      "Nome do Produto": p.produto,
      "Sabor": p.sabor,
      "Código de Barras": p.codigo
    }));
    const ws = XLSX.utils.json_to_sheet(linhas);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Estoque");
    const hoje = new Date();
    const nomeArquivo = `controle-racoes-${hoje.getFullYear()}-${String(hoje.getMonth()+1).padStart(2,"0")}-${String(hoje.getDate()).padStart(2,"0")}.xlsx`;
    XLSX.writeFile(wb, nomeArquivo);
    const statusEl = document.getElementById("importStatus");
    statusEl.textContent = `Planilha exportada: ${nomeArquivo}`;
    statusEl.className = "import-status ok";
  });

  document.getElementById("addForm").addEventListener("submit", (e)=>{
    e.preventDefault();
    const marca = document.getElementById("fMarca").value.trim();
    const produto = document.getElementById("fProduto").value.trim();
    const sabor = document.getElementById("fSabor").value.trim() || "Não especificado";
    const data = document.getElementById("fData").value;
    const codigo = document.getElementById("fCodigo").value.trim();
    if(!marca || !produto || !data) return;
    produtos.push({marca, produto, sabor, data, codigo});
    salvarEstado();
    e.target.reset();
    populateMarcasRefresh();
    render();
  });

  function populateMarcasRefresh(){
    const select = document.getElementById("marcaSelect");
    const atual = select.value;
    select.innerHTML = '<option value="">Todas as marcas</option>';
    populateMarcas();
    select.value = atual;
  }

  document.getElementById("restaurarBtn").addEventListener("click", ()=>{
    const ok = confirm("Isso apaga tudo que foi salvo neste navegador (produtos removidos, vendidos e adicionados) e volta para a lista original do código. Deseja continuar?");
    if(!ok) return;
    produtos.length = 0;
    produtos.push(...JSON.parse(JSON.stringify(produtosOriginais)));
    historico = [];
    vendidosSessao = 0;
    localStorage.removeItem(STORAGE_KEY_PRODUTOS);
    localStorage.removeItem(STORAGE_KEY_HISTORICO);
    populateMarcasRefresh();
    render();
    const statusEl = document.getElementById("importStatus");
    statusEl.textContent = "Lista original restaurada.";
    statusEl.className = "import-status ok";
  });

  carregarEstadoSalvo();
  populateMarcas();
  render();
