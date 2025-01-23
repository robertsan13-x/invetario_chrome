from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)

# Conectar ao banco de dados
def conectar_bd():
    return sqlite3.connect("inventario_hastes.db")

# Inicializar o banco de dados
def inicializar_bd():
    conn = conectar_bd()
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS hastes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        codigo TEXT NOT NULL,
        descricao TEXT NOT NULL,
        diametro_externo REAL NOT NULL,
        diametro_interno REAL,
        comprimento REAL NOT NULL,
        unidade TEXT NOT NULL,
        quantidade INTEGER NOT NULL,
        estado TEXT NOT NULL,
        localizacao TEXT NOT NULL,
        data_recuperacao TEXT,
        fornecedor TEXT,
        observacoes TEXT
    )
    """)
    conn.commit()
    conn.close()

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/listar_hastes", methods=["GET"])
def listar_hastes():
    conn = conectar_bd()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM hastes")
    hastes = cursor.fetchall()
    conn.close()
    return jsonify(hastes)

@app.route("/adicionar_haste", methods=["POST"])
def adicionar_haste():
    dados = request.json
    try:
        conn = conectar_bd()
        cursor = conn.cursor()
        cursor.execute("""
        INSERT INTO hastes (codigo, descricao, diametro_externo, diametro_interno, comprimento, unidade, quantidade, estado, localizacao, data_recuperacao, fornecedor, observacoes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            dados["codigo"], dados["descricao"], dados["diametro_externo"], dados["diametro_interno"],
            dados["comprimento"], dados["unidade"], dados["quantidade"], dados["estado"],
            dados["localizacao"], dados["data_recuperacao"], dados["fornecedor"], dados["observacoes"]
        ))
        conn.commit()
        conn.close()
        return jsonify({"message": "Haste adicionada com sucesso!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/editar_haste/<int:id>", methods=["PUT"])
def editar_haste(id):
    dados = request.json
    try:
        conn = conectar_bd()
        cursor = conn.cursor()
        cursor.execute("""
        UPDATE hastes
        SET codigo=?, descricao=?, diametro_externo=?, diametro_interno=?, comprimento=?, unidade=?, quantidade=?, estado=?, localizacao=?, observacoes=?
        WHERE id=?
        """, (
            dados["codigo"], dados["descricao"], dados["diametro_externo"], dados["diametro_interno"],
            dados["comprimento"], dados["unidade"], dados["quantidade"], dados["estado"],
            dados["localizacao"], dados["observacoes"], id
        ))
        conn.commit()
        conn.close()
        return jsonify({"message": "Haste atualizada com sucesso!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/remover_haste/<int:id>", methods=["DELETE"])
def remover_haste(id):
    try:
        conn = conectar_bd()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM hastes WHERE id=?", (id,))
        conn.commit()
        conn.close()
        return jsonify({"message": "Haste removida com sucesso!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/filtrar_hastes", methods=["GET"])
def filtrar_hastes():
    filtro = request.args.get("filtro", "").strip()  # Obtém o filtro enviado (campo de busca)
    criterio = request.args.get("criterio", "descricao")  # Campo no qual o filtro será aplicado (ex: 'descricao')
    
    conn = conectar_bd()
    cursor = conn.cursor()

    query = f"SELECT * FROM hastes WHERE {criterio} LIKE ?"
    cursor.execute(query, (f"%{filtro}%",))
    hastes_filtradas = cursor.fetchall()
    conn.close()

    return jsonify(hastes_filtradas)


if __name__ == "__main__":
    inicializar_bd()
    app.run(debug=True)
