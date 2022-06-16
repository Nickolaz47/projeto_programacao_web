# Programação Web III

>Criar aplicação web usando os conceitos vistos ao longo do módulo e do curso.
Serão avaliadas questões como implementação de API RESTful, modelagem de recursos, uso
correto dos métodos HTTP, qualidade e legibilidade de código.

Apresentação: 24/06/2022

Requisitos:

1. Necessário criar, pelo menos, 3 recursos que tenham algum nível de relacionamento
(empresas, gêneros e jogos);
2. Criar rotas no serviço, usando path params, que suportem a interação com esses
recursos;
3. Suportar query params com 3 funcionalidades: sortBy, algum tipo de filtro como nome
ou qtd de estrelas, e limit;
4. Todas rotas devem suportar, pelo menos, GET, PUT, POST, e DELETE;
5. Ter, pelo menos, uma rota onde é possível visualizar algum dos recursos usando uma
view engine;
6. Projeto deve usar um padrão de pastas modularizado;
7. Serviço deve conseguir salvar e buscar dados de algum sistema de storage, podendo
ser o próprio filesystem;
8. Deve ser possível ler e escrever dados através de algum cliente HTTP como Postman,
cURL, Insomnia.

### Bônus
1. Usar Postgres como storage;
2. Usar uma aplicação React como view.