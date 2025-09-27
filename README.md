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

---


## Considerações

- Mesmo barrando por header, ainda consta no `access.log` o acesso
- Colocar o código `444` é o mais adequado para bots