const validUsers = {
  user1: "@Chrome1",
  user2: "@Chrome2"
};

const form = document.getElementById("loginForm");
const message = document.getElementById("message");
const passwordInput = document.getElementById("password");
const togglePasswordButton = document.getElementById("togglePassword");

// Alternar visibilidade da senha
togglePasswordButton.addEventListener("click", function () {
  const type = passwordInput.type === "password" ? "text" : "password";
  passwordInput.type = type;
  togglePasswordButton.textContent = type === "password" ? "👁️" : "🙈";
});

// Verificar login ao enviar o formulário
form.addEventListener("submit", function (event) {
  event.preventDefault(); // Evita o envio do formulário padrão

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (validUsers[username] && validUsers[username] === password) {
    // Login bem-sucedido
    message.style.display = "none";
    alert("Login bem-sucedido! Redirecionando para o inventário...");
    window.location.href = "/inventario"; // Altere para sua rota real
  } else {
    // Exibir mensagem de erro
    message.style.display = "block";
    message.textContent = "Usuário ou senha inválidos.";
  }
});


