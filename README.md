
# **BarberApp ✂**

Projeto feito para agendamentos de serviços em barbearias, construído com **Next.js**, **Prisma** e com banco de dados **PostgreSQL**.

### Funcionalidades 

✅ **Autenticação com credenciais** (e-mail e senha)
✅ **Login via OAuth** (Google)
✅ **Agendamento e cancelamento de serviços**
✅ **Consulta barbearias**

<br/>

## **Demo**

A demo pode ser acessado através do [link](https://barber-app-eta-one.vercel.app/).  
  
<br>
  
<p  align="center">

<img  alt="rocketpay"  src="https://equivalent-apricot-peafowl.myfilebase.com/ipfs/QmdoUevSje8erBvftdc1wcFBRmxJsGujWcSHcbdEKAu21S"  width="600px">

</p>

## 🚀 Tecnologias

Esse projeto foi desenvolvido com as seguintes tecnologias:

- **Next.js** → Framework para React com renderização híbrida
- **TypeScript** → Tipagem estática para maior segurança no código
- **PostgreSQL** → Banco de dados relacional

## Como Executar o Projeto

### **Pré-requisitos**

- Node.js instalado
- PostgreSQL configurado

1. Clone o repositório:
   ```bash
   git clone https://github.com/lucasdasilva182/barberApp.git
   ```

2. Instale as dependências:
   ```bash
   cd barberApp
   npm install
   ```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis:
     ```
     DATABASE_URL=postgresql://{user}:{password}@localhost:5432
     AUTH_SECRET=
     GOOGLE_CLIENT_ID=
     GOOGLE_CLIENT_SECRET= 
     RESEND_API_KEY=
     NEXT_PUBLIC_APP_URL=http://localhost:3000
     ```

4. Execute as migrações do banco de dados:
   ```bash
   npx prisma migrate dev
   ```

5. Inicie o servidor:
   ```bash
   npm run dev
   ```
6. O projeto estará rodando em `http://localhost:3000`.



## :memo: Licença

  

Esse projeto está sob a licença MIT.

 
