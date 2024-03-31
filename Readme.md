## Renomear o Arquivo .env.example:
Renomeie o arquivo .env.example para .env.

## Preencher o Arquivo .env:
Preencha o arquivo .env com os dados da conexão com o banco MySQL, a porta que o projeto irá rodar e a palavra-chave do token.

## Instalar Dependências:
Execute o seguinte comando para instalar as dependências do projeto:

npm install

# Banco de Dados
Para criar as tabelas e o schema (caso ele não exista), execute o seguinte comando:

npm run db

# Dados Iniciais
Para criar os dados iniciais das roles, execute o seguinte comando:

npm run seed

# Executar o Projeto
Para iniciar o servidor de desenvolvimento, execute o seguinte comando:

npm run dev

Isso iniciará o servidor Express na porta especificada no arquivo .env e você poderá acessar as rotas via Insomnia.
