document.addEventListener("DOMContentLoaded", () => {
    const tabela = document.querySelector("#tabela_hastes tbody");
    const modal = document.getElementById("modal-editar");
    const formularioEditar = {
        codigo: document.getElementById("editar-codigo"),
        descricao: document.getElementById("editar-descricao"),
        diametro_externo: document.getElementById("editar-diametro_externo"),
        diametro_interno: document.getElementById("editar-diametro_interno"),
        comprimento: document.getElementById("editar-comprimento"),
        quantidade: document.getElementById("editar-quantidade"),
        unidade: document.getElementById("editar-unidade"),
        estado: document.getElementById("editar-estado"),
        localizacao: document.getElementById("editar-localizacao"),
        observacoes: document.getElementById("editar-observacoes"),
    };

    let idAtual = null;

    function carregarHastes(filtro = "", criterio = "descricao") {
        fetch(`/filtrar_hastes?filtro=${encodeURIComponent(filtro)}&criterio=${encodeURIComponent(criterio)}`)
            .then((res) => res.json())
            .then((hastes) => {
                tabela.innerHTML = "";
                hastes.forEach((h) => {
                    const linha = `
                        <tr>
                            <td>${h[1]}</td>
                            <td>${h[2]}</td>
                            <td>${h[3]}</td>
                            <td>${h[5]}</td>
                            <td>${h[7]}</td>
                            <td>${h[6]}</td>
                            <td>${h[8]}</td>
                            <td>${h[9]}</td>
                            <td>${h[12]}</td>
                            <td>
                                <button onclick="abrirEditar(${h[0]}, decodeURIComponent('${encodeURIComponent(JSON.stringify(h))}'))">Editar</button>
                                <button onclick="removerHaste(${h[0]})">Remover</button>
                            </td>
                        </tr>`;
                    tabela.innerHTML += linha;
                });
            });
    }

    function abrirEditar(id, dadosEncoded) {
        idAtual = id;
        const dados = JSON.parse(decodeURIComponent(dadosEncoded));

        formularioEditar.codigo.value = dados[1];
        formularioEditar.descricao.value = dados[2];
        formularioEditar.diametro_externo.value = dados[3];
        formularioEditar.diametro_interno.value = dados[4];
        formularioEditar.comprimento.value = dados[5];
        formularioEditar.quantidade.value = dados[7];
        formularioEditar.unidade.value = dados[6];
        formularioEditar.estado.value = dados[8];
        formularioEditar.localizacao.value = dados[9];
        formularioEditar.observacoes.value = dados[12];

        modal.style.display = "flex";
    }

    document.querySelector("#modal-editar .salvar").addEventListener("click", () => {
        const dadosAtualizados = {
            codigo: formularioEditar.codigo.value || formularioEditar.codigo.defaultValue,
            descricao: formularioEditar.descricao.value || formularioEditar.descricao.defaultValue,
            diametro_externo: formularioEditar.diametro_externo.value
                ? parseFloat(formularioEditar.diametro_externo.value)
                : parseFloat(formularioEditar.diametro_externo.defaultValue),
            diametro_interno: formularioEditar.diametro_interno.value
                ? parseFloat(formularioEditar.diametro_interno.value)
                : parseFloat(formularioEditar.diametro_interno.defaultValue),
            comprimento: formularioEditar.comprimento.value
                ? parseFloat(formularioEditar.comprimento.value)
                : parseFloat(formularioEditar.comprimento.defaultValue),
            quantidade: formularioEditar.quantidade.value
                ? parseInt(formularioEditar.quantidade.value)
                : parseInt(formularioEditar.quantidade.defaultValue),
            unidade: formularioEditar.unidade.value || formularioEditar.unidade.defaultValue,
            estado: formularioEditar.estado.value || formularioEditar.estado.defaultValue,
            localizacao: formularioEditar.localizacao.value || formularioEditar.localizacao.defaultValue,
            observacoes: formularioEditar.observacoes.value || formularioEditar.observacoes.defaultValue,
        };

        fetch(`/editar_haste/${idAtual}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosAtualizados),
        }).then(() => {
            modal.style.display = "none";
            carregarHastes();
        });
    });

    document.querySelector("#modal-editar .cancelar").addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.removerHaste = (id) => {
        fetch(`/remover_haste/${id}`, { method: "DELETE" }).then(() => carregarHastes());
    };

    window.abrirEditar = abrirEditar; // Expondo a função abrirEditar ao escopo global

    document.getElementById("adicionar").addEventListener("click", () => {
        const dados = {
            codigo: document.getElementById("codigo").value,
            descricao: document.getElementById("descricao").value,
            diametro_externo: parseFloat(document.getElementById("diametro_externo").value),
            diametro_interno: parseFloat(document.getElementById("diametro_interno").value),
            comprimento: parseFloat(document.getElementById("comprimento").value),
            unidade: document.getElementById("unidade").value,
            quantidade: parseInt(document.getElementById("quantidade").value),
            observacoes: document.getElementById("observacoes").value,
            estado: document.getElementById("estado").value,
            localizacao: document.getElementById("localizacao").value,
            data_recuperacao: "",
            fornecedor: "",
        };

        fetch("/adicionar_haste", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados),
        }).then(() => carregarHastes());
    });

    document.getElementById("filtrar").addEventListener("click", () => {
        const filtroTexto = document.getElementById("filtro-texto").value;
        const criterio = document.getElementById("criterio").value;
        carregarHastes(filtroTexto, criterio);
    });

    carregarHastes();
});
