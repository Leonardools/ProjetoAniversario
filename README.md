# Convite Premium — Formatura ADS + Aniversário

Experiência digital interativa para celebrar duas conquistas em um só encontro: a conclusão da graduação em **Análise e Desenvolvimento de Sistemas (ADS)** e mais um ano de vida. O projeto usa HTML5, CSS3 e JavaScript puro e pode ser publicado gratuitamente no GitHub Pages.

## Identidade visual e experiência

- Estética tecnológica premium: azul-noite, ciano elétrico, violeta e detalhes luminosos.
- Abertura animada com convite para entrar na experiência.
- Hero com linguagem de tecnologia (`BUILD 2026`, `deploy`, `próximo capítulo`).
- Contagem regressiva para **12/12/2026 às 12h30**.
- Texto contando por que aniversário e formatura serão comemorados juntos.
- Timeline conceitual da jornada em ADS, galeria com lightbox, mapa, RSVP via WhatsApp, player de música e mural local.
- Responsivo para desktop e celular, com recursos de acessibilidade e respeito a `prefers-reduced-motion`.

## Estrutura

```text
projeto-aniversario/
├── index.html
├── README.md
├── css/style.css
├── js/script.js
└── assets/
    ├── images/
    ├── audio/
    ├── video/
    └── icons/
```

## 1. Abrir no VS Code

1. Extraia a pasta do ZIP.
2. Abra o VS Code e selecione **Arquivo → Abrir Pasta**.
3. Escolha `projeto-aniversario`.
4. Abra `index.html` no navegador. Para facilitar a atualização durante o desenvolvimento, pode usar a extensão Live Server, mas ela não é obrigatória.

## 2. Personalizar o evento

Abra `js/script.js` e localize o objeto `CONFIG`, no início do arquivo. Altere os dados ali:

- `nomeAniversariante`: nome que aparece no convite.
- `dataEvento`: data no formato `AAAA-MM-DD`. Já configurada como `2026-12-12`.
- `horarioEvento`: formato 24 horas. Já configurado como `12:30`.
- `localEvento` e `enderecoCompleto`: nome e endereço do espaço.
- `linkMapa`: link completo do Google Maps (opcional). Se ficar vazio, o mapa usa o endereço configurado.
- `whatsappNumero`: número que receberá as confirmações, com código do país e DDD, somente números. Exemplo: `5561999999999`. Substitua pelo número real do anfitrião.
- `mensagemEspecial` e `fraseHero`: textos personalizados.
- `fotos` e `historia`: legendas, caminhos das imagens e conteúdo da timeline.

**Atenção:** o nome está como `Seu Nome` e o WhatsApp está como número demonstrativo. Troque esses valores antes de publicar.

## 3. Alterar fotos

1. Coloque suas imagens em `assets/images/`.
2. No objeto `CONFIG`, atualize os caminhos em `fotos` e `historia`.
3. Prefira imagens JPG, PNG ou WebP otimizadas, com nomes simples, por exemplo `foto-viagem.webp`.
4. Não apague os arquivos de demonstração até atualizar todos os caminhos que os utilizam.

## 4. Alterar música

Adicione seu arquivo de áudio em `assets/audio/music.mp3`. O player já está preparado para esse caminho. A música não começa sozinha: o visitante controla o play, pause e volume.

## 5. Alterar local e mapa

Atualize `localEvento` e `enderecoCompleto` em `CONFIG`. Se quiser apontar para um local exato, cole o link compartilhável do Google Maps em `linkMapa`.

## 6. Configurar WhatsApp

Em `CONFIG.whatsappNumero`, use o formato `55 + DDD + número`, sem `+`, espaços, parênteses ou traços. Exemplo fictício: `5561999999999`. O formulário valida os campos, guarda a última confirmação no LocalStorage daquele navegador e abre o WhatsApp com uma mensagem pronta. **O convidado ainda precisa tocar em Enviar.**

O `wa.me` não é uma API de envio automático. Para automação real no futuro, o comentário na função `initRSVP()` indica o ponto de integração com WhatsApp Business API / Meta Cloud API, Twilio, Evolution API ou Z-API. Tokens e credenciais nunca devem ser colocados no JavaScript público; uma API futura exige backend seguro.

## 7. Mural de recados e armazenamento

O mural usa LocalStorage: os recados ficam somente no navegador/dispositivo em que foram publicados. Eles **não são compartilhados automaticamente** com os demais convidados. Para um mural coletivo, será necessário conectar um backend ou serviço de banco de dados. O RSVP também não cria uma lista central: cada navegador guarda apenas seus próprios dados.

## 8. Publicar no GitHub Pages

1. Crie um repositório no GitHub, por exemplo `convite-formatura-aniversario`.
2. Envie todos os arquivos e pastas mantendo a estrutura original.
3. No repositório, abra **Settings → Pages**.
4. Em **Build and deployment**, escolha **Deploy from a branch**.
5. Selecione a branch `main` e a pasta `/ (root)` e salve.
6. Aguarde a publicação e acesse o endereço informado pelo GitHub Pages.

## Observações

- Não precisa de backend para abrir ou hospedar a experiência estática.
- O mapa depende de conexão com a internet.
- `assets/audio/music.mp3` deve ser adicionado pelo responsável pelo convite.
- Substitua o nome, o telefone, o endereço e as imagens demonstrativas antes de compartilhar o link.
- A data e o horário da contagem regressiva usam o fuso horário local do navegador do visitante.
