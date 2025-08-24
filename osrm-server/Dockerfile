FROM osrm/osrm-backend

# Download Nigeria map from Geofabrik
ADD https://download.geofabrik.de/africa/nigeria-latest.osm.pbf /data/map.osm.pbf

WORKDIR /data

# Preprocess map
RUN osrm-extract -p /opt/car.lua /data/map.osm.pbf && \
    osrm-partition /data/map.osrm && \
    osrm-customize /data/map.osrm

# Start OSRM server on port 5000
CMD ["osrm-routed", "--algorithm", "mld", "/data/map.osrm", "-p", "5000"]
