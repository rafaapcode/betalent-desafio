# Desafio BETALENT - Desenvolvedor Backend Júnior

## Objetivo

Reposítório criado para o desafio da vaga de Desenvolvedor Back-End Júnior da BETALENT

## Requisitos
- Docker
- Node >= 20.x

## Passo a Passo para rodar o projeto
- Primeiro faça o clone do repositório usando o `git clone https://github.com/rafaapcode/betalent-desafio.git`.
- Com o repositório clonado acesse a pasta do projeto pelo terminal e instale todas as dependências usando o `npm install`.
- Antes de subir o nosso banco de dados e os nossos gateways, crie uma arquivo `.env` na raiz do projeto e use como exemplo as variáveis que deixei no arquivo `.env.example` preenchendo o valor das variáveis que estão faltando. 
- Com as dependências instaladas e ainda na pasta do projeto iremos agora subir o MYSQL e os 2 GATEWAYS usando o docker compose. Para isso execute `docker-compose up -d`
- Agora que o banco de dados está online e os 2 gateways também , iremos executar as migrações no DB e também executar os SEEDS. Primeiro iremos executar as migrações com o seguinte comando `node ace migration:run`. Com as tabelas criadas agora iremos popular elas executando os SEEDS `node ace db:seed` 
- Agora que todo o ambiente está preparado você pode rodar a API usando o `npm run dev`

---

## Dados mockados

- Como expliquei anterior fazemos o SEED, ou seja, populamos o nosso banco de dados com alguns dados mockados para conseguirmos usar a api.
- Irei listar aqui somente os usuário e o nome dos GATEWAYS que estamos adicionando, mas se quiser ver todos os outros dados que são adicionados acesse a pasta `database/seeders`

### Gateways
```json
[
  {
    "name": "Gateway_1",
    "is_active": true,
    "priority": 1,
  },
  {
    "name": "Gateway_2",
    "is_active": true,
    "priority": 2,
  },
]

```

### Users
- Use as credenciais desses usuário para poder recuperar o TOKEN através da rota `/login`
```json
[
  {
    "email": "rafaap2003@gmail.com",
    "role": "ADMIN",
    "password": "teste123",
  },
  {
    "email": "rafaap2003manager@gmail.com",
    "role": "MANAGER",
    "password": "teste123",
  },
  {
    "email": "rafaap2003finance@gmail.com",
    "role": "FINANCE",
    "password": "teste123",
  },
  {
    "email": "rafaap2003user@gmail.com",
    "role": "USER",
    "password": "teste123",
  },
]

```

# Docs - API

### Autenticação
A API utiliza o BEARER TOKEN como o método de autenticação. Então nas rotas privadas é necessário passar o token pelo cabeçalho.

Exemplo de cabeçalho:
```http
Authorization: Bearer <your-token>
```

# Endpoints

Base URL: `http://localhost:3333`


## Health
**Descrição:** Utilizado para verifcar a saúde da API.

**Rota:** `GET /health`

**Resposta de Sucesso:**

**status:** `200`

```json
{
	"message": "Hello, World"
}
```

## Login
**Descrição:** Utilizado para realizar o login do usuário e recuperar o TOKEN.

**Rota:** `POST /login`

**Corpo da requisição:**
```json
{
  "email": "teste@example.com",
  "password": "teste123"
}
```



**Resposta de Sucesso:**

**status:** `200`
```json
{
  "access_token": "eyJhbGciOiJIUkI1NiIsInR5cCI6IkpCVGJ9 ...",
}
```

**Resposta de Erro:**

**status:** `400`
```json
{
	"errors": [
		{
			"message": "Invalid user credentials"
		}
	]
}
```

**status:** `422`
```json
{
	"errors": [
			{
			"message": "The password field must have at least 8 characters",
			"rule": "minLength",
			"field": "password",
			"meta": {
				"min": 8
			}
		}
	]
}
```


## Comprar Produto

**Descrição:** Utilizado para realizar a compra de um produto em específico para o cliente.

**Rota:** `POST /buy`

**Corpo da requisição:**
```json
{
  "name": "Nome do cliente",
  "email": "email_cliente@gmail.com",
  "cardNumber": "0000000000000000",
  "cvv": "010",
  "productName": "Video Game",
  "quantity": 1
}
```



**Resposta de Sucesso:**

**status:** `200`
```json
{
	"status": true,
	"data": {
		"id": "3100e857-a979-48af-8434-dcc99aa6e55c",
		"amount": 1000,
		"card_first_digits": "0000",
		"card_last_digits": "0000",
		"email": "email_cliente@gmail.com",
		"name": "Nome do cliente",
		"status": "paid"
	}
}
```

**Resposta de Erro:**

**status:** `400`
```json
{
	"status": false,
	"message": "Contact your credit card support"
}
```

**status:** `404`
```json
{
	"status": false,
	"message": "Product not found"
}
```

**status:** `409`
```json
{
	"status": false,
	"message": "Insufficient product for your request"
}
```


**status:** `409`
```json

{
	"status": false,
	"message": "Product not available"
}

```

**status:** `422`
```json
{
	"errors": [
			{
			"message": "The cardNumber field must be a valid credit card number",
			"rule": "creditCard",
			"field": "cardNumber",
			"meta": {
				"providersList": "credit"
			}
		}
	]
}
```


**status:** `500`
```json
{
	"status": false,
	"message": "Does not have any registered gateway or all gateway is deactivated"
}
```

- **OBSERVAÇÃO**

Para a criação de um número de cartão de crédito válido recomendo utilizar o [4 Devs](https://www.4devs.com.br/gerador_de_numero_cartao_credito)


## Usuários


- ### Criar Usuário

**Descrição:** Criação de um usuário.

**Rota:** `POST /user`


**Autenticação**
```http
Authorization: Bearer <your-token>
```


**Corpo da requisição:**

| chave  | Valor    |
| ------ | ---------|
| role    | "ADMIN" \| "MANAGER" \| "FINANCE" \| "USER"|


```json
{
	"email": "teste@example.com",
	"password": "examplepassword123",
	"role": "USER"
}
```


**Resposta de Sucesso:**

**status:** `200`
```json
{
	"status": true,
	"data": {
		"id": "019552d2-d569-705b-8184-ac3b7946251f",
		"email": "teste@example.com",
		"role": "USER",
		"createdAt": "2025-03-01T17:48:23.836+00:00",
		"updatedAt": "2025-03-01T17:48:23.837+00:00"
	},
	"message": "user created successfully"
}
```

**Resposta de Erro:**

**status:** `401`
```
  Unauthorized access
```

**status:** `422`
```json
{
	"errors": [
		{
		    "message": "The password field must have at least 8 characters",
			"rule": "minLength",
			"field": "password",
			"meta": {
				"min": 8
			}
		}
	]
}
```


- ### Atualizar Usuário

**Descrição:** Atualiza o ROLE de um usuário.

**Rota:** `PATCH /user/:email`

**Autenticação**
```http
Authorization: Bearer <your-token>
```

**Params:**

| chave  | Tipo    |
| ------ | ---------|
| email    | string |


**Corpo da requisição:**

| chave  | Tipo    |
| ------ | ---------|
| role    | "ADMIN" \| "MANAGER" \| "FINANCE" \| "USER"|


```json
{
	"role": "MANAGER"
}
```


**Resposta de Sucesso:**

**status:** `200`
```json
{
	"message": "User updated successfully",
	"status": true
}
```


**Resposta de Erro:**


**status:** `401`
```
Unauthorized access
```

**status:** `404`
```json
{
	"status": false,
	"message": "User not found"
}
```


**status:** `422`
```json
{
	"errors": [
		{
		   "message": "The selected role is invalid",
			"rule": "enum",
			"field": "role",
			"meta": {
				"choices": [
					"ADMIN",
					"MANAGER",
					"FINANCE",
					"USER"
				]
			}
		}
	]
}
```

- ### Deletar Usuário

**Descrição:** Deleta um usuário

**Rota:** `DELETE /user/:email`

**Autenticação**
```http
Authorization: Bearer <your-token>
```

**Params:**

| chave  | Tipo    |
| ------ | ---------|
| email    | string |



**Resposta de Sucesso:**

**status:** `200`
```json
{
	"message": "User deleted successfully",
	"status": true
}
```


**Resposta de Erro:**

**status:** `401`
```
Unauthorized access
```

**status:** `404`
```json
{
	"status": false,
	"message": "User not found"
}
```


- ### Lista Usuários

**Descrição:** Listar um usuário

**Rota:** `GET /user/:emailOrId`

**Autenticação**
```http
Authorization: Bearer <your-token>
```

**Params:**

| chave  | Tipo    | Descrição  |
| ------ | --------- |--------- |
| emailOrId  | string | Pode ser o EMAIL ou ID do usuário |



**Resposta de Sucesso:**

**status:** `200`
```json
{
	"data": {
		"id": "01955412-94c0-724d-8cea-f4495e7f1a06",
		"email": "teste@example.com",
		"role": "USER",
		"createdAt": "2025-03-01T23:37:39.000+00:00",
		"updatedAt": "2025-03-01T23:37:39.000+00:00"
	},
	"status": true
}
```


**Resposta de Erro:**

**status:** `401`
```
Unauthorized access
```

**status:** `404`
```json
{
	"status": false,
	"message": "User not found"
}
```

- ### Lista todos os Usuários

**Descrição:** Listar todos usuários

**Rota:** `GET /user`

**Autenticação**
```http
Authorization: Bearer <your-token>
```


**Resposta de Sucesso:**

**status:** `200`
```json
{
	"user": [
		{
			"id": "01955412-94c0-724d-8cea-f4495e7f1a06",
		    "email": "teste@example.com",
		    "role": "USER",
		    "createdAt": "2025-03-01T23:37:39.000+00:00",
		    "updatedAt": "2025-03-01T23:37:39.000+00:00"
		}
	]
}
```


**Resposta de Erro:**

**status:** `401`
```
Unauthorized access
```







## Clientes


- ### Criar Cliente

**Descrição:** Criação de um cliente.

**Rota:** `POST /clients`


**Autenticação**
```http
Authorization: Bearer <your-token>
```


**Corpo da requisição:**


```json
{
	"email": "user@example.com",
	"password": "userpassword123",
}
```


**Resposta de Sucesso:**

**status:** `200`
```json
{
	"message": "Client created successfully",
	"status": true,
	"data": {
		"id": "019544d2-6cf2-7397-8b7f-d4d36f75d43b",
		"email": "user@example.com",
		"name": "user",
		"createdAt": "2025-02-27T00:33:16.018+00:00",
		"updatedAt": "2025-02-27T00:33:16.018+00:00"
	}
}
```

**Resposta de Erro:**

**status:** `401`
```
Unauthorized access
```

**status:** `422`
```json
{
	"errors": [
	    {
			"message": "The name has already been taken",
			"rule": "database.unique",
			"field": "name"
		},
	]
}
```


- ### Atualizar Cliente

**Descrição:** Atualiza o email/nome de um cliente.

**Rota:** `PUT /clients/:email`

**Autenticação**
```http
Authorization: Bearer <your-token>
```

**Params:**

| chave  | Tipo    |
| ------ | ---------|
| email   | string |


**Corpo da requisição:**

```json
{
	"email": "newemail@gmail.com",
	"name": "novo nome"
}
```


**Resposta de Sucesso:**

**status:** `200`
```json
{
	"status": true,
	"message": "Client updated successfully"
}
```


**Resposta de Erro:**


**status:** `401`
```
Unauthorized access
```

**status:** `404`
```json
{
	"message": "Client not found",
	"status": false
}
```


**status:** `422`
```json
{
	"errors": [
		{
			"message": "The email field must be a valid email address",
			"rule": "email",
			"field": "email"
		}
	]
}
```

- ### Deletar Cliente

**Descrição:** Deleta um cliente

**Rota:** `DELETE /clients/:email`

**Autenticação**
```http
Authorization: Bearer <your-token>
```

**Params:**

| chave  | Tipo    |
| ------ | ---------|
| email    | string |



**Resposta de Sucesso:**

**status:** `200`
```json
{
	"message": "Client deleted successfully",
	"status": true
}
```


**Resposta de Erro:**

**status:** `401`
```
Unauthorized access
```

**status:** `404`
```json
{
	"message": "Client not found",
	"status": false
}
```


- ### Listar Cliente

**Descrição:** Listar um cliente

**Rota:** `GET /clients/:emailOrName`

**Autenticação**
```http
Authorization: Bearer <your-token>
```

**Params:**

| chave  | Tipo    | Descrição  |
| ------ | --------- |--------- |
| emailOrName  | string | Pode ser o EMAIL ou NOME do cliente |



**Resposta de Sucesso:**

**status:** `200`
```json
{
	"status": true,
	"data": {
		"id": "01955651-ef53-753e-910a-d25caaeb3743",
		"name": "Leanne Graham",
		"email": "Sincere@april.biz",
		"createdAt": "2025-03-02T10:06:05.000+00:00",
		"updatedAt": "2025-03-02T10:06:05.000+00:00"
	}
}
```


**Resposta de Erro:**

**status:** `401`
```
Unauthorized access
```

**status:** `404`
```json
{
	"status": false,
	"message": "Client not found"
}
```

- ### Lista todos os Clientes

**Descrição:** Listar todos clientes

**Rota:** `GET /clients`

**Autenticação**
```http
Authorization: Bearer <your-token>
```


**Resposta de Sucesso:**

**status:** `200`
```json
{
	"client": [
		{
			"name": "Clementine Bauch",
			"email": "Nathan@yesenia.net"
		},
		{
			"name": "Leanne Graham",
			"email": "Sincere@april.biz"
		}
	]
}
```


**Resposta de Erro:**

**status:** `401`
```
Unauthorized access
```


- ### Lista os detalhes do cliente

**Descrição:** Lista todas as informações de um cliente juntamente com suas compras relizadas

**Rota:** `GET /clients/details/:email`

**Autenticação**
```http
Authorization: Bearer <your-token>
```

**Params:**

| chave  | Tipo    | Descrição  |
| ------ | --------- |--------- |
| email  | string | Email do cliente a ser buscado |

**Resposta de Sucesso:**

**status:** `200`
```json
{
	"status": true,
	"data": {
		"id": "019551e0-06c6-729c-b8c9-f45e4001413f",
		"name": "Capitao teste gancho",
		"email": "caitateste@ogamil.com",
		"createdAt": "2025-03-01T13:23:11.000+00:00",
		"updatedAt": "2025-03-01T13:23:11.000+00:00",
		"transactions": [
			{
				"id": "019551e1-80fd-70e4-9371-a3a03283d1b5",
				"productId": "0195519b-f981-7178-8ebe-15cd3fa1970b",
				"externalId": "da643ff2-5a12-47f4-9595-455631f7b3df",
				"status": "paid",
				"amount": 89990,
				"quantity": 1,
				"cardLastNumbers": 8518,
				"createdAt": "2025-03-01T13:24:48.000+00:00",
				"updatedAt": "2025-03-01T13:24:48.000+00:00",
				"clientId": "019551e0-06c6-729c-b8c9-f45e4001413f",
				"product": {
					"name": "Bermuda Esportiva",
					"amount": 14,
					"price": 89.99,
					"id": "0195519b-f981-7178-8ebe-15cd3fa1970b"
				}
			}
		]
	}
}
```


**Resposta de Erro:**

**status:** `401`
```
Unauthorized access
```

**status:** `404`
```json
{
	"message": "Client not found",
	"status": false
}
```






## Produtos


- ### Criar Produto

**Descrição:** Criação de um produto.

**Rota:** `POST /product`


**Autenticação**
```http
Authorization: Bearer <your-token>
```


**Corpo da requisição:**

| chave  | Tipo    | Descrição  |
| ------ | --------- |--------- |
| amount  | number | A quantidade em estoque do produto |
| price  | number | Preço unitário do produto |

```json
{
	"name": "Airmax",
	"amount": 100,
	"price": 243.00,
	"description": "Tênnis confortável para corrida e esportes"
}
```


**Resposta de Sucesso:**

**status:** `200`
```json
{
	"data": {
		"id": "01955661-7257-734d-a29c-9054c5d78931",
		"name": "Airmax",
		"amount": 100,
		"description": "Tênnis confortável para corrida e esportes",
		"price": 243,
		"createdAt": "2025-03-02T10:23:01.720+00:00",
		"updatedAt": "2025-03-02T10:23:01.720+00:00"
	},
	"status": true
}
```

**Resposta de Erro:**

**status:** `401`
```
Unauthorized access
```

**status:** `422`
```json
{
	"errors": [
	    {
			"message": "The name has already been taken",
			"rule": "database.unique",
			"field": "name"
		},
	]
}
```


- ### Atualizar Produto

**Descrição:** Atualiza os dados de um produto.

**Rota:** `PUT /product/:id`

**Autenticação**
```http
Authorization: Bearer <your-token>
```

**Params:**

| chave  | Tipo    |
| ------ | ---------|
| id   | string |


**Corpo da requisição:**

```json
{
	"amount": 76,
	"name": "Airmax 2",
	"price": 123,
	"description": "Nova descrição"
}
```


**Resposta de Sucesso:**

**status:** `200`
```json
{
	"message": "Product updated with succesfully",
	"status": true,
	"data": {
		"id": "0195448c-77eb-722e-b32d-8d9c35e3f697",
		"name": "Airmax 2",
		"amount": 76,
		"price": 123,
		"description": "Luvas para proteção e aderência durante os treinos",
		"createdAt": "2025-02-26T23:16:51.000+00:00",
		"updatedAt": "2025-02-27T00:07:56.595+00:00"
	}
}
```


**Resposta de Erro:**


**status:** `401`
```
Unauthorized access
```

**status:** `404`
```json
{
	"message": "Product not found",
	"status": false
}
```


**status:** `422`
```json
{
	"errors": [
	    {
			"message": "The description field must have at least 5 characters",
			"rule": "minLength",
			"field": "description",
			"meta": {
				"min": 5
			}
		}
	]
}
```

- ### Deletar Produto

**Descrição:** Deleta um produto

**Rota:** `DELETE /product/:id`

**Autenticação**
```http
Authorization: Bearer <your-token>
```

**Params:**

| chave  | Tipo    |
| ------ | ---------|
| id    | string |



**Resposta de Sucesso:**

**status:** `200`
```json
{
	"message": "Product deleted with succesfully",
	"status": true
}
```


**Resposta de Erro:**

**status:** `401`
```
Unauthorized access
```

**status:** `404`
```json
{
	"message": "Product not found",
	"status": false
}
```


- ### Listar Produto

**Descrição:** Listar um produto

**Rota:** `GET /product/:idOrName`

**Autenticação**
```http
Authorization: Bearer <your-token>
```

**Params:**

| chave  | Tipo    | Descrição  |
| ------ | --------- |--------- |
| idOrName  | string | Pode ser o NOME ou o ID do produto |



**Resposta de Sucesso:**

**status:** `200`
```json
{
	"data": {
		"id": "01955975-4e4c-7785-8301-5fffb4a76e40",
		"name": "Airmax",
		"amount": 12,
		"price": 123,
		"description": "Tenis esportivo para a pratica de esportes",
		"createdAt": "2025-03-03T00:43:34.000+00:00",
		"updatedAt": "2025-03-03T00:43:34.000+00:00"
	},
	"status": true
}
```


**Resposta de Erro:**

**status:** `401`
```
Unauthorized access
```

**status:** `404`
```json
{
	"message": "Product not found",
	"status": false
}
```

- ### Lista todos os Produtos

**Descrição:** Listar todos produtos

**Rota:** `GET /product`

**Autenticação**
```http
Authorization: Bearer <your-token>
```


**Resposta de Sucesso:**

**status:** `200`
```json
{
	"product": [
		{
			"id": "01955975-4e4c-7785-8301-5fffb4a76e40",
			"name": "Luvas de Musculação",
			"amount": 12,
			"price": 49.9,
			"description": "Luvas para proteção e aderência durante os treinos",
			"createdAt": "2025-03-03T00:43:34.000+00:00",
			"updatedAt": "2025-03-03T00:43:34.000+00:00"
		},
		{
			"id": "01955975-4e4c-7785-8301-59b10e83c1ed",
			"name": "Bermuda Esportiva",
			"amount": 20,
			"price": 89.99,
			"description": "Bermuda confortável e flexível para exercícios",
			"createdAt": "2025-03-03T00:43:34.000+00:00",
			"updatedAt": "2025-03-03T00:43:34.000+00:00"
		},
		{
			"id": "01955975-4e4c-7785-8301-5691bcb0076e",
			"name": "Garrafa Térmica 1L",
			"amount": 30,
			"price": 79.9,
			"description": "Garrafa térmica para manter sua água gelada por horas",
			"createdAt": "2025-03-03T00:43:34.000+00:00",
			"updatedAt": "2025-03-03T00:43:34.000+00:00"
		},
		{
			"id": "01955975-4e4c-7785-8301-52d2842ebf57",
			"name": "Mochila Fitness",
			"amount": 8,
			"price": 149.99,
			"description": "Mochila espaçosa para academia e viagens",
			"createdAt": "2025-03-03T00:43:34.000+00:00",
			"updatedAt": "2025-03-03T00:43:34.000+00:00"
		},
		{
			"id": "01955975-4e4c-7785-8301-4e574f65ce74",
			"name": "Camiseta Dry Fit",
			"amount": 25,
			"price": 59.9,
			"description": "Camiseta leve e respirável para treinos",
			"createdAt": "2025-03-03T00:43:34.000+00:00",
			"updatedAt": "2025-03-03T00:43:34.000+00:00"
		},
		{
			"id": "01955975-4e4c-7785-8301-4a4276df7c19",
			"name": "Tênis Esportivo",
			"amount": 15,
			"price": 129.99,
			"description": "Tênis confortável para corrida",
			"createdAt": "2025-03-03T00:43:34.000+00:00",
			"updatedAt": "2025-03-03T00:43:34.000+00:00"
		}
	]
}
```


**Resposta de Erro:**

**status:** `401`
```
Unauthorized access
```







## Gateways


- ### Ativar/Desativa um gateway

**Descrição:** Este endpoint desativa um gateway caso ele esteja ativado e vice-versa.

**Rota:** `GET /gateway/toggle/:gatewayName`


**Autenticação**
```http
Authorization: Bearer <your-token>
```


**Params:**

| chave  | Tipo    | Descrição  |
| ------ | --------- |--------- |
| gatewayName  | string | Nome do gateway a ser **ativado/desativado** |



**Resposta de Sucesso:**

**status:** `200`
```json
{
	"status": true,
	"message": "Gateway activated/deactivated successfully"
}
```

**Resposta de Erro:**

**status:** `401`
```
Unauthorized access
```

**status:** `404`
```json
{
	"status": false,
	"message": "Gateway not found"
}
```



- ### Mudar a prioridade de um gateway

**Descrição:** Este endpoint muda a prioridade de um gateway. Se a mudança ocorrer de uma gateway de prioridade 1 para 2, o gateway que tinha a prioridade 1 ficará com a prioridade 2 e o que tinha a prioridade 2 ficará com a 1. Basicamente as prioridades são invertidas.

**Rota:** `POST /gateway/priority/:gatewayName`


**Autenticação**
```http
Authorization: Bearer <your-token>
```


**Params:**

| chave  | Tipo    | Descrição  |
| ------ | --------- |--------- |
| gatewayName  | string | Nome do gateway a ter a prioridade trocada |



**Corpo da requisição:**
```json
{
	"priority": 2
}
```



**Resposta de Sucesso:**

**status:** `200`
```json
{
	"status": true,
	"message": "The gateway Gateway_2 now has the 2 priority"
}
```

**Resposta de Erro:**

**status:** `401`
```
Unauthorized access
```

**status:** `404`
```json
{
	"status": false,
	"message": "Gateway not found"
}
```








## Trasações


- ### Listar todas transações

**Descrição:** Este endpoint lista todas as transações que ocorreram.

**Rota:** `GET /transactions`


**Autenticação**
```http
Authorization: Bearer <your-token>
```



**Resposta de Sucesso:**

**status:** `200`
```json
[
	{
		"id": "01955b92-be8b-737e-8b92-ec8893502463",
		"clientId": "01955b92-b2ce-757e-a4a9-a66c0fc81d71",
		"gatewayId": "01955b87-1361-762a-b8ef-1d2f2aa56ae7",
		"productId": "01955b87-1387-7041-9c6a-0d3f1e1ad77f",
		"externalId": "0b5f5040-9a11-49be-8662-7f798f644136",
		"status": "paid",
		"amount": 89990,
		"quantity": 1,
		"cardLastNumbers": 8518,
		"createdAt": "2025-03-03T10:34:59.000+00:00",
		"updatedAt": "2025-03-03T10:34:59.000+00:00"
	}
]
```

**Resposta de Erro:**

**status:** `401`
```
Unauthorized access
```



- ### Buscar detalhes da transação

**Descrição:** Este endpoint retorna os detalhes de uma transação em específico.

**Rota:** `GET /transactions/:transactionId`


**Autenticação**
```http
Authorization: Bearer <your-token>
```


**Params:**

| chave  | Tipo    | Descrição  |
| ------ | --------- |--------- |
| transactionId  | string | Id da transação |



**Resposta de Sucesso:**

**status:** `200`
```json
{
	"status": true,
	"data": {
		"id": "01955b92-be8b-737e-8b92-ec8893502463",
		"clientId": "01955b92-b2ce-757e-a4a9-a66c0fc81d71",
		"gatewayId": "01955b87-1361-762a-b8ef-1d2f2aa56ae7",
		"productId": "01955b87-1387-7041-9c6a-0d3f1e1ad77f",
		"externalId": "0b5f5040-9a11-49be-8662-7f798f644136",
		"status": "paid",
		"amount": 89990,
		"quantity": 1,
		"cardLastNumbers": 8518,
		"createdAt": "2025-03-03T10:34:59.000+00:00",
		"updatedAt": "2025-03-03T10:34:59.000+00:00",
		"client": {
			"id": "01955b92-b2ce-757e-a4a9-a66c0fc81d71",
			"name": "teste user",
			"email": "teste@ogamil.com"
		},
		"product": {
			"id": "01955b87-1387-7041-9c6a-0d3f1e1ad77f",
			"name": "Bermuda Esportiva",
			"price": 89.99
		},
		"gateway": {
			"id": "01955b87-1361-762a-b8ef-1d2f2aa56ae7",
			"name": "Gateway_1"
		}
	}
}
```

**Resposta de Erro:**

**status:** `401`
```
Unauthorized access
```

**status:** `404`
```json
{
	"status": false,
	"message": "No transaction found"
}
```



- ### Reembolso

**Descrição:** Realiza o reembolso de uma transação

**Rota:** `GET /transactions/refund/:transactionId`


**Autenticação**
```http
Authorization: Bearer <your-token>
```


**Params:**

| chave  | Tipo    | Descrição  |
| ------ | --------- |--------- |
| transactionId  | string | Id da transação a ser reebolsada |



**Resposta de Sucesso:**

**status:** `200`
```json
{
	"status": true,
	"data": {
		"amount": 90,
		"card_first_digits": "5171",
		"card_last_digits": "8518",
		"email": "teste@ogamil.com",
		"id": "0b5f5040-9a11-49be-8662-7f798f644136",
		"name": "teste user",
		"status": "charged_back"
	}
}
```
OU

**status:** `200`
```json
{
	"status": true,
	"message": "Refund successfully processed!"
}
```

**Resposta de Erro:**

**status:** `401`
```
Unauthorized access
```

**status:** `404`
```json
{
	"status": false,
	"message": "Transaction not found"
}
```



**status:** `409`
```json
{
	"status": false,
	"message": "Transaction already charged back"
}
```
---

# Dificuldades
- Acredito que minha principal dificuldade foi basicamente trabalhar com ADONIS pois nunca havia trabalhado com ele, porém consegui aprender rápido e criar a API tranquilamente.

//  modularidade e como adicionar novos gateways
# Observações
- No momento do reembolso levei em conta que a quantidade de produtos da transação reembolsada será devolvida ao estoque.
- Usei soft delete nos produtos e também clientes, pois acredito que todas as transações relacionadas a essas entidades ainda deveriam ser acessadas mesmo depois delas serem deletadas.
- Para trabalhar com as prioridades dos GATEWAYS decidi usar números para as prioridades, ou seja, 1,2,3 ... Sendo o número 1 a prioridade maior e assim em diante. Pensei em implementar a prioridade baseada em STATUS (HIGH, MEDIUM e LOW) , porém pensando na adição de novos gateways essa abordagem não seria tão eficaz.
- Para manter a modularidade e facilitar a adição de novos gateways, utilizei o DESIGN PATTTERN ADAPTER, onde basicamente eu adapto as resposta retornadas pelas APIs para o uso interno da nossa API. Para a criação de um novo GATEWAY você deve criar um novo adapter dentro da pasta `/app/gateways/adapters`, esse adapter deverá implementar a interface `PaymentGateway`. Após a criação do seu novo adapter, você deverá adicionar ele no factory que está no arquivo `/app/gateways/gateway_factory.ts` nesse arquivo temos um objeto chamado **GATEWAY_PRIORITY**, nele você irá colocar como CHAVE o nome do gateway que foi cadastrado no DB e como valor deverá instanciar o seu adapter, segue um exemplo :

```ts
  const GATEWAY_PRIORITY: Record<string, PaymentGateway> = {
    Nome_Gateway: new Gateway1Adapter(),
    Nome_Gateway2: new Gateway2Adapter(),
  }
```

---

## HTTP Status Code

```
## Códigos de Status

| Código | Significado |
|--------|------------|
| 200    | OK |
| 201    | Criado |
| 400    | Requisição Inválida |
| 401    | Não Autorizado |
| 403    | Proibido |
| 404    | Não Encontrado |
| 409    | Conflito |
| 500    | Erro Interno do Servidor |

## Contato
Em caso de dúvidas ou problemas, entre em contato pelo e-mail: `rafaap2003@gmail.com`.

