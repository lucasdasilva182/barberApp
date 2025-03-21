
# **BarberApp**

Projeto feito para agendamentos de serviços em barbearias, com opções de para escolha de funcionário para o serviço, dia e horário. App completo, permite cadastro com e-mail e senha, ou login com google, agendamento e cancelamento de serviços, além de outras features.

## **Demo**

A demo pode ser acessado através do [link](https://barber-app-eta-one.vercel.app/).  
  
<br>
  
<p  align="center">

<img  alt="rocketpay"  src="https://equivalent-apricot-peafowl.myfilebase.com/ipfs/QmdoUevSje8erBvftdc1wcFBRmxJsGujWcSHcbdEKAu21S"  width="100%">

</p>

## 🚀 Tecnologias

Esse projeto foi desenvolvido com as seguintes tecnologias:

- React
- TypeScript
- PostgreSQL
- Node 

  ## **Como Executar o Projeto**

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
3. Banco de dados: Crie um banco de dados Postgresql com a estrutura presente em prisma/schema.prisma

4. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis:
     ```
     DATABASE_URL=postgresql://{user}:{password}@localhost:5432
     AUTH_SECRET=
     GOOGLE_CLIENT_ID=
     GOOGLE_CLIENT_SECRET= 
     RESEND_API_KEY=
     NEXT_PUBLIC_APP_URL=http://localhost:3000
     ```
5. Inicie o servidor:
   ```bash
   npm run dev
   ```
6. O projeto estará rodando em `http://localhost:3000`.



## :memo: Licença

  

Esse projeto está sob a licença MIT.

 
