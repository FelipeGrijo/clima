# Clima

Mostra o clima baseado da localização aproximada do usuário, usando o IP.

Utiliza [Geolocation-DB](https://www.geolocation-db.com/) e [Open-Meteo](https://open-meteo.com/)

## Instalação

Necessário ter:

- [Git](https://git-scm.com/downloads/win)
- [Node](https://nodejs.org/en/download)
- [VSCode](https://code.visualstudio.com/download)

⚠️ _Instale as extensões recomendadas no vscode pra ativar o eslint e prettier. Talvez seja necessário reiniciar o vscode._

Clone o repositório

```sh
git clone https://github.com/FelipeGrijo/clima-pvt.git
```

Entre na pasta

```sh
cd clima-pvt
```

Instale as dependências

```sh
npm i
```

Abra o VSCode

```sh
code .
```

## Dev

```sh
npm run dev
```

```sh
http://localhost:5173
```

---

## TODO

- [x] Botão [pin](https://fonts.google.com/icons?icon.query=pin)
  - [x] Ao clicar abre modal
  - [x] Usar o [open-meteo](https://open-meteo.com/en/docs/geocoding-api#name=Maca%C3%A9) pra localização. Ex.: [Macaé](https://geocoding-api.open-meteo.com/v1/get?id=3458266)
  - [x] Criar campo de busca, ao buscar nome, preencher com bandeira do país, cidade e estado. Usar idioma do navegador.
  - [x] Add coordenadas como campo adicional opcional
  - [x] Salvar cidade no localStorage
- [ ] Mostrar mensagem de erro quando a requisição falhar
- [ ] Botão pra pegar a localização exata
- [ ] Gráfico com clima do dia
- [ ] Previsão do clima pros próximos dias
- [ ] PWA
- [ ] 100 pontos no [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview?hl=pt-br)
