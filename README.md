## Testando

### 1 - Criar os container

```bash
docker-compose up -d --build
```

### 2 - Bloqueio por header

```bash
# Permitido
curl -i http://localhost:8080/

# Bloqueado
curl -i -H "X-Blocked: yes" http://localhost:8080/
```

### 3 - Rate limit

```bash
for i in {1..20}; do curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8080/; done
```
### 4 - failed (104: Connection reset by peer)

```bash
curl -v http://localhost:8089/reset

```

### 5 - Comando K6

```bash
k6 run --vus 10 --duration 30s load_test.js
```

## Considerações

- Mesmo barrando por header, ainda consta no `access.log` o acesso
- Colocar o código `444` é o mais adequado para bots
- O erro `104` aparece quando há uma sobrecarga de CPU e Memória