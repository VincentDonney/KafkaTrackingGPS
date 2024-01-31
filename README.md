Despite uvicorn saying so, FastAPI does not run on 8000 but on 8008.

Launch the containers with : docker-compose -f parties.yml -f app.yml -f producer.yml up -d --build

The front is exposed on port 4200 : http://localhost:4200/

To check for any container failing, use : docker-compose -f parties.yml -f app.yml -f producer.yml ps

To restart the containers, use : docker-compose -f parties.yml -f app.yml -f producer.yml restart