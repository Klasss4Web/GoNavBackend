# OSRM Server (Nigeria Map)

This repo runs an OSRM server for Nigeria using the official `osrm/osrm-backend` image.

## 🚀 Deploy on Render

1. Fork this repo to your own GitHub.
2. Go to [Render](https://dashboard.render.com/), click **New → Web Service**.
3. Select this repo.
4. Render detects `Dockerfile` automatically.
5. Deploy → You’ll get a URL like:

🚀 2. Create Service on Render Dashboard

Go to Render dashboard
.

Click New → Web Service.

Choose your repo (osrm-server).

Render detects Dockerfile automatically.

# Fill in settings:

## Name: osrm-server

1. Region: Choose EU or US (closer to your users)

2. Instance type: Start with Starter (512 MB RAM), but for Nigeria map you might need 1 GB+ (so choose Starter Plus or Standard).

3. Click Create Web Service.

🚀 3. Wait for Build

1. Render will pull the osrm/osrm-backend image.

2. Download the Nigeria .pbf.

3. Run osrm-extract, osrm-partition, osrm-customize.

4. Finally, it starts osrm-routed.

5. When deployment is successful, Render gives you a URL like:

## 🔗 Usage with Leaflet Routing Machine

```js
L.Routing.control({
  waypoints: [L.latLng(6.428334, 3.429), L.latLng(6.517689, 3.384223)],
  router: new L.Routing.OSRMv1({
    serviceUrl: "https://osrm-server.onrender.com/route/v1",
  }),
}).addTo(map);
```
