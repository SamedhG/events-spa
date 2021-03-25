# Events: React SPA with Phoenix Backend

## Development setup
### UI
```bash
cd events_ui
npm start
```

### Server
```bash 
cd events_api
mix phx.server
```


## Deployment
 - Through single nginx app
 - Server url is defined in api.js (should be moved)

### UI

```bash
cd events_ui
npm run build 
rm -r /home/www
mv build /home/events-spa/www
```

### Server
```bash
cd events_api
./deploy.sh
sudo systemctl restart events-spa.service
```


